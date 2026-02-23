import React from 'react';

const ShopLayoutSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto mt-4 p-4">
      <div>
        <p className="text-2xl md:text-3xl lg:text-3xl font-bold bg-gray-300 text-gray-300 skeleton">
          Loading...
        </p>
        <p className="mt-2 text-sm md:text-base lg:text-lg bg-gray-300 text-gray-300 skeleton">
          Loading...
        </p>
      </div>
      <div className="mt-4 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="avatar w-full md:w-1/2 lg:w-1/2 rounded overflow-hidden bg-gray-300 skeleton h-60">
          <img
            src="https://ctn-uploads.s3.ap-northeast-1.amazonaws.com/buyerportal-assets/placeholder-ctn-car-image.png"
            alt="Skeleton Image"
            className="w-full h-full object-cover opacity-0"
          />
        </div>
        <div className="w-full md:w-1/2 lg:w-1/2">
          <h3 className="text-lg md:text-xl font-bold bg-gray-300 text-gray-300 skeleton">
            Loading...
          </h3>
          <table className="mt-2 w-full text-sm md:text-base lg:text-lg">
            <tbody>
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <tr key={index}>
                    <td className="pr-4 bg-gray-300 text-gray-300 skeleton">Loading...</td>
                    <td className="bg-gray-300 text-gray-300 skeleton">Loading...</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-full md:w-1/2 lg:w-1/3 bg-gray-300 text-gray-300 skeleton">
          Loading...
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3 bg-gray-300 text-gray-300 skeleton">
          Loading...
        </div>
      </div>
      <div className="mt-8 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-full md:w-1/2 lg:w-1/3 bg-gray-300 text-gray-300 skeleton h-12"></div>
        <div className="w-full md:w-1/2 lg:w-1/3 bg-gray-300 text-gray-300 skeleton h-12"></div>
      </div>
    </div>
  );
};

export default ShopLayoutSkeleton;
