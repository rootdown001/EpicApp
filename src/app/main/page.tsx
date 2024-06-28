"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { FaDev, FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

export default function Main() {
  const colors = {
    "5": "#212A31",
    "4": "#2E3944",
    "3": "#124E66",
    "2": "#748D92",
    "1": "#D3D9D4",
  };

  const [runFetch, setRunFetch] = useState(false);

  useEffect(() => {
    if (runFetch) {
      try {
        fetch("https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/")
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setRunFetch(false);
          });
      } catch (error) {
        console.log(error);
        setRunFetch(false);
      }
    }
  }, [runFetch]);

  return (
    <div id="home" className=" w-full h-screen text-center bg-grad">
      <div className=" max-w-[1240px] w-full h-full mx-auto p-2 flex justify-center items-center">
        <div>
          <div className="mb-3">
            <button
              className=" rounded-md bg-[#748D92] text-black px-2 py-1"
              onClick={() => setRunFetch(true)}
            >
              Run API
            </button>
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
