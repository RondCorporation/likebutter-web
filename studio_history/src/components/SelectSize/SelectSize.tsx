/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";

interface Props {
  state: "default";
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
      className={`flex flex-col w-14 h-14 items-center justify-center gap-2.5 p-6 relative rounded-md border border-solid border-[#4a4a4b] ${className}`}
    >
      {hasDiv && (
        <div className="relative w-fit mt-[-7.00px] mb-[-5.00px] ml-[-0.50px] mr-[-0.50px] font-text-body2-medium font-[number:var(--text-body2-medium-font-weight)] text-dark-modetextdefault text-[length:var(--text-body2-medium-font-size)] tracking-[var(--text-body2-medium-letter-spacing)] leading-[var(--text-body2-medium-line-height)] whitespace-nowrap [font-style:var(--text-body2-medium-font-style)]">
          S
        </div>
      )}
    </div>
  );
};
