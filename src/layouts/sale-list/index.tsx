import SaleCard from './sale-card';

const SaleLayout = () => {
  const customerInfo = [
    { label: 'お名前', value: '中原 豊' },
    { label: '電話番号', value: '080-9791-0608' },
    { label: 'メールアドレス', value: 'nakahara0608@gmail.com' },
    { label: '郵便番号', value: '〒703-8235' },
    { label: '都道府県', value: '岡山県' },
    { label: '市区町村', value: '岡山市中区原尾島' },
  ];

  return (
    <div className='bg-[#F6F6F6] min-h-screen py-10 px-4'>
      <div className='max-w-[1000px] mx-auto'>
        <div className="flex justify-center mb-10">
          <h1 className="text-xl lg:text-[23px] font-bold text-[#597C95] tracking-[0.2em]">
            問い合わせ車両
          </h1>
        </div>

        <div className="space-y-4 mb-16">
          <SaleCard />
          <SaleCard />
        </div>

        <div className="flex justify-center mb-8">
          <h2 className="text-xl lg:text-[22px] font-bold text-[#597C95] tracking-[0.1em]">
            お客様情報
          </h2>
        </div>

        <div className="bg-white border border-gray-100 rounded shadow-sm p-6 md:p-10 max-w-[800px] mx-auto">
          <table className="w-full text-left text-[13px] md:text-[14px]">
            <tbody className="divide-y divide-gray-100">
              {customerInfo.map((item, index) => (
                <tr key={index}>
                  <td className="py-4 font-bold text-gray-600 w-1/3 md:w-1/4">
                    {item.label}
                  </td>
                  <td className="py-4 text-gray-800">
                    {item.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SaleLayout;
