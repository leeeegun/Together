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
  const [disability, setDisability] = useState(0);

  useEffect(() => {
    setWs(new WebSocket("wss://" + "i6a406.p.ssafy.io:8446" + "/groupcall"));
    if (!localStorage.getItem("token")) {
      Swal.fire({
        icon: "error",
        title: "로그인 실패..",
        text: "로그인을 다시 해주세요!",
        confirmButtonAriaLabel: "확인"
      });
      Router.push("/");
    } else {
      const token = localStorage.getItem("token");
      const base64Payload = token.split(".")[1];
      const payload = Buffer.from(base64Payload, "base64");
      const result = JSON.parse(payload.toString());
      setUserId(result.sub);
      setUid(result.uid);
      switch (result.disability) {
        case "해당 없음":
          setDisability(0);
          break;
        case "시각 장애":
          setDisability(1);
          break;
        case "청각 장애":
          setDisability(2);
          break;
        default:
          console.error("잘못된 유형: ", result.disability);}
    }
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
    // return fetch(`http://localhost:8443/conference/info/${conferenceName}`)
    return fetch(
      `https://i6a406.p.ssafy.io:8443/conference/info/${conferenceName}`,
    )
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then((res) => {
        setDescription(res.description);
      })
      .catch(() => {});
  };

  const joinRoom = async (e) => {
    e.preventDefault();
    // return fetch(
    //   `${process.env.NEXT_PUBLIC_API_URL}/conference/join/${conferenceName}/${uid}`,
    // )
    //   .then((response) => {
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
    //     setMyName(e.target[0].value);
    //     setIsJoin(false);
    //   })
    //   .catch(() => {});
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
      confirmButtonAriaLabel: "확인"
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
      confirmButtonAriaLabel: "확인"
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
        return fetch(`https://i6a406.p.ssafy.io:8443/conference/update`, {
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
          confirmButtonAriaLabel: "확인"
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
          <div className="flex flex-row w-full max-w-4xl bg-white border shadow-xl rounded-2xl h-3/6">
            <div aria-labelledby="waitRoomInfo" role="article" tabIndex="0" className="flex flex-col items-start justify-center content-center p-10 w-6/12 bg-[#ece6cc] rounded-l-2xl">
              <h1 tabIndex="0" className="mb-10 text-2xl font-semibold text-gray-500 subject">
                {conferenceName}님의 회의실
              </h1>
              <br></br>
              <p tabIndex="0" role="note">{description ? description : "설명이 없습니다"}</p>
              <span hidden id="waitRoomInfo">대기실, 회의실에 입장하기 전 닉네임 마이크 카메라 설정이 가능합니다.</span>
            </div>
            <div role="heading" tabIndex="0" className="flex flex-col items-center content-center justify-center w-6/12 p-10 space-y-4">
              <strong className="z-10 w-4/6 text-2xl font-bold text-center text-gray-700 waiting">
                대기실
              </strong>
              <form
                className="flex flex-col items-center gap-10 text-center"
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
                    className="inline meetingroom-red"
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
                    className="inline meetingroom-grey"
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
                    className="inline mx-3 meetingroom-red"
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
                    className="inline mx-3 meetingroom-grey"
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
                  className="inline hover:font-semibold"
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
          isVideo={isVideo} // 비디오를 사용할지 prop으로 넘겨줍니다.
          disability={disability} // 장애 유형을 prop으로 넘겨줍니다.
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
