import React from "react";
import { Avatar } from "../../../../components/Avatar";

export const TopNavigation = (): JSX.Element => {
  return (
    <div className="flex h-16 items-center justify-end gap-2.5 px-8 py-5 relative self-stretch w-full bg-dark-modebackgrounddefault border-b [border-bottom-style:solid] border-dark-modeborderdefault">
      <div className="relative flex-1 mt-[-3.00px] mb-[-1.00px] [font-family:'Archivo_Black',Helvetica] font-normal text-[#ffd93b] text-xl tracking-[0] leading-7">
        LikeButter
      </div>

      <div className="inline-flex items-center gap-4 relative flex-[0_0_auto] mt-[-5.00px] mb-[-5.00px]">
        <div className="inline-flex items-center justify-end gap-4 relative flex-[0_0_auto]">
          <button className="all-[unset] box-border inline-flex h-[34px] items-center justify-center gap-2 px-3 py-2 relative flex-[0_0_auto] rounded-md overflow-hidden border border-solid border-dark-modeborderprimary">
            <img
              className="relative w-5 h-5 mt-[-1.00px] mb-[-1.00px] aspect-[1]"
              alt="Material symbols"
              src="https://c.animaapp.com/dqzZYv6Z/img/material-symbols-crown.svg"
            />

            <div className="relative w-fit font-button-button3-semibold font-[number:var(--button-button3-semibold-font-weight)] text-dark-modeborderprimary text-[length:var(--button-button3-semibold-font-size)] text-center tracking-[var(--button-button3-semibold-letter-spacing)] leading-[var(--button-button3-semibold-line-height)] whitespace-nowrap [font-style:var(--button-button3-semibold-font-style)]">
              업그레이드
            </div>
          </button>
        </div>

        <Avatar className="!mr-[-1.00px]" image size="thirty-two" />
      </div>
    </div>
  );
};
