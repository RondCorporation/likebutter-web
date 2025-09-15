/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";

interface Props {
  status: boolean;
  size: "thirty-two";
  image: boolean;
  className: any;
}

export const Avatar = ({
  status = false,
  size,
  image,
  className,
}: Props): JSX.Element => {
  return (
    <div
      className={`relative w-[34px] h-[34px] rounded-[90px] border border-solid border-light-modebackgrounddefault ${className}`}
    >
      <img
        className="absolute w-8 h-8 top-0 left-0 object-cover"
        alt="Ellipse"
        src="https://c.animaapp.com/Nx4v5zU2/img/ellipse-17-1@2x.png"
      />
    </div>
  );
};
