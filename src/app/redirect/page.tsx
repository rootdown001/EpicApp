"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { checkEnvVariables } from "../utils/env";
import { Metadata } from "../launch/page";
import FHIR from "fhirclient";
import { oauth2 as SMART } from "fhirclient";

export default function Redirect() {
  const baseUriEnv = process.env.NEXT_PUBLIC_BASE_URL;
  const clientIdEnv = process.env.NEXT_PUBLIC_REGISTERED_CLIENT_ID;
  const redirectUriEnv = process.env.NEXT_PUBLIC_REDIRECT_URI;

  //   const abortController = new AbortController();
  //   const signal = abortController.signal;

  const [appClient, setAppClient] = useState<any>(null);
  const [patientData, setPatientData] = useState<any>(null);
  const [patientId, setPatientId] = useState<any>(null);
  const [allergyIntoleranceData, setAllergyIntoleranceData] =
    useState<any>(null);

  // checkEnvVariables(clientIdEnv, redirectUriEnv, baseUriEnv);

  async function getPatientData() {
    const tempPatientData = await appClient.patient.read();
    console.log("🚀 ~ getDashboard ~ tempPatientData:", tempPatientData);

    setPatientData(tempPatientData);
  }

  async function getAllergyIntolerance() {
    try {
      const response = await appClient.request(
        `AllergyIntolerance?patient=${patientId}`,
        {
          pageLimit: 0, // to fetch all pages
          flat: true, // to get a flat array of results
        }
      );
      console.log("🚀 ~ getAllergyIntolerance ~ response:", response);

      const allergyIntData = response;

      setAllergyIntoleranceData(allergyIntData);
    } catch (error) {
      console.error("Error fetching AllergyIntolerance data:", error);
    }
  }

  useEffect(() => {
    FHIR.oauth2
      .ready()
      .then((client) => {
        console.log("my client: ", client);
        setAppClient(client);
        setPatientId(client.patient.id);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (appClient) {
      getPatientData();
      getAllergyIntolerance();
    }
  }, [appClient]);

  // TODO: see how app works now - added patient and allergyintolerance search - trying to get AllergyIntolerance to work

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Patient Data</h2>
          {patientData ? (
            <div>
              <p>
                <strong>Name:</strong> {patientData.name?.[0]?.text}
              </p>
              <p>
                <strong>Gender:</strong> {patientData.gender}
              </p>
              <p>
                <strong>Birth Date:</strong> {patientData.birthDate}
              </p>
              {/* Add more patient details as needed */}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Allergy Intolerance</h2>
          {allergyIntoleranceData ? (
            <div>{/* Render allergy intolerance data here */}</div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        {/* Add more sections as needed */}
      </div>
    </div>
  );
}
