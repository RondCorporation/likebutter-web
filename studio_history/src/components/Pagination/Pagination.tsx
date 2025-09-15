/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import { DropdownInput } from "../DropdownInput";
import { HeroiconsMiniWrapper } from "../HeroiconsMiniWrapper";
import { PaginationArrow } from "../PaginationArrow";
import { PaginationNumber } from "../PaginationNumber";

interface Props {
  device: "desktop";
  darkMode: boolean;
  className: any;
  paginationArrowHeroiconsMiniHeroiconsMini: string;
  paginationArrowHeroiconsMiniChevronRightHeroiconsMini: string;
}

export const Pagination = ({
  device,
  darkMode,
  className,
  paginationArrowHeroiconsMiniHeroiconsMini = "https://c.animaapp.com/dqzZYv6Z/img/heroicons-mini-chevron-left.svg",
  paginationArrowHeroiconsMiniChevronRightHeroiconsMini = "https://c.animaapp.com/dqzZYv6Z/img/heroicons-mini-chevron-right.svg",
}: Props): JSX.Element => {
  return (
    <div
      className={`flex w-[697px] items-center justify-between relative ${className}`}
    >
      <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
        <div className="relative w-fit font-text-body3-regular font-[number:var(--text-body3-regular-font-weight)] text-dark-modetextdefault text-[length:var(--text-body3-regular-font-size)] tracking-[var(--text-body3-regular-letter-spacing)] leading-[var(--text-body3-regular-line-height)] whitespace-nowrap [font-style:var(--text-body3-regular-font-style)]">
          Show
        </div>

        <DropdownInput
          className="!flex-[0_0_auto]"
          darkMode
          frameClassName="!gap-2.5 ![justify-content:unset] !inline-flex !w-[unset]"
          icon="none"
          label={false}
          placeholderText="10 per page"
          state="completed"
        />
      </div>

      <div className="inline-flex items-center gap-6 relative flex-[0_0_auto]">
        <p className="relative w-fit font-text-body3-regular font-[number:var(--text-body3-regular-font-weight)] text-dark-modetextdefault text-[length:var(--text-body3-regular-font-size)] tracking-[var(--text-body3-regular-letter-spacing)] leading-[var(--text-body3-regular-line-height)] whitespace-nowrap [font-style:var(--text-body3-regular-font-style)]">
          1 to 10 of 97 results
        </p>

        <div className="inline-flex items-center relative flex-[0_0_auto]">
          <PaginationArrow
            darkMode
            direction="left"
            heroiconsMiniHeroiconsMini={
              paginationArrowHeroiconsMiniHeroiconsMini
            }
            state="default"
          />
          <PaginationNumber
            className="!border-b !border-[unset] ![border-top-style:solid] !border-t ![border-bottom-style:solid]"
            darkMode
            state="default"
            text="1"
          />
          <PaginationNumber darkMode state="selected" text="2" />
          <PaginationNumber
            className="!border-b !border-[unset] ![border-top-style:solid] !border-t ![border-bottom-style:solid]"
            darkMode
            state="default"
            text="3"
          />
          <PaginationNumber darkMode state="default" text="4" />
          <PaginationNumber
            className="!border-b !border-[unset] ![border-right-style:solid] ![border-top-style:solid] !border-r !border-t ![border-bottom-style:solid]"
            darkMode
            state="default"
            text="5"
          />
          <div className="flex w-[38px] h-[38px] items-center justify-center gap-2.5 relative border-t [border-top-style:solid] border-b [border-bottom-style:solid] border-[#4a4a4b]">
            <HeroiconsMiniWrapper
              className="!relative !left-[unset] !top-[unset]"
              heroiconsMini="https://c.animaapp.com/dqzZYv6Z/img/heroicons-mini-ellipsis-horizontal-2.svg"
            />
          </div>

          <PaginationNumber
            className="!border-b !border-[unset] !border-l ![border-top-style:solid] ![border-left-style:solid] !border-t ![border-bottom-style:solid]"
            darkMode
            state="default"
            text="108"
          />
          <PaginationArrow
            darkMode
            direction="right"
            heroiconsMiniChevronRightHeroiconsMini={
              paginationArrowHeroiconsMiniChevronRightHeroiconsMini
            }
            state="default"
          />
        </div>
      </div>
    </div>
  );
};
