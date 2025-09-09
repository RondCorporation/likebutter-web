/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";

interface Props {
  className: any;
}

export const HeroiconsOutlineArrowUpOnSquare = ({
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
        d="M13.125 7.5L13.125 6.25C13.125 5.21447 12.2855 4.375 11.25 4.375L3.75 4.375C2.71447 4.375 1.875 5.21447 1.875 6.25L1.875 13.75C1.875 14.7855 2.71447 15.625 3.75 15.625L11.25 15.625C12.2855 15.625 13.125 14.7855 13.125 13.75L13.125 12.5M15.625 12.5L18.125 10M18.125 10L15.625 7.5M18.125 10L7.5 10"
        stroke="#C3C3C5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
};
