/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";

interface Props {
  labelText: string;
  placeholderText: string;
  icon: boolean;
  mandantory: boolean;
  label: boolean;
  status: "default";
  darkMode: boolean;
  className: any;
  inputTextAreaClassName: any;
  overlapGroupClassName: any;
  containerClassName: any;
  divClassName: any;
  resizerClassName: any;
}

export const InputTextArea = ({
  labelText = "Label",
  placeholderText = "Value",
  icon = false,
  mandantory = false,
  label = true,
  status,
  darkMode,
  className,
  inputTextAreaClassName,
  overlapGroupClassName,
  containerClassName,
  divClassName,
  resizerClassName,
}: Props): JSX.Element => {
  return (
    <div
      className={`flex flex-col w-80 h-[98px] items-start gap-2 relative ${className}`}
    >
      {label && (
        <div className="inline-flex items-start gap-1 relative flex-[0_0_auto]">
          {label && (
            <div className="inline-flex items-center gap-1 px-px py-0 relative self-stretch flex-[0_0_auto]">
              <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
                <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
                  <div className="relative w-fit mt-[-1.00px] [font-family:'Pretendard-Medium',Helvetica] font-medium text-dark-modetextdefault text-sm text-center tracking-[0] leading-[19.6px] whitespace-nowrap">
                    {labelText}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div
        className={`relative flex-1 self-stretch w-full grow rounded-md ${inputTextAreaClassName}`}
      >
        <div
          className={`relative w-80 h-[70px] rounded ${overlapGroupClassName}`}
        >
          <div
            className={`flex w-80 h-[70px] items-center gap-3 px-3 py-2.5 absolute top-0 left-0 rounded overflow-hidden border border-solid border-[#4a4a4b] ${containerClassName}`}
          >
            <div className="flex items-start gap-2.5 grow relative flex-1 self-stretch">
              <div
                className={`mt-[-1.00px] [font-family:'Pretendard-Regular',Helvetica] font-normal text-[#a8a8aa] text-sm tracking-[0] leading-[19.6px] relative flex-1 self-stretch ${divClassName}`}
              >
                {placeholderText}
              </div>
            </div>
          </div>

          <div
            className={`absolute w-2 h-2 top-[58px] left-[308px] bg-[url(/img/resizer.svg)] bg-[100%_100%] ${resizerClassName}`}
          />
        </div>
      </div>
    </div>
  );
};

InputTextArea.propTypes = {
  labelText: PropTypes.string,
  placeholderText: PropTypes.string,
  icon: PropTypes.bool,
  mandantory: PropTypes.bool,
  label: PropTypes.bool,
  status: PropTypes.oneOf(["default"]),
  darkMode: PropTypes.bool,
};
