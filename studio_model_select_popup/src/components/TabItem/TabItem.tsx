/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";

interface Props {
  state: "selected" | "default";
  icon: boolean;
  darkMode: boolean;
  className: any;
  text: string;
}

export const TabItem = ({
  state,
  icon,
  darkMode,
  className,
  text = "Tab Name",
}: Props): JSX.Element => {
  return (
    <div
      className={`[border-bottom-style:solid] inline-flex flex-col items-center gap-[15px] px-6 py-3 justify-center relative ${state === "default" ? "border-[#4a4a4b]" : "border-[#ffd83b]"} ${state === "default" ? "border-b" : "border-b-2"} ${className}`}
    >
      <div
        className={`[font-family:'Pretendard-Medium',Helvetica] w-fit tracking-[0] text-sm font-medium leading-[19.6px] whitespace-nowrap relative ${state === "default" ? "mt-[-1.00px]" : "mt-[-2.00px]"} ${state === "default" ? "text-[#a8a8aa]" : "text-[#ffd83b]"}`}
      >
        {text}
      </div>
    </div>
  );
};

TabItem.propTypes = {
  state: PropTypes.oneOf(["selected", "default"]),
  icon: PropTypes.bool,
  darkMode: PropTypes.bool,
  text: PropTypes.string,
};
