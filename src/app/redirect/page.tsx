"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { checkEnvVariables } from "../utils/env";
import { useMetadata } from "../context/MetadataContext";

export default function Redirect() {
  const searchParams = useSearchParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();
  const { metadata } = useMetadata();

  const clientIdEnv = process.env.NEXT_PUBLIC_REGISTERED_CLIENT_ID;
  const redirectUriEnv = process.env.NEXT_PUBLIC_REDIRECT_URI;

  checkEnvVariables(clientIdEnv, redirectUriEnv);

  // Step 5: Exchange the Authorization Code for an Access Token
  async function fetchAccessToken(code: string) {
    checkEnvVariables(clientIdEnv, redirectUriEnv);

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
    const code = searchParams.get("code");
    console.log("🚀 ~ useEffect ~ code:", code);
  }, [searchParams]);
}
