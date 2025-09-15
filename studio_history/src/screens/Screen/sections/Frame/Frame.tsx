import React from "react";
import { Badge } from "../../../../components/Badge";
import { DropdownButton } from "../../../../components/DropdownButton";
import { HeroiconsSolidCog } from "../../../../components/HeroiconsSolidCog";
import { HeroiconsSolidWrapper } from "../../../../components/HeroiconsSolidWrapper";
import { ImgWrapper } from "../../../../components/ImgWrapper";
import { Pagination } from "../../../../components/Pagination";
import { SelectSize } from "../../../../components/SelectSize";
import { Tabs } from "../../../../components/Tabs";

export const Frame = (): JSX.Element => {
  return (
    <div className="relative flex-1 self-stretch grow bg-[#25282c]">
      <div className="inline-flex flex-col items-start gap-4 absolute top-[220px] left-[90px]">
        <div className="flex flex-col w-[1180px] h-[440px] items-start gap-[138px] relative">
          <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto] mb-[-32.00px]">
            <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
              <DropdownButton
                className="!flex-[0_0_auto]"
                darkMode
                state="default"
                text="옵션 선택"
                type="default"
              />
              <div className="inline-flex flex-wrap items-start gap-[0px_12px] relative flex-[0_0_auto]">
                <HeroiconsSolidCog
                  className="!relative !left-[unset] !top-[unset]"
                  heroiconsSolidCog="https://c.animaapp.com/dqzZYv6Z/img/heroicons-solid-cog-6-tooth-1.svg"
                />
                <HeroiconsSolidWrapper
                  className="!relative !left-[unset] !top-[unset]"
                  heroiconsSolid="https://c.animaapp.com/dqzZYv6Z/img/heroicons-solid-trash-1.svg"
                />
                <ImgWrapper
                  className="!relative !left-[unset] !top-[unset]"
                  heroiconsSolid="https://c.animaapp.com/dqzZYv6Z/img/heroicons-solid-ellipsis-vertical-1.svg"
                />
              </div>
            </div>

            <div className="flex w-[1180px] items-center gap-4 relative flex-[0_0_auto]">
              <div className="flex flex-col items-center justify-center gap-4 relative flex-1 grow">
                <SelectSize
                  className="!self-stretch !h-[165px] !rounded-2xl !bg-[#4a4a4b] !w-full"
                  darkMode
                  hasDiv={false}
                  state="default"
                />
                <p className="relative self-stretch font-text-body2-medium font-[number:var(--text-body2-medium-font-weight)] text-dark-modebordersecondary text-[length:var(--text-body2-medium-font-size)] text-center tracking-[var(--text-body2-medium-letter-spacing)] leading-[var(--text-body2-medium-line-height)] [font-style:var(--text-body2-medium-font-style)]">
                  2025년 10월 24일 18시 20분
                </p>

                <Badge
                  className="!px-2 !py-1 !left-[209px] !absolute !bg-[#e8fa07] !top-3"
                  darkMode
                  divClassName="!text-[#292c31] !tracking-[var(--label-regular-letter-spacing)] !text-[length:var(--label-regular-font-size)] ![font-style:var(--label-regular-font-style)] !font-[number:var(--label-regular-font-weight)] !font-label-regular !leading-[var(--label-regular-line-height)]"
                  filled
                  rounded={false}
                  text="디지털 굿즈"
                  type="info"
                />
              </div>

              <div className="flex flex-col items-center justify-center gap-4 relative flex-1 grow">
                <SelectSize
                  className="!self-stretch !h-[165px] !rounded-2xl !border-[unset] !bg-[#4a4a4b] !w-full"
                  darkMode
                  hasDiv={false}
                  state="default"
                />
                <p className="relative self-stretch font-text-body2-medium font-[number:var(--text-body2-medium-font-weight)] text-dark-modebordersecondary text-[length:var(--text-body2-medium-font-size)] text-center tracking-[var(--text-body2-medium-letter-spacing)] leading-[var(--text-body2-medium-line-height)] [font-style:var(--text-body2-medium-font-style)]">
                  2025년 10월 24일 18시 20분
                </p>

                <Badge
                  className="!px-2 !py-1 !left-[209px] !absolute !bg-[#e8fa07] !top-3"
                  darkMode
                  divClassName="!text-[#292c31] !tracking-[var(--label-regular-letter-spacing)] !text-[length:var(--label-regular-font-size)] ![font-style:var(--label-regular-font-style)] !font-[number:var(--label-regular-font-weight)] !font-label-regular !leading-[var(--label-regular-line-height)]"
                  filled
                  rounded={false}
                  text="디지털 굿즈"
                  type="info"
                />
              </div>

              <div className="flex flex-col items-center justify-center gap-4 relative flex-1 grow">
                <SelectSize
                  className="!self-stretch !h-[165px] !rounded-2xl !border-[unset] !bg-[#4a4a4b] !w-full"
                  darkMode
                  hasDiv={false}
                  state="default"
                />
                <p className="relative self-stretch font-text-body2-medium font-[number:var(--text-body2-medium-font-weight)] text-dark-modebordersecondary text-[length:var(--text-body2-medium-font-size)] text-center tracking-[var(--text-body2-medium-letter-spacing)] leading-[var(--text-body2-medium-line-height)] [font-style:var(--text-body2-medium-font-style)]">
                  2025년 10월 24일 18시 20분
                </p>

                <Badge
                  className="!px-2 !py-1 !left-[204px] !absolute !bg-[#e8fa07] !top-3"
                  darkMode
                  divClassName="!text-[#292c31] !tracking-[var(--label-regular-letter-spacing)] !text-[length:var(--label-regular-font-size)] ![font-style:var(--label-regular-font-style)] !font-[number:var(--label-regular-font-weight)] !font-label-regular !leading-[var(--label-regular-line-height)]"
                  filled
                  rounded={false}
                  text="스타일리스트"
                  type="info"
                />
              </div>

              <div className="flex flex-col items-center justify-center gap-4 relative flex-1 grow">
                <SelectSize
                  className="!self-stretch !h-[165px] !rounded-2xl !border-[unset] !bg-[#4a4a4b] !w-full"
                  darkMode
                  hasDiv={false}
                  state="default"
                />
                <p className="relative self-stretch font-text-body2-medium font-[number:var(--text-body2-medium-font-weight)] text-dark-modebordersecondary text-[length:var(--text-body2-medium-font-size)] text-center tracking-[var(--text-body2-medium-letter-spacing)] leading-[var(--text-body2-medium-line-height)] [font-style:var(--text-body2-medium-font-style)]">
                  2025년 10월 24일 18시 20분
                </p>

                <Badge
                  className="!px-2 !py-1 !left-[205px] !absolute !bg-[#e8fa07] !top-3"
                  darkMode
                  divClassName="!text-[#292c31] !tracking-[var(--label-regular-letter-spacing)] !text-[length:var(--label-regular-font-size)] ![font-style:var(--label-regular-font-style)] !font-[number:var(--label-regular-font-weight)] !font-label-regular !leading-[var(--label-regular-line-height)]"
                  filled
                  rounded={false}
                  text="스타일리스트"
                  type="info"
                />
              </div>
            </div>

            <div className="flex w-[1180px] items-center gap-4 relative flex-[0_0_auto]">
              <div className="flex flex-col items-center justify-center gap-4 relative flex-1 grow">
                <SelectSize
                  className="!self-stretch !h-[165px] !rounded-2xl !bg-[#4a4a4b] !w-full"
                  darkMode
                  hasDiv={false}
                  state="default"
                />
                <p className="relative self-stretch font-text-body2-medium font-[number:var(--text-body2-medium-font-weight)] text-dark-modebordersecondary text-[length:var(--text-body2-medium-font-size)] text-center tracking-[var(--text-body2-medium-letter-spacing)] leading-[var(--text-body2-medium-line-height)] [font-style:var(--text-body2-medium-font-style)]">
                  2025년 10월 24일 18시 20분
                </p>

                <Badge
                  className="!px-2 !py-1 !left-[209px] !absolute !bg-[#e8fa07] !top-3"
                  darkMode
                  divClassName="!text-[#292c31] !tracking-[var(--label-regular-letter-spacing)] !text-[length:var(--label-regular-font-size)] ![font-style:var(--label-regular-font-style)] !font-[number:var(--label-regular-font-weight)] !font-label-regular !leading-[var(--label-regular-line-height)]"
                  filled
                  rounded={false}
                  text="디지털 굿즈"
                  type="info"
                />
              </div>

              <div className="flex flex-col items-center justify-center gap-4 relative flex-1 grow">
                <SelectSize
                  className="!self-stretch !h-[165px] !rounded-2xl !border-[unset] !bg-[#4a4a4b] !w-full"
                  darkMode
                  hasDiv={false}
                  state="default"
                />
                <p className="relative self-stretch font-text-body2-medium font-[number:var(--text-body2-medium-font-weight)] text-dark-modebordersecondary text-[length:var(--text-body2-medium-font-size)] text-center tracking-[var(--text-body2-medium-letter-spacing)] leading-[var(--text-body2-medium-line-height)] [font-style:var(--text-body2-medium-font-style)]">
                  2025년 10월 24일 18시 20분
                </p>

                <Badge
                  className="!px-2 !py-1 !left-[209px] !absolute !bg-[#e8fa07] !top-3"
                  darkMode
                  divClassName="!text-[#292c31] !tracking-[var(--label-regular-letter-spacing)] !text-[length:var(--label-regular-font-size)] ![font-style:var(--label-regular-font-style)] !font-[number:var(--label-regular-font-weight)] !font-label-regular !leading-[var(--label-regular-line-height)]"
                  filled
                  rounded={false}
                  text="디지털 굿즈"
                  type="info"
                />
              </div>

              <div className="flex flex-col items-center justify-center gap-4 relative flex-1 grow">
                <SelectSize
                  className="!self-stretch !h-[165px] !rounded-2xl !border-[unset] !bg-[#4a4a4b] !w-full"
                  darkMode
                  hasDiv={false}
                  state="default"
                />
                <p className="relative self-stretch font-text-body2-medium font-[number:var(--text-body2-medium-font-weight)] text-dark-modebordersecondary text-[length:var(--text-body2-medium-font-size)] text-center tracking-[var(--text-body2-medium-letter-spacing)] leading-[var(--text-body2-medium-line-height)] [font-style:var(--text-body2-medium-font-style)]">
                  2025년 10월 24일 18시 20분
                </p>

                <Badge
                  className="!px-2 !py-1 !left-[204px] !absolute !bg-[#e8fa07] !top-3"
                  darkMode
                  divClassName="!text-[#292c31] !tracking-[var(--label-regular-letter-spacing)] !text-[length:var(--label-regular-font-size)] ![font-style:var(--label-regular-font-style)] !font-[number:var(--label-regular-font-weight)] !font-label-regular !leading-[var(--label-regular-line-height)]"
                  filled
                  rounded={false}
                  text="스타일리스트"
                  type="info"
                />
              </div>

              <div className="flex flex-col items-center justify-center gap-4 relative flex-1 grow">
                <SelectSize
                  className="!self-stretch !h-[165px] !rounded-2xl !border-[unset] !bg-[#4a4a4b] !w-full"
                  darkMode
                  hasDiv={false}
                  state="default"
                />
                <p className="relative self-stretch font-text-body2-medium font-[number:var(--text-body2-medium-font-weight)] text-dark-modebordersecondary text-[length:var(--text-body2-medium-font-size)] text-center tracking-[var(--text-body2-medium-letter-spacing)] leading-[var(--text-body2-medium-line-height)] [font-style:var(--text-body2-medium-font-style)]">
                  2025년 10월 24일 18시 20분
                </p>

                <Badge
                  className="!px-2 !py-1 !left-[205px] !absolute !bg-[#e8fa07] !top-3"
                  darkMode
                  divClassName="!text-[#292c31] !tracking-[var(--label-regular-letter-spacing)] !text-[length:var(--label-regular-font-size)] ![font-style:var(--label-regular-font-style)] !font-[number:var(--label-regular-font-weight)] !font-label-regular !leading-[var(--label-regular-line-height)]"
                  filled
                  rounded={false}
                  text="스타일리스트"
                  type="info"
                />
              </div>
            </div>
          </div>

          <Pagination
            className="!self-stretch !h-[38px] !mb-[-208.00px] !w-full"
            darkMode
            device="desktop"
            paginationArrowHeroiconsMiniChevronRightHeroiconsMini="https://c.animaapp.com/dqzZYv6Z/img/heroicons-mini-chevron-right-3.svg"
            paginationArrowHeroiconsMiniHeroiconsMini="https://c.animaapp.com/dqzZYv6Z/img/heroicons-mini-chevron-left-3.svg"
          />
        </div>
      </div>

      <Tabs
        className="!inline-flex !left-[90px] !absolute !w-[unset] !top-[113px]"
        darkMode
        visible={false}
        visible1={false}
        visible2={false}
      />
      <div className="absolute top-11 left-[90px] font-header-h1 font-[number:var(--header-h1-font-weight)] text-white text-[length:var(--header-h1-font-size)] tracking-[var(--header-h1-letter-spacing)] leading-[var(--header-h1-line-height)] whitespace-nowrap [font-style:var(--header-h1-font-style)]">
        내 보관함
      </div>
    </div>
  );
};
