import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import LandingImage01 from "../public/images/LandingImage01.jpg";
import LandingParagraph from "../components/LandingParagraph";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/signupForm";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Router from "next/Router";

export default function Home() {
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  //scroll Event
  const scrollEvent = (e, option) => {
    const snapScroll = document.querySelector(".overflow-scroll");
    if (option === "up") {
      snapScroll.scrollTop -= snapScroll.scrollHeight / 5;
    } else {
      snapScroll.scrollTop += snapScroll.scrollHeight / 5;
    }
  };

  //signup click
  const signUpClick = () => {
    setShowSignUpForm(!showSignUpForm);
    const signupButton = document.querySelector("#signup-button");
    signupButton.classList.toggle("signup-clicked");
    if (showLoginForm) {
      const loginButton = document.querySelector("#login-button");
      loginButton.classList.toggle("login-clicked");
      setShowLoginForm(!showLoginForm);
    }
  };

  const loginClick = () => {
    setShowLoginForm(!showLoginForm);
    const loginButton = document.querySelector("#login-button");
    loginButton.classList.toggle("login-clicked");
    if (showSignUpForm) {
      const signupButton = document.querySelector("#signup-button");
      signupButton.classList.toggle("signup-clicked");
      setShowSignUpForm(!showSignUpForm);
    }
  };

  useEffect(() => {
    const snapScroll = document.querySelector(".overflow-scroll");
    snapScroll.scrollTo(0, 0);
    if (localStorage.getItem("token")) {
      Router.push("/main");
    }
  }, []);

  useEffect(() => {
    if (document.querySelector(".overflow-scroll")) {
      const snapScroll = document.querySelector(".overflow-scroll");
      return () => {
        snapScroll.scrollTo(0, snapScroll.scrollHeight);
      };
    } else {
      return;
    }
  }, [showSignUpForm, showLoginForm]);

  return (
    <motion.div
      className=""
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {
          scale: 0.3,
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
      <button className="prev fixed" onClick={(e) => scrollEvent(e, "up")}>
        <FontAwesomeIcon icon={faChevronUp} size="2x" />
      </button>
      <button className="next fixed" onClick={(e) => scrollEvent(e, "down")}>
        <FontAwesomeIcon icon={faChevronDown} size="2x" />
      </button>
      <div className="left sidebar flex flex-col items-center justify-center">
        <p className="md:text-7xl text-5xl mb-10 font-extralight">Together</p>
        <p>
          <button
            className="button text-black font-bold py-2 px-7 rounded-full mb-10 hover:bg-[#BEBBB1]"
            onClick={signUpClick}
            id="signup-button"
          >
            <a className="text-xs">회원가입</a>
          </button>
        </p>
        <p className="md:text-sm text-xs mb-3">
          이미 가입된 회원이세요?
          <span className="text-red-500 cursor-pointer" onClick={loginClick}>
            <a
              className="hover:text-red-600 hover:font-bold rounded-full"
              id="login-button"
            >
              {" "}
              로그인{"    "}
            </a>
          </span>
        </p>
        <p className="lg:text-sm text-xs mb-40">
          <Link href="/guide" replace={false} shallow>
            <a>
              <span className="text-xl">📖 </span>가이드 보기
            </a>
          </Link>
        </p>
        <p className="lg:text-sm text-xs">
          이미 만들어진 회의에 참여하고 싶으세요?
          <span className="text-red-500">
            <Link href="/signup" passHref>
              <a className="hover:text-red-600 hover:font-semibold block text-center">
                회의 참여하기
              </a>
            </Link>
          </span>
        </p>
      </div>
      <div className="snap-y snap-mandatory h-screen w-screen overflow-scroll scroll-smooth">
        <LandingParagraph
          src={LandingImage01}
          text="Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text
        ever since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum."
        />
        <LandingParagraph
          src={LandingImage01}
          text="The quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dogThe quick brown fox jumps over the lazy dogThe quick brown fox jumps over the lazy dogThe quick brown fox jumps over the lazy dog"
        />
        <LandingParagraph
          src={LandingImage01}
          text="국회의원과 정부는 법률안을 제출할 수 있다. 헌법재판소 재판관은 정당에 가입하거나 정치에 관여할 수 없다. 모든 국민은 소급입법에 의하여 참정권의 제한을 받거나 재산권을 박탈당하지 아니한다. 국무회의는 정부의."
        />
        {showSignUpForm ? <SignUpForm /> : null}
        {showLoginForm ? <LoginForm /> : null}
      </div>
    </motion.div>
  );
}
