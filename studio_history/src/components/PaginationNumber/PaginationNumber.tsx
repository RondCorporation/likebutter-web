/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";

interface Props {
  state: "selected" | "default";
  darkMode: boolean;
  className: any;
  text: string;
}

export const PaginationNumber = ({
  state,
  darkMode,
  className,
  text = "1",
}: Props): JSX.Element => {
  return (
    <div
      className={`border border-solid w-[38px] flex items-center gap-2.5 h-[38px] justify-center relative ${state === "default" ? "border-[#4a4a4b]" : "border-dark-modeborderprimary"} ${state === "selected" ? "bg-dark-modebackgroundprimary-disabled" : ""} ${className}`}
    >
      <div className="[font-family:'Pretendard-Regular',Helvetica] w-fit tracking-[0] text-sm text-dark-modetextdefault font-normal text-center whitespace-nowrap leading-[19.6px] relative">
        {text}
      </div>
    </div>
  );
};
