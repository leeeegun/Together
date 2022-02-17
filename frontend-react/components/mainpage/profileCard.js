import React from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useState } from "react";
import Router from "next/router";

export default function profileCard({
  text,
  src,
  link,
  userId,
  username,
  description,
}) {
  const [userNickname, setUserNickName] = useState(username);
  const onHover = () => {
    const myTag = document.querySelector(`#link${link}`);
    const myDescription = document.querySelector(`#description${link}`);
    myTag.classList.toggle("hidden");
    myDescription.classList.toggle("hidden");
  };
  const handleClickProfile = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "비밀번호를 입력해주세요",
      html: `<input type="password" id="password" class="swal2-input" placeholder="비밀번호">`,
      confirmButtonText: "확인",
      showCancelButton: true,
      cancelButtonText: "취소",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const userPassword = Swal.getPopup().querySelector("#password").value;
        return fetch(`https://i6a406.p.ssafy.io:8443/auth/login`, {
          method: "POST",
          body: JSON.stringify({
            userId: userId,
            password: userPassword,
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) throw new Error(response.status);
            return response.json();
          })
          .catch((error) => {
            Swal.showValidationMessage(`아이디 혹은 비밀번호가 틀렸습니다.`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `<h2 hidden role="note" aria-label="닉네임과 장애 유형 수정이 가능합니다. 원하시는 닉네임을 입력하거나 장애 유형을 선택해주세요."></h2>`,
          html:
            `<label for="swal-input1">닉네임</label><input id="swal-input1" class="swal2-input" value=${username} placeholder="3-5글자">` +
            `<br></br>` +
            `<input type="radio" id="a" name="chk_info" value="해당 없음" checked="checked"><label for="a">해당 없음</label>
            <input type="radio" id="b" name="chk_info" value="시각 장애" ><label for="b">시각 장애</label>
            <input type="radio" id="c" name="chk_info" value="청각 장애"><label for="c">청각 장애</label>` +
            `<br></br>`,
          confirmButtonText: "확인",
          showCancelButton: true,
          cancelButtonText: "취소",
          showLoaderOnConfirm: true,
          preConfirm: () => {
            const customNickname = document.getElementById("swal-input1").value;
            const disability = document.querySelector(
              "input[name='chk_info']:checked",
            ).value;
            const token = localStorage.getItem("token");
            return fetch(`https://i6a406.p.ssafy.io:8443/users/modify`, {
              method: "POST",
              body: JSON.stringify({
                nickname: customNickname,
                disability: disability,
              }),
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            })
              .then((response) => {
                if (!response.ok) throw new Error(response);
                return response.json();
              })
              .then((res) => {
                Swal.fire({
                  icon: "success",
                  title: `<span role="note" hidden aria-label="변경이 완료되었습니다"></span>`,
                  text: "변경이 완료되었습니다! 😄 다시 로그인 해주세요!",
                  confirmButtonAriaLabel: "확인",
                });
                localStorage.removeItem("token");
                Router.push("/");
              })
              .catch((error) => {
                Swal.showValidationMessage(`오류가 발생했습니다.`);
              });
          },
        });
      }
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
        onClick={handleClickProfile}
        className="relative px-6 pt-10 pb-8 bg-[#efedec] shadow-xl sm:max-w-sm sm:mx-auto rounded-xl sm:px-10 sm:w-4/5"
      >
        <div className="max-w-md mx-auto">
          <div className="divide-y divide-gray-400/50">
            <div className="h-1/3">
              <img aria-hidden src={src} className="main-image"></img>
            </div>
            <div className="py-8 flex justify-center">
              <a className="opacity-75 cursor-pointer">
                <p className="text-3xl" id={"link" + link}>
                  {text}
                </p>
                <p id={"description" + link} className="hidden">
                  {description}
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
