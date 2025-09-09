/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { Avatar } from "../Avatar";

interface Props {
  type: "forty";
  className: any;
  avatarDivClassName: any;
  avatarOverlapGroupClassName: any;
  avatarText: string;
  avatarSizeImageTrueClassName: any;
  avatarImage: boolean;
  divClassName: any;
  text: string;
  divClassNameOverride: any;
  text1: string;
}

export const AvatarWithText = ({
  type,
  className,
  avatarDivClassName,
  avatarOverlapGroupClassName,
  avatarText,
  avatarSizeImageTrueClassName,
  avatarImage = true,
  divClassName,
  text = "Jane Cooper",
  divClassNameOverride,
  text1 = "jane.cooper@example.com",
}: Props): JSX.Element => {
  return (
    <div className={`inline-flex items-center gap-4 relative ${className}`}>
      <Avatar
        className={avatarSizeImageTrueClassName}
        divClassName={avatarDivClassName}
        ellipse="/img/ellipse-17.png"
        image={avatarImage}
        overlapGroupClassName={avatarOverlapGroupClassName}
        size="thirty-eight"
        text={avatarText}
      />
      <div className="inline-flex flex-col items-start gap-1 relative flex-[0_0_auto]">
        <div
          className={`relative w-fit mt-[-1.00px] font-text-body2-medium font-[number:var(--text-body2-medium-font-weight)] text-textdefault text-[length:var(--text-body2-medium-font-size)] tracking-[var(--text-body2-medium-letter-spacing)] leading-[var(--text-body2-medium-line-height)] whitespace-nowrap [font-style:var(--text-body2-medium-font-style)] ${divClassName}`}
        >
          {text}
        </div>

        <div
          className={`relative w-fit font-text-body3-regular font-[number:var(--text-body3-regular-font-weight)] text-textsecondary text-[length:var(--text-body3-regular-font-size)] tracking-[var(--text-body3-regular-letter-spacing)] leading-[var(--text-body3-regular-line-height)] whitespace-nowrap [font-style:var(--text-body3-regular-font-style)] ${divClassNameOverride}`}
        >
          {text1}
        </div>
      </div>
    </div>
  );
};

AvatarWithText.propTypes = {
  type: PropTypes.oneOf(["forty"]),
  avatarText: PropTypes.string,
  avatarImage: PropTypes.bool,
  text: PropTypes.string,
  text1: PropTypes.string,
};
