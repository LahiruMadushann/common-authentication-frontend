const TabButtons = ({ activeTab, setActiveTab }: any) => (
  <div className="flex w-full border-b-2 border-gray-200">
    {/* Matching Store Information */}
    <label
      className={`flex-1 text-center cursor-pointer transition-colors duration-300 ease-in-out px-6 py-4 ${
        activeTab === 0
          ? 'bg-white text-[#4A6D7C] font-semibold border-t border-l border-r' // Active Tab: White background, blue text, border
          : 'bg-[#597C95] text-white hover:bg-[#4A6D7C]  border border-white'
      }`}
      style={{ borderBottom: activeTab === 0 ? 'none' : '1px solid #4A6D7C' }}>
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="sr-only"
        aria-label="Matching Store Information"
        defaultChecked
        onClick={() => setActiveTab(0)}
      />
      <p
        className={`"text-lg sm:text-sm md:text-base lg:text-lg ${activeTab === 1 ? 'text-white' : ' text-[#597C95]'}"`}>
        マッチング店舗情報
      </p>
    </label>

    {/* Assessment Request Information */}
    <label
      className={`flex-1 text-center cursor-pointer transition-colors duration-300 ease-in-out px-6 py-4 ${
        activeTab === 1
          ? 'bg-white text-[#4A6D7C] font-semibold border-t border-l border-r' // Active Tab
          : 'bg-[#597C95] text-white hover:bg-[#4A6D7C] border border-white' // Inactive Tab
      }`}
      style={{ borderBottom: activeTab === 1 ? 'none' : '1px solid #4A6D7C' }}>
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="sr-only"
        aria-label="Assessment Request Information"
        onClick={() => setActiveTab(1)}
      />
      <p
        className={`"text-lg sm:text-sm md:text-base lg:text-lg ${activeTab === 1 ? 'text-white' : ' text-[#597C95]'}"`}>
        査定依頼情報
      </p>
    </label>

    {/* Additional Information */}
    <label
      className={`flex-1 text-center cursor-pointer transition-colors duration-300 ease-in-out px-6 py-4 ${
        activeTab === 2
          ? 'bg-white text-[#4A6D7C] font-semibold border-t border-l border-r' // Active Tab
          : 'bg-[#597C95] text-white hover:bg-[#4A6D7C] border border-white' // Inactive Tab
      }`}
      style={{ borderBottom: activeTab === 2 ? 'none' : '1px solid #4A6D7C' }}>
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="sr-only"
        aria-label="Additional Information"
        onClick={() => setActiveTab(2)}
      />
      <p
        className={`"text-lg sm:text-sm md:text-base lg:text-lg ${activeTab === 1 ? 'text-white' : ' text-[#597C95]'}"`}>
        追加情報
      </p>
    </label>
  </div>
);
export default TabButtons;
