"use client";
import Image from "next/image";
import navLogo from "/public/assets/lance8.png";
import Link from "next/link";
import { AiOutlineClose, AiOutlineMail, AiOutlineMenu } from "react-icons/ai";
import { FaDev, FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [nav, setNav] = useState(false);
  const [shadow, setShadow] = useState(false);
  const [navBg, setNavBg] = useState("#ecf0f3");
  const [linkColor, setLinkColor] = useState("#1f2937");
  const [inProject, setInProject] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNav = () => {
    setNav(!nav);
  };

  useEffect(() => {
    // console.log("pathname: ", pathname);
    if (
      pathname === "/calendar" ||
      pathname === "/blog" ||
      pathname === "/portfolio" ||
      pathname === "/job"
    ) {
      setNavBg("transparent");
      setLinkColor("#ecf0f3");
      setInProject(true);
    } else {
      setNavBg("#ecf0f3");
      setLinkColor("#1f2937");
      setInProject(false);
    }
    console.log("project: ", inProject);
  }, [pathname, inProject]);

  // empty dependency array so runs just on load (for navbar shadow)
  useEffect(() => {
    const handleShadow = () => {
      if (window.scrollY >= 90) {
        setShadow(true);
        console.log("shadow");
      } else {
        setShadow(false);
        console.log("no shadow");
      }
    };
    window.addEventListener("scroll", handleShadow);
  }, []);

  return (
    <div
      style={{ background: `${navBg}` }}
      className={
        !inProject && shadow
          ? "fixed w-full  h-20 shadow-xl z-[100]"
          : "fixed w-full  h-20 z-[100]"
      }
    >
      <div className="flex justify-between items-center w-full h-full px-2 2xl:px-16">
        <Link href="/">
          <Image src={navLogo} alt="/" width={200} />
        </Link>

        <div>
          <ul style={{ color: `${linkColor}` }} className=" hidden md:flex">
            <li className="ml-10 text-sm uppercase hover:border-b">
              <Link href="/#home">Home</Link>
            </li>
            <li className="ml-10 text-sm uppercase hover:border-b">
              <Link href="/#about">About</Link>
            </li>

            <li className="ml-10 text-sm uppercase hover:border-b">
              <Link href="/#skills">Skills</Link>
            </li>

            <li className="ml-10 text-sm uppercase hover:border-b animate-bounce1">
              <Link href="/#projects">Projects</Link>
            </li>
            <li className="ml-10 text-sm uppercase hover:border-b">
              <Link href="/#contact">Contact</Link>
            </li>
          </ul>
          <div
            className="md:hidden flex justify-end cursor-pointer"
            onClick={handleNav}
          >
            <AiOutlineMenu size={25} />
          </div>
        </div>
      </div>
      <div
        className={
          nav ? "md:hidden fixed left-0 top-0 w-full h-screen bg-black/70" : ""
        }
      >
        <div
          className={
            nav
              ? "fixed left-0 top-0 w-[75%] sm:w-[60%] md:w-[45%] h-screen bg-[#ecf0f3] p-10 ease-in duration-500"
              : "fixed left-[-100%] top-0 p-10 ease-in duration-500"
          }
        >
          <div>
            <div className="flex w-full items-center justify-between">
              <Link href="/">
                <Image src={navLogo} alt="/" width={200} />
              </Link>
              <div
                className=" rounded-full shadow-md shadow-gray-400 p-2 cursor-pointer"
                onClick={handleNav}
              >
                <AiOutlineClose size={10} />
              </div>
            </div>
            <div className="border-b border-gray-300 my-4">
              <p className="w-[85%] md:w-[90%] py-4  text-theme-color/70">
                I love beutiful code.
              </p>
            </div>
            <div className=" py-4 flex flex-col">
              <ul className=" uppercase">
                <Link href="/#home">
                  <li onClick={() => setNav(false)} className=" py-4 text-sm">
                    Home
                  </li>
                </Link>
                <Link href="/#about">
                  <li onClick={() => setNav(false)} className=" py-4 text-sm">
                    About
                  </li>
                </Link>
                <Link href="/#skills">
                  <li onClick={() => setNav(false)} className=" py-4 text-sm">
                    Skills
                  </li>
                </Link>
                <Link href="/#projects">
                  <li onClick={() => setNav(false)} className=" py-4 text-sm">
                    Projects
                  </li>
                </Link>
                <Link href="/#contact">
                  <li onClick={() => setNav(false)} className=" py-4 text-sm">
                    Contact
                  </li>
                </Link>
              </ul>
              <div className=" pt-40">
                <p className=" uppercase tracking-widest text-theme-color">
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  Let's connect.
                </p>
                <div className="flex items-center justify-between my-4 w-full sm:w-[80%]">
                  <div className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-in duration-300">
                    <Link
                      href="https://www.linkedin.com/in/nwpgpc/"
                      target="_blank"
                    >
                      <FaLinkedinIn />
                    </Link>
                  </div>
                  <div className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-in duration-300">
                    <Link href="https://github.com/rootdown001" target="_blank">
                      <FaGithub />
                    </Link>
                  </div>
                  <div className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-in duration-300">
                    <Link href="https://dev.to/rootdown001" target="_blank">
                      <FaDev />
                    </Link>
                  </div>
                  <div className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-in duration-300">
                    <Link
                      href="https://twitter.com/rootdown001"
                      target="_blank"
                    >
                      <FaXTwitter />
                    </Link>
                  </div>
                  <div className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-in duration-300">
                    <AiOutlineMail />
                  </div>
                  <div className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-in duration-300">
                    <Link href="/#contact" onClick={() => setNav(false)}>
                      <BsFillPersonLinesFill />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
