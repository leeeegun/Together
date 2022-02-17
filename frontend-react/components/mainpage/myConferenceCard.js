import React from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

export default function myConferenceCard({ text, src, link, username }) {
  const onHover = () => {
    const myTag = document.querySelector(`#link${link}`);
    const myDescription = document.querySelector(`#description${link}`);
    myTag.classList.toggle("hidden");
    myDescription.classList.toggle("hidden");
  };
  function copyToClipboard(textToCopy) {
    // navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
      // navigator clipboard api method'
      return navigator.clipboard.writeText(textToCopy);
    } else {
      // text area method
      let textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      // make the textarea out of viewport
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((res, rej) => {
        // here the magic happens
        document.execCommand("copy") ? res() : rej();
        textArea.remove();
      });
    }
  }
  const handleClickMyConference = (e) => {
    e.preventDefault();
    const encoded = new Buffer(username).toString("base64");
    const link = `https://ssafytogether.site/meetingroom/${encoded}`;
    // console.log(encoded);
    copyToClipboard(encoded);
    Swal.fire({
      title: "초대링크 복사 성공!",
      html: `<p>바로 이동하기 : <a href=${link} style="text-decoration: underline">회의실로 이동하기</a></p>`,
      timer: 1000000,
      icon: "success",
      confirmButtonAriaLabel: "확인",
    });
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
        onClick={handleClickMyConference}
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
                  aria-labelledby="newConfInfo"
                  className="text-3xl"
                  id={"link" + link}
                >
                  {text}
                </p>
                <span id="newConfInfo" hidden>
                  내 회의실, 회의를 열어 사람들과 소통해보세요
                </span>
                <p id={"description" + link} className="hidden">
                  회의를 열어 사람들과 소통해보세요! 😆
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
