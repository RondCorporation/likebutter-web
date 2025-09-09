/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";

interface Props {
  className: any;
}

export const BasicsCopy = ({ className }: Props): JSX.Element => {
  return (
    <svg
      className={`${className}`}
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.7539 2.94141L13.0586 1.24609C12.8945 1.08203 12.6758 1 12.457 1H8C7.04297 1 6.25 1.79297 6.25 2.75V9.75C6.25 10.707 7.04297 11.5 8 11.5H13.25C14.207 11.5 15 10.707 15 9.75V3.54297C15 3.32422 14.918 3.10547 14.7539 2.94141ZM13.6875 9.75C13.6875 9.99609 13.4961 10.1875 13.25 10.1875H8C7.75391 10.1875 7.5625 9.99609 7.5625 9.75V2.75C7.5625 2.50391 7.75391 2.3125 8 2.3125H11.5V3.625C11.5 4.11719 11.8828 4.5 12.375 4.5H13.6875V9.75ZM8.4375 13.25C8.4375 13.4961 8.24609 13.6875 8 13.6875H2.75C2.50391 13.6875 2.3125 13.4961 2.3125 13.25V6.25C2.3125 6.00391 2.50391 5.8125 2.75 5.8125H5.375V4.5H2.75C1.79297 4.5 1 5.29297 1 6.25V13.25C1 14.207 1.79297 15 2.75 15H8C8.95703 15 9.75 14.207 9.75 13.25V12.375H8.4375V13.25Z"
        fill="#0D0F1B"
      />
    </svg>
  );
};
