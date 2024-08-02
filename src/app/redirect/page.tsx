"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { checkEnvVariables } from "../utils/env";
import { Metadata } from "../main/page";

export default function Redirect() {
  const searchParams = useSearchParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<Metadata | null>(null);

  const clientIdEnv = process.env.NEXT_PUBLIC_REGISTERED_CLIENT_ID;
  const redirectUriEnv = process.env.NEXT_PUBLIC_REDIRECT_URI;

  checkEnvVariables(clientIdEnv, redirectUriEnv);

  // Step 5: Exchange the Authorization Code for an Access Token
  async function fetchAccessToken(code: string) {
    checkEnvVariables(clientIdEnv, redirectUriEnv);

    if (!metadata || !metadata.token_endpoint) {
      throw new Error("Metadata or token endpoint is not defined");
    }

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUriEnv as string,
      client_id: clientIdEnv as string,
    }).toString();

    try {
      const response = await fetch(metadata.token_endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to obtain access token: ${text}`);
      }

      const data = await response.json();

      if (!data.access_token) {
        throw new Error("Failed to obtain access token");
      }

      setAccessToken(data.access_token);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    const storedMetadata = localStorage.getItem("metadata");
    if (storedMetadata) {
      setMetadata(JSON.parse(storedMetadata));
    }
  }, []);

  useEffect(() => {
    const code = searchParams.get("code");
    // console.log("🚀 ~ useEffect ~ code:", code);
    if (metadata && code) {
      //   console.log("Metadata in redirect: ", metadata);
      // TODO: call fetchAccessToken
    }
  }, [searchParams, metadata]);
}
