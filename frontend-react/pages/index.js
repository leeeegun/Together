import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import LandingImage01 from "../public/images/LandingImage01.jpg";
import LandingParagraph from "../components/LandingParagraph";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/signupForm";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Router from "next/router";
import Swal from "sweetalert2";

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

  const loginClickJoin = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "question",
      title: "로그인이 필요합니다.",
    });
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
      {/* <button className="fixed prev" onClick={(e) => scrollEvent(e, "up")} >
        <FontAwesomeIcon icon={faChevronUp} size="2x" />
      </button>
      <button className="fixed next" onClick={(e) => scrollEvent(e, "down")}>
        <FontAwesomeIcon icon={faChevronDown} size="2x" />
      </button> */}
      <div className="flex flex-col items-center justify-center left sidebar">
        <img
          src="images/svg/Together.svg"
          alt="웹앱 로고, Together"
          className="mb-5"
          tabIndex="0"
        ></img>
        <p>
          <button
            className="button text-black font-bold py-2 px-7 rounded-full my-5 hover:bg-[#BEBBB1]"
            onClick={signUpClick}
            id="signup-button"
          >
            <a className="text-xs">회원가입</a>
          </button>
        </p>
        <p className="mb-3 text-xs md:text-sm">
          이미 가입된 회원이세요?
          <span className="text-red-500 cursor-pointer" onClick={loginClick}>
            <button
              className="rounded-full hover:text-red-600 hover:font-bold"
              id="login-button"
            >
              {" "}
              로그인{"    "}
            </button>
          </span>
        </p>
        <p className="mb-40 text-xs lg:text-sm">
          <Link href="/guide" replace={false} shallow role="link">
            <a>
              <span className="text-xl" aria-hidden="true">
                📖{" "}
              </span>
              가이드 보기
            </a>
          </Link>
        </p>
        <p className="text-xs lg:text-sm">
          이미 만들어진 회의에 참여하고 싶으세요?
          <span className="text-red-500">
            <a
              className="block text-center hover:text-red-600 hover:font-semibold"
              aria-label="생성된 회의에 참여하기"
            >
              회의 참여하기
            </a>
          </span>
        </p>
      </div>
      <div className="w-screen h-screen overflow-scroll snap-y snap-mandatory scroll-smooth">
        <LandingParagraph
          src={LandingImage01}
          text="화상회의 플랫폼 Together와 함께 재미있는 시간을 보내봐요!"
        />
        <LandingParagraph
          src={LandingImage01}
          text="화상회의 플랫폼 Together와 함께 재미있는 시간을 보내봐요!"
        />
        <LandingParagraph
          src={LandingImage01}
          text="화상회의 플랫폼 Together와 함께 재미있는 시간을 보내봐요!"
        />
        {showSignUpForm ? <SignUpForm /> : null}
        {showLoginForm ? <LoginForm /> : null}
      </div>
      <button
        className="fixed prev"
        onClick={(e) => scrollEvent(e, "up")}
        aria-hidden
      >
        <FontAwesomeIcon icon={faChevronUp} size="2x" />
      </button>
      <button
        className="fixed next"
        onClick={(e) => scrollEvent(e, "down")}
        aria-hidden
      >
        <FontAwesomeIcon icon={faChevronDown} size="2x" />
      </button>
    </motion.div>
  );
}
