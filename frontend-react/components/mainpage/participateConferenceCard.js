import React from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import Router from "next/router";
import { motion } from "framer-motion";

export default function participateConferenceCard({
  text,
  src,
  link,
  username,
}) {
  const onHover = () => {
    const myTag = document.querySelector(`#link${link}`);
    const myDescription = document.querySelector(`#description${link}`);
    myTag.classList.toggle("hidden");
    myDescription.classList.toggle("hidden");
  };

  const handleClickParticipateConference = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "초대 코드를 입력해주세요!",
      input: "text",
      backdrop: true,
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      cancelButtonText: "취소",
      confirmButtonText: "제출",
      showLoaderOnConfirm: true,
      inputPlaceholder: "호스트에게 받은 초대 코드를 입력해주세요!",
      preConfirm: (input) => {
        Router.push(`/meetingroom/${input}`);
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(() => {});
  };
  return (
    <motion.div
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.8 }}
      onTap={handleClickParticipateConference}
      onHoverStart={onHover}
      onHoverEnd={onHover}
      className="hover:cursor-pointer"
    >
      <div className="relative px-6 pt-10 pb-8 bg-[#efedec] shadow-xl sm:max-w-sm sm:mx-auto rounded-xl sm:px-10 lg:max-w-lg">
        <div className="max-w-md mx-auto">
          <div className="divide-y divide-gray-400/50">
            <div className="h-1/3">
              <img src={src} className="main-image"></img>
            </div>
            <div className="py-8 flex justify-center">
              <a className="opacity-75 cursor-pointer">
                <p className="text-3xl" id={"link" + link}>
                  {text}
                </p>
                <p id={"description" + link} className="hidden">
                  회의에 참가해 사람들과 소통해보세요! 😆
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
