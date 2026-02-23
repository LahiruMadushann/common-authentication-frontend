import React from 'react';

interface Reviews {
  starValue: number;
  starSupport: number;
  starRecommendation: number;
}

interface StarIconProps {
  filled: boolean;
  partialFill?: number;
}

interface ReviewStarsProps {
  value: number;
  maxStars?: number;
}

const StarIcon: React.FC<StarIconProps> = ({ filled, partialFill = 0 }) => {
  return (
    <div className="relative w-5 h-5 inline-block">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-full h-full absolute"
        fill="#E5E7EB">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>

      {(filled || partialFill > 0) && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-full h-full absolute"
          fill="#FBBF24"
          style={{
            clipPath:
              partialFill > 0
                ? `polygon(0 0, ${partialFill}% 0, ${partialFill}% 100%, 0 100%)`
                : 'none'
          }}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )}
    </div>
  );
};

const ReviewStars: React.FC<ReviewStarsProps> = ({ value, maxStars = 5 }) => {
  return (
    <div className="flex gap-1">
      {[...Array(maxStars)].map((_, index) => {
        const isFilledStar = index < Math.floor(value);
        const isPartialStar = index === Math.floor(value) && value % 1 !== 0;
        const partialFillPercentage = isPartialStar ? (value % 1) * 100 : 0;

        return (
          <StarIcon
            key={index}
            filled={isFilledStar}
            partialFill={isPartialStar ? partialFillPercentage : 0}
          />
        );
      })}
    </div>
  );
};

interface ShopReviewRatingsProps {
  reviews: Reviews;
  isBuyer: boolean;
}

const ShopReviewRatings: React.FC<ShopReviewRatingsProps> = ({ reviews, isBuyer }) => {
  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">口コミ評価</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">査定価格</span>
          <ReviewStars value={reviews.starValue} />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-700">連絡・対応</span>
          <ReviewStars value={reviews.starSupport} />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-700">おすすめ度</span>
          <ReviewStars value={reviews.starRecommendation} />
        </div>
      </div>
{/* {!isBuyer && (
      <div className="mt-4 text-right">
        <a href="#" className="text-blue-600 hover:underline">
          口コミを見る ＞
        </a>
      </div>
      )} */}
    </div>
  );
};

export default ShopReviewRatings;
