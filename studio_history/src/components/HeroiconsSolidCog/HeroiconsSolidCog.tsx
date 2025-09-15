/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";

interface Props {
  className: any;
  heroiconsSolidCog: string;
}

export const HeroiconsSolidCog = ({
  className,
  heroiconsSolidCog = "https://c.animaapp.com/dqzZYv6Z/img/heroicons-solid-cog-6-tooth.svg",
}: Props): JSX.Element => {
  return (
    <img
      className={`absolute w-6 h-6 top-0 left-0 ${className}`}
      alt="Heroicons solid cog"
      src={heroiconsSolidCog}
    />
  );
};
