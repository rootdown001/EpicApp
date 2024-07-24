"use client";
// TODO: check jwt - with jwt.io
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as jose from "jose";
import { checkEnvVariables } from "../utils/env";

export default function Redirect() {
  const searchParams = useSearchParams();
  const [idToken, setIdToken] = useState("");

  const clientIdEnv = process.env.NEXT_PUBLIC_REGISTERED_CLIENT_ID;
  const redirectUriEnv = process.env.NEXT_PUBLIC_REDIRECT_URI;

  // FXN: fetchIdToken()
  // caled from useEffect when searchParams change
  async function fetchIdToken(code: string, state: string) {
    // type check env variable
    checkEnvVariables(clientIdEnv, redirectUriEnv);

    // asserting env variables "as string" bc passed type check
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUriEnv as string,
      client_id: clientIdEnv as string,
    }).toString();

    try {
      const response = await fetch(
        "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body,
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to obtain initial access token: ${text}`);
      }

      const data = await response.json();

      if (!data.access_token) {
        throw new Error(`Failed to obtain initial access token`);
      }

      // TODO: setIdToken to data.id_token
      // TODO: setIdToken to data
      setIdToken(data.access_token);
      console.log("Data:", data);
      // console.log("data.access_token:", data.access_token);

      const decodedIdToken = jose.decodeJwt(data.access_token);
      console.log("decodedIdToken:", decodedIdToken);

      const now = Math.floor(Date.now() / 1000);
      if (decodedIdToken.exp && decodedIdToken.exp < now) {
        throw new Error("Initial access token is expired");
      }

      return data.access_token;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // FXN: generateKeyPair()
  // generate key pair with RSASSA-PKCS1-v1_5
  async function generateKeyPair() {
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

    const publicKeyJwk = await window.crypto.subtle.exportKey(
      "jwk",
      keyPair.publicKey
    );

    const privateKeyJwk = await window.crypto.subtle.exportKey(
      "jwk",
      keyPair.privateKey
    );

    return { publicKeyJwk, privateKeyJwk };
  }

  // FXN: registerDynamicClient()
  // called by handle redirect page
  async function registerDynamicClient(
    initialAcessToken: string,
    clientId: string
  ) {
    // get key pair in jwk format
    const { publicKeyJwk, privateKeyJwk } = await generateKeyPair();

    // fetch register with software_id & public key
    const registrationResponse = await fetch(
      "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          software_id: clientId,
          jwks: {
            keys: [publicKeyJwk],
          },
        }),
      }
    );

    if (!registrationResponse.ok) {
      const errorText = await registrationResponse.text();
      console.log("Failed to register dynamic client", errorText);
      throw new Error(`Failed to register dynamic client: ${errorText}`);
    }

    const registrationData = await registrationResponse.json();

    return { registrationData, privateKeyJwk };
  }

  // generate JWT bearer flow
  async function generateJWT(clientId: string, privateKeyJwk: JsonWebKey) {
    const now = Math.floor(Date.now() / 1000);

    const payload = {
      sub: clientId,
      aud: "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token",
      jti: crypto.randomUUID(),
      nbf: now,
      exp: now + 300,
      iat: now,
      iss: clientId,
    };

    // Ensure the privateKey conforms to the JWK structure expected by jose
    const privateKeyJWK = privateKeyJwk as jose.JWK;
    const privateKeyObj = await jose.importJWK(privateKeyJWK, "RS256");

    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "RS256", typ: "JWT" })
      .sign(privateKeyObj);

    return jwt;
  }

  // FXN: getAccessToken()
  // called by handleRedirectPage()
  async function getAccessToken(clientId: string, privateKeyJwk: JsonWebKey) {
    const jwt = await generateJWT(clientId, privateKeyJwk);
    const grantType = "urn:ietf:params:oauth:grant-type:jwt-bearer";

    const body = new URLSearchParams({
      grant_type: grantType,
      assertion: jwt,
      client_id: clientId,
    }).toString();

    // console.log("body: ", body);

    const tokenResponse = await fetch(
      "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
      }
    );

    console.log("tokenResponse: ", tokenResponse);

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

  // handle redirect page
  // called by useEffect after initial access token
  async function handleRedirectPage() {
    if (clientIdEnv != undefined) {
      try {
        const { registrationData, privateKeyJwk } = await registerDynamicClient(
          idToken,
          clientIdEnv
        );
        console.log("Dynamic client registered:", registrationData);

        console.log("registration data clientId: ", registrationData.client_id);

        const accessToken = await getAccessToken(
          registrationData.client_id,
          privateKeyJwk
        );
      } catch (error) {
        console.log("Error: ", error);
      }
    } else {
      throw new Error(
        "An env variable is undefined @ handleRedirectPage in redirect.tsx"
      );
    }
  }

  // call fetchIdToken() when searchParams change (on redirect)
  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code && state) {
      fetchIdToken(code, state);
    }
  }, [searchParams]);

  // call handleRedirectPage() when idToken loaded in state
  useEffect(() => {
    console.log("idToken: ", idToken);
    if (idToken) {
      console.log("idToken: ", idToken);
      handleRedirectPage();
    }
  }, [idToken]);

  return (
    <div id="home" className=" w-full h-screen text-center bg-grad">
      <div className=" max-w-[1240px] w-full h-full mx-auto p-2 flex justify-center items-center text-black">
        REDIRECT PAGE
      </div>
    </div>
  );
}
