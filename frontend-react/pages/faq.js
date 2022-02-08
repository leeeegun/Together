import Navbar from "../components/mainpage/Navbar";
import { motion } from "framer-motion";
import Footer from "../components/footer";

export default function Faq() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {
          scale: 2,
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
      <Navbar />
      {/* <section className="w-1/2 mt-10 mx-auto">
      <div className="">
        <div className="question">
          <p>Q. How can I receive the PFP image?</p>
        </div>
        <div className="answer">
          <p>• Exact date will be announced through our official Discord channel.</p>
        </div>
        <hr style={{width: "100%", size:"2px"}} />
      </div>
    </section> */}

      <section
        style={{ marginTop: "15vmin" }}
        className="text-lg w-1/2 mx-auto h-screen"
      >
        <details>
          <summary>
            <span className="cursor-pointer">
              Q. 회의를 생성하려면 어떻게 해야 하나요?
            </span>
          </summary>
          <br></br>
          <div>
            <p>두 가지 방법이 있습니다:</p>
            <p className="ml-1">
              • 내 회의실 메뉴에서 정해져있는 본인의 회의실 주소로 자동생성하기
            </p>
            <p className="ml-1">
              • 회의 생성하기 메뉴를 이용함으로써 랜덤한 주소로 일회성 회의실
              생성하기
            </p>
          </div>
        </details>
        <br></br>
        <hr
          style={{
            width: "100%",
            size: "2px",
            backgroundColor: "black",
            color: "black",
          }}
        />
      </section>
      <Footer />
    </motion.div>
  );
}
