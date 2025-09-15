/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";

interface Props {
  state: "selected" | "default";
  icon: boolean;
  darkMode: boolean;
  className: any;
}

export const TabItem = ({
  state,
  icon,
  darkMode,
  className,
}: Props): JSX.Element => {
  return (
    <div
      className={`[border-bottom-style:solid] inline-flex flex-col items-center gap-[15px] px-6 py-3 justify-center relative ${state === "default" ? "border-[#4a4a4b]" : "border-dark-modeborderprimary"} ${state === "default" ? "border-b" : "border-b-2"} ${className}`}
    >
      <div
        className={`font-text-body2-medium w-fit tracking-[var(--text-body2-medium-letter-spacing)] text-[length:var(--text-body2-medium-font-size)] [font-style:var(--text-body2-medium-font-style)] font-[number:var(--text-body2-medium-font-weight)] leading-[var(--text-body2-medium-line-height)] whitespace-nowrap relative ${state === "default" ? "mt-[-1.00px]" : "mt-[-2.00px]"} ${state === "default" ? "text-[#a8a8aa]" : "text-dark-modetextprimary"}`}
      >
        Tab Name
      </div>
    </div>
  );
};
