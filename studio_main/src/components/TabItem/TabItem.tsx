/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import { HeroiconsOutlinePencil } from "../HeroiconsOutlinePencil";

interface Props {
  state: "selected" | "default";
  type: "text" | "with-icon";
  darkMode: boolean;
  className: any;
  override: JSX.Element;
  text: string;
  divClassName: any;
}

export const TabItem = ({
  state,
  type,
  darkMode,
  className,
  override = (
    <HeroiconsOutlinePencil
      className="!h-5 !relative !left-[unset] !w-5 !top-[unset]"
      heroiconsOutline="https://c.animaapp.com/Nx4v5zU2/img/heroicons-outline-pencil.svg"
    />
  ),
  text = "Tab Name",
  divClassName,
}: Props): JSX.Element => {
  return (
    <div
      className={`inline-flex items-center justify-center relative ${type === "text" ? "flex-col" : ""} ${type === "with-icon" ? "gap-3" : "gap-[15px]"} ${type === "with-icon" ? "px-4 py-2" : "px-4 py-3"} ${type === "text" ? "h-[38px]" : ""} ${state === "selected" ? "rounded-md" : ""} ${state === "selected" ? "bg-dark-modebackgroundprimary-disabled" : ""} ${className}`}
    >
      {type === "text" && (
        <div
          className={`font-text-body2-medium w-fit tracking-[var(--text-body2-medium-letter-spacing)] text-[length:var(--text-body2-medium-font-size)] [font-style:var(--text-body2-medium-font-style)] font-[number:var(--text-body2-medium-font-weight)] leading-[var(--text-body2-medium-line-height)] whitespace-nowrap relative ${state === "default" ? "mt-[-4.00px]" : "mt-[-5.00px]"} ${state === "default" ? "text-[#a8a8aa]" : "text-dark-modetextprimary"} ${state === "default" ? "mb-[-2.00px]" : "mb-[-1.00px]"} ${divClassName}`}
        >
          {text}
        </div>
      )}

      {type === "with-icon" && (
        <>
          {override}
          <div
            className={`font-text-body2-medium w-fit tracking-[var(--text-body2-medium-letter-spacing)] text-[length:var(--text-body2-medium-font-size)] [font-style:var(--text-body2-medium-font-style)] font-[number:var(--text-body2-medium-font-weight)] leading-[var(--text-body2-medium-line-height)] whitespace-nowrap relative ${state === "default" ? "mt-[-1.00px]" : "mt-[-2.00px]"} ${state === "default" ? "text-[#a8a8aa]" : "text-dark-modetextprimary"}`}
          >
            {text}
          </div>
        </>
      )}
    </div>
  );
};
