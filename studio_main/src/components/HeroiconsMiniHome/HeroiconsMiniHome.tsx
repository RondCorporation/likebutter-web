/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";

interface Props {
  className: any;
  heroiconsMiniHome: string;
}

export const HeroiconsMiniHome = ({
  className,
  heroiconsMiniHome = "https://c.animaapp.com/Nx4v5zU2/img/heroicons-mini-home.svg",
}: Props): JSX.Element => {
  return (
    <img
      className={`absolute w-5 h-5 top-0 left-0 ${className}`}
      alt="Heroicons mini home"
      src={heroiconsMiniHome}
    />
  );
};
