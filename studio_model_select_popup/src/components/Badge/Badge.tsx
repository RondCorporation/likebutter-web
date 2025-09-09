/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";

interface Props {
  type: "info";
  filled: boolean;
  rounded: boolean;
  darkMode: boolean;
  className: any;
  divClassName: any;
  text: string;
}

export const Badge = ({
  type,
  filled,
  rounded,
  darkMode,
  className,
  divClassName,
  text = "Value",
}: Props): JSX.Element => {
  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-0.5 relative bg-[#ffd83b] rounded overflow-hidden ${className}`}
    >
      <div
        className={`relative w-fit mt-[-1.00px] [font-family:'Pretendard-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-[19.6px] whitespace-nowrap ${divClassName}`}
      >
        {text}
      </div>
    </div>
  );
};

Badge.propTypes = {
  type: PropTypes.oneOf(["info"]),
  filled: PropTypes.bool,
  rounded: PropTypes.bool,
  darkMode: PropTypes.bool,
  text: PropTypes.string,
};
