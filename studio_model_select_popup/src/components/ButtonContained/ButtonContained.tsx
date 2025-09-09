/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { useReducer } from "react";

interface Props {
  text: string;
  type: "primary";
  size: "large";
  icon: "none";
  stateProp: "hover" | "default";
  darkMode: boolean;
  className: any;
  textClassName: any;
}

export const ButtonContained = ({
  text = "Button text",
  type,
  size,
  icon,
  stateProp,
  darkMode,
  className,
  textClassName,
}: Props): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, {
    type: type || "primary",

    size: size || "large",

    icon: icon || "none",

    state: stateProp || "default",

    darkMode: darkMode || true,
  });

  return (
    <div
      className={`inline-flex items-center px-5 py-3 h-12 overflow-hidden rounded-md justify-center relative ${state.state === "hover" ? "bg-[#f7c80d]" : "bg-[#ffd83b]"} ${className}`}
      onMouseLeave={() => {
        dispatch("mouse_leave");
      }}
      onMouseEnter={() => {
        dispatch("mouse_enter");
      }}
    >
      <div
        className={`[font-family:'Pretendard-SemiBold',Helvetica] w-fit tracking-[0] text-base text-white font-semibold leading-4 whitespace-nowrap relative ${textClassName}`}
      >
        {text}
      </div>
    </div>
  );
};

function reducer(state: any, action: any) {
  switch (action) {
    case "mouse_enter":
      return {
        ...state,
        state: "hover",
      };

    case "mouse_leave":
      return {
        ...state,
        state: "default",
      };
  }

  return state;
}

ButtonContained.propTypes = {
  text: PropTypes.string,
  type: PropTypes.oneOf(["primary"]),
  size: PropTypes.oneOf(["large"]),
  icon: PropTypes.oneOf(["none"]),
  stateProp: PropTypes.oneOf(["hover", "default"]),
  darkMode: PropTypes.bool,
};
