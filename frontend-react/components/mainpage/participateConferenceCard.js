import React from "react";
import Swal from "sweetalert2";
import Router from "next/router";
import { motion } from "framer-motion";

export default function participateConferenceCard({
  text,
  src,
  link,
  username,
  description,
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
      onHoverStart={onHover}
      onHoverEnd={onHover}
      className="hover:cursor-pointer"
    >
      <button
        onClick={handleClickParticipateConference}
        className="relative px-6 pt-10 pb-8 bg-[#efedec] shadow-xl sm:max-w-sm sm:mx-auto rounded-xl sm:px-10 sm:w-4/5"
      >
        <div className="max-w-md mx-auto">
          <div className="divide-y divide-gray-400/50">
            <div className="h-1/3">
              <img aria-hidden src={src} className="main-image"></img>
            </div>
            <div className="flex justify-center py-8">
              <a className="opacity-75 cursor-pointer">
                <p
                  aria-labelledby="enterConfInfo"
                  className="text-3xl"
                  id={"link" + link}
                >
                  {text}
                </p>
                <span hidden id="enterConfInfo">
                  회의 참가, 회의에 참가해 사람들과 소통해보세요!
                </span>
                <p id={"description" + link} className="hidden">
                  회의에 참가해 사람들과 소통해보세요! 😆
                </p>
              </a>
            </div>
            <div className="divide-y divide-gray-400/50"></div>
          </div>
        </div>
      </button>
    </motion.div>
  );
}
