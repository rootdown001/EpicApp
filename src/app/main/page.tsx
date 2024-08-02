"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AiOutlineMail } from "react-icons/ai";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { FaDev, FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { checkEnvVariables } from "../utils/env";
import { useSearchParams } from "next/navigation";

// import * as dotenv from "dotenv";

export interface Metadata {
  [key: string]: any;
}

export default function Main() {
  const colors = {
    "5": "#212A31",
    "4": "#2E3944",
    "3": "#124E66",
    "2": "#748D92",
    "1": "#D3D9D4",
  };

  // hooks
  const [runAuth, setRunAuth] = useState(false);
  const searchParams = useSearchParams();
  const [metadata, setMetadata] = useState<Metadata | null>(null);

  // env variables
  const clientIdEnv = process.env.NEXT_PUBLIC_REGISTERED_CLIENT_ID;
  const redirectUriEnv = process.env.NEXT_PUBLIC_REDIRECT_URI;
  const responseTypeEnv = process.env.NEXT_PUBLIC_RESPONSE_TYPE;
  const scopeEnv = process.env.NEXT_PUBLIC_SCOPE;
  // TODO: figure out my state
  const stateEnv = process.env.NEXT_PUBLIC_STATE;
  // const baseUrlEnv = process.env.NEXT_PUBLIC_BASE_URL;
  // const authUrlEnv = process.env.NEXT_PUBLIC_AUTHORIZE_URL;

  // check that env variables not undefined
  checkEnvVariables(
    clientIdEnv,
    redirectUriEnv,
    responseTypeEnv,
    scopeEnv,
    stateEnv
  );

  // step 1: get iss & launch
  const launch = searchParams.get("launch");
  // console.log("🚀 ~ Main ~ launch:", launch);
  const iss = searchParams.get("iss");
  // console.log("🚀 ~ Main ~ iss:", iss);

  // Step 2: Retrieve the Conformance Statement or SMART Configuration
  async function fetchMetadata(iss: string) {
    try {
      const response = await fetch(`${iss}/.well-known/smart-configuration`, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.statusText}`);
      }

      const data = await response.json();
      // console.log("🚀 ~ fetchMetadata ~ data:", data);
      setMetadata(data);
      localStorage.setItem("metadata", JSON.stringify(data)); // Store metadata in local storage
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  }

  // Step 3: Request an Authorization Code
  async function requestAuthorizationCode() {
    if (!metadata) return;

    const authorizeUrl = new URL(metadata.authorization_endpoint);
    authorizeUrl.searchParams.append(
      "response_type",
      responseTypeEnv as string
    );
    authorizeUrl.searchParams.append("client_id", clientIdEnv as string);
    authorizeUrl.searchParams.append("redirect_uri", redirectUriEnv as string);
    authorizeUrl.searchParams.append("scope", scopeEnv as string);
    authorizeUrl.searchParams.append("launch", launch as string);
    authorizeUrl.searchParams.append("state", stateEnv as string);
    authorizeUrl.searchParams.append("aud", iss as string);

    window.location.href = authorizeUrl.toString();
  }

  // run auth
  useEffect(() => {
    // // runAuth true with button click
    // if (runAuth) {
    //   // are env variables loaded

    if (iss) {
      fetchMetadata(iss);
    }

    // const query = new URLSearchParams({
    //   response_type: responseTypeEnv,
    //   client_id: clientIdEnv,
    //   redirect_uri: redirectUriEnv,
    //   scope: scopeEnv,
    //   state: stateEnv,
    //   aud: baseUrlEnv,
    // }).toString();

    // try {
    //   const authUrl = `${authUrlEnv}?${query}`;
    //   window.location.href = authUrl;
    // } catch (error) {
    //   console.log(error);
    // }
    // }
  }, [iss]);

  useEffect(() => {
    if (metadata && launch) {
      // console.log("🚀 ~ useEffect ~ launch:", launch);
      // console.log("🚀 ~ useEffect ~ metadata:", metadata);

      requestAuthorizationCode();
    }
  }, [metadata, launch]);

  return (
    <div id="home" className=" w-full h-screen text-center bg-grad">
      <div className=" max-w-[1240px] w-full h-full mx-auto p-2 flex justify-center items-center">
        <div>
          <div className="mb-3">
            <button
              className=" rounded-md bg-[#748D92] text-black px-2 py-1"
              onClick={() => setRunAuth(true)}
            >
              Authorize
            </button>
          </div>
          <div className="mb-3"></div>
          <div className="flex items-center justify-between w-[440px] m-auto py-4 px-4">
            <div className="rounded-full shadow-lg shadow-black/50 p-4 cursor-pointer hover:scale-110 ease-in duration-300">
              <Link href="https://www.linkedin.com/in/nwpgpc/" target="_blank">
                <FaLinkedinIn color="#D3D9D4" />
              </Link>
            </div>
            <div className="rounded-full shadow-lg shadow-black/50 p-4 cursor-pointer hover:scale-110 ease-in duration-300">
              <Link href="https://github.com/rootdown001" target="_blank">
                <FaGithub color="#D3D9D4" />
              </Link>
            </div>

            <div className="rounded-full shadow-lg shadow-black/50 p-4 cursor-pointer hover:scale-110 ease-in duration-300">
              <Link href="https://dev.to/rootdown001" target="_blank">
                <FaDev color="#D3D9D4" />
              </Link>
            </div>
            <div className="rounded-full shadow-lg shadow-black/50 p-4 cursor-pointer hover:scale-110 ease-in duration-300">
              <Link href="https://twitter.com/rootdown001" target="_blank">
                <FaXTwitter color="#D3D9D4" />
              </Link>
            </div>

            <div className="rounded-full shadow-lg shadow-black/50 p-4 cursor-pointer hover:scale-110 ease-in duration-300">
              <AiOutlineMail color="#D3D9D4" />
            </div>
            <div className="rounded-full shadow-lg shadow-black/50 p-4 cursor-pointer hover:scale-110 ease-in duration-300">
              <Link href="/#contact">
                <BsFillPersonLinesFill color="#D3D9D4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
