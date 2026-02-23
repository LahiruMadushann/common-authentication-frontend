import { Minus, PlusIcon } from 'lucide-react';
import { useState } from 'react';

const regions = [
  {
    name: '北海道/東北地方',
    prefectures: [
      { label: '北海道', link: 'https://ctn-net.jp/kaitori/car/column/area-hokkaido/' },
      { label: '青森県', link: 'https://ctn-net.jp/kaitori/car/column/area-aomori/' },
      { label: '岩手県', link: 'https://ctn-net.jp/kaitori/car/column/area-iwate/' },
      { label: '秋田県', link: 'https://ctn-net.jp/kaitori/car/column/area-akita/' },
      { label: '宮城県', link: 'https://ctn-net.jp/kaitori/car/column/area-miyagi/' },
      { label: '山形県', link: 'https://ctn-net.jp/kaitori/car/column/area-yamagata/' },
      { label: '福島県', link: 'https://ctn-net.jp/kaitori/car/column/area-fukushima/' }
    ]
  },
  {
    name: '関東地方',
    prefectures: [
      { label: '東京都', link: 'https://ctn-net.jp/kaitori/car/column/area-tokyo/' },
      { label: '神奈川県', link: 'https://ctn-net.jp/kaitori/car/column/area-kanagawa/' },
      { label: '埼玉県', link: 'https://ctn-net.jp/kaitori/car/column/area-saitama/' },
      { label: '千葉県', link: 'https://ctn-net.jp/kaitori/car/column/area-chiba/' },
      { label: '茨城県', link: 'https://ctn-net.jp/kaitori/car/column/area-ibaraki/' },
      { label: '栃木県', link: 'https://ctn-net.jp/kaitori/car/column/area-tochigi/' },
      { label: '群馬県', link: 'https://ctn-net.jp/kaitori/car/column/area-gunma/' }
    ]
  },
  {
    name: '北陸/甲信越地方',
    prefectures: [
      { label: '新潟県', link: 'https://ctn-net.jp/kaitori/car/column/area-niigata/' },
      { label: '山梨県', link: 'https://ctn-net.jp/kaitori/car/column/area-yamanashi/' },
      { label: '長野県', link: 'https://ctn-net.jp/kaitori/car/column/area-nagano/' },
      { label: '富山県', link: 'https://ctn-net.jp/kaitori/car/column/area-toyama/' },
      { label: '石川県', link: 'https://ctn-net.jp/kaitori/car/column/area-ishikawa/' },
      { label: '福井県', link: 'https://ctn-net.jp/kaitori/car/column/area-hukui/' }
    ]
  },
  {
    name: '東海地方',
    prefectures: [
      { label: '愛知県', link: 'https://ctn-net.jp/kaitori/car/column/area-aichi/' },
      { label: '岐阜県', link: 'https://ctn-net.jp/kaitori/car/column/area-gifu/' },
      { label: '静岡県', link: 'https://ctn-net.jp/kaitori/car/column/area-sizuoka/' },
      { label: '三重県', link: 'https://ctn-net.jp/kaitori/car/column/area-mie/' }
    ]
  },
  {
    name: '近畿地方',
    prefectures: [
      { label: '大阪府', link: 'https://ctn-net.jp/kaitori/car/column/area-osaka/' },
      { label: '兵庫県', link: 'https://ctn-net.jp/kaitori/car/column/area-hyougo/' },
      { label: '京都府', link: 'https://ctn-net.jp/kaitori/car/column/area-kyoto/' },
      { label: '奈良県', link: 'https://ctn-net.jp/kaitori/car/column/area-nara/' },
      { label: '滋賀県', link: 'https://ctn-net.jp/kaitori/car/column/area-shiga/' },
      { label: '和歌山県', link: 'https://ctn-net.jp/kaitori/car/column/area-wakayama/' }
    ]
  },
  {
    name: '中国地方',
    prefectures: [
      { label: '山口県', link: 'https://ctn-net.jp/kaitori/car/column/area-yamaguthi/' },
      { label: '広島県', link: 'https://ctn-net.jp/kaitori/car/column/area-hiroshima/' },
      { label: '岡山県', link: 'https://ctn-net.jp/kaitori/car/column/area-okayama/' },
      { label: '鳥取県', link: 'https://ctn-net.jp/kaitori/car/column/area-tottori/' },
      { label: '島根県', link: 'https://ctn-net.jp/kaitori/car/column/area-shimane/' }
    ]
  },
  {
    name: '四国地方',
    prefectures: [
      { label: '徳島県', link: 'https://ctn-net.jp/kaitori/car/column/area-tokushima/' },
      { label: '香川県', link: 'https://ctn-net.jp/kaitori/car/column/area-kagawa/' },
      { label: '愛媛県', link: 'https://ctn-net.jp/kaitori/car/column/area-ehime/' },
      { label: '高知県', link: 'https://ctn-net.jp/kaitori/car/column/area-kouchi/' }
    ]
  },
  {
    name: '九州地方/沖縄',
    prefectures: [
      { label: '福岡県', link: 'https://ctn-net.jp/kaitori/car/column/area-fukuoka/' },
      { label: '佐賀県', link: 'https://ctn-net.jp/kaitori/car/column/area-saga/' },
      { label: '長崎県', link: 'https://ctn-net.jp/kaitori/car/column/area-nagasaki/' },
      { label: '熊本県', link: 'https://ctn-net.jp/kaitori/car/column/area-kumamoto/' },
      { label: '大分県', link: 'https://ctn-net.jp/kaitori/car/column/area-ooita/' },
      { label: '宮崎県', link: 'https://ctn-net.jp/kaitori/car/column/area-miyazaki/' },
      { label: '鹿児島県', link: 'https://ctn-net.jp/kaitori/car/column/area-kagoshima/' },
      { label: '沖縄県', link: 'https://ctn-net.jp/kaitori/car/column/area-okinawa/' }
    ]
  }
];

