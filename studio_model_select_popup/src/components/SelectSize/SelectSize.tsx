/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";

interface Props {
  state: "selected" | "default";
  darkMode: boolean;
  className: any;
  hasDiv: boolean;
}

export const SelectSize = ({
  state,
  darkMode,
  className,
  hasDiv = true,
}: Props): JSX.Element => {
  return (
    <div
      className={`border border-solid w-14 flex flex-col items-center gap-2.5 p-6 h-14 rounded-md justify-center relative ${state === "selected" ? "border-[#ffd83b]" : "border-[#4a4a4b]"} ${className}`}
    >
      {hasDiv && (
        <div className="[font-family:'Pretendard-Medium',Helvetica] w-fit mt-[-7.00px] tracking-[0] text-sm mr-[-0.50px] ml-[-0.50px] text-white font-medium leading-[19.6px] whitespace-nowrap mb-[-5.00px] relative">
          S
        </div>
      )}
    </div>
  );
};

SelectSize.propTypes = {
  state: PropTypes.oneOf(["selected", "default"]),
  darkMode: PropTypes.bool,
  hasDiv: PropTypes.bool,
};
