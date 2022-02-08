// import Head from "next/head";
// import styles from "../styles/main.module.css"
// import "../styles/main.module.css"
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/mainpage/Navbar";
import Router from "next/router";
import Swal from "sweetalert2";
import Footer from "../components/footer";
import { motion } from "framer-motion";
import RandomSvg from "../public/images/svg/background.svg";
import RandomSvg2 from "../public/images/svg/facebook-brands.svg";
import LinkCard from "../components/mainpage/linkCard";
import MyConferenceCard from "../components/mainpage/myConferenceCard";
import ParticipateConferenceCard from "../components/mainpage/participateConferenceCard";

const participateConference = () => {
  console.log(1);
};

export default function Main() {
  const [username, setUsername] = useState("");
  const [isFirst, setIsFirst] = useState(true);
  const [userId, setUserId] = useState("");

  // 로그인한 사용자만 mainpage에 접근할 수 있도록 함
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsFirst(false);
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
      });
      Router.push("/");
    }
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {
          scale: 1,
          opacity: 0,
        },
        visible: {
          scale: 1,
          opacity: 1,
          transition: {
            delay: 0.5,
          },
        },
      }}
    >
      <div className="h-screen w-screen maindiv">
        <Navbar username={username} />
        {isFirst && <div id="mainpage-tempside"></div>}
        <section
          id="mainpage"
          className="flex flex-col justify-center justify-items-center items-center"
        >
          <div id="mainpage-menu">
            <MyConferenceCard
              src={RandomSvg}
              text="내 회의실"
              link="myconference"
              username={username}
              description="도움말을 보며 궁금증을 해결해봐요!"
            />
            <ParticipateConferenceCard
              src={RandomSvg2}
              text="회의 참가"
              link="participate"
              description="도움말을 보며 궁금증을 해결해봐요!"
            ></ParticipateConferenceCard>
            <LinkCard
              text="도움말"
              link="faq"
              description="도움말을 보며 궁금증을 해결해봐요!"
            ></LinkCard>
            <LinkCard
              text="마이 페이지"
              link="mypage"
              description="내 프로필로 들어가봐요!"
            ></LinkCard>
          </div>
          <Footer />
        </section>
      </div>
    </motion.div>
  );
}
