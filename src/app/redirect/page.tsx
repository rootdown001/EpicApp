"use client";
// TODO: check jwt - with jwt.io
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as jose from "jose";

export default function Redirect() {
  const searchParams = useSearchParams();

  // TODO: put this in .env
  const clientId = "ea9b08eb-030c-41e5-b24b-e4b95ce068e5";
  var initialAccessToken = "";

  async function generateKeyPair() {
    // Generate a key pair using RSA-OAEP algorithm
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"]
    );

    const publicKey = await window.crypto.subtle.exportKey(
      "jwk",
      keyPair.publicKey
    );

    const privateKey = await window.crypto.subtle.exportKey(
      "jwk",
      keyPair.privateKey
    );

    return { publicKey, privateKey };
  }

  async function registerDynamicClient(
    initialAcessToken: string,
    clientId: string
  ) {
    console.log("🚀 ~ Redirect ~ initialAcessToken:", initialAcessToken);

    const { publicKey, privateKey } = await generateKeyPair();
    console.log("🚀 ~ Redirect ~ privateKey:", privateKey);
    console.log("🚀 ~ Redirect ~ publicKey:", publicKey);

    const registrationResponse = await fetch(
      "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${initialAccessToken}`,
        },
        body: JSON.stringify({
          software_id: clientId,
          jwks: {
            keys: [publicKey],
          },
        }),
      }
    );
    if (!registrationResponse.ok) {
      throw new Error("Failed to register dynamic client");
    }

    const registrationData = await registrationResponse.json();
    console.log("🚀 ~ Redirect ~ registrationData:", registrationData);

    return { registrationData, privateKey };
  }

  async function generateJWT(clientId: string, privateKey: JsonWebKey) {
    console.log(
      "in generateJWT. clientId: ",
      clientId,
      " privateKey: ",
      privateKey
    );

    const now = Math.floor(Date.now() / 1000);
    console.log("🚀 ~ generateJWT ~ now:", now);

    const payload = {
      sub: clientId,
      aud: "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token",
      jti: crypto.randomUUID(),
      nbf: now,
      exp: now + 300,
      iat: now,
      iss: clientId,
    };
    console.log("🚀 ~ generateJWT ~ payload:", payload);

    // Ensure the privateKey conforms to the JWK structure expected by jose
    const privateKeyJWK = privateKey as jose.JWK;
    const privateKeyObj = await jose.importJWK(privateKeyJWK, "RS256");

    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "RS256" })
      .sign(privateKeyObj);

    return jwt;
  }

  async function getAccessToken(clientId: string, privateKey: JsonWebKey) {
    const jwt = await generateJWT(clientId, privateKey);
    console.log("🚀 ~ getAccessToken ~ jwt:", jwt);

    const tokenResponse = await fetch(
      "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
          assertion: jwt,
          client_id: clientId,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Failed to obtain access token:", errorText);
      throw new Error(`Failed to obtain access token: ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    console.log("Access token obtained:", accessToken);
    return accessToken;
  }

  async function handleRedirectPage() {
    try {
      const { registrationData, privateKey } = await registerDynamicClient(
        initialAccessToken,
        clientId
      );
      console.log("Dynamic client registered:", registrationData);

      console.log("registration data clientId: ", registrationData.client_id);

      const accessToken = await getAccessToken(
        registrationData.client_id,
        privateKey
      );
      // console.log('Access token obtained:', accessToken);
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    const clientId = "ea9b08eb-030c-41e5-b24b-e4b95ce068e5";
    const redirectUri = "http://localhost:3000/redirect";

    if (code) {
      console.log("code: ", code);
    }

    if (state) {
      console.log("state: ", state);
    }

    if (code && state) {
      const body = `grant_type=${encodeURIComponent(
        "authorization_code"
      )}&code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&client_id=${encodeURIComponent(clientId)}`;

      fetch("https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
      })
        .then((response) => {
          response.json().then((data) => {
            if (!response.ok) {
              console.error("Response Error Data: ", data);
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            initialAccessToken = data.access_token;

            console.log("initialAccessToken: ", initialAccessToken);
            [];
          });
        })
        .then(() => {
          handleRedirectPage();
        })
        .then((response) => {
          console.log("response: ", response);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [searchParams]);

  return (
    <div id="home" className=" w-full h-screen text-center bg-grad">
      <div className=" max-w-[1240px] w-full h-full mx-auto p-2 flex justify-center items-center text-black">
        REDIRECT PAGE
      </div>
    </div>
  );
}
