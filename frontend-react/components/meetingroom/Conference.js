import kurentoUtils from "kurento-utils";
import { useEffect } from "react";

const PARTICIPANT_MAIN_CLASS = "participant main";
const PARTICIPANT_CLASS = "participant";
const URL = "3.38.253.61:8443";

export default function Conference({ myName, myRoom, ws }) {
  // const ws = new WebSocket("wss://" + URL + "/groupcall");
  const participants = {};

  useEffect(() => {
    const message = {
      id: "joinRoom",
      name: myName,
      room: myRoom,
    };
    console.log(ws);
    console.log(message);
    sendMessage(message);
  }, []);

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
    receiveVideo(request.name);
  }

  // 2. SDP offer 생성 및 백엔드 서버로 전달
  // 새로 들어온 유저의 경우
  function receiveVideo(sender) {
    const participant = new Participant(sender);
    participants[sender] = participant;
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
    participants[myName] = participant;
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
    participants[result.name].rtcPeer.processAnswer(
      result.sdpAnswer,
      function (error) {
        if (error) return console.error(error);
      },
    );
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
    document.getElementById("participants").appendChild(container);

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
    const participant = participants[request.name];
    participant.dispose();
    delete participants[request.name];
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
  }

  return (
    <>
      {/* <h1>myName: {myName}</h1> */}
      <h1>room {myRoom}</h1>
      <div id="room">
        <h2 id="room-header">Room {myRoom}</h2>
        <div id="participants"></div>
        <input
          type="button"
          id="button-leave"
          onMouseUp={leaveRoom}
          value="Leave room"
        />
      </div>
      <div id="meetingroom-"></div>
    </>
  );
}
