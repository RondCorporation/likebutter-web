import React from 'react';
import { DropdownButton } from '../../../../components/DropdownButton';
import { InputTextArea } from '../../../../components/InputTextArea';

export const SideMenuDarkWrapper = (): JSX.Element => {
  return (
    <div className="flex flex-col w-[260px] h-[900px] items-start gap-10 pt-6 pb-3 px-3 relative mb-[-76.00px] bg-[#202020] border-r [border-right-style:solid] border-[#1a3353]">
      <div className="flex flex-col items-start gap-8 relative self-stretch w-full flex-[0_0_auto]">
        <div className="inline-flex flex-col items-start gap-4 relative flex-[0_0_auto] mr-[-36.00px]">
          <div className="w-fit mt-[-1.00px] [font-family:'Pretendard-Medium',Helvetica] font-medium text-white text-sm text-center leading-[19.6px] whitespace-nowrap relative tracking-[0]">
            스타일 프리셋
          </div>

          <div className="inline-flex flex-col items-start gap-2.5 relative flex-[0_0_auto]">
            <div className="inline-flex items-start gap-2.5 relative flex-[0_0_auto]">
              <div className="flex flex-col w-[84px] items-center justify-center gap-1.5 relative">
                <img
                  className="relative w-[84px] h-[89px] object-cover"
                  alt="Rectangle"
                  src="/img/rectangle-1.svg"
                />

                <div className="self-stretch [font-family:'Pretendard-Medium',Helvetica] font-medium text-[#ffcc00] text-sm text-center leading-[19.6px] relative tracking-[0]">
                  지브리
                </div>
              </div>

              <div className="flex flex-col w-[84px] items-center justify-center gap-1.5 relative">
                <img
                  className="relative w-[84px] h-[89px] object-cover"
                  alt="Rectangle"
                  src="/img/rectangle-1-1.svg"
                />

                <div className="self-stretch [font-family:'Pretendard-Medium',Helvetica] font-medium text-white text-sm text-center leading-[19.6px] relative tracking-[0]">
                  액션
                </div>
              </div>

              <div className="flex flex-col w-[84px] items-center justify-center gap-1.5 relative">
                <img
                  className="w-[60px] relative h-[89px]"
                  alt="Rectangle"
                  src="/img/rectangle-1-5.svg"
                />

                <div className="self-stretch [font-family:'Pretendard-Medium',Helvetica] font-medium text-white text-sm text-center leading-[19.6px] relative tracking-[0]">
                  지브리
                </div>
              </div>
            </div>

            <div className="inline-flex items-start gap-2.5 relative flex-[0_0_auto]">
              <div className="flex flex-col w-[84px] items-center justify-center gap-1.5 relative">
                <img
                  className="w-[84px] relative h-[89px]"
                  alt="Rectangle"
                  src="/img/rectangle-1-4.svg"
                />

                <div className="self-stretch [font-family:'Pretendard-Medium',Helvetica] font-medium text-white text-sm text-center leading-[19.6px] relative tracking-[0]">
                  포스터
                </div>
              </div>

              <div className="flex flex-col w-[84px] items-center justify-center gap-1.5 relative">
                <img
                  className="w-[84px] relative h-[89px]"
                  alt="Rectangle"
                  src="/img/rectangle-1-4.svg"
                />

                <div className="self-stretch [font-family:'Pretendard-Medium',Helvetica] font-medium text-white text-sm text-center leading-[19.6px] relative tracking-[0]">
                  스티커
                </div>
              </div>

              <div className="flex flex-col w-[84px] items-center justify-center gap-1.5 relative">
                <img
                  className="w-[60px] relative h-[89px]"
                  alt="Rectangle"
                  src="/img/rectangle-1-5.svg"
                />

                <div className="self-stretch [font-family:'Pretendard-Medium',Helvetica] font-medium text-white text-sm text-center leading-[19.6px] relative tracking-[0]">
                  카툰
                </div>
              </div>
            </div>
          </div>
        </div>

        <InputTextArea
          className="!self-stretch !h-[unset] !gap-4 !flex-[0_0_auto] !w-full"
          containerClassName="!bg-[#202020] !w-[236px]"
          darkMode
          divClassName="!font-medium ![font-family:'Pretendard-Medium',Helvetica]"
          inputTextAreaClassName="!h-[70px] !flex-[unset] !grow-[unset] !bg-[#3c3c3c]"
          labelText="편집 설명"
          overlapGroupClassName="!w-[236px]"
          placeholderText="원하는 디스크립션 디스크립션"
          resizerClassName="bg-[url(/img/resizer-1.svg)] !left-56"
          status="default"
        />
        <div className="inline-flex flex-col items-start gap-4 relative flex-[0_0_auto]">
          <div className="w-fit mt-[-1.00px] [font-family:'Pretendard-Medium',Helvetica] font-medium text-white text-sm text-center leading-[19.6px] whitespace-nowrap relative tracking-[0]">
            이미지 사이즈
          </div>

          <DropdownButton
            className="!flex !bg-[#202020] !w-[236px]"
            darkMode
            divClassName="!text-[#a8a8aa] !flex-1 ![white-space:unset] !w-[unset]"
            frameClassName="!self-stretch !flex !w-full"
            heroiconsSolidChevronDown3Color="#A8A8AA"
            state="default"
            text="1:1(정방향)"
            type="default"
          />
        </div>

        <div className="inline-flex flex-col items-start gap-4 relative flex-[0_0_auto]">
          <div className="w-fit mt-[-1.00px] [font-family:'Pretendard-Medium',Helvetica] font-medium text-white text-sm text-center leading-[19.6px] whitespace-nowrap relative tracking-[0]">
            파일업로드
          </div>

          <DropdownButton
            className="!flex !bg-[#202020] !w-[236px]"
            darkMode
            divClassName="!text-[#a8a8aa] !flex-1 ![white-space:unset] !w-[unset]"
            frameClassName="!self-stretch !flex !w-full"
            heroiconsSolidChevronDown3Color="#A8A8AA"
            state="default"
            text="1:1(정방향)"
            type="default"
          />
        </div>
      </div>
    </div>
  );
};
