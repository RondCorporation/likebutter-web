import React from "react";
import { ButtonContained } from "../../../../components/ButtonContained";
import { HeroiconsSolidQuestionMarkCircle1 } from "../../../../icons/HeroiconsSolidQuestionMarkCircle1";

export const Frame = (): JSX.Element => {
  return (
    <div className="flex items-start gap-6 pt-6 pb-12 px-12 relative flex-1 self-stretch grow bg-[#25282c]">
      <div className="flex flex-col items-start gap-6 relative flex-1 self-stretch grow">
        <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex-1 font-header-h3 font-[number:var(--header-h3-font-weight)] text-white text-[length:var(--header-h3-font-size)] leading-[var(--header-h3-line-height)] relative tracking-[var(--header-h3-letter-spacing)] [font-style:var(--header-h3-font-style)]">
            디지털 굿즈
          </div>

          <ButtonContained
            className="!flex-[0_0_auto] !bg-dark-modeborderprimary"
            darkMode={false}
            icon="none"
            size="medium"
            stateProp="default"
            text="굿즈생성"
            textClassName="!text-[#4a4a4b] !tracking-[0] !text-sm ![font-style:unset] !font-bold ![font-family:'Pretendard-Bold',Helvetica] !leading-[14px]"
            type="primary"
          />
          <ButtonContained
            className="!border-dark-modeborderprimary !flex-[0_0_auto] !opacity-60"
            darkMode={false}
            icon="none"
            size="medium"
            stateProp="default"
            text="저장하기"
            textClassName="!text-dark-modeborderprimary !tracking-[0] !text-sm ![font-style:unset] !font-bold ![font-family:'Pretendard-Bold',Helvetica] !leading-[14px]"
            type="secondary"
          />
        </div>

        <div className="flex items-center gap-6 relative flex-1 self-stretch w-full grow">
          <div className="relative self-stretch w-[330px] bg-[#313030] rounded-[20px] overflow-hidden">
            <div className="flex flex-col w-[300px] min-h-[300px] items-center justify-center gap-2.5 p-2.5 absolute top-[15px] left-[15px] bg-[#25282c] rounded-[20px]">
              <img
                className="relative w-[189px] h-64 aspect-[0.74] object-cover"
                alt="Element"
                src="/img/1.png"
              />
            </div>

            <ButtonContained
              className="!flex !absolute !left-[15px] !bg-[#414141] !w-[300px] !top-[333px]"
              darkMode={false}
              icon="none"
              size="medium"
              stateProp="default"
              text="파일 찾아보기"
              textClassName="!text-dark-modeiconsecondary !tracking-[var(--button-button3-semibold-letter-spacing)] !text-[length:var(--button-button3-semibold-font-size)] ![font-style:var(--button-button3-semibold-font-style)] !font-[number:var(--button-button3-semibold-font-weight)] !font-button-button3-semibold !leading-[var(--button-button3-semibold-line-height)]"
              type="primary"
            />
          </div>

          <div className="relative self-stretch w-[650px] bg-[#313131] rounded-[20px]" />

          <div className="flex flex-col w-[608px] h-[653px] items-center justify-center gap-2.5 p-2.5 absolute top-[15px] left-[375px] bg-[#292c31] rounded-[20px] border border-dashed border-dark-modebackgrounddefault">
            <div className="flex flex-col items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col w-[142px] items-center gap-3.5 relative flex-[0_0_auto]">
                <HeroiconsSolidQuestionMarkCircle1
                  className="!relative !w-12 !h-12"
                  color="#89898A"
                />
              </div>

              <div className="relative w-[174px] h-[50px]">
                <div className="inline-flex flex-col items-center gap-2 relative">
                  <div className="w-fit mt-[-1.00px] [font-family:'Pretendard-Medium',Helvetica] font-medium text-[#a8a8aa] text-base text-center leading-6 whitespace-nowrap relative tracking-[0]">
                    결과 이미지
                  </div>

                  <div className="relative w-fit [font-family:'Pretendard-Regular',Helvetica] font-normal text-dark-modebackgrounddisabled text-xs text-center tracking-[0] leading-[18px] whitespace-nowrap">
                    파일당 200mb 제한 (png,jpg,jpeg)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
