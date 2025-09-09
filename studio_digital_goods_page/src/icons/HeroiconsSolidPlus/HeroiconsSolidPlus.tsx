/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";

interface Props {
  color: string;
  className: any;
}

export const HeroiconsSolidPlus = ({
  color = "#202020",
  className,
}: Props): JSX.Element => {
  return (
    <svg
      className={`${className}`}
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M10 3.125C10.3452 3.125 10.625 3.40482 10.625 3.75V9.375H16.25C16.5952 9.375 16.875 9.65482 16.875 10C16.875 10.3452 16.5952 10.625 16.25 10.625H10.625V16.25C10.625 16.5952 10.3452 16.875 10 16.875C9.65482 16.875 9.375 16.5952 9.375 16.25V10.625H3.75C3.40482 10.625 3.125 10.3452 3.125 10C3.125 9.65482 3.40482 9.375 3.75 9.375H9.375V3.75C9.375 3.40482 9.65482 3.125 10 3.125Z"
        fill={color}
        fillRule="evenodd"
      />
    </svg>
  );
};

HeroiconsSolidPlus.propTypes = {
  color: PropTypes.string,
};
