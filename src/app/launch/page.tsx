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
    <div className="flex flex-col items-center self-center px-20  w-full rounded-none">
      <div className="bg-[#ffffff]">
        <h1 className=" text-center text-[#0B3864] text-[64px] font-normal leading-[70px] pt-20 centered-heading ">
          Hospice AI Chart Review and Medicare Coder
        </h1>
        <h2 className=" mt-14 text-[34px] font-normal text-center text-[#0B3864]">
          Seamlessly Integrate Your EPIC Medical Records
        </h2>
        <div className=" mt-20 w-full ">
          <div className="flex flex-row rectangle">
            <div className="flex flex-col flex-[6]">
              <p className="text-[18px] py-8 leading-6 font-normal pl-[140px] text-white  ">
                Click "Authorize" to link your provider account and streamline
                the process of identifying hospice-eligible patients while
                ensuring accurate Medicare coding and reimbursement.
              </p>
            </div>
            <div className="flex flex-col flex-[3] justify-center items-center mr-8">
              <AuthorizeButton onClick={handleAuthorizeClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
