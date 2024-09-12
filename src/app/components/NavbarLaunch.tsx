import React from "react";
import navLogo from "/public/assets/hospice-ai3.png";
import Image from "next/image";
import Link from "next/link";

const NavbarLaunch: React.FC = () => {
  return (
    <header className="flex overflow-hidden flex-wrap gap-10 px-20 justify-between py-8 w-full text-3xl pl-24 font-semibold leading-none text-[#ffffff] bg-[#348395] ">
      {/* <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/aba947d407b443002dee2c9ad79e421ce2846f852d0897358bbccabbfd7a804a?placeholderIfAbsent=true&apiKey=f9f522b90c2147cfa2ae6f16c245e771"
        className="object-contain shrink-0 max-w-full aspect-[3.83] w-[268px]"
        alt="Hospice AI Logo"
      /> */}
      <Link href="/">
        <Image
          src={navLogo}
          className="my-auto"
          alt="Hospice AI Logo"
          priority
          width={180}
        />
      </Link>
      <nav className="my-auto mr-1">
        <a href="#learn-more" className="text-xl text-[#ffffff]">
          Learn More
        </a>
      </nav>
    </header>
  );
};

export default NavbarLaunch;
