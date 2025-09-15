import React from "react";
import { Avatar } from "../../components/Avatar";
import { Badge } from "../../components/Badge";
import { HeroiconsMiniHome } from "../../components/HeroiconsMiniHome";
import { HeroiconsOutline } from "../../components/HeroiconsOutline";
import { HeroiconsOutlineMusicalNote } from "../../components/HeroiconsOutlineMusicalNote";
import { HeroiconsOutlineWrapper } from "../../components/HeroiconsOutlineWrapper";
import { HeroiconsSolidPlus } from "../../components/HeroiconsSolidPlus";
import { ImgWrapper } from "../../components/ImgWrapper";
import { ItemsSideMenuDark } from "../../components/ItemsSideMenuDark";
import { Tabs } from "../../components/Tabs";

export const Main = (): JSX.Element => {
  return (
    <div className="flex flex-col items-start relative" data-model-id="296:636">
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
                src="https://c.animaapp.com/Nx4v5zU2/img/material-symbols-crown.svg"
              />

              <div className="relative w-fit font-button-button3-semibold font-[number:var(--button-button3-semibold-font-weight)] text-dark-modeborderprimary text-[length:var(--button-button3-semibold-font-size)] leading-[var(--button-button3-semibold-line-height)] whitespace-nowrap text-center tracking-[var(--button-button3-semibold-letter-spacing)] [font-style:var(--button-button3-semibold-font-style)]">
                업그레이드
              </div>
            </button>
          </div>

          <Avatar className="!mr-[-1.00px]" image size="thirty-two" />
        </div>
      </div>

      <div className="flex h-[824px] items-start relative self-stretch w-full bg-[#323232] overflow-hidden">
        <div className="flex flex-col w-20 h-[900px] items-start gap-10 pt-6 pb-3 px-3 relative mb-[-76.00px] bg-dark-modebackgrounddefault border-r [border-right-style:solid] border-[#4a4a4b]">
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
                            heroiconsSolidPlus="https://c.animaapp.com/Nx4v5zU2/img/heroicons-solid-plus-1.svg"
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
                            heroiconsMiniHome="https://c.animaapp.com/Nx4v5zU2/img/heroicons-mini-home-1.svg"
                          />
                        }
                        state="selected"
                        type="menu-item"
                      />
                      <div className="relative self-stretch font-text-body3-medium font-[number:var(--text-body3-medium-font-weight)] text-[#a8a8aa] text-[length:var(--text-body3-medium-font-size)] leading-[var(--text-body3-medium-line-height)] text-center tracking-[var(--text-body3-medium-letter-spacing)] [font-style:var(--text-body3-medium-font-style)]">
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
                            heroiconsOutline="https://c.animaapp.com/Nx4v5zU2/img/heroicons-outline-rectangle-stack-1.svg"
                          />
                        }
                        state="default"
                        type="menu-item"
                      />
                      <div className="relative self-stretch font-text-body3-medium font-[number:var(--text-body3-medium-font-weight)] text-[#a8a8aa] text-[length:var(--text-body3-medium-font-size)] leading-[var(--text-body3-medium-line-height)] text-center tracking-[var(--text-body3-medium-letter-spacing)] [font-style:var(--text-body3-medium-font-style)]">
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
                            heroiconsOutline="https://c.animaapp.com/Nx4v5zU2/img/heroicons-outline-users-1.svg"
                          />
                        }
                        state="default"
                        type="menu-item"
                      />
                      <div className="relative self-stretch font-text-body3-medium font-[number:var(--text-body3-medium-font-weight)] text-[#a8a8aa] text-[length:var(--text-body3-medium-font-size)] leading-[var(--text-body3-medium-line-height)] text-center tracking-[var(--text-body3-medium-letter-spacing)] [font-style:var(--text-body3-medium-font-style)]">
                        도움말
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex-1 self-stretch grow bg-[#25282c]">
          <div className="absolute w-[1180px] h-[172px] top-7 left-[90px]">
            <div className="absolute w-[1180px] h-[150px] top-0 left-0 rounded-2xl bg-[linear-gradient(90deg,rgba(255,216,59,1)_0%,rgba(242,235,30,1)_50%,rgba(229,255,0,1)_100%)]" />

            <div className="absolute h-[34px] top-[58px] left-[464px] font-header-h2 font-[number:var(--header-h2-font-weight)] text-black text-[length:var(--header-h2-font-size)] leading-[var(--header-h2-line-height)] whitespace-nowrap text-center tracking-[var(--header-h2-letter-spacing)] [font-style:var(--header-h2-font-style)]">
              오늘은 어떻게 놀아볼까요?
            </div>

            <Tabs
              className="!rounded-[100px] !absolute !left-[464px] !bg-[#292c31] !top-32"
              darkMode
              override={
                <HeroiconsOutlineMusicalNote
                  className="!h-5 !relative !left-[unset] !w-5 !top-[unset]"
                  heroiconsOutline="https://c.animaapp.com/Nx4v5zU2/img/heroicons-outline-musical-note-1.svg"
                />
              }
              tabItem={
                <ImgWrapper
                  className="!h-5 !relative !left-[unset] !w-5 !top-[unset]"
                  heroiconsOutline="https://c.animaapp.com/Nx4v5zU2/img/heroicons-outline-photo-1.svg"
                />
              }
              tabItemStateSelectedTypeClassName="!rounded-[100px] !flex-[0_0_auto]"
              tabItemStateSelectedTypeClassNameOverride="!flex-[0_0_auto]"
              tabItemText="이미지 생성"
              tabItemText1="음원 생성"
              tabItemType="with-icon"
              tabItemType1="with-icon"
              visible={false}
              visible1={false}
              visible2={false}
            />
          </div>

          <div className="inline-flex flex-col items-start gap-7 absolute top-[271px] left-[90px]">
            <div className="relative w-fit mt-[-1.00px] bg-[linear-gradient(90deg,rgba(255,204,0,1)_0%,rgba(232,250,7,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] font-header-h4 font-[number:var(--header-h4-font-weight)] text-transparent text-[length:var(--header-h4-font-size)] leading-[var(--header-h4-line-height)] whitespace-nowrap text-center tracking-[var(--header-h4-letter-spacing)] [font-style:var(--header-h4-font-style)]">
              이미지 생성
            </div>

            <div className="flex w-[1180px] items-center gap-4 relative flex-[0_0_auto]">
              <div className="flex flex-col w-[283px] items-center justify-center gap-4 relative">
                <div className="flex flex-col w-[283px] h-[165px] items-center justify-center gap-2.5 p-6 relative rounded-2xl overflow-hidden [background:radial-gradient(50%_50%_at_50%_50%,rgba(192,236,245,1)_0%,rgba(238,242,219,1)_100%)]">
                  <img
                    className="absolute w-[75px] h-[89px] top-0 left-0 aspect-[1.1]"
                    alt="Kakaotalk photo"
                    src="https://c.animaapp.com/Nx4v5zU2/img/kakaotalk-photo-2025-09-13-23-39-14-1@2x.png"
                  />

                  <img
                    className="absolute w-[124px] h-[68px] top-0 left-[83px] aspect-[1.37] object-cover"
                    alt="Style transfer test"
                    src="https://c.animaapp.com/Nx4v5zU2/img/style-transfer-test@2x.png"
                  />

                  <img
                    className="absolute w-[78px] h-[68px] top-[97px] left-0 aspect-[1] object-cover"
                    alt="Sketch IDOL"
                    src="https://c.animaapp.com/Nx4v5zU2/img/sketch-idol@2x.png"
                  />

                  <img
                    className="absolute w-[124px] h-[89px] top-[76px] left-[83px] aspect-[0.67] object-cover"
                    alt="Yearbook IDOL"
                    src="https://c.animaapp.com/Nx4v5zU2/img/yearbook-idol@2x.png"
                  />

                  <img
                    className="absolute w-[71px] h-[102px] top-[63px] left-[212px] aspect-[1] object-cover"
                    alt="Style transfer"
                    src="https://c.animaapp.com/Nx4v5zU2/img/style-transfer-openai@2x.png"
                  />

                  <img
                    className="absolute w-[68px] h-[55px] top-0 left-[215px] object-cover"
                    alt="Style converted"
                    src="https://c.animaapp.com/Nx4v5zU2/img/style-converted-1@2x.png"
                  />
                </div>

                <div className="flex items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="relative w-fit mt-[-1.00px] font-text-body1-medium font-[number:var(--text-body1-medium-font-weight)] text-white text-[length:var(--text-body1-medium-font-size)] leading-[var(--text-body1-medium-line-height)] whitespace-nowrap text-center tracking-[var(--text-body1-medium-letter-spacing)] [font-style:var(--text-body1-medium-font-style)]">
                    디지털 굿즈
                  </div>
                </div>

                <div className="flex items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
                  <p className="relative w-fit mt-[-1.00px] [font-family:'Pretendard-Regular',Helvetica] font-normal text-[#a8a8aa] text-sm leading-[19.6px] whitespace-nowrap text-center tracking-[0]">
                    사진을 멋진 리얼리스틱 스케치로 변환
                  </p>
                </div>

                <Badge
                  className="!px-2 !py-1 !left-[237px] !absolute !bg-[#4f0089] !top-[7px]"
                  darkMode
                  divClassName="!tracking-[var(--label-regular-letter-spacing)] !text-[length:var(--label-regular-font-size)] ![font-style:var(--label-regular-font-style)] !font-[number:var(--label-regular-font-weight)] !font-label-regular !leading-[var(--label-regular-line-height)]"
                  filled
                  rounded={false}
                  text="New"
                  type="info"
                />
              </div>

              <div className="flex flex-col w-[283px] items-center justify-center gap-4 relative">
                <div className="border border-solid border-dark-modeborderprimary bg-[linear-gradient(90deg,rgba(192,236,245,1)_0%,rgba(242,235,30,1)_100%)] flex flex-col w-[283px] h-[165px] items-center justify-center gap-2.5 p-6 relative rounded-2xl overflow-hidden">
                  <img
                    className="absolute w-[143px] h-[165px] top-0 left-[140px] aspect-[0.51]"
                    alt="Kakaotalk photo"
                    src="https://c.animaapp.com/Nx4v5zU2/img/kakaotalk-photo-2025-09-13-16-52-51-removebg-preview@2x.png"
                  />

                  <img
                    className="absolute w-[138px] h-[165px] top-0 left-0.5 aspect-[0.49]"
                    alt="Element"
                    src="https://c.animaapp.com/Nx4v5zU2/img/3203cb13a8304c27fe21257592b7c2b9249000570ec31361dfc605ea@2x.png"
                  />

                  <div className="absolute w-0.5 h-[165px] top-0 left-[139px] bg-white" />

                  <Badge
                    className="!left-3.5 !absolute !bg-light-modebackgrounddefault !top-32"
                    darkMode={false}
                    divClassName="!text-[#202020] !tracking-[var(--text-body3-medium-letter-spacing)] !text-[length:var(--text-body3-medium-font-size)] ![font-style:var(--text-body3-medium-font-style)] !font-[number:var(--text-body3-medium-font-weight)] !font-text-body3-medium !leading-[var(--text-body3-medium-line-height)]"
                    filled
                    rounded={false}
                    text="before"
                    type="info"
                  />
                  <Badge
                    className="!left-[229px] !absolute !bg-light-modebackgrounddefault !top-32"
                    darkMode={false}
                    divClassName="!text-[#202020] !tracking-[var(--text-body3-medium-letter-spacing)] !text-[length:var(--text-body3-medium-font-size)] ![font-style:var(--text-body3-medium-font-style)] !font-[number:var(--text-body3-medium-font-weight)] !font-text-body3-medium !leading-[var(--text-body3-medium-line-height)]"
                    filled
                    rounded={false}
                    text="after"
                    type="info"
                  />
                </div>

                <div className="flex items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="relative w-fit mt-[-1.00px] font-text-body1-medium font-[number:var(--text-body1-medium-font-weight)] text-white text-[length:var(--text-body1-medium-font-size)] leading-[var(--text-body1-medium-line-height)] whitespace-nowrap text-center tracking-[var(--text-body1-medium-letter-spacing)] [font-style:var(--text-body1-medium-font-style)]">
                    스타일리스트
                  </div>
                </div>

                <div className="flex items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
                  <p className="relative w-fit mt-[-1.00px] [font-family:'Pretendard-Regular',Helvetica] font-normal text-[#a8a8aa] text-sm leading-[19.6px] whitespace-nowrap text-center tracking-[0]">
                    사진을 멋진 리얼리스틱 스케치로 변환
                  </p>
                </div>
              </div>

              <div className="flex flex-col w-[283px] items-center justify-center gap-4 relative">
                <div className="flex flex-col w-[283px] h-[165px] items-center justify-center gap-2.5 p-6 relative rounded-2xl overflow-hidden">
                  <img
                    className="relative w-[283px] h-[165px] mt-[-24.00px] mb-[-24.00px] ml-[-24.00px] mr-[-24.00px] aspect-[1.48] object-cover"
                    alt="Chatgpt image"
                    src="https://c.animaapp.com/Nx4v5zU2/img/chatgpt-image-2025----9----13----------02-47-46@2x.png"
                  />

                  <img
                    className="absolute w-[174px] h-7 top-[121px] left-[54px] aspect-[6.29] object-cover"
                    alt="Image"
                    src="https://c.animaapp.com/Nx4v5zU2/img/image-54@2x.png"
                  />
                </div>

                <div className="flex items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="relative w-fit mt-[-1.00px] font-text-body1-medium font-[number:var(--text-body1-medium-font-weight)] text-white text-[length:var(--text-body1-medium-font-size)] leading-[var(--text-body1-medium-line-height)] whitespace-nowrap text-center tracking-[var(--text-body1-medium-letter-spacing)] [font-style:var(--text-body1-medium-font-style)]">
                    온라인 팬미팅
                  </div>
                </div>

                <div className="flex items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
                  <p className="relative w-fit mt-[-1.00px] [font-family:'Pretendard-Regular',Helvetica] font-normal text-[#a8a8aa] text-sm leading-[19.6px] whitespace-nowrap text-center tracking-[0]">
                    사진을 멋진 리얼리스틱 스케치로 변환
                  </p>
                </div>

                <Badge
                  className="!px-2 !py-1 !left-[237px] !absolute !bg-[#4f0089] !top-[7px]"
                  darkMode
                  divClassName="!tracking-[var(--label-regular-letter-spacing)] !text-[length:var(--label-regular-font-size)] ![font-style:var(--label-regular-font-style)] !font-[number:var(--label-regular-font-weight)] !font-label-regular !leading-[var(--label-regular-line-height)]"
                  filled
                  rounded={false}
                  text="New"
                  type="info"
                />
              </div>

              <div className="flex flex-col w-[283px] items-center justify-center gap-4 relative">
                <div className="bg-[#202020] flex flex-col w-[283px] h-[165px] items-center justify-center gap-2.5 p-6 relative rounded-2xl overflow-hidden">
                  <div className="relative w-[283px] h-[191px] mt-[-37.00px] mb-[-24.00px] ml-[-24.00px] mr-[-24.00px] aspect-[1.48]" />

                  <div className="absolute w-[127px] h-[268px] -top-10 left-[-127px] aspect-[0.47]" />

                  <img
                    className="absolute w-[191px] h-[165px] top-0 left-[92px] aspect-[0.75] object-cover"
                    alt="Image"
                    src="https://c.animaapp.com/Nx4v5zU2/img/image-49@2x.png"
                  />

                  <div className="absolute w-[172px] h-[132px] top-[13px] left-[72px] rotate-[90.00deg] bg-[linear-gradient(360deg,rgba(32,32,32,1)_0%,rgba(32,32,32,0)_100%)]" />

                  <img
                    className="absolute w-[68px] h-[165px] top-0 left-3 aspect-[0.26] object-cover"
                    alt="Image"
                    src="https://c.animaapp.com/Nx4v5zU2/img/image-56@2x.png"
                  />

                  <img
                    className="absolute w-3.5 h-[15px] top-[87px] left-[39px]"
                    alt="Vector"
                    src="https://c.animaapp.com/Nx4v5zU2/img/vector-6.svg"
                  />
                </div>

                <div className="flex items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="relative w-fit mt-[-1.00px] font-text-body1-medium font-[number:var(--text-body1-medium-font-weight)] text-white text-[length:var(--text-body1-medium-font-size)] leading-[var(--text-body1-medium-line-height)] whitespace-nowrap text-center tracking-[var(--text-body1-medium-letter-spacing)] [font-style:var(--text-body1-medium-font-style)]">
                    가상 캐스팅
                  </div>
                </div>

                <div className="flex items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
                  <p className="relative w-fit mt-[-1.00px] [font-family:'Pretendard-Regular',Helvetica] font-normal text-[#a8a8aa] text-sm leading-[19.6px] whitespace-nowrap text-center tracking-[0]">
                    사진을 멋진 리얼리스틱 스케치로 변환
                  </p>
                </div>

                <Badge
                  className="!px-2 !py-1 !left-[237px] !absolute !bg-[#4f0089] !top-[7px]"
                  darkMode
                  divClassName="!tracking-[var(--label-regular-letter-spacing)] !text-[length:var(--label-regular-font-size)] ![font-style:var(--label-regular-font-style)] !font-[number:var(--label-regular-font-weight)] !font-label-regular !leading-[var(--label-regular-line-height)]"
                  filled
                  rounded={false}
                  text="New"
                  type="info"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
