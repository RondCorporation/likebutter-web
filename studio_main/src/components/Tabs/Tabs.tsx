/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import { TabItem } from "../TabItem";

interface Props {
  darkMode: boolean;
  className: any;
  tabItemStateSelectedTypeClassName: any;
  tabItemText: string;
  tabItemType: string;
  tabItem: JSX.Element;
  tabItemStateSelectedTypeClassNameOverride: any;
  tabItemText1: string;
  tabItemType1: string;
  override: JSX.Element;
  visible: boolean;
  visible1: boolean;
  visible2: boolean;
}

export const Tabs = ({
  darkMode,
  className,
  tabItemStateSelectedTypeClassName,
  tabItemText = "Tab Name",
  tabItemType = "text",
  tabItem,
  tabItemStateSelectedTypeClassNameOverride,
  tabItemText1 = "Tab Name",
  tabItemType1 = "text",
  override,
  visible = true,
  visible1 = true,
  visible2 = true,
}: Props): JSX.Element => {
  return (
    <div
      className={`inline-flex items-start p-1 relative rounded-lg border border-solid border-[#4a4a4b] ${className}`}
    >
      <TabItem
        className={tabItemStateSelectedTypeClassName}
        darkMode
        divClassName="!mt-[-2.00px] !mb-[unset]"
        override={tabItem}
        state="selected"
        text={tabItemText}
        type={tabItemType}
      />
      <TabItem
        className={tabItemStateSelectedTypeClassNameOverride}
        darkMode
        divClassName="!mt-[-1.00px] !mb-[unset]"
        override={override}
        state="default"
        text={tabItemText1}
        type={tabItemType1}
      />

      {visible && (
        <TabItem
          className="!h-[unset] !flex-[0_0_auto] !px-4 !py-2"
          darkMode
          divClassName="!mt-[-1.00px] !mb-[unset]"
          state="default"
          text="Tab Name"
          type="text"
        />
      )}

      {visible1 && (
        <TabItem
          className="!h-[unset] !flex-[0_0_auto] !px-4 !py-2"
          darkMode
          divClassName="!mt-[-1.00px] !mb-[unset]"
          state="default"
          text="Tab Name"
          type="text"
        />
      )}

      {visible2 && (
        <TabItem
          className="!h-[unset] !flex-[0_0_auto] !px-4 !py-2"
          darkMode
          divClassName="!mt-[-1.00px] !mb-[unset]"
          state="default"
          text="Tab Name"
          type="text"
        />
      )}
    </div>
  );
};
