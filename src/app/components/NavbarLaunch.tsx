import React from "react";
import navLogo from "/public/assets/hospice-ai-chart.png";
import Image from "next/image";
import Link from "next/link";

const NavbarLaunch: React.FC = () => {
  return (
    <header className="flex overflow-hidden flex-wrap gap-5 justify-between py-3 w-full text-xl pl-20 font-semibold tracking-tight leading-none text-[#bb2a26] bg-white bg-blend-normal max-md:px-5 max-md:max-w-full">
      {/* <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/aba947d407b443002dee2c9ad79e421ce2846f852d0897358bbccabbfd7a804a?placeholderIfAbsent=true&apiKey=f9f522b90c2147cfa2ae6f16c245e771"
        className="object-contain shrink-0 max-w-full aspect-[3.83] w-[268px]"
        alt="Hospice AI Logo"
      /> */}
      <Link href="/">
        <Image
          src={navLogo}
          className="my-auto pt-4"
          alt="Hospice AI Logo"
          priority
          width={300}
        />
      </Link>
      <nav className="my-auto mr-36 pt-10">
        <a href="#learn-more" className="text-xl text-[#333d55]">
          Learn More
        </a>
      </nav>
    </header>
  );
};

export default NavbarLaunch;
