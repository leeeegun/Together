import React from "react";
import Image from "next/image";
import svg from "../../public/images/svg/background.svg";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

export default function myConferenceCard({ text, src, link, username }) {
  const onHover = () => {
    const myTag = document.querySelector(`#link${link}`);
    const myDescription = document.querySelector(`#description${link}`);
    myTag.classList.toggle("hidden");
    myDescription.classList.toggle("hidden");
  };

  const handleClickMyConference = (e) => {
    e.preventDefault();
    const link = `http://localhost:3000/meetingroom/${username}`;
    navigator.clipboard.writeText(link);
    Swal.fire({
      title: "초대링크 복사 성공!",
      html: `<p>바로 이동하기 : <a href=${link} style="text-decoration: underline">${link}</a></p>`,
      timer: 1000000,
      icon: "success",
    });
  };
  return (
    <motion.div
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.8 }}
      onHoverStart={onHover}
      onHoverEnd={onHover}
      onTap={handleClickMyConference}
      className="hover:cursor-pointer"
    >
      <div className="relative px-6 pt-10 pb-8 bg-[#efedec] shadow-xl sm:max-w-sm sm:mx-auto rounded-xl sm:px-10 lg:max-w-lg">
        <div className="max-w-md mx-auto">
          <div className="divide-y divide-gray-400/50">
            <div className="h-1/3">
              <Image src={svg}></Image>
            </div>
            <div className="py-8 flex justify-center">
              <a className="opacity-75 cursor-pointer">
                <p className="text-3xl" id={"link" + link}>
                  {text}
                </p>
                <p id={"description" + link} className="hidden">
                  회의를 열어 사람들과 소통해보세요! 😆
                </p>
              </a>
            </div>
            <div className="divide-y divide-gray-400/50"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}