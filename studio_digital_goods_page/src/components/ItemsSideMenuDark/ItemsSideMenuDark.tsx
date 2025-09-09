/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { HeroiconsOutlineArrowUpOnSquare } from "../../icons/HeroiconsOutlineArrowUpOnSquare";
import { HeroiconsOutlineRectangleGroup1 } from "../../icons/HeroiconsOutlineRectangleGroup1";
import { AvatarWithText } from "../AvatarWithText";

interface Props {
  openItems: boolean;
  type: "my-account" | "menu-item";
  state: "selected" | "default";
  collapse: boolean;
  customize: boolean;
  className: any;
  icon: JSX.Element;
}

export const ItemsSideMenuDark = ({
  openItems = true,
  type,
  state,
  collapse,
  customize,
  className,
  icon = (
    <HeroiconsOutlineRectangleGroup1
      className="!relative !w-5 !h-5"
      color="#C3C3C5"
    />
  ),
}: Props): JSX.Element => {
  return (
    <div
      className={`items-center gap-3 relative ${!collapse ? "w-[263px]" : ""} ${collapse ? "inline-flex" : "flex"} ${collapse && type === "my-account" ? "flex-col" : ""} ${collapse ? "px-3 py-2.5" : "p-3"} ${type === "my-account" ? "h-[52px]" : ""} ${type === "my-account" ? "rounded-lg" : (state === "default" && type === "menu-item") ? "rounded-[10px]" : state === "selected" ? "rounded-md" : ""} ${collapse ? "justify-center" : ""} ${state === "selected" ? "bg-dark-modebackgroundsecondary" : ""} ${className}`}
    >
      {!collapse && (
        <div className="flex items-center justify-between relative flex-1 grow mt-[-6.50px] mb-[-6.50px]">
          <AvatarWithText
            avatarDivClassName="!text-light-modetextdefault"
            avatarImage={false}
            avatarOverlapGroupClassName="!bg-light-modebackgroundsecondary"
            avatarSizeImageTrueClassName="!border-light-modeborderdefault !ml-[-1.00px] !relative"
            avatarText="JC"
            className="!gap-3 !flex-[0_0_auto]"
            divClassName="!text-light-modetexton-primary"
            divClassNameOverride="!text-light-modetexttertiary"
            text="Jenny Cooper"
            text1="jenny.cooper@example.com"
            type="forty"
          />
          <HeroiconsOutlineArrowUpOnSquare className="!relative !w-5 !h-5" />
        </div>
      )}

      {collapse && <>{icon}</>}
    </div>
  );
};

ItemsSideMenuDark.propTypes = {
  openItems: PropTypes.bool,
  type: PropTypes.oneOf(["my-account", "menu-item"]),
  state: PropTypes.oneOf(["selected", "default"]),
  collapse: PropTypes.bool,
  customize: PropTypes.bool,
};
