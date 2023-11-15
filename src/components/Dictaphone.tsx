import dynamic from "next/dynamic";

const Dictaphone = dynamic(() => import("./ClientOnlyDictaphone"), {
  ssr: false,
});

export default Dictaphone;
