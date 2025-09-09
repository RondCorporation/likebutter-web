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

export const HeroiconsOutlineXMark = ({
  color = "#202020",
  className,
}: Props): JSX.Element => {
  return (
    <svg
      className={`${className}`}
      fill="none"
      height="17"
      viewBox="0 0 16 17"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 12.5L12 4.5M4 4.5L12 12.5"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
};

HeroiconsOutlineXMark.propTypes = {
  color: PropTypes.string,
};
