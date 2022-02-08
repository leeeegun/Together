import React from "react";
import Image from "next/image";
import svg from "../../public/images/svg/background.svg";
import Swal from "sweetalert2";
import Router from "next/router";
import { motion } from "framer-motion";

export default function createConferenceCard({ text, src, link, username }) {
  const handleClickParticipateConference = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "초대 코드를 입력해주세요!",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      backdrop: true,
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
    <div className="relative px-6 pt-10 pb-8 bg-[#efedec] shadow-xl sm:max-w-sm sm:mx-auto rounded-xl sm:px-10 lg:max-w-lg ">
      <div className="max-w-md mx-auto">
        <div className="divide-y divide-gray-400/50">
          <div className="h-1/3">
            <Image src={svg}></Image>
          </div>
          <div className="py-8 flex justify-center">
            <a
              className="text-xl font-serif text-gray-900 opacity-75 cursor-pointer hover:font-bold"
              onClick={(e) => handleClickParticipateConference(e)}
            >
              <p className="text-4xl">{text}</p>
            </a>
          </div>
          <div className="divide-y divide-gray-400/50"></div>
        </div>
      </div>
    </div>
  );
}
