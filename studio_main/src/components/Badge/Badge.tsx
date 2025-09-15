/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

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
      className={`inline-flex items-center gap-1 px-2 py-0.5 overflow-hidden rounded relative ${darkMode ? "bg-dark-modebackgroundprimary" : "bg-light-modebackgroundprimary"} ${className}`}
    >
      <div
        className={`[font-family:'Pretendard-Regular',Helvetica] w-fit mt-[-1.00px] tracking-[0] text-sm font-normal leading-[19.6px] whitespace-nowrap relative ${darkMode ? "text-dark-modetextdefault" : "text-light-modetexton-primary"} ${divClassName}`}
      >
        {text}
      </div>
    </div>
  );
};
