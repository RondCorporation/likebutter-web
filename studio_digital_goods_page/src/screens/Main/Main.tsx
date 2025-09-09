import React from "react";
import { HeroiconsMiniChevronLeft1 } from "../../icons/HeroiconsMiniChevronLeft1";
import { Frame } from "./sections/Frame";
import { SideMenuDark } from "./sections/SideMenuDark";
import { SideMenuDarkWrapper } from "./sections/SideMenuDarkWrapper";
import { TopNavigation } from "./sections/TopNavigation";

export const Main = (): JSX.Element => {
  return (
    <div
      className="flex flex-col w-[1440px] items-start relative"
      data-model-id="208:3315"
    >
      <TopNavigation />
      <div className="flex h-[824px] items-start relative self-stretch w-full bg-[#323232] overflow-hidden">
        <SideMenuDark />
        <SideMenuDarkWrapper />
        <Frame />
        <HeroiconsMiniChevronLeft1 className="!absolute !w-5 !h-5 !top-[150px] !left-[314px]" />
      </div>
    </div>
  );
};
