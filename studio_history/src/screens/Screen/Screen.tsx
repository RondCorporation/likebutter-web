import React from "react";
import { Frame } from "./sections/Frame";
import { SideMenuDark } from "./sections/SideMenuDark";
import { TopNavigation } from "./sections/TopNavigation";

export const Screen = (): JSX.Element => {
  return (
    <div className="flex flex-col items-start relative" data-model-id="296:727">
      <TopNavigation />
      <div className="flex h-[915px] items-start relative self-stretch w-full bg-[#323232]">
        <SideMenuDark />
        <Frame />
      </div>
    </div>
  );
};
