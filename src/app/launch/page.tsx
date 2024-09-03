"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { checkEnvVariables } from "../utils/env";
import { useSearchParams } from "next/navigation";
// import { Alata } from "next/font/google";
import FHIR from "fhirclient";
import AuthorizeButton from "../components/buttons/AuthorizeButton";

// import * as dotenv from "dotenv";

export interface Metadata {
  [key: string]: any;
}

// make FHIR global object
(window as any).FHIR = FHIR;

export default function Launch() {
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
  // const scopeEnv = process.env.NEXT_PUBLIC_SCOPE;

  // TODO: figure out my state
  const stateEnv = process.env.NEXT_PUBLIC_STATE;

  // check that env variables not undefined
  checkEnvVariables(clientIdEnv, redirectUriEnv);

  // // run auth
  useEffect(() => {
    if (runAuth) {
      FHIR.oauth2.authorize({
        client_id: clientIdEnv,
        scope:
          "launch openid fhirUser patient/read launch/patient encounter/context offline_access",
        redirectUri: redirectUriEnv,
      });
    }
  }, [runAuth]);

  const handleAuthorizeClick = () => {
    setRunAuth(true);
  };

  return (
    <div className="flex flex-col items-center self-center px-20  w-full rounded-none max-w-[1070px] max-md:px-5 max-md:pt-24 max-md:max-w-full">
      <div className="bg-grad bottom-right-radius rectangle">
        <h1 className=" text-center text-white text-[64px] font-normal pt-16 centered-heading max-md:max-w-full ">
          Hospice AI Chart Review and Medicare Coder
        </h1>
        <h2 className="mt-16 text-4xl font-medium text-center text-white max-md:mt-10 max-md:max-w-full">
          Seamlessly Integrate Your EPIC Medical Records
        </h2>
        <div className=" mt-16 max-w-full ">
          <div className="flex gap-5 flex-row w-full">
            <div className="flex flex-col flex-[4]">
              <p className="text-xl font-medium pl-[100px] text-white  ">
                Click "Authorize" to link your provider account and streamline
                the process of identifying hospice-eligible patients while
                ensuring accurate Medicare coding and reimbursement.
              </p>
            </div>
            <div className="flex flex-col flex-[3] items-start pl-10">
              <AuthorizeButton onClick={handleAuthorizeClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
