/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import { HeroiconsOutlineRectangleGroup } from "../HeroiconsOutlineRectangleGroup";

interface Props {
  openItems: boolean;
  type: "my-account" | "menu-item";
  state: "selected" | "default";
  collapse: boolean;
  customize: boolean;
  className: any;
  override: JSX.Element;
}

export const ItemsSideMenuDark = ({
  openItems = true,
  type,
  state,
  collapse,
  customize,
  className,
  override = (
    <HeroiconsOutlineRectangleGroup
      className="!h-5 !relative !left-[unset] !w-5 !top-[unset]"
      heroiconsOutline="https://c.animaapp.com/Nx4v5zU2/img/heroicons-outline-rectangle-group-1.svg"
    />
  ),
}: Props): JSX.Element => {
  return (
    <div
      className={`inline-flex items-center gap-3 px-3 py-2.5 justify-center relative ${type === "my-account" ? "flex-col" : ""} ${type === "my-account" ? "h-[52px]" : ""} ${type === "my-account" ? "rounded-lg" : (state === "default" && type === "menu-item") ? "rounded-[10px]" : state === "selected" ? "rounded-md" : ""} ${state === "selected" ? "bg-dark-modebackgroundsecondary" : ""} ${className}`}
    >
      {override}
    </div>
  );
};
