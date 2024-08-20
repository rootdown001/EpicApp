"use client";

import { useEffect, useState } from "react";
import { checkEnvVariables } from "../utils/env";

export default function Smart() {
  const [data, setData] = useState(null);
  const baseUriEnv = process.env.NEXT_PUBLIC_BASE_URL;
  checkEnvVariables(baseUriEnv);
  const encodedUrl = encodeURIComponent(baseUriEnv as string);

  // TODO: decode both partsh of string to create own launch string
  // TODO: I THIMK, url to r4 is right. create payload in form of payload in jwt and then post

  useEffect(() => {
    window.location.href = `http://localhost:3000/%3Fiss%3Dhttps%253A%252F%252Ffhir.epic.com%252Finterconnect-fhir-oauth%252Fapi%252FFHIR%252FR4%26launch%3DeyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1cm46b2lkOmZoaXIiLCJjbGllbnRfaWQiOiJkOGIzYWUwMi0yNWMzLTQwN2ItODc0Mi04M2UxOGMxMzJkMmQiLCJlcGljLmVjaSI6InVybjplcGljOk9wZW4uRXBpYy1jdXJyZW50IiwiZXBpYy5tZXRhZGF0YSI6IkpPd0t4TEJBbzViVTBEM3ZZWXZjdzlDSWdGRXFDSEkzcHZaeVNDbnkwQ3pHMGd1NjN1bFY0NThJdXhwcjVWYlptNEhNOVlUa2pveUYtMWZaTVJJdEp0RlJ5QlRHU0lwNVFhUnZIVDZ1ak5oSjA3LTRkWTh3R2xGYTExUGxkRHJ4IiwiZXBpYy50b2tlbnR5cGUiOiJsYXVuY2giLCJleHAiOjE3MjM2MDUxNzcsImlhdCI6MTcyMzYwNDg3NywiaXNzIjoidXJuOm9pZDpmaGlyIiwianRpIjoiNjMwOWE5YzItZmRkOS00ZGY5LThkZWItMjdjYTg1ZmVjMzRiIiwibmJmIjoxNzIzNjA0ODc3LCJzdWIiOiJldk5wLUtoWXdPT3FBWm4xcFoyZW51QTMifQ.APHySNNSjcz6x2CXX6f04cyiMhbmVXFjIfLosX2u7DxWF1bA_5kxbdkBrPlBtGjV1Qiv4Z8SJsnwyL1XX6t9KqkIAe4GO21HBxq_BHNl_0QX_cF5ILF1rZSg2ymtrl-tiEdJOqINw4XBRegmE8k-VZBP1TqefoNmazbHE6QixlB65ys-YWeLUL3S0-Y047r8-7WziN-pJwfov8UdhXAr7GQIWTrglpG6S9-N8tUhSuxJXDtLWrJreJW3TQAcCqajk77yW_eLUK_It8_WTk1-7hW3rn7-t_h4Jv8X2Sxjv67lVx1ofV_AwaNAWJBmMrCXdHvjf-gNmowi9svmrtBp4Q&usg=AOvVaw2tCFRM9V07CUrVRg3jqGF6`;
  }, []);

  return <div></div>;
}
