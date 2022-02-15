import React from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

export default function myConferenceCard({ text, src, link, username, description }) {
  const onHover = () => {
    const myTag = document.querySelector(`#link${link}`);
    const myDescription = document.querySelector(`#description${link}`);
    myTag.classList.toggle("hidden");
    myDescription.classList.toggle("hidden");
  };

  const handleClickMyConference = (e) => {
    e.preventDefault();
    const encoded = new Buffer(username).toString("base64");
    const link = `http://localhost:3000/meetingroom/${encoded}`;
    // console.log(encoded);
    navigator.clipboard.writeText(encoded);
    Swal.fire({
      title: "초대링크 복사 성공!",
      html: `<p>바로 이동하기 : <a href=${link} style="text-decoration: underline">이동하기</a></p>`,
      timer: 1000000,
      icon: "success",
    });
  };
  return (
    <button aria-label={description} onClick={handleClickMyConference}>
      <motion.div
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
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
              <div className="flex justify-center py-8">
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
    </button>
  );
}
