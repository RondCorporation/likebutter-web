/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";

interface Props {
  className: any;
  heroiconsOutline: string;
}

export const HeroiconsOutlineWrapper = ({
  className,
  heroiconsOutline = "https://c.animaapp.com/dqzZYv6Z/img/heroicons-outline-users.svg",
}: Props): JSX.Element => {
  return (
    <img
      className={`absolute w-6 h-6 top-0 left-0 ${className}`}
      alt="Heroicons outline"
      src={heroiconsOutline}
    />
  );
};
