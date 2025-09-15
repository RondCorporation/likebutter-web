/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import { HeroiconsSolid } from "../HeroiconsSolid";

interface Props {
  state: "default";
  type: "default";
  darkMode: boolean;
  className: any;
  text: string;
}

export const DropdownButton = ({
  state,
  type,
  darkMode,
  className,
  text = "Options",
}: Props): JSX.Element => {
  return (
    <div
      className={`inline-flex flex-col h-[38px] items-start px-4 py-2 relative rounded-md border border-solid border-[#4a4a4b] ${className}`}
    >
      <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
        <div className="relative w-fit mt-[-1.00px] font-text-body2-medium font-[number:var(--text-body2-medium-font-weight)] text-dark-modetextdefault text-[length:var(--text-body2-medium-font-size)] tracking-[var(--text-body2-medium-letter-spacing)] leading-[var(--text-body2-medium-line-height)] whitespace-nowrap [font-style:var(--text-body2-medium-font-style)]">
          {text}
        </div>

        <HeroiconsSolid
          className="!h-5 !relative !left-[unset] !w-5 !top-[unset]"
          heroiconsSolid="https://c.animaapp.com/dqzZYv6Z/img/heroicons-solid-chevron-down-4.svg"
        />
      </div>
    </div>
  );
};
