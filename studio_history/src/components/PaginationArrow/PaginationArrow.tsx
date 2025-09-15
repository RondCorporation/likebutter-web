/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import { HeroiconsMini } from "../HeroiconsMini";
import { HeroiconsMiniChevronRight } from "../HeroiconsMiniChevronRight";

interface Props {
  direction: "right" | "left";
  state: "default";
  darkMode: boolean;
  heroiconsMiniHeroiconsMini: string;
  heroiconsMiniChevronRightHeroiconsMini: string;
}

export const PaginationArrow = ({
  direction,
  state,
  darkMode,
  heroiconsMiniHeroiconsMini = "https://c.animaapp.com/dqzZYv6Z/img/heroicons-mini-chevron-left-1.svg",
  heroiconsMiniChevronRightHeroiconsMini = "https://c.animaapp.com/dqzZYv6Z/img/heroicons-mini-chevron-right-1.svg",
}: Props): JSX.Element => {
  return (
    <div
      className={`border border-solid border-[#4a4a4b] w-[38px] flex items-center gap-2.5 h-[38px] justify-center relative ${direction === "left" ? "rounded-[6px_0px_0px_6px]" : "rounded-[0px_6px_6px_0px]"}`}
    >
      {direction === "right" && (
        <HeroiconsMiniChevronRight
          className="!h-4 !relative !left-[unset] !w-4 !top-[unset]"
          heroiconsMini={heroiconsMiniChevronRightHeroiconsMini}
        />
      )}

      {direction === "left" && (
        <HeroiconsMini
          className="!h-4 !relative !left-[unset] !w-4 !top-[unset]"
          heroiconsMini={heroiconsMiniHeroiconsMini}
        />
      )}
    </div>
  );
};
