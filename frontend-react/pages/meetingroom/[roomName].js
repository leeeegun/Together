import { useState, useEffect } from "react";
import Conference from "../../components/meetingroom/Conference";
import Swal from "sweetalert2";
import Router from "next/router";
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// export const isBrowser = typeof window !== "undefined";
const URL = "3.38.253.61:8443";
// export const ws = isBrowser
//   ? new WebSocket("wss://" + URL + "/groupcall")
//   : null;

export default function Meeting({ roomName }) {
  const conferenceName = new Buffer(roomName, "base64").toString();

  const [isJoin, setIsJoin] = useState(true);
  const [myName, setMyName] = useState("");
  const [ws, setWs] = useState(null);
  const [userId, setUserId] = useState("")
  const [isMic, setIsMic] = useState(true) // 초기에 마이크를 사용할지 정하는 state입니다.
  const [isVideo, setIsVideo] = useState(true) // 초기에 비디오를 사용할지 정하는 state입니다.

  useEffect(() => {
    setWs(new WebSocket("wss://" + URL + "/groupcall"));
    window.onbeforeunload = function () {
      return false;
    };
    if (!localStorage.getItem("token")) {
      Swal.fire({
        icon: "error",
        title: "로그인 실패..",
        text: "로그인을 다시 해주세요!",
      });
      Router.push("/");
    } else {
      const token = localStorage.getItem("token");
      const base64Payload = token.split(".")[1];
      const payload = Buffer.from(base64Payload, "base64");
      const result = JSON.parse(payload.toString());
      setUserId(result.sub);
    }
  }, []);

  const joinRoom = async (e) => {
    e.preventDefault();
    console.log(e.target[0].value);
    await setMyName(e.target[0].value);
    await setIsJoin(false);
  };

  // 초기에 비디오를 사용할지 토글하는 함수입니다.
  const toggleVideo = () => {
    setIsVideo(!isVideo);
  }

  // 초기에 마이크를 사용할지 토글하는 함수입니다.
  const toggleMic = () => {
    setIsMic(!isMic);
  }

  return (
    <>
      {isJoin ? (
        <div className="animate join flex flex-col gap-10 mx-auto mt-10">
          <h1 className="text-center text-5xl">대기실?</h1>
          <form
            className="flex flex-col gap-10 text-center items-center"
            onSubmit={joinRoom}
            acceptCharset="UTF-8"
          >
            <p>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Username"
                required
              />
            </p>
            <button className="w-20 bg-[#009e747a] hover:bg-[#009e7494] text-white font-bold py-2 px-4 rounded">
              <input type="submit" name="commit" value="Join!" />
            </button>
          </form>

          {isMic?
          <button aria-label="본인 마이크 끄기" title="누르시면 마이크를 끈 채로 시작합니다" onClick={toggleMic} className="meetingroom-red"><FontAwesomeIcon icon={faMicrophoneSlash} size="1x" /></button>:
          <button aria-label="본인 마이크 켜기" title="누르시면 마이크를 켠 채로 시작합니다" onClick={toggleMic} className="meetingroom-grey"><FontAwesomeIcon icon={faMicrophone} size="1x" /></button>
          }

          {isVideo?
          <button aria-label="본인 비디오 끄기" title="누르시면 비디오를 끈 채로 시작합니다" onClick={toggleVideo} className="meetingroom-red"><FontAwesomeIcon icon={faVideoSlash} size="1x" /></button>:
          <button aria-label="본인 비디오 켜기" title="누르시면 비디오를 켠 채로 시작합니다" onClick={toggleVideo} className="meetingroom-grey"><FontAwesomeIcon icon={faVideo} size="1x" /></button>
          }
        </div>
      ) : (
        <Conference
          myName={myName}
          myRoom={conferenceName}
          ws={ws}
          userId={userId}
          isMic={isMic} // 마이크를 사용할지 prop으로 넘겨줍니다.
          isVideo={isVideo}
        ></Conference>
      )}
    </>
  );
}

// 아래 링크를 참조하십시오. roomName이라는 URL 링크를 변수로 사용하기 위한 과정입니다!
// https://stackoverflow.com/questions/67803855/how-to-generate-dynamic-pages-without-knowing-the-static-paths-on-nextjs
export async function getStaticProps({ params: { roomName } }) {
  return {
    props: { roomName },
  };
}
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

// export async function getStaticProps({ params }) {
//   console.log(params)
// }
