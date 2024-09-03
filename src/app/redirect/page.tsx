"use client";

import { useSearchParams } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";
import { checkEnvVariables } from "../utils/env";
import { Metadata } from "../launch/page";
import FHIR from "fhirclient";
import { oauth2 as SMART } from "fhirclient";
import Link from "next/link";

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
  const [medicationRequestData, setMedicationRequestData] = useState<any>(null);
  const [diagnosisData, setDiagnosisData] = useState<any>(null);
  const [diagnosticReportData, setDiagnosticReportData] = useState<any>(null);
  const [observationData, setObservationData] = useState<any>(null);
  const [specimenData, setSpecimenData] = useState<any>(null);
  const [familyMemberData, setFamilyMemberData] = useState<any>(null);
  const [encounterData, setEncounterData] = useState<any>(null);
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

      response.map((entry: any) => {
        entry.code.coding.map((allergy: any) => {
          console.log(`Allergy`, allergy.display);
        });
      });

      const allergyIntData = response;
      console.log("🚀 ~ getAllergyIntolerance ~ response:", response);

      setAllergyIntoleranceData(allergyIntData);
    } catch (error) {
      console.error("Error fetching AllergyIntolerance data:", error);
    }
  }

  async function getMedications() {
    try {
      const response = await appClient.request(
        `MedicationRequest?patient=${patientId}`,
        {
          pageLimit: 0, // to fetch all pages
          flat: true, // to get a flat array of results
        }
      );

      // response.map((entry: any) => {
      //   entry.code.coding.map((medication: any) => {
      //     console.log(`Medication`, medication.display);
      //   });
      // });

      const medIntData = response;
      console.log("🚀 ~ getMedications ~ response:", response);

      setMedicationRequestData(medIntData);
    } catch (error) {
      console.error("Error fetching MedicationRequest data:", error);
    }
  }

  async function getDiagnoses() {
    try {
      const response = await appClient.request(
        `Condition?patient=${patientId}`,
        {
          pageLimit: 0, // to fetch all pages
          flat: true, // to get a flat array of results
        }
      );

      // response.map((entry: any) => {
      //   entry.code.coding.map((medication: any) => {
      //     console.log(`Medication`, medication.display);
      //   });
      // });

      const conditionData = response;
      console.log("🚀 ~ getDiagnoses ~ response:", response);

      setDiagnosisData(conditionData);
    } catch (error) {
      console.error("Error fetching Diagnoses data:", error);
    }
  }

  async function getFamilyHistory() {
    try {
      const response = await appClient.request(
        `FamilyMemberHistory?patient=${patientId}`,
        {
          pageLimit: 0, // to fetch all pages
          flat: true, // to get a flat array of results
        }
      );

      // response.map((entry: any) => {
      //   entry.code.coding.map((medication: any) => {
      //     console.log(`Medication`, medication.display);
      //   });
      // });

      const tempFamilyHistoryData = response;
      console.log("🚀 ~ getFamilyHistory ~ response:", response);

      setFamilyMemberData(tempFamilyHistoryData);
    } catch (error) {
      console.error("Error fetching Family History data:", error);
    }
  }

  async function getDiagnosticReport() {
    try {
      const response = await appClient.request(
        `DiagnosticReport?patient=${patientId}`,
        {
          pageLimit: 0, // to fetch all pages
          flat: true, // to get a flat array of results
        }
      );

      // response.map((entry: any) => {
      //   entry.code.coding.map((medication: any) => {
      //     console.log(`Medication`, medication.display);
      //   });
      // });

      const tempDiagnosticReportData = response;
      console.log("🚀 ~ getDiagnosticReport ~ response:", response);

      setDiagnosticReportData(tempDiagnosticReportData);
    } catch (error) {
      console.error("Error fetching DiagnosticReport data:", error);
    }
  }

  async function getObservations() {
    try {
      const response = await appClient.request(
        `Observation?patient=${patientId}`,
        {
          pageLimit: 0, // to fetch all pages
          flat: true, // to get a flat array of results
        }
      );

      // response.map((entry: any) => {
      //   entry.code.coding.map((medication: any) => {
      //     console.log(`Medication`, medication.display);
      //   });
      // });

      const tempObservationData = response;
      console.log("🚀 ~ getObservations ~ response:", response);

      setObservationData(tempObservationData);
    } catch (error) {
      console.error("Error fetching Observation data:", error);
    }
  }

  async function getSpecimens() {
    try {
      const response = await appClient.request(
        `Specimen?patient=${patientId}`,
        {
          pageLimit: 0, // to fetch all pages
          flat: true, // to get a flat array of results
        }
      );

      // response.map((entry: any) => {
      //   entry.code.coding.map((medication: any) => {
      //     console.log(`Medication`, medication.display);
      //   });
      // });

      const tempSpecimenData = response;
      console.log("🚀 ~ getSpecimens ~ response:", response);

      setSpecimenData(tempSpecimenData);
    } catch (error) {
      console.error("Error fetching Specimen data:", error);
    }
  }

  async function getEncounters() {
    try {
      const response = await appClient.request(
        `Encounter?patient=${patientId}`,
        {
          pageLimit: 0,
          flat: true,
        }
      );

      const tempEncounterData = response;
      console.log("🚀 ~ getEncounters ~ response:", response);

      setEncounterData(tempEncounterData);
    } catch (error) {
      console.error("Error fetching Encounter data:", error);
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
      getMedications();
      getDiagnoses();
      getFamilyHistory();
      getDiagnosticReport();
      getObservations();
      getSpecimens();
      getEncounters();
    }
  }, [appClient]);

  // TODO: see how app works now - added patient and allergyintolerance search - trying to get AllergyIntolerance to work

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-2">
            <h2 className="text-xl font-semibold mb-2">Patient Data</h2>
            <div className="details-link-button">
              <Link className="btn" href={"/details/patient"}>
                Details
              </Link>
            </div>
          </div>
          {patientData ? (
            <div className="grid grid-cols-2 custom-grid">
              <p>
                {/* <strong>Name:</strong> {patientData.name?.[0]?.text} */}
                <strong>Name:</strong>{" "}
              </p>
              <p>
                {` ${patientData.name?.[0]?.family}, ${patientData.name?.[0]?.given?.[0]}`}
              </p>
              <p>
                <strong>Gender:</strong>
              </p>
              <p>{patientData?.gender}</p>
              <p>
                <strong>Birth Date:</strong>
              </p>
              <p>{patientData?.birthDate}</p>
              <p>
                <strong>Marital Status:</strong>{" "}
              </p>
              <p>{patientData?.maritalStatus?.text}</p>
              <p>
                <strong>Languages:</strong>{" "}
              </p>
              <p>
                {patientData?.communication
                  ?.map((entry: any) => entry?.language?.text)
                  .join(", ")}
              </p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-2">
            <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
            <div className="details-link-button">
              <Link className="btn" href={"/details/contact"}>
                Details
              </Link>
            </div>
          </div>
          {patientData ? (
            <div className="grid grid-cols-2 custom-grid">
              <p>
                {/* <strong>Street:</strong> {patientData.address?.[0]?.line?.[0]} */}
                <strong>Street:</strong>{" "}
              </p>
              <p>
                {patientData.address?.[0]?.line?.map(
                  (line_entry: any) => line_entry
                )}
              </p>
              <p>
                <strong>City, State:</strong>{" "}
              </p>
              <p>
                {patientData.address?.[0]?.city &&
                patientData.address?.[0]?.state
                  ? `${patientData.address?.[0]?.city}, ${patientData.address?.[0]?.state}`
                  : ""}
              </p>
              <p>
                <strong>Postal Code:</strong>{" "}
              </p>
              <p>{patientData.address?.[0]?.postalCode}</p>

              {patientData.telecom?.map((entry: any, index: number) => {
                const system = entry?.system
                  ? entry.system.charAt(0).toUpperCase() + entry.system.slice(1)
                  : "";
                return (
                  <React.Fragment key={index}>
                    <p>
                      <strong>{system}: </strong>
                    </p>
                    <p>{entry?.value}</p>
                  </React.Fragment>
                );
              })}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        {/* Allergies */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-2">
            <h2 className="text-xl font-semibold mb-2">Allergy Information</h2>
            <div className="details-link-button">
              <Link className="btn" href={"/details/allergies"}>
                Details
              </Link>
            </div>
          </div>
          {allergyIntoleranceData ? (
            allergyIntoleranceData.length > 0 ? (
              <p>
                {allergyIntoleranceData.map((entry: any, index: number) => (
                  <span key={index}>{entry?.code?.text}</span>
                ))}
              </p>
            ) : (
              <p>None returned</p>
            )
          ) : (
            <p>Loading...</p>
          )}
        </div>
        {/* Medications */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-2">
            <h2 className="text-xl font-semibold mb-2">
              Medication Information
            </h2>
            <div className="details-link-button">
              <Link className="btn" href={"/details/medications"}>
                Details
              </Link>
            </div>
          </div>

          {medicationRequestData ? (
            <div>
              {/* <strong>Medications:</strong>{" "} */}
              {medicationRequestData.map((entry: any, index: number) => (
                <p key={index}>{entry?.medicationCodeableConcept?.text}</p>
              ))}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        {/* Diagnoses */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-2">
            <h2 className="text-xl font-semibold mb-2">Medical Conditions</h2>
            <div className="details-link-button">
              <Link className="btn" href={"/details/conditions"}>
                Details
              </Link>
            </div>
          </div>
          {diagnosisData ? (
            <div>
              {diagnosisData.map((entry: any, index: number) => (
                <p key={index}>{entry?.code?.text}</p>
              ))}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        {/* Family History */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-2">
            <h2 className="text-xl font-semibold mb-2">Family History</h2>
            <div className="details-link-button">
              <Link className="btn" href={"/details/family"}>
                Details
              </Link>
            </div>
          </div>
          {familyMemberData ? (
            familyMemberData.length > 0 ? (
              <p>
                {familyMemberData.map((entry: any, index: number) => (
                  <p key={index}>{entry?.relationship?.text}</p>
                ))}
              </p>
            ) : (
              <p>None returned</p>
            )
          ) : (
            <p>Loading...</p>
          )}
        </div>
        {/* Diagnostic Report */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-2">
            <h2 className="text-xl font-semibold mb-2">Diagnostic Reports</h2>
            <div className="details-link-button">
              <Link className="btn" href={"/details/diagnostics"}>
                Details
              </Link>
            </div>
          </div>
          {diagnosticReportData ? (
            <div>
              {diagnosticReportData.map((entry: any, index: number) => (
                <p key={index}>{entry?.code?.text}</p>
              ))}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        {/* Observations */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-2">
            <h2 className="text-xl font-semibold mb-2">Observations</h2>
            <div className="details-link-button">
              <Link className="btn" href={"/details/observations"}>
                Details
              </Link>
            </div>
          </div>
          {observationData ? (
            <div>
              {observationData.map((entry: any, index: number) => (
                <p key={index}>{entry?.code?.text}</p>
              ))}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        {/* Specimens */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-2">
            <h2 className="text-xl font-semibold mb-2">Specimens</h2>
            <div className="details-link-button">
              <Link className="btn" href={"/details/specimens"}>
                Details
              </Link>
            </div>
          </div>
          {specimenData ? (
            <div>
              {specimenData.map((entry: any, index: number) => (
                <p key={index}>{entry?.type?.text}</p>
              ))}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        {/* Encounters 
        <p key={index}>{entry?.type?.text}</p>
        */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-2">
            <h2 className="text-xl font-semibold mb-2">Encounters</h2>
            <div className="details-link-button">
              <Link className="btn" href={"/details/encounters"}>
                Details
              </Link>
            </div>
          </div>
          {encounterData ? (
            <div>
              {encounterData.map((entry: any, index: number) => (
                <div key={index}>
                  {entry?.type.map((type: any, typeIndex: number) => (
                    <span key={typeIndex}>{type.text}</span>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}
