import clsx from "clsx";
import { useState } from "react";

export const Tooltip: React.FC<{
  content: string;
  children: React.ReactNode;
}> = ({ content, children }) => {
  const [show, setShow] = useState(false);

  return (
    <span
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      className="relative flex items-center justify-center"
    >
      {children}
      <div
        role="tooltip"
        className={clsx(
          "shadow-gray-4 absolute bottom-12 left-[50%] w-[200px] -translate-x-[50%] rounded-lg bg-slate-600 px-3 py-2 text-center text-sm text-white shadow-md transition-opacity",
          "flex items-center justify-center",
          !show ? "invisible opacity-0" : "visible opacity-100",
        )}
      >
        <div className="absolute -bottom-1 left-[50%] -ml-1 h-2 w-2 rotate-45 bg-slate-600" />
        {content}
      </div>
    </span>
  );
};