export const RegionSelector = () => {
  return (
    <div
      className=" max-h-[955px] text-white  font-sans bg-cover bg-center bg-no-repeat mt-4 "
      style={{ backgroundImage: "url('/areabg.png')" }}>
      <div className="bg-[#474747] bg-opacity-55">
        <div className="  text-white  font-sans flex items-center flex-col  p-8">
          <h1 className="text-[2rem] mb-[80px] text-center">高価買取店を地域から探す</h1>
          <div className="grid grid-cols-4 gap-x-10 xl:gap-x-20 items-start !justify-center gap-y-10">
            {regions?.map((region, index) => (
              <div key={index} className="space-y-2 ">
                <h2 className="font-bold mb-2  text-[20px] xl:text-[25px] py-2">{region.name}</h2>
                <ul className="flex flex-col py-2 ">
                  {region?.prefectures?.map((prefecture, prefIndex) => (
                    <a
                      key={prefIndex}
                      href={prefecture.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" text-[20px] xl:text-[25px] w-fit hover:text-orange-600">
                      {prefecture.label}
                    </a>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const MobileRegionSelector = () => {
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});

  const toggleRegion = (regionName: string) => {
    setExpandedRegions((prev) => ({
      ...prev,
      [regionName]: !prev[regionName]
    }));
  };

  return (
    <div className=" mx-auto pt-[30px] bg-[#474747]  shadow-md  overflow-hidden mt-4 pb-6">
      <h2 className="text-xl font-bold p-4 text-center text-white">高価買取店を地域から探す</h2>
      <ul className="px-4 py-4">
        {regions?.map((region) => (
          <li key={region.name} className="border-t-2  border-white text-white   last:border-b-2">
            <button
              onClick={() => toggleRegion(region.name)}
              className="w-full p-4 text-left flex  items-center gap-4 focus:outline-none ">
              {expandedRegions[region.name] ? (
                <Minus className="w-5 h-5 text-white font-bold " />
              ) : (
                <PlusIcon className="w-5 h-5 text-white font-bold " />
              )}
              <span className="font-bold">{region.name}</span>
            </button>
            <div className={`transition-all duration-300 ${expandedRegions[region.name] ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
              {expandedRegions[region.name] && (
                <ul className=" bg-transparent py-2">
                  {region?.prefectures?.map((prefecture, prefIndex) => (
                    <li key={prefIndex} className="border-t-2  border-white text-white    py-2 ">
                      <a
                        href={prefecture.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className=" text-[14px] w-fit hover:text-orange-600">
                        {prefecture.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
