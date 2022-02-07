import { useState } from "react";
import Conference from "../../components/meetingroom/Conference";

export const isBrowser = typeof window !== "undefined";
const URL = "3.38.253.61:8443";
export const ws = isBrowser
  ? new WebSocket("wss://" + URL + "/groupcall")
  : null;

export default function Meeting({ roomName }) {
  const [isJoin, setIsJoin] = useState(true);
  const [myName, setMyName] = useState("");

  const joinRoom = async (e) => {
    e.preventDefault();
    console.log(e.target[0].value);
    await setMyName(e.target[0].value);
    await setIsJoin(false);
  };

  return (
    <>
      {isJoin ? (
        <div id="join" className="animate join">
          <h1>대기실?</h1>
          <form onSubmit={joinRoom} acceptCharset="UTF-8">
            <p>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Username"
                required
              />
            </p>
            <p className="submit">
              <input type="submit" name="commit" value="Join!" />
            </p>
          </form>
        </div>
      ) : (
        <Conference myName={myName} myRoom={roomName} ws={ws}></Conference>
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
