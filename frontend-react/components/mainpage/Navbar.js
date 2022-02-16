// import {ReactComponent as Home} from '../../public/mainpage/home-icon.svg';
import Link from "next/link";
import Swal from "sweetalert2";
import Router from "next/router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const base64Payload = token.split(".")[1];
      const payload = Buffer.from(base64Payload, "base64");
      const result = JSON.parse(payload.toString());
      setUsername(result.sub);
      setUserId(result.nickname);
    } else {
      Swal.fire({
        icon: "error",
        title: "로그인 실패..",
        text: "로그인을 다시 해주세요!",
        confirmButtonAriaLabel: "확인"
      });
      Router.push("/");
    }
  }, []);
  return (
    <>
      <nav
        style={{ display: "flex", alignItems: "end" }}
        className="flex flex-row items-center justify-between mx-5 my-3 text-center"
      >
        {/* <Home /> */}
        <div className="flex flex-row items-center content-center justify-center">
          <a href="/main">
            <motion.img
              whileHover={{ scale: 1.3 }}
              src="mainpage/Home-Logo.png"
              alt="홈 로고, 메인페이지로 이동합니다"
              style={{ width: "40px", marginRight: "1rem", cursor: "pointer" }}
              className="inline-block"
            />
          </a>
          <span
            className="text-xl font-semibold c-footer-social_link"
            tabIndex="0"
          >
            {userId ? userId : null}님, 안녕하세요!
          </span>
        </div>

        <div className="flex flex-row items-center justify-center text-center">
          <button
            tabIndex="0"
            onClick={() => {
              localStorage.clear("token");
              Swal.fire({
                icon: "success",
                title: "로그아웃 성공!",
                text: "다음에 또 오세요!",
                confirmButtonAriaLabel: "확인"
              });
              Router.push("/");
            }}
          >
            <motion.img
              whileHover={{ scale: 1.3 }}
              src="images/svg/logout.svg"
              alt="로그아웃하기"
              style={{ width: "40px", marginRight: "1rem", cursor: "pointer" }}
              className="inline-block"
            />
          </button>
        </div>
      </nav>
    </>
  );
}
