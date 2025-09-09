import React from "react";
import { Badge } from "../../components/Badge";
import { ButtonContained } from "../../components/ButtonContained";
import { SelectSize } from "../../components/SelectSize";
import { TabItem } from "../../components/TabItem";
import { HeroiconsOutlineXMark } from "../../icons/HeroiconsOutlineXMark";

export const Box = (): JSX.Element => {
  return (
    <div className="w-[678px] h-[719px]" data-model-id="208:3451-frame">
      <div className="fixed w-[678px] h-[719px] top-0 left-0">
        <div className="flex flex-col w-[678px] items-end gap-10 p-6 relative bg-[#292c31] rounded-xl border border-solid border-[#4a4a4b]">
          <div className="flex flex-col items-start gap-8 relative self-stretch w-full flex-[0_0_auto]">
            <div className="inline-flex flex-col items-start gap-10 relative flex-[0_0_auto]">
              <div className="flex flex-col items-start gap-5 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex flex-col items-start gap-6 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
                    <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
                      <div className="flex-1 mt-[-1.00px] [font-family:'Pretendard-Bold',Helvetica] font-bold text-white text-lg text-center leading-[25.2px] relative tracking-[0]">
                        만들어보기
                      </div>

                      <HeroiconsOutlineXMark
                        className="!relative !w-4 !h-4"
                        color="white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex w-[630px] items-start relative flex-[0_0_auto] border-b [border-bottom-style:solid] border-[#4a4a4b]">
                  <TabItem
                    className="!flex-[0_0_auto]"
                    darkMode
                    icon={false}
                    state="selected"
                    text="이미지 생성"
                  />
                  <TabItem
                    className="!flex-[0_0_auto]"
                    darkMode
                    icon={false}
                    state="default"
                    text="음원 생성"
                  />
                </div>
              </div>

              <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-fit mt-[-1.00px] [font-family:'Pretendard-Bold',Helvetica] font-bold text-white text-sm leading-[19.6px] whitespace-nowrap relative tracking-[0]">
                    이미지 생성하기
                  </div>

                  <div className="w-fit [font-family:'Pretendard-SemiBold',Helvetica] font-semibold text-[#89898b] text-sm leading-[14px] whitespace-nowrap relative tracking-[0]">
                    How to use
                  </div>
                </div>

                <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="inline-flex items-center gap-4 relative flex-[0_0_auto]">
                    <div className="flex flex-col w-[307px] items-center justify-center gap-4 relative">
                      <SelectSize
                        className="!self-stretch !h-[165px] !bg-[50%_50%] !bg-cover bg-[url(/img/select-size.png)] !w-full"
                        darkMode
                        hasDiv={false}
                        state="selected"
                      />
                      <div className="flex items-center justify-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
                        <div className="w-fit mt-[-1.00px] [font-family:'Pretendard-Medium',Helvetica] font-medium text-[#ffcc00] text-sm text-center leading-[19.6px] whitespace-nowrap relative tracking-[0]">
                          디지털 굿즈
                        </div>
                      </div>

                      <Badge
                        className="!px-2 !py-1 !absolute !left-[261px] !bg-[#4f0089] !top-[7px]"
                        darkMode
                        divClassName="!text-[10px] !leading-[10px]"
                        filled
                        rounded={false}
                        text="New"
                        type="info"
                      />
                    </div>

                    <div className="flex flex-col w-[307px] items-center justify-center gap-4 relative">
                      <SelectSize
                        className="!self-stretch !h-[165px] !w-full"
                        darkMode
                        hasDiv={false}
                        state="default"
                      />
                      <div className="self-stretch [font-family:'Pretendard-Medium',Helvetica] font-medium text-white text-sm text-center leading-[19.6px] relative tracking-[0]">
                        아이돌 사진 에디터
                      </div>
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-4 relative flex-[0_0_auto]">
                  <div className="flex flex-col w-[307px] items-center justify-center gap-4 relative">
                    <SelectSize
                      className="!self-stretch !h-[165px] !w-full"
                      darkMode
                      hasDiv={false}
                      state="default"
                    />
                    <div className="self-stretch [font-family:'Pretendard-Medium',Helvetica] font-medium text-white text-sm text-center leading-[19.6px] relative tracking-[0]">
                      팬미팅 스튜디오
                    </div>
                  </div>

                  <div className="flex flex-col w-[307px] items-center justify-center gap-4 relative">
                    <SelectSize
                      className="!self-stretch !h-[165px] !w-full"
                      darkMode
                      hasDiv={false}
                      state="default"
                    />
                    <div className="relative self-stretch [font-family:'Pretendard-Medium',Helvetica] font-medium text-white text-sm text-center tracking-[0] leading-[19.6px]">
                      AI 드림 콘티
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ButtonContained
            className="!self-stretch !flex !w-full"
            darkMode
            icon="none"
            size="large"
            stateProp="default"
            text="만들기"
            textClassName="!text-[#4a4a4b]"
            type="primary"
          />
        </div>
      </div>
    </div>
  );
};
