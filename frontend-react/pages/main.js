import { useState, useEffect } from "react";
import Navbar from "../components/mainpage/Navbar";
import Router from "next/router";
import Swal from "sweetalert2";
import Footer from "../components/footer";
import { motion } from "framer-motion";
import LinkCard from "../components/mainpage/linkCard";
import MyConferenceCard from "../components/mainpage/myConferenceCard";
import ParticipateConferenceCard from "../components/mainpage/participateConferenceCard";
import ProfileCard from "../components/mainpage/profileCard";

export default function Main() {
  const [username, setUsername] = useState("");
  const [isFirst, setIsFirst] = useState(true);
  const [userId, setUserId] = useState("");
  const [uid, setUid] = useState("");

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
      setUid(result.uid);
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
    <>
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
        <div className="w-screen h-screen maindiv">
          <Navbar username={username} />
          {isFirst && <div id="mainpage-tempside"></div>}
          <section
            id="mainpage"
            className="flex flex-col items-center justify-center justify-items-center"
          >
            <div id="mainpage-menu">
              <MyConferenceCard
                src="images/svg/newConference.svg"
                text="내 회의실"
                link="myconference"
                username={username}
                uid={uid}
                description="내 회의실, 회의를 열어 사람들과 소통해보세요!"
              />
              <ParticipateConferenceCard
                src="images/svg/participateConference.svg"
                text="회의 참가"
                link="participate"
                description="회의 참가, 회의에 참가해 사람들과 소통해보세요!"
              ></ParticipateConferenceCard>
              <LinkCard
                text="도움말"
                link="faq"
                src="images/svg/faq.svg"
                description="도움말, 도움말을 보며 궁금증을 해결해봐요!"
              ></LinkCard>
              <ProfileCard
                text="프로필 수정"
                link="mypage"
                username={userId}
                src="images/svg/profile.svg"
                description="내 프로필을 수정할 수 있어요!"
              ></ProfileCard>
            </div>
          </section>
        </div>
      </motion.div>
      <Footer />
    </>
  );
}
