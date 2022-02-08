import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function footer() {
  return (
    <div className="flex flex-col text-center justify-center sticky mt-auto">
      <p className="font-extralight text-2xl">Together</p>
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
        <a href="https://ssafy.com">@ SSAFY</a>
      </motion.p>
    </div>
  );
}
