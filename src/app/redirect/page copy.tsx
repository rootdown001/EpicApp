"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { checkEnvVariables } from "../utils/env";
import { Metadata } from "../launch/page";
import FHIR from "fhirclient";

export default function Redirect() {
  const searchParams = useSearchParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [encounter, setEncounter] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);
  // console.log("metadata", metadata);

  //   const client = new FHIR.client("https://r3.smarthealthit.org");

  const baseUriEnv = process.env.NEXT_PUBLIC_BASE_URL;
  const clientIdEnv = process.env.NEXT_PUBLIC_REGISTERED_CLIENT_ID;
  const redirectUriEnv = process.env.NEXT_PUBLIC_REDIRECT_URI;

  //   const abortController = new AbortController();
  //   const signal = abortController.signal;

  checkEnvVariables(clientIdEnv, redirectUriEnv, baseUriEnv);

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
      setResponse(data);
      setAccessToken(data.access_token);
      setPatientId(data.patient);
      setEncounter(data.encounter);
      console.log("🚀 ~ fetchAccessToken ~ data:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    const storedMetadata = localStorage.getItem("metadata");
    if (storedMetadata) {
      setMetadata(JSON.parse(storedMetadata));
    }
    console.log("metadata: ", storedMetadata);
  }, []);

  useEffect(() => {
    const code = searchParams.get("code");
    if (metadata && code) {
      //   console.log("🚀 ~ useEffect ~ code:", code);
      //   console.log("Metadata in redirect: ", metadata);
      fetchAccessToken(code);
    }
  }, [searchParams, metadata]);

  useEffect(() => {
    if (accessToken && patientId && encounter && response) {
      console.log("🚀 ~ useEffect ~ response:", response);
      console.log("🚀 ~ useEffect ~ patientId:", patientId);
      console.log("in");
      //   console.log("🚀 ~ useEffect ~ patientId:", patientId);
      console.log("🚀 ~ useEffect ~ accessToken:", accessToken);

      const client = FHIR.client({
        serverUrl: baseUriEnv as string,
        tokenResponse: {
          access_token: response.access_token,
          expires_in: response.expires_in,
        },
      });
      console.log("🚀 ~ useEffect ~ client:", client);
      //TODO: debug here
      // TODO: setup web tester .exe or find launcher to control info in launch
      client
        .request(`Patient/${client.patient.id}`)
        // .request(`Encounter/${encounter}`)
        // .request(`User`)
        // .then((data) => {
        //   setPatientData(data);
        //   console.log("🚀 ~ client.request ~ patientData:", data);
        // })
        .catch((error) => {
          console.error("Error fetching patient data: ", error);
        });
    }
  }, [accessToken, patientId, encounter, response]);

  return (
    <div>
      <h1>Redirect Page</h1>
      {patientData && (
        <div>
          <h2>Patient Data</h2>
          <pre>{JSON.stringify(patientData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
