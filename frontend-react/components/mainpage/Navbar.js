// import {ReactComponent as Home} from '../../public/mainpage/home-icon.svg';
import Link from "next/link";
import { useState, useEffect } from "react";

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
      });
      Router.push("/");
    }
  }, []);
  return (
    <nav style={{ display: "flex", alignItems: "end" }} className="mx-2 my-2">
      {/* <Home /> */}
      <Link href="/main">
        <img
          src="mainpage/Home-Logo.png"
          alt="home logo"
          style={{ width: "40px", marginRight: "1rem", cursor: "pointer" }}
        />
      </Link>
      <h1 className="text-xl font-semibold c-footer-social_link">
        {userId ? userId : null}님, 안녕하세요!
      </h1>
    </nav>
  );
}
