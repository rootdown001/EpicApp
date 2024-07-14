"use client";
// TODO: check jwt - with jwt.io
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as jose from "jose";

export default function Redirect() {
  const searchParams = useSearchParams();

  // TODO: put this in .env
  const clientId = "ea9b08eb-030c-41e5-b24b-e4b95ce068e5";
  const redirectUri = "http://localhost:3000/redirect";
  const [initialAccessToken, setInitialAccessToken] = useState("");
  // var initialAccessToken = "";

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
    // console.log("🚀 ~ generateKeyPair ~ publicKey:", publicKey);

    const privateKey = await window.crypto.subtle.exportKey(
      "jwk",
      keyPair.privateKey
    );
    // console.log("🚀 ~ generateKeyPair ~ privateKey:", privateKey);

    return { publicKey, privateKey };
  }

  async function registerDynamicClient(
    initialAcessToken: string,
    clientId: string
  ) {
    // console.log("🚀 ~ Redirect ~ initialAcessToken:", initialAcessToken);

    const { publicKey, privateKey } = await generateKeyPair();
    // console.log("🚀 ~ Redirect ~ privateKey:", privateKey);
    // console.log("🚀 ~ Redirect ~ publicKey:", publicKey);

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
    // console.log("🚀 ~ Redirect ~ registrationData:", registrationData);

    return { registrationData, privateKey };
  }

  async function generateJWT(clientId: string, privateKey: JsonWebKey) {
    // console.log(
    //   "in generateJWT. clientId: ",
    //   clientId,
    //   " privateKey: ",
    //   privateKey
    // );

    const now = Math.floor(Date.now() / 1000);
    // console.log("🚀 ~ generateJWT ~ now:", now);

    const payload = {
      sub: clientId,
      aud: "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token",
      jti: crypto.randomUUID(),
      nbf: now,
      exp: now + 300,
      iat: now,
      iss: clientId,
    };
    // console.log("🚀 ~ generateJWT ~ payload:", payload);

    // Ensure the privateKey conforms to the JWK structure expected by jose
    const privateKeyJWK = privateKey as jose.JWK;
    const privateKeyObj = await jose.importJWK(privateKeyJWK, "RS256");
    // console.log("🚀 ~ generateJWT ~ privateKeyObj:", privateKeyObj);

    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "RS256", typ: "JWT" })
      .sign(privateKeyObj);

    return jwt;
  }

  async function getAccessToken(clientId: string, privateKey: JsonWebKey) {
    const jwt = await generateJWT(clientId, privateKey);
    // console.log("🚀 ~ getAccessToken ~ jwt:", jwt);

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
          client_id: encodeURIComponent(clientId),
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
    // console.log(
    //   "inside handle redirect. initialAccessToken: ",
    //   initialAccessToken,
    //   ". clientId: ",
    //   clientId
    // );
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

    // if code & state are in response proceed
    if (code && state) {
      const body = `grant_type=${encodeURIComponent(
        "authorization_code"
      )}&code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&client_id=${encodeURIComponent(clientId)}`;

      // fetch iniial access token
      fetch("https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
      })
        .then((response) => {
          response.json().then((data) => {
            console.error("Response: ", data);
            if (!data.access_token) {
              throw new Error(`Failed to obtain initial access token`);
            }

            setInitialAccessToken(data.access_token);
            // console.log("initialAccessToken: ", data.access_token);

            // decode and inspect token
            const decodedToken = jose.decodeJwt(data.access_token);
            console.log("Decoded Token:", decodedToken);

            // Check token expiry
            const now = Math.floor(Date.now() / 1000);
            if (decodedToken.exp && decodedToken.exp < now) {
              throw new Error("Initial access token is expired");
            }

            // Verify token signature (optional, requires public key)
            // const publicKey = await fetchPublicKey(); // Fetch the public key from your server or JWKS endpoint
            // const verifiedToken = await jose.jwtVerify(data.access_token, publicKey);
            // console.log("Verified Token:", verifiedToken);

            return data.access_token;
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [searchParams]);

  useEffect(() => {
    if (initialAccessToken) {
      handleRedirectPage();
    }
  }, [initialAccessToken]);

  return (
    <div id="home" className=" w-full h-screen text-center bg-grad">
      <div className=" max-w-[1240px] w-full h-full mx-auto p-2 flex justify-center items-center text-black">
        REDIRECT PAGE
      </div>
    </div>
  );
}
