import Image from "next/image";

function LandingParagraph({ src, text }) {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen right snap-center">
      <p className="w-2/3 mb-20">
        <Image tabIndex="0" className="rounded-full" src={src} alt="people, image" />
      </p>
      <h1 tabIndex="0" className="w-2/3 text-sm font-semibold">{text}</h1>
    </div>
  );
}

export default LandingParagraph;
