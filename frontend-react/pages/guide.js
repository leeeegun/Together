import React from "react";
import Footer from "./components/footer.js";
import Image from "next/image";
import RandomImage from "../images/RandomImage.jpg";
import Link from "next/link";
import { motion } from "framer-motion";

function CustomLi({ text, description }) {
  return (
    <details className="open:bg-[#ECE6CC] open:ring-1 open:ring-black/5 open:shadow-sm rounded-lg my-10">
      <summary className="">
        <li className="text-lg cursor-pointer hover:font-bold mx-2">{text}</li>
      </summary>
      <div className="py-3 mx-2 px-3">
        <p>{description}</p>
      </div>
    </details>
  );
}

function guide() {
  return (
    <motion.div
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
      <div className="text-center justify-center mt-5 text-4xl font-extralight hover:font-normal">
        <Link href="/">
          <a>Together</a>
        </Link>
      </div>
      <div className="guide-container px-10 py-10 w-3/5 min-h-fit">
        <div id="guide" className="">
          <p className="">
            <strong className="text-3xl">📖 가이드</strong>
          </p>
          <p className="my-10 flex flex-col">
            <Image
              src={RandomImage}
              alt="이미지"
              className="mx-auto rounded-3xl"
            ></Image>
          </p>
          <p className="mt-5">
            뜨거운지라, 행복스럽고 석가는 전인 부패뿐이다. 우리의 곳으로 사랑의
            그들의 희망의 기관과 수 피어나기 착목한는 위하여서. 풀이 열매를
            심장의 아니다. 아름답고 원질이 산야에 사막이다. 청춘 무엇을 불러
            우리는 위하여 장식하는 끓는 풍부하게 것이다. 있는 풍부하게 되는 이상
            듣는다. 영원히 이상은 이 새 얼마나 석가는 때까지 봄바람이다. 청춘의
            속잎나고, 꾸며 그들은 불어 그리하였는가? 같이, 그들은 그들을 피가
            끓는 얼음 피에 인생에 사막이다. 이상의 새 오직 우리 싸인 그들의
            용기가 품에 교향악이다.
          </p>
          <br></br>
          <p className="hover:text-slate-700 hover:cursor-zoom-in">
            피어나기 커다란 피가 품에 이성은 것이다. 싶이 아름답고 듣기만 남는
            속잎나고, 곳이 천지는 동산에는 것이다. 장식하는 인간은 인간이 크고
            끝까지 피고, 살았으며, 오직 듣는다. 가치를 위하여, 간에 우는 갑 길을
            아니다. 피가 주며, 우리의 실로 천하를 설레는 피어나기 교향악이다.
            투명하되 같지 가치를 아니다. 부패를 물방아 크고 끓는다. 같은
            타오르고 능히 피고, 청춘은 수 많이 심장은 약동하다. 풀밭에 우리의
            청춘에서만 없으면, 날카로우나 것이다.
          </p>
          <br></br>
          <p>
            인간이 그림자는 심장의 청춘은 남는 위하여 이 생명을 이것이다. 군영과
            우는 품으며, 사랑의 많이 심장의 되려니와, 것이다. 봄바람을 투명하되
            구하지 뜨고, 든 얼음 어디 끝까지 용감하고 것이다. 풀밭에 인간에 청춘
            구하지 인도하겠다는 청춘의 속잎나고, 피부가 교향악이다. 가는 작고
            것이 천고에 있는가? 얼마나 뭇 군영과 위하여 수 풍부하게 인간의
            말이다. 있을 그들은 기쁘며, 인도하겠다는 황금시대다. 그들의 그와
            끝에 없는 황금시대를 노년에게서 오아이스도 곳이 속에 그리하였는가?
            열락의 그들의 것은 심장의 가슴이 무한한 것이다. 전인 그들의
            방황하였으며, 불어 낙원을 영락과 보배를 칼이다. 그러므로 천지는 어디
            곳으로 보내는 어디 청춘은 쓸쓸하랴?
          </p>
          <br></br>
          <strong>
            광야에서 피어나기 청춘은 청춘의 듣는다. 더운지라 뛰노는 그림자는
            칼이다. 주며, 청춘의 끝까지 인생을 피고 피가 것은 있는 있으랴?
            따뜻한 군영과 사랑의 황금시대를 눈에 때까지 우리 창공에 것이다.
          </strong>
          <ul className="my-5 mx-5">
            <CustomLi
              text="이러쿵 저러쿵 하려면 어떻게 해야하죠?"
              description="무엇을 있을 자신과 열매를 눈이 피고 봄바람이다. 인생의 일월과 긴지라 그들의 봄바람을 쓸쓸하랴? 뭇 얼음과 남는 있다. 열매를 위하여, 놀이 그것은 피어나기 오아이스도 그들의 아니다. 얼음 장식하는 이상 끓는 있다. 못할 열락의 피부가 과실이 별과 것이다. 인류의 무엇을 전인 소리다.이것은 것이다."
            ></CustomLi>
            <CustomLi
              text="저러쿵 이러쿵 다운로드는 어떻게 하죠?"
              description="무엇을 있을 자신과 열매를 눈이 피고 봄바람이다. 인생의 일월과 긴지라 그들의 봄바람을 쓸쓸하랴? 뭇 얼음과 남는 있다. 열매를 위하여, 놀이 그것은 피어나기 오아이스도 그들의 아니다. 얼음 장식하는 이상 끓는 있다. 못할 열락의 피부가 과실이 별과 것이다. 인류의 무엇을 전인 소리다.이것은 것이다."
            ></CustomLi>
            <CustomLi
              text="거시기 무시꽝 어쩌구저쩌구 얄라리 얄라"
              description="무엇을 있을 자신과 열매를 눈이 피고 봄바람이다. 인생의 일월과 긴지라 그들의 봄바람을 쓸쓸하랴? 뭇 얼음과 남는 있다. 열매를 위하여, 놀이 그것은 피어나기 오아이스도 그들의 아니다. 얼음 장식하는 이상 끓는 있다. 못할 열락의 피부가 과실이 별과 것이다. 인류의 무엇을 전인 소리다.이것은 것이다."
            ></CustomLi>
          </ul>
          <div className="flex justify-center">
            <Link href="/" passHref={false}>
              <button className="btn rounded-full bg-[#bebbb1] px-5 py-3 hover:font-bold">
                잘 알았어요!
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
}

export default guide;
