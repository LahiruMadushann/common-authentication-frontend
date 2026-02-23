export const DeskotpTabButtons = ({ activeTab, setActiveTab }: any) => (
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
        車両情報
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
        写真
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
        ユーザーとメッセージ
      </p>
    </label>
  </div>
);

export const MobileTabButtons = ({ activeTab, setActiveTab }: any) => (
  <div className="mt-10 flex flex-col items-center ">
    <button
      className={`w-full py-4 px-4 text-center font-bold border border-gray-100  ${activeTab === 0 ? 'bg-gray-200 text-[#4A6D7C]' : 'bg-[#597C95] text-white'}`}
      onClick={() => setActiveTab(0)}>
      車両情報
    </button>
    <button
      className={`w-full py-4 px-4 text-center font-bold border border-gray-100  ${activeTab === 1 ? 'bg-gray-200 text-[#4A6D7C]' : 'bg-[#597C95] text-white'}`}
      onClick={() => setActiveTab(1)}>
      写真
    </button>
    <button
      className={`w-full py-4 px-4 text-center font-bold border border-gray-100 ${activeTab === 2 ? 'bg-gray-200 text-[#4A6D7C]' : 'bg-[#597C95] text-white'}`}
      onClick={() => setActiveTab(2)}>
      ユーザーとメッセージ
    </button>
  </div>
);

