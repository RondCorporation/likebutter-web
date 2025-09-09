/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { useReducer } from "react";

interface Props {
  text: string;
  type: "primary" | "text" | "secondary";
  size: "medium";
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

    size: size || "medium",

    icon: icon || "none",

    state: stateProp || "default",

    darkMode: darkMode,
  });

  return (
    <div
      className={`inline-flex items-center overflow-hidden rounded-md justify-center relative ${state.type === "secondary" ? "border border-solid" : ""} ${state.type === "secondary" ? "border-light-modebordersecondary" : ""} ${!state.darkMode ? "px-5 py-2.5" : ""} ${!state.darkMode ? "h-[38px]" : ""} ${state.state === "default" && state.type === "primary" ? "bg-light-modebackgroundprimary" : (state.type === "primary" && state.state === "hover") ? "bg-light-modebackgroundprimary-hover" : state.type === "secondary" && state.state === "hover" ? "bg-light-modebackgroundsecondary" : ""} ${className}`}
      onMouseEnter={() => {
        dispatch("mouse_enter");
      }}
      onMouseLeave={() => {
        dispatch("mouse_leave");
      }}
    >
      <div
        className={`font-button-button2-semibold w-fit tracking-[var(--button-button2-semibold-letter-spacing)] [font-style:var(--button-button2-semibold-font-style)] text-[length:var(--button-button2-semibold-font-size)] font-[number:var(--button-button2-semibold-font-weight)] leading-[var(--button-button2-semibold-line-height)] whitespace-nowrap relative ${state.type === "text" ? "mt-[-2.00px]" : ""} ${state.type === "primary" ? "text-light-modebackgrounddefault" : (state.type === "secondary") ? "text-light-modetextdefault" : state.darkMode && state.state === "hover" ? "text-dark-modebackgroundprimary-hover" : state.state === "default" && state.type === "text" ? "text-dark-modebackgroundprimary" : ""} ${textClassName}`}
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
  type: PropTypes.oneOf(["primary", "text", "secondary"]),
  size: PropTypes.oneOf(["medium"]),
  icon: PropTypes.oneOf(["none"]),
  stateProp: PropTypes.oneOf(["hover", "default"]),
  darkMode: PropTypes.bool,
};
