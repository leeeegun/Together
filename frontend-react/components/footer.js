import React from "react";
import { motion } from "framer-motion";

export default function footer() {
  return (
    <footer className="flex flex-col text-center justify-center sticky bg-[#bebbb1] py-10">
      <img
        src="images/svg/Together.svg"
        alt="Together 로고"
        className="w-24 self-center"
      ></img>
      <p className="mt-5">Contact us</p>
      <br></br>
      <div className="flex flex-row justify-center items-center">
        <a href="https://facebook.com" className="mx-2">
          <motion.img
            src="/images/svg/facebook-brands.svg"
            whileHover={{ scale: 1.4 }}
            width={40}
            height={40}
            className="inline"
          ></motion.img>
        </a>
        <a href="https://instagram.com" className="mx-2">
          <motion.img
            whileHover={{ scale: 1.4 }}
            src="/images/svg/instagram-brands.svg"
            width={40}
            height={40}
            className="inline"
          ></motion.img>
        </a>
        <a href="https://twitter.com" className="mx-2">
          <motion.img
            whileHover={{ scale: 1.4 }}
            src="/images/svg/twitter-brands.svg"
            width={40}
            height={40}
            className="inline"
          ></motion.img>
        </a>
      </div>
      <br></br>
      <motion.p
        className="my-10 hover:cursor-pointer"
        whileHover={{ scale: 1.4 }}
        className="hover:font-semibold"
      >
        <a href="https://ssafy.com" className="">
          @ SSAFY
        </a>
      </motion.p>
    </footer>
  );
}
