/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";

interface Props {
  className: any;
  heroiconsSolidPlus: string;
}

export const HeroiconsSolidPlus = ({
  className,
  heroiconsSolidPlus = "https://c.animaapp.com/Nx4v5zU2/img/heroicons-solid-plus.svg",
}: Props): JSX.Element => {
  return (
    <img
      className={`absolute w-6 h-6 top-0 left-0 ${className}`}
      alt="Heroicons solid plus"
      src={heroiconsSolidPlus}
    />
  );
};
