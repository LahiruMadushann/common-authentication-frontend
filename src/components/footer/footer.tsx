const links = [
  { text: 'プライバシーポリシー', to: 'https://ctn-net.jp/kaitori/car/privacypolicy/' },
  { text: '利用規約', to: 'https://ctn-net.jp/kaitori/car/terms/' },
  { text: '反社会的勢力に対する基本方針', to: 'https://ctn-net.jp/kaitori/car/anti_society/' },
  { text: '運営会社', to: 'https://www.ctn-net.jp/' },
  { text: '買取店様はこちら', to: 'https://ctn-net.jp/kaitori/car/contact/' },
  { text: '掲載メディア', to: 'https://ctn-net.jp/kaitori/car/media/' }
];

export const Footer = () => {
  return (
    <>
      <div className=" w-full md:h-full md:py-[20px] lg:py-0 lg:h-[100px] bg-black flex flex-col items-center justify-center md:gap-4">
        {/* <div className=" hidden lg:flex items-center justify-center gap-4">
          {links.map((link) => (
            <a
              key={link.text}
              className=" text-white border-r-2 border-white pr-4 text-[14px] hover:"
              href={link.to}
              target="_blank"
              rel="noopener noreferrer">
              {link.text}
            </a>
          ))}
        </div> */}
        <div className=" flex-col items-center  justify-center gap-4 hidden md:flex lg:hidden">
          {links.map((link) => (
            <a
              key={link.text}
              className=" text-white text-[14px]"
              href={link.to}
              target="_blank"
              rel="noopener noreferrer">
              {link.text}
            </a>
          ))}
        </div>
        <div className=" w-full grid grid-cols-2  md:hidden">
          {links.map((link) => (
            <a
              key={link.text}
              className=" text-white border-[1px] border-white text-center text-[11px] w-full py-2 md:text-[14px]"
              href={link.to}
              target="_blank"
              rel="noopener noreferrer">
              {link.text}
            </a>
          ))}
        </div>
        <h3 className=" w-full text-center text-[7px] md:text-sm text-white py-2 pb-2">
          Copyright © {new Date().getFullYear()} CTN Co., Ltd.. All Rights Reserved
        </h3>
      </div>
    </>
  );
};
