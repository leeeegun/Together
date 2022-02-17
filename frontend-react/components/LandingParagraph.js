function LandingParagraph({ src, text }) {
  return (
    <div className="right snap-center flex flex-col items-center justify-center h-screen w-screen">
      <p className="mb-20 w-2/3">
        <img className="rounded-full" src={src} alt="people" />
      </p>
      <h1 className="text-sm font-semibold w-2/3">{text}</h1>
    </div>
  );
}

export default LandingParagraph;
