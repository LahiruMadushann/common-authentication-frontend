const AssessmentDetails = () => {
  const cards = [
    { title: '★未対応案件一覧', count: 1 },
    { title: '★対応中案件一覧', count: 5 },
    { title: '★アポ確定案件一覧', count: 1 },
    { title: '★成約済み案件一覧', count: 1 }
  ];

  return (
    
      <div className="grid grid-cols-2 gap-10 max-w-3xl mx-auto my-6">
        {cards.map((card, index) => (
          <div 
            key={index}
            className="bg-white rounded-lg shadow-md p-6 px-10 transform transition-transform hover:scale-105"
          >
            <div className="flex flex-col items-center space-y-4">
              <h2 className="text-gray-700 text-sm font-medium">
                {card.title}
              </h2>
              <p className="text-4xl font-bold text-gray-800">
                {card.count}
                <span className="text-2xl ml-1">件</span>
              </p>
            </div>
          </div>
        ))}
      </div>
  
  );
};

export default AssessmentDetails;