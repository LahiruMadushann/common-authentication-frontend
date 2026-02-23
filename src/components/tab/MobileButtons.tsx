const MobileButtons = ({ activeTab, setActiveTab }: any) => (
  <div className="mt-10 flex flex-col items-center ">
    <button
      className={`w-full py-4 px-4 text-center font-bold border border-gray-100  ${activeTab === 0 ? 'bg-gray-200 text-[#4A6D7C]' : 'bg-[#597C95] text-white'}`}
      onClick={() => setActiveTab(0)}>
      マッチング店舗情報
    </button>
    <button
      className={`w-full py-4 px-4 text-center font-bold border border-gray-100  ${activeTab === 1 ? 'bg-gray-200 text-[#4A6D7C]' : 'bg-[#597C95] text-white'}`}
      onClick={() => setActiveTab(1)}>
      査定依頼情報
    </button>
    <button
      className={`w-full py-4 px-4 text-center font-bold border border-gray-100  ${activeTab === 2 ? 'bg-gray-200 text-[#4A6D7C]' : 'bg-[#597C95] text-white'}`}
      onClick={() => setActiveTab(2)}>
      追加情報
    </button>
  </div>
);

export default MobileButtons;
