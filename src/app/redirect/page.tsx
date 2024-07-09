"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as jose from "jose";

export default function Redirect() {
  // const router = useRouter();

  const searchParams = useSearchParams();
  // const [publicKey, setPublicKey] = useState<string | undefined>(undefined);
  // const [privateKey, setPrivateKey] = useState<string | undefined>(undefined);
  // const [initialAccessToken, setInitialAccessToken] = useState("");

  // TODO: put this in .env
  const clientId = "ea9b08eb-030c-41e5-b24b-e4b95ce068e5";
  var initialAccessToken = "";

  async function generateKeyPair() {
    // Generate a key pair using RSA-OAEP algorithm
    const keyPair = await window.crypto.subtle.generateKey(
      {
        // changed - name: "RSA-OAEP",
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
    // console.log("🚀 ~ generateJWT ~ jwt:", jwt);

    return jwt;
  }

  async function getAccessToken(clientId: string, privateKey: JsonWebKey) {
    const jwt = await generateJWT(clientId, privateKey);
    console.log("🚀 ~ getAccessToken ~ jwt:", jwt);
  }

  async function handleRedirectPage() {
    try {
      const { registrationData, privateKey } = await registerDynamicClient(
        initialAccessToken,
        clientId
      );
      console.log("Dynamic client registered:", registrationData);

      const accessToken = await getAccessToken(
        registrationData.client_id,
        privateKey
      );
      // console.log('Access token obtained:', accessToken);
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  // NOT CALLING THIS
  // async function storeKeyPair(keyPair: CryptoKeyPair) {
  //   const db = await new Promise<IDBDatabase>((resolve, reject) => {
  //     const request = indexedDB.open("keyPairDB", 1);
  //     request.onupgradeneeded = () => {
  //       const db = request.result;
  //       db.createObjectStore("keys", { keyPath: "id" });
  //     };
  //     request.onsuccess = () => resolve(request.result);
  //     request.onerror = () => reject(request.error);
  //   });

  //   const tx = db.transaction("keys", "readwrite");
  //   const store = tx.objectStore("keys");

  //   const objectStoreRequest = store.clear();

  //   objectStoreRequest.onsuccess = (event) => {
  //     // report the success of our request
  //     console.log("cleared");
  //   };

  //   await store.put({ id: "publicKey", key: keyPair.publicKey });
  //   await store.put({ id: "privateKey", key: keyPair.privateKey });

  //   await tx.oncomplete;
  // }

  // NOT CALLING THIS
  // async function retrieveKeys() {
  //   const db = await new Promise<IDBDatabase>((resolve, reject) => {
  //     const request = indexedDB.open("keyPairDB", 1);
  //     request.onsuccess = () => resolve(request.result);
  //     request.onerror = () => reject(request.error);
  //   });

  //   const tx = db.transaction("keys", "readonly");
  //   const store = tx.objectStore("keys");

  //   const publicKey = await store.get("publicKey");
  //   const privateKey = await store.get("privateKey");

  //   await tx.oncomplete;

  //   return { publicKey, privateKey };
  // }

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

    // async function handleKeyPair() {
    //   const keyPair = await generateKeyPair();
    //   await storeKeyPair(keyPair);
    // }

    // handleKeyPair()
    //   .then(retrieveKeys)
    //   .then((result) => {
    //     console.log("Result from retrieveKeys: ", result);
    //   });
  }, [searchParams]);
  // // return null; // or some loading indication while you process the code

  return (
    <div id="home" className=" w-full h-screen text-center bg-grad">
      <div className=" max-w-[1240px] w-full h-full mx-auto p-2 flex justify-center items-center text-black">
        REDIRECT PAGE
      </div>
    </div>
  );
}
