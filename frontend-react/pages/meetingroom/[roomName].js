import { useState, useEffect } from "react";
import Conference from "../../components/meetingroom/Conference";
import Swal from "sweetalert2";
import Router from "next/router";
import {
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

// export const isBrowser = typeof window !== "undefined";
const URL = "3.38.253.61:8446";
// export const ws = isBrowser
//   ? new WebSocket("wss://" + URL + "/groupcall")
//   : null;

export default function Meeting({ roomName }) {
  const conferenceName = new Buffer(roomName, "base64").toString();
  const [isJoin, setIsJoin] = useState(true);
  const [myName, setMyName] = useState("");
  const [ws, setWs] = useState(null);
  const [userId, setUserId] = useState("");
  const [isMic, setIsMic] = useState(true); // 초기에 마이크를 사용할지 정하는 state입니다.
  const [isVideo, setIsVideo] = useState(true); // 초기에 비디오를 사용할지 정하는 state입니다.
  const [isHost, setIsHost] = useState(false);
  const [description, setDescription] = useState("");
  const [uid, setUid] = useState("");

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
      console.log(result);
      setUserId(result.sub);
      setUid(result.uid);
    }
    console.log(isHost);
  }, []);

  useEffect(() => {
    if (userId === conferenceName) {
      getInformation();
      setIsHost(true);
    } else {
      getInformation();
      setIsHost(false);
    }
  }, [userId]);

  // 설명 얻어오는 함수.
  const getInformation = () => {
    return fetch(`http://localhost:8443/conference/info/${conferenceName}`)
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then((res) => {
        setDescription(res.description);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const joinRoom = async (e) => {
    e.preventDefault();
    // console.log(e.target[0].value);
    // return fetch(
    //   `http://localhost:8443/conference/join/${conferenceName}/${uid}`,
    // )
    //   .then((response) => {
    //     console.log(response);
    //     if (!response.ok) {
    //       Swal.fire({
    //         icon: "error",
    //         text: "호스트가 회의를 열지 않았습니다.",
    //       });
    //       throw new Error(response.status);
    //     }
    //     return response.json();
    //   })
    //   .then((res) => {
    //     console.log(res);
    //     setMyName(e.target[0].value);
    //     setIsJoin(false);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    await setMyName(e.target[0].value);
    await setIsJoin(false);
  };

  // 초기에 비디오를 사용할지 토글하는 함수입니다.
  const toggleVideo = () => {
    let message;
    message = isVideo ? "카메라를 끈 상태입니다." : "카메라를 켠 상태입니다.";
    Swal.fire({
      title: message,
      icon: "success",
    });
    setIsVideo(!isVideo);
  };

  // 초기에 마이크를 사용할지 토글하는 함수입니다.
  const toggleMic = () => {
    let message;
    message = isMic ? "음소거 상태입니다." : "음소거가 해제되었습니다.";
    Swal.fire({
      title: message,
      icon: "success",
    });
    setIsMic(!isMic);
  };

  //회의정보 변경
  const changeConference = () => {
    Swal.fire({
      title: "방 설명을 적어주세요!",
      input: "text",
      inputPlaceholder: "방 설명",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      cancelButtonText: "취소",
      confirmButtonText: "확인",
      showLoaderOnConfirm: true,
      backdrop: true,
      preConfirm: (desc) => {
        return fetch(`http://localhost:8443/conference/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            title: "",
            description: desc,
          }),
        })
          .then((response) => {
            if (!response.ok) throw new Error(response.statusText);
            return response.json();
          })
          .catch((error) => {
            Swal.showValidationMessage(`${error}`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        getInformation();
        Swal.fire({
          icon: "success",
          title: "수정 완료!",
        });
      }
    });
  };

  return (
    <>
      {isJoin ? (
        <motion.div
          className="flex items-center justify-center h-screen"
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
          <div className="bg-white rounded-2xl border shadow-xl max-w-4xl flex flex-row w-full h-3/6">
            <div className="flex flex-col items-start justify-center content-center p-10 w-6/12 bg-[#ece6cc] rounded-l-2xl">
              <h1 className="font-semibold text-2xl text-gray-500 mb-10 subject">
                {conferenceName}님의 회의실
              </h1>
              <br></br>
              <p>{description ? description : "설명이 없습니다"}</p>
            </div>
            <div className="flex flex-col items-center justify-center content-center p-10 space-y-4 w-6/12">
              <strong className="font-bold text-2xl text-gray-700 w-4/6 text-center waiting z-10">
                대기실
              </strong>
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
              <div>
                {isMic ? (
                  <motion.button
                    aria-label="본인 마이크 끄기"
                    title="누르시면 마이크를 끈 채로 시작합니다"
                    onClick={toggleMic}
                    className="meetingroom-red inline"
                    whileHover={{ scale: 1.2 }}
                  >
                    <FontAwesomeIcon
                      icon={faMicrophoneSlash}
                      size="1x"
                      className="inline"
                    />
                  </motion.button>
                ) : (
                  <motion.button
                    aria-label="본인 마이크 켜기"
                    title="누르시면 마이크를 켠 채로 시작합니다"
                    onClick={toggleMic}
                    className="meetingroom-grey inline"
                    whileHover={{ scale: 1.2 }}
                  >
                    <FontAwesomeIcon
                      icon={faMicrophone}
                      size="1x"
                      className="inline"
                    />
                  </motion.button>
                )}

                {isVideo ? (
                  <motion.button
                    aria-label="본인 비디오 끄기"
                    title="누르시면 비디오를 끈 채로 시작합니다"
                    onClick={toggleVideo}
                    className="meetingroom-red inline mx-3"
                    whileHover={{ scale: 1.2 }}
                  >
                    <FontAwesomeIcon
                      icon={faVideoSlash}
                      size="1x"
                      className="inline mx-3"
                    />
                  </motion.button>
                ) : (
                  <motion.button
                    aria-label="본인 비디오 켜기"
                    title="누르시면 비디오를 켠 채로 시작합니다"
                    onClick={toggleVideo}
                    className="meetingroom-grey inline mx-3"
                    whileHover={{ scale: 1.2 }}
                  >
                    <FontAwesomeIcon
                      icon={faVideo}
                      size="1x"
                      className="inline mx-3"
                    />
                  </motion.button>
                )}
              </div>
              {isHost ? (
                <button
                  className="hover:font-semibold inline"
                  onClick={changeConference}
                >
                  호스트시네요? 방 정보 수정하기
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
        </motion.div>
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
