import kurentoUtils from "kurento-utils";
import Router from "next/router";
import { useState, useEffect, useRef } from "react";
import {
  faDesktop,
  faMicrophone,
  faMicrophoneSlash,
  faPhoneSlash,
  faVideo,
  faVideoSlash,
  faEllipsisV,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import Chat from "./Chat";

const PARTICIPANT_MAIN_CLASS = "participant main";
const PARTICIPANT_CLASS = "participant";

export default function Conference({
  myName,
  myRoom,
  ws,
  isMic,
  isVideo,
  userId,
  disability // 장애 유형을 입력받습니다.
}) {
  // 받아오는 myName이 자신의 닉네임이고 userId가 아이디입니다!
  // participant 객체의 name은 해당 사용자의 아이디이고 nickname은 닉네임입니다!
  const [participants, setParticipants] = useState({}); // 참가자들 목록 저장
  const [isMicEnabled, setIsMicEnabled] = useState(isMic); // 마이크 켜고 끄기 토글
  const [isVideoEnabled, setIsVideoEnabled] = useState(isVideo); // 비디오 켜고 끄기 토글
  const [isSharingEnabled, setIsSharingEnabled] = useState(false); // 화면 공유 켜고 끄기 토글
  const [chats, setChats] = useState([]); // 채팅기록을 저장합니다.
  const [isChatEnabled, setIsChatEnabled] = useState(false); // 채팅창을 표시할지 토글합니다.
  const [isNoti, setIsNoti] = useState(false); // 메시지 알람을 활성화할지 토글합니다.
  const [isTTSEnabled, setIsTTSEnabled] = useState(true) // TTS 활성화 여부를 토글합니다.
  const messageInput = useRef();
  const meetingroomMessage = useRef();

  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };
  useEffect(() => {
    const message = {
      id: "joinRoom",
      // name: userId, // 가입할 때 쓴 userId
      name: userId,
      room: myRoom,
      nickname: myName, // ㄹㅇ 닉네임
    };
    sendMessage(message);
    console.log("설마 웹소켓이?", ws);
    createStt(); // 페이지 렌더 시 바로 STT 기능 활성화
    window.screen.orientation.lock("portrait").then(
      (success) => console.log(success),
      (failure) => console.log(failure),
    ); // 모바일 환경에서는 화면을 가로로 고정!
    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.addEventListener("beforeunload", alertUser);
    };
  }, []); // 기본 코드의 register 과정입니다.


  ws.onmessage = function (message) {
    const parsedMessage = JSON.parse(message.data);
    console.info("Received message: " + message.data);

    switch (parsedMessage.id) {
      case "existingParticipants":
        onExistingParticipants(parsedMessage);
        break;
      case "newParticipantArrived":
        onNewParticipant(parsedMessage);
        break;
      case "participantLeft":
        onParticipantLeft(parsedMessage);
        break;
      case "receiveVideoAnswer":
        receiveVideoResponse(parsedMessage);
        break;
      case "receiveTextMsg":
        receiveStt(parsedMessage);
        break;
      // ICE candidate peer 한테 보내기 혹은 받아오기 (아 정확히는 몰라)
      case "iceCandidate":
        participants[parsedMessage.name].rtcPeer.addIceCandidate(
          parsedMessage.candidate,
          function (error) {
            if (error) {
              console.error("Error adding candidate: " + error);
              return;
            }
          },
        );
        break;
      default:
        console.error("Unrecognized message", parsedMessage);
    }
  };

  function onNewParticipant(request) {
    receiveVideo(request.name, request.nickname);
  }

  // 대박 STT 부분
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // STT 생성 로직
  const createStt = () => {
    window.SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.interimResults = false;
    recognition.lang = "ko-KR";
    recognition.continuous = true;
    recognition.maxAlternatives = 100000;

    let speechToText = "";
    recognition.addEventListener("result", (event) => {
      let inter = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        let stt = event.results[i][0].transcript;

        // 이 부분에 kurento서버에 보내는 로직 필요함.
        sendStt(stt);
        // setSendSttMsg(stt);
      }
    });
    recognition.start();
    recognition.addEventListener("end", (event) => {
      recognition.start(); // 음성인식 기능이 꺼지면 다시 켜지게
    });
  };


  // 생성된 STT 백서버로 전달
  const sendStt = (stt) => {
    const msg = {
      id: "chatMsg",
      name: userId,
      room: myRoom,
      // content: sendSttMsg,
      content: `b${stt}`, // STT 메시지일 때는 앞에 "b"를 덧붙입니다!
    };
    console.log(`sending STT message : ${stt}`);
    sendMessage(msg);
  };


  // TTS 함수. 발화자와 텍스트 두 개를 인수로 받습니다.
  const speak = (speaker, text) => {
    if (
      typeof SpeechSynthesisUtterance === "undefined" ||
      typeof window.speechSynthesis === "undefined"
    ) {
      Swal.fire({
        icon: "error",
        title: "브라우저 미지원",
        text: "이 브라우저는 TTS를 지원하지 않습니다. 다른 브라우저를 이용해 주세요...!",
        confirmButtonAriaLabel: "확인"
      });
      return "error";
    }
  
    // window.speechSynthesis.cancel(); // 현재 읽고있다면 초기화
  
    const speechMsg = new SpeechSynthesisUtterance();
    speechMsg.rate = 0.8; // 속도: 0.1 ~ 10
    speechMsg.pitch = 0.8; // 음높이: 0 ~ 2
    speechMsg.lang = "ko-KR";
    speechMsg.text = `${speaker}로부터. ${text}`;
  
    // SpeechSynthesisUtterance에 저장된 내용을 바탕으로 음성합성 실행
    window.speechSynthesis.speak(speechMsg);
  }


  // 미디어서버로부터 메시지를 받은 경우. STT일 수도, 일반 채팅일 수도 있습니다!
  const receiveStt = (parsedMessage) => {
    const participant = participants[parsedMessage.owner];
    if (participant) {
      return
    }

    // STT 메시지를 받은 경우. 채팅창에 따로 기록되지 않습니다!
    if (parsedMessage.content[0] === "b") {
      const sttMsg = participant.getSttElement();
      sttMsg.innerText = parsedMessage.content.slice(1);
      setTimeout(function () {
        sttMsg.innerText = "";
      }, 3000);
    
    // 채팅 메시지를 받은 경우.
    } else if (parsedMessage.content[0] === "a") {
      const chatMsg = parsedMessage.content.slice(1);
      const now = new Date();
      const nickname = participants[parsedMessage.owner].nickname;
      const newChats = [
        ...chats,
        [nickname, now.toTimeString().slice(0, 5), chatMsg],
      ];
      setChats(newChats);
      !isChatEnabled && setIsNoti(true);
      if (disability === 1 && isTTSEnabled) {
        speak(nickname, chatMsg)
      }
      meetingroomMessage.current.scrollTo(
        0,
        meetingroomMessage.current.scrollHeight,
      );
    
    // 청각장애인 채팅의 경우 읽어줍니다. DRY에 어긋나는 코드이지만,,,
    } else if (parsedMessage.content[0] === "c") {
      const chatMsg = parsedMessage.content.slice(1);
      const now = new Date();
      const nickname = participants[parsedMessage.owner].nickname;
      const newChats = [
        ...chats,
        [nickname, now.toTimeString().slice(0, 5), chatMsg],
      ];
      setChats(newChats);
      !isChatEnabled && setIsNoti(true);
      meetingroomMessage.current.scrollTo(
        0,
        meetingroomMessage.current.scrollHeight,
      );
      const sttMsg = participant.getSttElement();
      sttMsg.innerText = chatMsg;
      setTimeout(function () {
        sttMsg.innerText = "";
      }, 3000);
      isTTSEnabled && speak(nickname, chatMsg) // TTS 기능이 활성화되어 있다면 채팅을 읽어줍니다.
    }
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // 2. SDP offer 생성 및 백엔드 서버로 전달
  // 다른 유저의 비디오 정보
  // 새로 들어온 유저의 경우
  function receiveVideo(sender, nickname) {
    const participant = new Participant(sender, nickname); // 새로 들어온 유저 객체
    // participant.nickname = nickname
    setParticipants((participants) => {
      return { ...participants, [sender]: participant };
    }); // 비동기처리를 위한 콜백 setState

    const video = participant.getVideoElement();

    const options = {
      remoteVideo: video,
      onicecandidate: participant.onIceCandidate.bind(participant),
    };
    console.log("video 태그: ", video);
    participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(
      options,
      function (error) {
        if (error) {
          return console.error(error);
        }
        this.generateOffer(participant.offerToReceiveVideo.bind(participant)); // 백서버로 SDP offer 보내는 부분
      },
    );
  }

  // 본인이 방 참가한 경우
  function onExistingParticipants(msg) {
    const constraints = {
      audio: true,
      video: {
        mandatory: {
          maxWidth: 320,
          // maxHeight: 200,
          maxFrameRate: 15,
          minFrameRate: 15,
        },
      },
    };
    console.log(msg);
    const participant = new Participant(userId, myName); // 처리 대상 유저 객체
    // participant.nickname = myName
    setParticipants((participants) => {
      return { ...participants, [userId]: participant };
    }); // 비동기처리를 위한 콜백 setState
    const video = participant.getVideoElement();
    console.log("내 비디오:", video);
    const options = {
      localVideo: video,
      mediaConstraints: constraints,
      onicecandidate: participant.onIceCandidate.bind(participant),
    };
    participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(
      options,
      function (error) {
        if (error) {
          return console.error(error);
        }
        this.generateOffer(participant.offerToReceiveVideo.bind(participant));
      },
    );

    for (let i = 0; i < msg.data.length; i++) {
      receiveVideo(msg.data[i], msg.nicknames[i]);
    }
    // msg.data.forEach(receiveVideo);
  }

  // 3. SDP answer 받아오기 및 P2P 연결!
  function receiveVideoResponse(result) {
    participants[result.name].rtcPeer.processAnswer(
      result.sdpAnswer,
      function (error) {
        if (error) return console.error(error);
      },
    );
    participants[userId].rtcPeer.videoEnabled = isVideo; // 받아온 prop으로부터 시작할 때 비디오 on/off를 결정합니다.
    participants[userId].rtcPeer.audioEnabled = isMic;
  }

  function callResponse(message) {
    if (message.response != "accepted") {
      console.info("Call not accepted by peer. Closing call");
      stop();
    } else {
      webRtcPeer.processAnswer(message.sdpAnswer, function (error) {
        if (error) return console.error(error);
      });
    }
  }

  function Participant(name, nickname) {
    this.name = name;
    this.nickname = nickname;
    const container = document.createElement("div");
    container.className = isPresentMainParticipant()
      ? PARTICIPANT_CLASS
      : PARTICIPANT_MAIN_CLASS;
    container.id = name;
    const span = document.createElement("span");
    const videoFrame = document.createElement("div"); // video 사이즈 맞추기 위한 틀
    const video = document.createElement("video");
    // const rtcPeer;

    videoFrame.appendChild(video);
    videoFrame.className = "meetingroom-frame";
    container.appendChild(videoFrame); // video를 videoFrame 안에 넣어서 container에 추가
    container.appendChild(span);

    const stt = document.createElement("blockquote"); // start
    stt.className = "speech-bubble";
    container.appendChild(stt); // end

    container.onclick = switchContainerClass;
    document.getElementById("meetingroom-participants").appendChild(container);

    span.appendChild(document.createTextNode(nickname));

    video.id = "video-" + name;
    video.autoplay = true;
    video.controls = false;

    this.getSttElement = function () {
      return stt;
    };

    this.getElement = function () {
      return container;
    };

    this.getVideoElement = function () {
      return video;
    };

    function switchContainerClass() {
      if (container.className === PARTICIPANT_CLASS) {
        const elements = Array.prototype.slice.call(
          document.getElementsByClassName(PARTICIPANT_MAIN_CLASS),
        );
        elements.forEach(function (item) {
          item.className = PARTICIPANT_CLASS;
        });

        container.className = PARTICIPANT_MAIN_CLASS;
      } else {
        container.className = PARTICIPANT_CLASS;
      }
    }

    function isPresentMainParticipant() {
      return (
        document.getElementsByClassName(PARTICIPANT_MAIN_CLASS).length !== 0
      );
    }

    this.offerToReceiveVideo = function (error, offerSdp, wp) {
      if (error) return console.error("sdp offer error");
      console.log("Invoking SDP offer callback function");
      const msg = {
        id: "receiveVideoFrom",
        sender: name,
        sdpOffer: offerSdp,
        nickname: nickname,
      };
      sendMessage(msg);
    };

    this.onIceCandidate = function (candidate, wp) {
      console.log("Local candidate" + JSON.stringify(candidate));

      const message = {
        id: "onIceCandidate",
        candidate: candidate,
        name: name,
      };
      sendMessage(message);
    };

    Object.defineProperty(this, "rtcPeer", { writable: true });

    this.dispose = function () {
      console.log("Disposing participant " + this.name);
      this.rtcPeer.dispose();
      container.parentNode.removeChild(container);
    };
  }

  function onParticipantLeft(request) {
    console.log("Participant " + request.nickname + " left");
    // 방 제목(즉, userId)과 나간 사람의 userId가 같다면 방을 폭파!
    if (request.name === myRoom) {
      window.alert("호스트가 연결을 종료하여 회의를 종료합니다");
      leaveRoom();
      return;
    }
    const participant = participants[request.name];
    participant.dispose();

    const newParticipants = { ...participants };
    delete newParticipants[request.name];
    setParticipants(newParticipants);
  }

  function sendMessage(message) {
    const jsonMessage = JSON.stringify(message);
    console.log("Sending message: " + jsonMessage);
    ws.send(jsonMessage);
  }

  function leaveRoom() {
    Router.reload("/");
    sendMessage({
      id: "leaveRoom",
    });

    // for (let key in participants) {
    //   participants[key].dispose();
    // }

    // // setIsJoin(true)

    // ws.close();

    // Router.push("/");
  }

  const toggleVideo = () => {
    console.log("비디오 토글:", participants);
    participants[userId].rtcPeer.videoEnabled =
      !participants[userId].rtcPeer.videoEnabled;
    setIsVideoEnabled(!isVideoEnabled);
  };

  const toggleAudio = () => {
    participants[userId].rtcPeer.audioEnabled =
      !participants[userId].rtcPeer.audioEnabled;
    setIsMicEnabled(!isMicEnabled);
  };

  // 엉망인 상태입니다,, 손볼 것...!
  const toggleSharing = () => {
    const constraints = {
      video: {
        width: 1920,
        height: 1080,
      },
      audio: false,
    };

    navigator.mediaDevices
      .getDisplayMedia(constraints)
      .then((stream) => {
        const videoInput = stream;
        const options = {
          localVideo: videoInput,
          mediaConstraints: constraints,
          onicecandidate: participants[myName].onIceCandidate,
        };
        webRtcPeerScreencast = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(
          options,
          function (error) {
            if (error) return handleError(error); //You'll need to use whatever you use for handling errors

            this.generateOffer(kurentoUtils.onOffer);
          },
        );
      })
      .catch(handleError);

    function handleError(error) {
      console.log("getDisplayMedia error: ", error);
    }

    // function handleSuccess(stream) {
    //     document.querySelector('video').srcObject = stream;
    // }

    // function handleError(error) {
    //     console.log('getDisplayMedia error: ', error);
    // }

    // navigator.mediaDevices.getDisplayMedia(constraints)
    //         .then((stream) => {
    //           document.querySelector('video').srcObject = stream;
    //           const peerConnection = new RTCPeerConnection(iceConfig);
    //           console.log(peerConnection)
    //           localStream.getTracks().forEach(track => {
    //             peerConnection.addTrack(track, localStream);
    //           });
    //         })
    //         .catch(handleError);
  };

  // 채팅창 토글
  const toggleChats = () => {
    if (isChatEnabled) {
      setIsChatEnabled(false);
    } else {
      isNoti && setIsNoti(false); // 메시지를 확인하므로 알림 삭제
      setIsChatEnabled(true);
      messageInput.current.focus();
    }
  };

  // 메시지 보내기
  const sendChatMsg = (event) => {
    event.preventDefault();
    const content = event.target[0].value;
    if (!content) {
      return
    }
    const msg = {
      id: "chatMsg",
      name: userId,
      room: myRoom,
      content: `a${content}`, // STT 메시지일 때는 앞에 "b"를 덧붙입니다!
    };
    if (disability === 2) { // 청각장애인의 채팅일 경우 앞에 "c"를 붙입니다.
      msg.content = `c${content}`;
    }
    sendMessage(msg);
    messageInput.current.value = "";
  };

  const toggleTTS = () => {
    setIsTTSEnabled((isTTSEnabled) => !isTTSEnabled)
  }

  return (
    <section
      id="meetingroom-meetingroom"
      style={
        isChatEnabled
          ? { gridTemplateColumns: "2fr 0.7fr" }
          : { gridTemplateColumns: "2fr 0.3fr" }
      }
    >
      {/* <h1>myName: {myName}</h1> */}
      <div id="room">
        <div
          className="grid grid-cols-2 gap-5 mx-auto text-center"
          id="meetingroom-participants"
        >
        </div>
        <div id="meetingroom-toolbar">
          {isMicEnabled ? (
            <button
              aria-label="본인 마이크 끄기"
              title="클릭 시 마이크를 끕니다"
              onClick={toggleAudio}
              className="meetingroom-red"
            >
              <FontAwesomeIcon icon={faMicrophoneSlash} size="1x" />
            </button>
          ) : (
            <button
              aria-label="본인 마이크 켜기"
              title="클릭 시 마이크를 켭니다"
              onClick={toggleAudio}
              className="meetingroom-grey"
            >
              <FontAwesomeIcon icon={faMicrophone} size="1x" />
            </button>
          )}

          {isVideoEnabled ? (
            <button
              aria-label="본인 비디오 끄기"
              title="클릭 시 비디오를 끕니다"
              onClick={toggleVideo}
              className="meetingroom-red"
            >
              <FontAwesomeIcon icon={faVideoSlash} size="1x" />
            </button>
          ) : (
            <button
              aria-label="본인 비디오 켜기"
              title="클릭 시 비디오를 켭니다"
              onClick={toggleVideo}
              className="meetingroom-grey"
            >
              <FontAwesomeIcon icon={faVideo} size="1x" />
            </button>
          )}

          {/* {isSharingEnabled ? (
            <button
              aria-label="화면 공유 끄기"
              title="화면 공유를 중단합니다."
              onClick={toggleSharing}
              className="meetingroom-red"
            >
              <FontAwesomeIcon icon={faDesktop} size="1x" />
            </button>
          ) : (
            <button
              aria-label="화면 공유하기"
              title="화면 공유를 시작합니다."
              onClick={toggleSharing}
              className="meetingroom-grey"
            >
              <FontAwesomeIcon icon={faDesktop} size="1x" />
            </button>
          )} */}

          <button
            aria-label="연결 종료하고 회의실 나가기"
            title="연결 종료하고 회의실을 나갑니다"
            onClick={leaveRoom}
            className="meetingroom-red"
          >
            <FontAwesomeIcon icon={faPhoneSlash} size="1x" />
          </button>
        </div>
      </div>
      <div style={{ overflow: "hidden"}}>
        {/* 채팅창 */}
        <motion.div
          id="meetingroom-chats"
          initial={{ opacity: 0 }}
          animate={isChatEnabled ? "open" : "closed"}
          variants={{
            open: { opacity: 1, x: 0 },
            closed: { opacity: 0, x: "-50%" },
          }}
          transition={{ duration: 0.5 }}
        >
          {/* 메시지 칸 */}
          <div className="flex content-start">
            <label className="meetingroom-switch-button"> 
              <input id="toggle-tts" onChange={toggleTTS} type="checkbox" checked={isTTSEnabled}/> 
              <span className="meetingroom-onoff-switch"></span> 
            </label>
            <label className="ml-3" htmlFor="toggle-tts">{isTTSEnabled?
              "TTS 활성화됨":
              "TTS 비활성화됨"}
            </label>
          </div>
          <div id="meetingroom-messages" ref={meetingroomMessage}>
            {chats.map((chat, key) => (
              <Chat chat={chat} key={key}></Chat>
            ))}
          </div>
          <form
            onSubmit={sendChatMsg}
            style={{
              display: "flex",
              justifyContent: "end",
              flexWrap: "wrap",
            }}
          >
            <input
              style={{ width: "80%" }}
              className="py-1 mt-2 rounded min-w-fit"
              type="text"
              placeholder="채팅을 입력하세요"
              ref={messageInput}
            ></input>
            <button aria-label="전송" className="w-2/12 min-w-fit mt-2 bg-[#009e747a] hover:bg-[#009e7494] text-white font-bold py-1 px-2 rounded ml-2">
              <FontAwesomeIcon icon={faPaperPlane} size="1x" />
            </button>
          </form>
        </motion.div>
        <button
          style={{
            margin: "auto",
            position: "fixed",
            right: "1rem",
            bottom: "1rem",
          }}
          aria-label="메시지 창 토글"
          title="메시지 창을 켜거나 끕니다."
          onClick={toggleChats}
          className="meetingroom-grey"
        >
          <FontAwesomeIcon icon={faEllipsisV} size="1x" />

          {/* 새 메시지 도착 시 알림. 새 메시지가 도착했으며, 그를 읽지 않았을 때! */}
          {!isChatEnabled && isNoti && (
            <div
              aria-label="새 메시지가 있습니다"
              title="새 메시지가 있습니다."
              id="meetingroom-noti"
            ></div>
          )}
        </button>
      </div>
    </section>
  );
}
