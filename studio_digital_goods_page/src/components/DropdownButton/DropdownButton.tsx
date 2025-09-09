/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { HeroiconsSolidChevronDown3 } from "../../icons/HeroiconsSolidChevronDown3";

interface Props {
  state: "default";
  type: "default";
  darkMode: boolean;
  className: any;
  frameClassName: any;
  divClassName: any;
  text: string;
  heroiconsSolidChevronDown3Color: string;
}

export const DropdownButton = ({
  state,
  type,
  darkMode,
  className,
  frameClassName,
  divClassName,
  text = "Options",
  heroiconsSolidChevronDown3Color = "white",
}: Props): JSX.Element => {
  return (
    <div
      className={`inline-flex flex-col h-[38px] items-start px-4 py-2 relative rounded-md border border-solid border-[#4a4a4b] ${className}`}
    >
      <div
        className={`inline-flex items-center gap-2 relative flex-[0_0_auto] ${frameClassName}`}
      >
        <div
          className={`relative w-fit mt-[-1.00px] [font-family:'Pretendard-Medium',Helvetica] font-medium text-dark-modetextdefault text-sm tracking-[0] leading-[19.6px] whitespace-nowrap ${divClassName}`}
        >
          {text}
        </div>

        <HeroiconsSolidChevronDown3
          className="!relative !w-5 !h-5"
          color={heroiconsSolidChevronDown3Color}
        />
      </div>
    </div>
  );
};

DropdownButton.propTypes = {
  state: PropTypes.oneOf(["default"]),
  type: PropTypes.oneOf(["default"]),
  darkMode: PropTypes.bool,
  text: PropTypes.string,
  heroiconsSolidChevronDown3Color: PropTypes.string,
};
