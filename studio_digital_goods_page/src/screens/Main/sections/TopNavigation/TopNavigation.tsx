import React from "react";
import { ButtonContained } from "../../../../components/ButtonContained";
import { HeroiconsOutlineCog8Tooth } from "../../../../icons/HeroiconsOutlineCog8Tooth";

export const TopNavigation = (): JSX.Element => {
  return (
    <div className="flex h-16 items-center justify-end gap-2.5 px-8 py-5 relative self-stretch w-full bg-[#202020] border-b [border-bottom-style:solid] border-dark-modeborderdefault">
      <div className="relative flex-1 mt-[-3.00px] mb-[-1.00px] [font-family:'Archivo_Black',Helvetica] font-normal text-[#ffd93b] text-xl tracking-[0] leading-7">
        LikeButter
      </div>

      <div className="inline-flex items-center justify-end gap-4 relative flex-[0_0_auto]">
        <ButtonContained
          className="!flex-[0_0_auto]"
          darkMode
          icon="none"
          size="medium"
          stateProp="default"
          text="Button text"
          textClassName="!text-dark-modeborderprimary"
          type="text"
        />
        <div className="inline-flex items-center justify-center gap-4 relative flex-[0_0_auto]">
          <HeroiconsOutlineCog8Tooth
            className="!relative !w-6 !h-6"
            color="#A8A8AA"
          />
        </div>
      </div>
    </div>
  );
};
