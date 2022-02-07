// import Head from "next/head";
// import styles from "../styles/main.module.css"
// import "../styles/main.module.css"
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/mainpage/Navbar";
import Router from "next/router";

export default function Main() {
  const [username, setUsername] = useState("임시");
  const [isFirst, setIsFirst] = useState(true);

  // 로그인한 사용자만 mainpage에 접근할 수 있도록 함
  // 현재는 시크릿키도 없고, JWT에 정보도 담겨져있지 않아서 제한적
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsFirst(false);
    if (token) {
      // setUsername(token.sub)
    } else {
      alert("로그인해 주세요");
      Router.push("/");
    }
  }, []);

  const copying = () => {
    const copyText = document.getElementById("mainpage-meeting-url").innerText;
    navigator.clipboard.writeText(copyText);
    alert("클립보드에 복사되었습니다!");
  };

  return (
    <>
      <Navbar username={username} />
      {isFirst && <div id="mainpage-tempside"></div>}
      <section id="mainpage">
        <div id="mainpage-menu">
          <div id="mainpage-card">
            <h1 className="m-3 text-3xl font-bold">내 회의실</h1>
            <p>
              내 주소:{" "}
              <a style={{ wordBreak: "break-word" }} id="mainpage-meeting-url">
                https://www.instagram.com/zuck/
              </a>
              <button
                onClick={copying}
                className="bg-[#009e747a] text-white ml-2 p-1 rounded"
              >
                복사
              </button>
            </p>
          </div>

          <div>
            <label htmlFor="mainpage-input-area">
              <h1
                className="m-3 text-3xl font-bold"
                style={{ cursor: "pointer" }}
              >
                회의 참가
              </h1>
            </label>
            <input
              type="checkbox"
              id="mainpage-input-area"
              style={{ display: "none" }}
            ></input>
            <div>
              <form>
                <input
                  className="h-10"
                  style={{ border: "1px solid black", width: "55%" }}
                  type="text"
                  name="roomnumber"
                  placeholder="회의 주소를 입력해 주세요."
                />
                <button className="h-10 bg-[#009e747a] text-white ml-2 p-1 rounded">
                  제출
                </button>
              </form>
            </div>
          </div>

          <div>
            <h1 className="m-3 text-3xl font-bold mainpage-title">회의 생성</h1>
            <img
              id="mainpage-image-3"
              className="mainpage-effectimg"
              src="./mainpage/conference.jpg"
              alt="conference"
            ></img>
          </div>

          <div>
            <Link href="/faq">
              <h1 className="m-3 text-3xl font-bold mainpage-title">FAQ</h1>
            </Link>
          </div>

          <div>
            <h1 className="m-3 text-3xl font-bold mainpage-title">My Page</h1>
            <img
              id="mainpage-image-5"
              className="mainpage-effectimg"
              src="./mainpage/Descartes.png"
              alt="my page"
            ></img>
          </div>

          <div>
            <h1
              className="m-3 text-3xl font-bold mainpage-title"
              onClick={() => {
                localStorage.clear("token");
                Router.push("/");
              }}
            >
              로그아웃
            </h1>
            {/* <Image className={styles.effectimg} width={400} height={400} src="/conference.jpg" alt="conference"></Image> */}
            {/* <Image className="mainpage-effectimg" width={400} height={400} src="/conference.jpg" alt="conference"></Image> */}
          </div>
        </div>
      </section>
    </>
  );
}
