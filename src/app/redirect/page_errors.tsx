"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Redirect() {
  // const router = useRouter();

  const searchParams = useSearchParams();
  // const [publicKey, setPublicKey] = useState<string | undefined>(undefined);
  // const [privateKey, setPrivateKey] = useState<string | undefined>(undefined);

  async function generateKeyPair() {
    // Generate a key pair using RSA-OAEP algorithm
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );

    return keyPair;
  }

  async function exportKey(key: CryptoKey) {
    return await window.crypto.subtle.exportKey("jwk", key);
  }

  async function importKey(jwk: JsonWebKey, isPublic: boolean) {
    return await window.crypto.subtle.importKey(
      "jwk",
      jwk,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      isPublic ? ["encrypt"] : ["decrypt"]
    );
  }
  async function storeKeyPair(keyPair: CryptoKeyPair) {
    // Open the IndexedDB database named "keyPairDB" with version 1
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("keyPairDB", 1);

      // If the database needs to be upgraded (e.g., first time it's being opened)
      request.onupgradeneeded = () => {
        const db = request.result;
        // Create an object store named "keys" with the key path "id"
        db.createObjectStore("keys", { keyPath: "id" });
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    // Start a transaction to store the keys
    const tx = db.transaction("keys", "readwrite");
    const store = tx.objectStore("keys");

    const objectStoreRequest = store.clear();

    objectStoreRequest.onsuccess = (event) => {
      // report the success of our request
      console.log("cleared");
    };

    const publicKeyJwk = await exportKey(keyPair.publicKey);
    console.log("🚀 ~ storeKeyPair ~ publicKeyJwk:", publicKeyJwk);
    const privateKeyJwk = await exportKey(keyPair.privateKey);
    console.log("🚀 ~ storeKeyPair ~ privateKeyJwk:", privateKeyJwk);

    // Store the public and private keys

    // TODO: figure out... 1 error if storing publicKey, another if rename. look at key: _ pair? id?
    try {
      await Promise.all([
        new Promise<void>((resolve, reject) => {
          const request = store.put({ id: "publicKey", key: publicKeyJwk });
          request.onsuccess = () => {
            console.log("Public key stored successfully");
            resolve();
          };
          request.onerror = () => {
            console.error("Error storing public key:", request.error);
            reject(request.error);
          };
        }),
        new Promise<void>((resolve, reject) => {
          const request = store.put({ id: "privateKey", key: privateKeyJwk });
          request.onsuccess = () => {
            console.log("Private key stored successfully");
            resolve();
          };
          request.onerror = () => {
            console.error("Error storing private key:", request.error);
            reject(request.error);
          };
        }),
      ]);

      // Close the transaction
      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => {
          console.log("Transaction completed successfully");
          resolve();
        };
        tx.onerror = () => {
          console.error("Transaction error:", tx.error);
          reject(tx.error);
        };
      });

      console.log("Keys stored successfully");
    } catch (error) {
      console.error("Error storing keys:", error);
    }
  }

  // async function storeKeyPair(keyPair: CryptoKeyPair) {
  //   // Open the IndexedDB database named "keyPairDB" with version 1
  //   const db = await new Promise<IDBDatabase>((resolve, reject) => {
  //     const request = indexedDB.open("keyPairDB", 1);

  //     // If the database needs to be upgraded (e.g., first time it's being opened)
  //     request.onupgradeneeded = () => {
  //       const db = request.result;
  //       // Create an object store named "keys1" with the key path "id"
  //       db.createObjectStore("keys", { keyPath: "id" });
  //     };

  //     request.onsuccess = () => resolve(request.result);
  //     request.onerror = () => reject(request.error);
  //   });

  //   // Start a transaction to store the keys
  //   const tx = db.transaction("keys", "readwrite");
  //   const store = tx.objectStore("keys");

  //   const publicKeyJwk = await exportKey(keyPair.publicKey);
  //   console.log("🚀 ~ storeKeyPair ~ publicKeyJwk:", publicKeyJwk);
  //   const privateKeyJwk = await exportKey(keyPair.privateKey);
  //   console.log("🚀 ~ storeKeyPair ~ privateKeyJwk:", privateKeyJwk);

  //   // TODO: seeif this needs to be wrapped in Promise.all array

  //   // Store the public and private keys

  //   await Promise.all([
  //     store.put({ id: "publicKey", key: publicKeyJwk }),
  //     store.put({ id: "privateKey", key: privateKeyJwk }),
  //     // Close the transaction
  //   ]);
  //   await new Promise<void>((resolve, reject) => {
  //     tx.oncomplete = () => resolve();
  //     tx.onerror = () => reject(tx.error);
  //   });
  // }

  async function retrieveKeys() {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("keyPairDB", 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    const tx = db.transaction("keys", "readonly");
    const store = tx.objectStore("keys");

    const publicKeyJwk = await store.get("publicKey");
    const privateKeyJwk = await store.get("privateKey");
    await tx.oncomplete;

    const publicKey = await importKey(publicKeyJwk, true);
    const privateKey = await importKey(privateKeyJwk.key, false);

    console.log("Get publicKeyJwk: ", publicKeyJwk);
    console.log("Get privateKeyJwk: ", privateKeyJwk);

    return { publicKey, privateKey };
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
            console.log("Access Token Data: ", data);
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    async function handleKeyPair() {
      const keyPair = await generateKeyPair();
      await storeKeyPair(keyPair);
    }

    handleKeyPair();
    // .then(retrieveKeys)
    // .then((result) => {
    //   console.log("Result from retrieveKeys: ", result);
    // });
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
