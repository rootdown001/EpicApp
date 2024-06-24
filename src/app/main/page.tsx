import Link from "next/link";
import { AiOutlineMail } from "react-icons/ai";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { FaDev, FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

export default function Main() {
  return (
    <div id="home" className=" w-full h-screen text-center">
      <div className=" max-w-[1240px] w-full h-full mx-auto p-2 flex justify-center items-center">
        <div>
          <p className=" uppercase text-sm tracking-widest text-theme-color/60">
            I love beautiful code.
          </p>
          <h1 className=" py-4 text-gray-700">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Hi, I'm <span className=" text-theme-color">Lance</span>
          </h1>
          <h1 className=" py-2 text-gray-700">A Web & App Developer</h1>
          <p className=" py-4 text-gray-600 max-w-[70%] m-auto">
            I am a front-end web & application developer, building responsive
            products with great user experiences. I am currently also building
            my skills in back-end and Solidity for web-3 technologies.
          </p>
          <div className="flex items-center justify-between max-w-[440px] m-auto py-4 px-4">
            <div className="rounded-full shadow-lg shadow-gray-400 p-4 cursor-pointer hover:scale-110 ease-in duration-300">
              <Link href="https://www.linkedin.com/in/nwpgpc/" target="_blank">
                <FaLinkedinIn />
              </Link>
            </div>
            <div className="rounded-full shadow-lg shadow-gray-400 p-4 cursor-pointer hover:scale-110 ease-in duration-300">
              <Link href="https://github.com/rootdown001" target="_blank">
                <FaGithub />
              </Link>
            </div>

            <div className="rounded-full shadow-lg shadow-gray-400 p-4 cursor-pointer hover:scale-110 ease-in duration-300">
              <Link href="https://dev.to/rootdown001" target="_blank">
                <FaDev />
              </Link>
            </div>
            <div className="rounded-full shadow-lg shadow-gray-400 p-4 cursor-pointer hover:scale-110 ease-in duration-300">
              <Link href="https://twitter.com/rootdown001" target="_blank">
                <FaXTwitter />
              </Link>
            </div>

            <div className="rounded-full shadow-lg shadow-gray-400 p-4 cursor-pointer hover:scale-110 ease-in duration-300">
              <AiOutlineMail />
            </div>
            <div className="rounded-full shadow-lg shadow-gray-400 p-4 cursor-pointer hover:scale-110 ease-in duration-300">
              <Link href="/#contact">
                <BsFillPersonLinesFill />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
