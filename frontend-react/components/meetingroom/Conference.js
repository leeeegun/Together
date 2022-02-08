import kurentoUtils from "kurento-utils";
import Router from "next/router";
import { useState, useEffect } from "react";
import { faDesktop, faMicrophone, faMicrophoneSlash, faPhoneSlash, faVideo, faVideoSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PARTICIPANT_MAIN_CLASS = "participant main";
const PARTICIPANT_CLASS = "participant";
const URL = "3.38.253.61:8443";

export default function Conference({ myName, myRoom, ws }) {
  // const ws = new WebSocket("wss://" + URL + "/groupcall");
  const [participants, setParticipants] = useState({}); // 참가자들 목록 저장
  const [isMicEnabled, setIsMicEnabled] = useState(true); // 마이크 켜고 끄기 토글
  const [isVideoEnabled, setIsVideoEnabled] = useState(true); // 비디오 켜고 끄기 토글
  const [isSharingEnabled, setIsSharingEnabled] = useState(false); // 화면 공유 켜고 끄기 토글


  useEffect(() => {
    const message = {
      id: "joinRoom",
      name: myName,
      room: myRoom,
    };
    sendMessage(message);
  }, []);

  useEffect(() => {
    console.log('참가자아아아', participants)
  }, [participants]);

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
      // ICE candidate peer 한테 보내기 혹은 받아오기 (아 정확히는 몰라)
      case "iceCandidate":
        participants[parsedMessage.name].rtcPeer.addIceCandidate(
          parsedMessage.candidate, function (error) {
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
    receiveVideo(request.name);
  }

  // 2. SDP offer 생성 및 백엔드 서버로 전달
  // 새로 들어온 유저의 경우
  function receiveVideo(sender) {
    const newParticipants = {...participants}
    const participant = new Participant(sender);
    newParticipants[sender] = participant;
    
    setParticipants(newParticipants), () => {
      console.log('receivevideo 부분',participants)
    }
    const video = participant.getVideoElement();

    const options = {
      remoteVideo: video,
      onicecandidate: participant.onIceCandidate.bind(participant),
    };

    participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(
      options,
      function (error) {
        if (error) {
          return console.error(error);
        }
        this.generateOffer(participant.offerToReceiveVideo.bind(participant));
      },
    );
  }

  // 이미 들어와있는 유저들의 경우
  function onExistingParticipants(msg) {
    const constraints = {
      audio: true,
      video: {
        mandatory: {
          maxWidth: 320,
          maxFrameRate: 15,
          minFrameRate: 15,
        },
      },
    };

    console.log(myName + " registered in room " + myRoom);
    const participant = new Participant(myName);
    const newParticipants = {...participants}
    newParticipants[myName] = participant;
    setParticipants(newParticipants)
    const video = participant.getVideoElement();

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

    msg.data.forEach(receiveVideo);
  }

  // 3. SDP answer 받아오기 및 P2P 연결!
  function receiveVideoResponse(result) {
    console.log('리시브', participants)
    console.log(result)
    console.log(result.name)
    participants[result.name].rtcPeer.processAnswer(
      result.sdpAnswer,
      function (error) {
        if (error) return console.error(error);
      },
    );
  }


  function callResponse(message) {
    if (message.response != 'accepted') {
      console.info('Call not accepted by peer. Closing call');
      stop();
    } else {
      webRtcPeer.processAnswer(message.sdpAnswer, function (error) {
        if (error) return console.error (error);
      });
    }
  }


  function Participant(name) {
    this.name = name;
    const container = document.createElement("div");
    container.className = isPresentMainParticipant()
      ? PARTICIPANT_CLASS
      : PARTICIPANT_MAIN_CLASS;
    container.id = name;
    const span = document.createElement("span");
    const video = document.createElement("video");
    // const rtcPeer;

    container.appendChild(video);
    container.appendChild(span);
    container.onclick = switchContainerClass;
    document.getElementById("meetingroom-participants").appendChild(container);

    span.appendChild(document.createTextNode(name));

    video.id = "video-" + name;
    video.autoplay = true;
    video.controls = false;

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
      const msg = { id: "receiveVideoFrom", sender: name, sdpOffer: offerSdp };
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
    console.log("Participant " + request.name + " left");
    if (request.name === myRoom) {
      leaveRoom()
      return
    }
    const participant = participants[request.name];
    participant.dispose();
    const newParticipants = {...participants}
    delete newParticipants[request.name];
    setParticipants(newParticipants)
  }

  function sendMessage(message) {
    const jsonMessage = JSON.stringify(message);
    console.log("Sending message: " + jsonMessage);
    ws.send(jsonMessage);
  }

  function leaveRoom() {
    sendMessage({
      id: "leaveRoom",
    });

    for (let key in participants) {
      participants[key].dispose();
    }

    // setIsJoin(true)

    ws.close();

    Router.push("/");
  }

  const toggleVideo = () => {
    console.log(participants[myName])
    console.log(participants)
    participants[myName].rtcPeer.videoEnabled = !participants[myName].rtcPeer.videoEnabled
    setIsVideoEnabled(!isVideoEnabled)
  }

  const toggleAudio = () => {
    console.log(participants[myName])
    participants[myName].rtcPeer.audioEnabled = !participants[myName].rtcPeer.audioEnabled
    setIsMicEnabled(!isMicEnabled)
  }

  const toggleSharing = () => {
    const constraints = {
      video: true
    };

    function handleSuccess(stream) {
        document.querySelector('video').srcObject = stream;
    }

    function handleError(error) {
        console.log('getDisplayMedia error: ', error);
    }

    navigator.mediaDevices.getDisplayMedia(constraints)
            .then(handleSuccess)
            .catch(handleError);
  }

  return (
    <>
      {/* <h1>myName: {myName}</h1> */}
      <h1 className="text-center text-3xl mt-1">room {myRoom}</h1>
      <div id="room">
        {/* <h2 id="room-header">Room {myRoom}</h2> */}
        <div className="grid grid-cols-2 text-center gap-5 mx-auto" id="meetingroom-participants"></div>
      </div>
      {/* <input
        type="button"
        id="button-leave"
        onMouseUp={leaveRoom}
        value="Leave room"
      /> */}
      <div id="meetingroom-toolbar">
        {/* {isMicEnabled?
        <button className="meetingroom-red"><img src="/meetingroom/mic_muted.svg" alt="마이크를 켜둘지 정하실 수 있습니다."/></button>:
        <button className="meetingroom-grey"><img src="/meetingroom/mic_on.svg" alt="마이크를 켜둘지 정하실 수 있습니다."/></button>
        } */}

        {isMicEnabled?
        <button aria-label="본인 마이크 끄기" onClick={toggleAudio} className="meetingroom-red"><FontAwesomeIcon icon={faMicrophoneSlash} size="1x" /></button>:
        <button aria-label="본인 마이크 켜기" onClick={toggleAudio} className="meetingroom-grey"><FontAwesomeIcon icon={faMicrophone} size="1x" /></button>
        }

        {isVideoEnabled?
        <button aria-label="본인 비디오 끄기" onClick={toggleVideo} className="meetingroom-red"><FontAwesomeIcon icon={faVideoSlash} size="1x" /></button>:
        <button aria-label="본인 비디오 켜기" onClick={toggleVideo} className="meetingroom-grey"><FontAwesomeIcon icon={faVideo} size="1x" /></button>
        }

        {isSharingEnabled?
        <button aria-label="화면 공유 끄기" onClick={toggleSharing} className="meetingroom-red"><FontAwesomeIcon icon={faDesktop} size="1x" /></button>:
        <button aria-label="화면 공유하기" onClick={toggleSharing} className="meetingroom-grey"><FontAwesomeIcon icon={faDesktop} size="1x" /></button>
        }
        
        <button aria-label="연결 종료하고 회의실 나가기" onMouseUp={leaveRoom} className="meetingroom-red"><FontAwesomeIcon icon={faPhoneSlash} size="1x" /></button>
      </div>
    </>
  );
}
