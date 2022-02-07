import React from "react";
import Image from "next/image";
import FacebookLogo from "../images/svg/facebook-brands.svg";
import InstaLogo from "../images/svg/instagram-brands.svg";
import TwitterLogo from "../images/svg/twitter-brands.svg";

export default function footer() {
  return (
    <div className="text-center justify-center sticky">
      <p className="font-extralight text-2xl">Together</p>
      <p className="mt-5">Contact us</p>
      <br></br>
      <a href="https://facebook.com" className="mx-2">
        <Image src={FacebookLogo} width={40} height={40}></Image>
      </a>
      <a href="https://instagram.com" className="mx-2">
        <Image src={InstaLogo} width={40} height={40}></Image>
      </a>
      <a href="https://twitter.com" className="mx-2">
        <Image src={TwitterLogo} width={40} height={40}></Image>
      </a>
      <br></br>
      <a href="https://ssafy.com" className="">
        @ SSAFY
      </a>
    </div>
  );
}
