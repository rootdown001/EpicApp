"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Redirect() {
  const searchParams = useSearchParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [metadata, setMetaData] = useState<any>(null);
}
