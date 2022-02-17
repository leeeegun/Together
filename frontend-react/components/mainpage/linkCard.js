import React from "react";
import Router from "next/router";
import { motion } from "framer-motion";

export default function linkCard({ text, src, link, username, description }) {
  const handleClickLinkCard = () => {
    Router.push(link);
  };
  const onHover = () => {
    // console.log(`link${link}`);
    const myTag = document.querySelector(`#link${link}`);
    const myDescription = document.querySelector(`#description${link}`);
    // console.log(myTag);
    myTag.classList.toggle("hidden");
    myDescription.classList.toggle("hidden");
  };
  return (
    <motion.div
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.8 }}
      onHoverStart={onHover}
      onHoverEnd={onHover}
      className="hover:cursor-pointer"
    >
      <button
        onClick={handleClickLinkCard}
        className="relative px-6 pt-10 pb-8 bg-[#efedec] shadow-xl sm:max-w-sm sm:mx-auto rounded-xl sm:px-10 lg:max-w-lg xs:min-w-sm sm:w-4/5"
      >
        <div className="max-w-md mx-auto">
          <div className="divide-y divide-gray-400/50">
            <div className="h-1/3">
              <img aria-hidden src={src} className="main-image"></img>
            </div>
            <div className="flex justify-center py-8">
              <h1
                className="text-3xl cursor-pointer hover:font-bold"
                id={"link" + link}
              >
                {text}
              </h1>
              <p className="hidden font-extralight" id={"description" + link}>
                {description} 😆
              </p>
            </div>
            <div className="divide-y divide-gray-400/50"></div>
          </div>
        </div>
      </button>
    </motion.div>
  );
}
