import { AppleHelloEnglishEffect } from "./apple-hello-effect";
const Hello = () => {
  return (
    <div className="flex w-full h-screen flex-col justify-center items-center gap-16">
      <AppleHelloEnglishEffect speed={1.1} />
    </div>
  );
};
export default Hello;