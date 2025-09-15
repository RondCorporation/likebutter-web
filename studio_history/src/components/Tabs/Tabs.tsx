/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import { TabItem } from "../TabItem";

interface Props {
  darkMode: boolean;
  className: any;
  visible: boolean;
  visible1: boolean;
  visible2: boolean;
}

export const Tabs = ({
  darkMode,
  className,
  visible = true,
  visible1 = true,
  visible2 = true,
}: Props): JSX.Element => {
  return (
    <div className={`flex w-[878px] items-start relative ${className}`}>
      <TabItem
        className="!flex-[0_0_auto]"
        darkMode
        icon={false}
        state="selected"
      />
      <TabItem
        className="!flex-[0_0_auto]"
        darkMode
        icon={false}
        state="default"
      />

      {visible && (
        <TabItem
          className="!flex-[0_0_auto]"
          darkMode
          icon={false}
          state="default"
        />
      )}

      {visible1 && (
        <TabItem
          className="!flex-[0_0_auto]"
          darkMode
          icon={false}
          state="default"
        />
      )}

      {visible2 && (
        <TabItem
          className="!flex-[0_0_auto]"
          darkMode
          icon={false}
          state="default"
        />
      )}
    </div>
  );
};
