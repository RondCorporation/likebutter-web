/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import { HeroiconsSolid } from "../HeroiconsSolid";

interface Props {
  label: boolean;
  labelText: string;
  placeholderText: string;
  mandatory: boolean;
  state: "completed";
  icon: "none";
  darkMode: boolean;
  className: any;
  frameClassName: any;
}

export const DropdownInput = ({
  label = true,
  labelText = "Label",
  placeholderText = "Value",
  mandatory = false,
  state,
  icon,
  darkMode,
  className,
  frameClassName,
}: Props): JSX.Element => {
  return (
    <div
      className={`inline-flex flex-col items-start gap-1 relative ${className}`}
    >
      {label && (
        <div className="inline-flex items-start gap-1 relative flex-[0_0_auto]">
          <div className="relative w-fit mt-[-1.00px] font-text-body2-medium font-[number:var(--text-body2-medium-font-weight)] text-dark-modetextdefault text-[length:var(--text-body2-medium-font-size)] text-center tracking-[var(--text-body2-medium-letter-spacing)] leading-[var(--text-body2-medium-line-height)] whitespace-nowrap [font-style:var(--text-body2-medium-font-style)]">
            {labelText}
          </div>
        </div>
      )}

      <div
        className={`flex w-[365px] h-[38px] items-center justify-between p-3 relative rounded-md border border-solid border-[#4a4a4b] ${frameClassName}`}
      >
        <div className="relative w-fit mt-[-4.00px] mb-[-2.00px] [font-family:'Pretendard-Regular',Helvetica] font-normal text-dark-modetextdefault text-sm text-center tracking-[0] leading-[19.6px] whitespace-nowrap">
          {placeholderText}
        </div>

        <HeroiconsSolid
          className="!h-5 !mt-[-3.00px] !mb-[-3.00px] !relative !left-[unset] !w-5 !top-[unset]"
          heroiconsSolid="https://c.animaapp.com/dqzZYv6Z/img/heroicons-solid-chevron-down-5.svg"
        />
      </div>
    </div>
  );
};
