import React from "react";
import { HeroiconsMiniHome } from "../../../../components/HeroiconsMiniHome";
import { HeroiconsOutline } from "../../../../components/HeroiconsOutline";
import { HeroiconsOutlineWrapper } from "../../../../components/HeroiconsOutlineWrapper";
import { HeroiconsSolidPlus } from "../../../../components/HeroiconsSolidPlus";
import { ItemsSideMenuDark } from "../../../../components/ItemsSideMenuDark";

export const SideMenuDark = (): JSX.Element => {
  return (
    <div className="flex flex-col w-20 h-[915px] items-start gap-10 pt-6 pb-3 px-3 relative bg-dark-modebackgrounddefault border-r [border-right-style:solid] border-[#4a4a4b]">
      <div className="inline-flex flex-col items-start gap-10 relative flex-1 grow">
        <div className="flex flex-col w-14 items-start gap-2.5 relative flex-[0_0_auto]">
          <div className="flex flex-col items-center justify-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col items-start gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex flex-col items-center justify-center gap-1 relative self-stretch w-full flex-[0_0_auto]">
                  <ItemsSideMenuDark
                    className="!h-[42px] !rounded-[100px] !p-3 !aspect-[1] !flex !bg-[#e9ba00] !w-[42px]"
                    collapse
                    customize={false}
                    override={
                      <HeroiconsSolidPlus
                        className="!h-5 !mr-[-1.00px] !mt-[-1.00px] !ml-[-1.00px] !mb-[-1.00px] !relative !left-[unset] !w-5 !top-[unset]"
                        heroiconsSolidPlus="https://c.animaapp.com/dqzZYv6Z/img/heroicons-solid-plus-1.svg"
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
                    override={
                      <HeroiconsMiniHome
                        className="!relative !left-[unset] !top-[unset]"
                        heroiconsMiniHome="https://c.animaapp.com/dqzZYv6Z/img/heroicons-mini-home-1.svg"
                      />
                    }
                    state="selected"
                    type="menu-item"
                  />
                  <div className="relative self-stretch font-text-body3-medium font-[number:var(--text-body3-medium-font-weight)] text-[#a8a8aa] text-[length:var(--text-body3-medium-font-size)] text-center tracking-[var(--text-body3-medium-letter-spacing)] leading-[var(--text-body3-medium-line-height)] [font-style:var(--text-body3-medium-font-style)]">
                    홈
                  </div>
                </div>

                <div className="flex flex-col items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
                  <ItemsSideMenuDark
                    className="!self-stretch !flex-[0_0_auto] !flex !w-full"
                    collapse
                    customize={false}
                    override={
                      <HeroiconsOutline
                        className="!h-5 !relative !left-[unset] !w-5 !top-[unset]"
                        heroiconsOutline="https://c.animaapp.com/dqzZYv6Z/img/heroicons-outline-rectangle-stack-1.svg"
                      />
                    }
                    state="default"
                    type="menu-item"
                  />
                  <div className="relative self-stretch font-text-body3-medium font-[number:var(--text-body3-medium-font-weight)] text-[#a8a8aa] text-[length:var(--text-body3-medium-font-size)] text-center tracking-[var(--text-body3-medium-letter-spacing)] leading-[var(--text-body3-medium-line-height)] [font-style:var(--text-body3-medium-font-style)]">
                    보관함
                  </div>
                </div>

                <div className="flex flex-col items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
                  <ItemsSideMenuDark
                    className="!self-stretch !flex-[0_0_auto] !flex !w-full"
                    collapse
                    customize={false}
                    override={
                      <HeroiconsOutlineWrapper
                        className="!h-5 !relative !left-[unset] !w-5 !top-[unset]"
                        heroiconsOutline="https://c.animaapp.com/dqzZYv6Z/img/heroicons-outline-users-1.svg"
                      />
                    }
                    state="default"
                    type="menu-item"
                  />
                  <div className="relative self-stretch font-text-body3-medium font-[number:var(--text-body3-medium-font-weight)] text-[#a8a8aa] text-[length:var(--text-body3-medium-font-size)] text-center tracking-[var(--text-body3-medium-letter-spacing)] leading-[var(--text-body3-medium-line-height)] [font-style:var(--text-body3-medium-font-style)]">
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
