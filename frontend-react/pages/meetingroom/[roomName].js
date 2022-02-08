import { useState, useEffect } from "react";
import Conference from "../../components/meetingroom/Conference";
import Swal from "sweetalert2";
import Router from "next/router";

export const isBrowser = typeof window !== "undefined";
const URL = "3.38.253.61:8443";
export const ws = isBrowser
  ? new WebSocket("wss://" + URL + "/groupcall")
  : null;

export default function Meeting({ roomName }) {
  const conferenceName = new Buffer(roomName, "base64").toString();

  const [isJoin, setIsJoin] = useState(true);
  const [myName, setMyName] = useState("");

  useEffect(() => {
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
    }
  }, []);

  const joinRoom = async (e) => {
    e.preventDefault();
    console.log(e.target[0].value);
    await setMyName(e.target[0].value);
    await setIsJoin(false);
  };

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
          <button className="meetingroom-red">
            <img
              src="/meetingroom/mic_muted.svg"
              alt="마이크를 켜둘지 정하실 수 있습니다."
            />
          </button>
          :
        </div>
      ) : (
        <Conference
          myName={myName}
          myRoom={conferenceName}
          ws={ws}
        ></Conference>
      )}
    </>
  );
}

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
