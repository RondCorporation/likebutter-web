import React from "react";
import { ItemsSideMenuDark } from "../../../../components/ItemsSideMenuDark";
import { HeroiconsMiniHome } from "../../../../icons/HeroiconsMiniHome";
import { HeroiconsOutlineRectangleStack1 } from "../../../../icons/HeroiconsOutlineRectangleStack1";
import { HeroiconsOutlineUsers1 } from "../../../../icons/HeroiconsOutlineUsers1";
import { HeroiconsSolidPlus } from "../../../../icons/HeroiconsSolidPlus";

export const SideMenuDark = (): JSX.Element => {
  return (
    <div className="flex flex-col w-20 h-[900px] items-start gap-10 pt-6 pb-3 px-3 relative mb-[-76.00px] bg-[#202020] border-r [border-right-style:solid] border-[#4a4a4b]">
      <div className="inline-flex flex-col items-start gap-10 relative flex-1 grow">
        <div className="flex flex-col w-14 items-start gap-2.5 relative flex-[0_0_auto]">
          <div className="flex flex-col items-center justify-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col items-start gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex flex-col items-center justify-center gap-1 relative self-stretch w-full flex-[0_0_auto]">
                  <ItemsSideMenuDark
                    className="!h-[42px] !rounded-[100px] !p-3 !flex !aspect-[1] !bg-[#e9ba00] !w-[42px]"
                    collapse
                    customize={false}
                    icon={
                      <HeroiconsSolidPlus
                        className="!mt-[-1.00px] !mb-[-1.00px] !ml-[-1.00px] !mr-[-1.00px] !relative !w-5 !h-5"
                        color="white"
                      />
                    }
                    state="selected"
                    type="menu-item"
                  />
                  <div className="relative self-stretch font-text-body3-medium font-[number:var(--text-body3-medium-font-weight)] text-white text-[length:var(--text-body3-medium-font-size)] text-center tracking-[var(--text-body3-medium-letter-spacing)] leading-[var(--text-body3-medium-line-height)] [font-style:var(--text-body3-medium-font-style)]">
                    만들기
                  </div>
                </div>

                <div className="flex flex-col items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
                  <ItemsSideMenuDark
                    className="!self-stretch !flex-[0_0_auto] !flex !w-full"
                    collapse
                    customize={false}
                    icon={
                      <HeroiconsMiniHome
                        className="!relative !w-5 !h-5"
                        color="#89898B"
                      />
                    }
                    state="default"
                    type="menu-item"
                  />
                  <div className="self-stretch font-text-body3-medium font-[number:var(--text-body3-medium-font-weight)] text-[#a8a8aa] text-[length:var(--text-body3-medium-font-size)] text-center leading-[var(--text-body3-medium-line-height)] relative tracking-[var(--text-body3-medium-letter-spacing)] [font-style:var(--text-body3-medium-font-style)]">
                    홈
                  </div>
                </div>

                <div className="flex flex-col items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
                  <ItemsSideMenuDark
                    className="!self-stretch !flex-[0_0_auto] !flex !w-full"
                    collapse
                    customize={false}
                    icon={
                      <HeroiconsOutlineRectangleStack1 className="!relative !w-5 !h-5" />
                    }
                    state="default"
                    type="menu-item"
                  />
                  <div className="self-stretch font-text-body3-medium font-[number:var(--text-body3-medium-font-weight)] text-[#a8a8aa] text-[length:var(--text-body3-medium-font-size)] text-center leading-[var(--text-body3-medium-line-height)] relative tracking-[var(--text-body3-medium-letter-spacing)] [font-style:var(--text-body3-medium-font-style)]">
                    보관함
                  </div>
                </div>

                <div className="flex flex-col items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
                  <ItemsSideMenuDark
                    className="!self-stretch !flex-[0_0_auto] !flex !w-full"
                    collapse
                    customize={false}
                    icon={
                      <HeroiconsOutlineUsers1
                        className="!relative !w-5 !h-5"
                        color="#A8A8AA"
                      />
                    }
                    state="default"
                    type="menu-item"
                  />
                  <div className="self-stretch font-text-body3-medium font-[number:var(--text-body3-medium-font-weight)] text-[#a8a8aa] text-[length:var(--text-body3-medium-font-size)] text-center leading-[var(--text-body3-medium-line-height)] relative tracking-[var(--text-body3-medium-letter-spacing)] [font-style:var(--text-body3-medium-font-style)]">
                    도움말
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
