import { useState, useEffect, useRef } from "react";
import Router from "next/router";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const LoginForm = () => {
  const [userId, setUserId] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // const userIdRef = useRef();

  // 페이지 렌서시 아이디 입력창에 포커스
  // useEffect(() => {
  //   userIdRef.current.focus();
  // }, []);

  // 성공 메세지 출력
  useEffect(() => {
    console.log(successMessage);
    setSuccessMessage("");
  }, [successMessage]);

  // 실패 메세지 출력
  useEffect(() => {
    console.log(errorMessage);
    setErrorMessage("");
  }, [errorMessage]);

  // 로그인 로직
  const handleSubmit = async (e) => {
    e.preventDefault();
    submitLogin();
    initializeData();
  };

  // 로그인 입력 정보의 상태들 초기화
  const initializeData = async () => {
    setUserId("");
    setUserPassword("");
  };

  // 로그인 POST 요청
  const submitLogin = async () => {
    fetch("http://localhost:8443/auth/login", {
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
        // 참고: https://stackoverflow.com/questions/49725012/handling-response-status-using-fetch-in-react-js/49725163
        if (!response.ok) throw new Error(response.status);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        localStorage.setItem("token", data.accessToken);
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
          icon: "success",
          title: "로그인 성공!",
        });
        setSuccessMessage("로그인 성공!");
        Router.push("/main");
      })
      .catch((error) => {
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
          icon: "error",
          title: "로그인 실패..",
        });
        setErrorMessage(`로그인 실패 사유 : ${error}`);
      });
  };

  return (
    <div className="right snap-center flex flex-col items-center justify-center w-screen h-screen">
      <motion.section
        className="flex flex-col px-6 py-8 bg-[#E1E2E1] rounded-[50px] shadow sm:px-10"
        whileHover={{ scale: 1.4 }}
        whileInView={{ scale: 1.2 }}
      >
        <h1 className="text-center">로그인</h1>
        <form onSubmit={handleSubmit} className="mb-0">
          <div>
            <label
              htmlFor="userid"
              className="relative block mt-10 text-sm font-medium 10"
            >
              아이디
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="userid"
                // ref={userIdRef} // 페이지 렌더 되면 이곳 포커스
                onChange={(e) => setUserId(e.target.value)}
                // autoComplete="off"
                value={userId} // 이게 무슨 역할을 하는거지
                required
                className="border border-[#F1EDE3] px-3 py-1 rounded-lg shadow-sm focus:outline-none focus:border-[#BEBBB1] focus:ring-1 focus:ring-[#BEBBB1]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="userPassword"
              className="relative block mt-10 text-sm font-medium 10"
            >
              비밀번호
            </label>
            <div className="mt-1">
              <input
                type="password"
                id="userPassword"
                onChange={(e) => setUserPassword(e.target.value)}
                value={userPassword}
                required
                className="border border-[#F1EDE3] px-3 py-1 rounded-lg shadow-sm focus:outline-none focus:border-[#BEBBB1] focus:ring-1 focus:ring-[#BEBBB1]"
              />
            </div>
          </div>

          <div className="mt-12 text-center">
            <button className="border border-[#BEBBB1] bg-[#BEBBB1] px-3 py-1 rounded-lg shadow-sm w-2/5">
              로그인
            </button>
          </div>
        </form>
      </motion.section>
    </div>
  );
};

export default LoginForm;
