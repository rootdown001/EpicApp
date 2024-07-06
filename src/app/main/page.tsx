"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { FaDev, FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
// import * as dotenv from "dotenv";

export default function Main() {
  const colors = {
    "5": "#212A31",
    "4": "#2E3944",
    "3": "#124E66",
    "2": "#748D92",
    "1": "#D3D9D4",
  };

  const [runFetch, setRunFetch] = useState(false);
  const [runAuth, setRunAuth] = useState(false);
  const [data, setData] = useState();
  const [isError, setIsError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/";

  // response_type=code&redirect_uri=[redirect_uri]&client_id=[client_id]&state=[state]&aud=[audience]
  const responseType = "code";
  // TODO: figure out env
  // const client_id = clientId
  // const clientId = "4ac28ca5-ff23-417c-a46b-b3670ba00e6d";
  // const client_id = non-production
  const clientId = encodeURIComponent("ea9b08eb-030c-41e5-b24b-e4b95ce068e5");
  // redirect for development
  const redirectUri = encodeURIComponent("http://localhost:3000/redirect");
  const myScope = encodeURIComponent("patient/*.read");
  // TODO: figure out my state
  const myState = "abc123";
  const myAud = encodeURIComponent(
    "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/"
  );

  // run auth

  useEffect(() => {
    if (runAuth) {
      const authUrl = `https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&state=${myState}&aud=${myAud}&scope=${myScope}`;
      // fetch(authUrl).then((res) => console.log(res));
      window.location.href = authUrl;
    }
  }, [runAuth]);

  // useEffect(() => {
  //   const authUrl = `https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&state=${myState}&aud=${myAud}&scope=${myScope}`;
  //   // fetch(authUrl).then((res) => console.log(res));
  //   window.location.href = authUrl;
  // }, []);

  // run fetch
  // useEffect(() => {
  //   if (runFetch) {
  //     setData(undefined);
  //     setIsError(undefined);
  //     setIsLoading(true);

  //     const controller = new AbortController();

  //     fetch(fullAuth, { signal: controller.signal })
  //       .then((res) => {
  //         if (res.status === 200 || res.status === 201) {
  //           return res.json();
  //         } else {
  //           return Promise.reject(res);
  //         }
  //       })
  //       .then((data) => {
  //         setData(data);
  //         // Here we reset runFetch back to false after fetching data
  //         setRunFetch(false);
  //       })
  //       .catch((e) => {
  //         console.log("error in catch: ", e);
  //         if (e?.name === "AbortError") return;
  //         setIsError(e);
  //       })
  //       .finally(() => {
  //         if (controller.signal.aborted) return;
  //         setIsLoading(false);
  //         if (!controller.signal.aborted) {
  //           // Also reset runFetch to false here in case of errors
  //           setRunFetch(false);
  //         }
  //       });

  //     return () => {
  //       controller.abort();
  //     };
  //   }
  // }, [runFetch]);

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
          <div className="mb-3">
            {/* <button
              className=" rounded-md bg-[#748D92] text-black px-2 py-1"
              onClick={() => setRunFetch(true)}
            >
              Run API
            </button> */}
          </div>
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
