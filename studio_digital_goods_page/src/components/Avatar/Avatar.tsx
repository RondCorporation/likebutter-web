/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";

interface Props {
  status: boolean;
  size: "thirty-eight";
  image: boolean;
  className: any;
  overlapGroupClassName: any;
  divClassName: any;
  text: string;
  ellipse: string;
}

export const Avatar = ({
  status = false,
  size,
  image,
  className,
  overlapGroupClassName,
  divClassName,
  text = "A",
  ellipse = "/img/ellipse-17-1.png",
}: Props): JSX.Element => {
  return (
    <div
      className={`border border-solid w-10 h-10 rounded-[90px] ${!image ? "border-borderdefault" : "border-backgrounddefault"} ${image ? "relative" : ""} ${className}`}
    >
      {image && (
        <img
          className="absolute w-[38px] h-[38px] top-0 left-0 object-cover"
          alt="Ellipse"
          src={ellipse}
        />
      )}

      {!image && (
        <div
          className={`relative w-[38px] h-[38px] bg-backgroundsecondary rounded-[19px] ${overlapGroupClassName}`}
        >
          <div
            className={`absolute w-[25px] h-[21px] top-[9px] left-[7px] font-text-body1-regular font-[number:var(--text-body1-regular-font-weight)] text-textsecondary text-[length:var(--text-body1-regular-font-size)] text-center tracking-[var(--text-body1-regular-letter-spacing)] leading-[var(--text-body1-regular-line-height)] whitespace-nowrap [font-style:var(--text-body1-regular-font-style)] ${divClassName}`}
          >
            {text}
          </div>
        </div>
      )}
    </div>
  );
};

Avatar.propTypes = {
  status: PropTypes.bool,
  size: PropTypes.oneOf(["thirty-eight"]),
  image: PropTypes.bool,
  text: PropTypes.string,
  ellipse: PropTypes.string,
};
