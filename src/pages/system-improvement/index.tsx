import useBodyClass from '@/src/hooks/useBodyClass';
import SystemImprovementLayout from '@/src/layouts/system-improvement';
import React from 'react';

function SystemImprovementPage() {
  useBodyClass('white');

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-normal text-center mb-8 sm:mb-12">
          システム改善要望
        </h1>
        <div className="max-w-7xl mx-auto">
          <SystemImprovementLayout />
        </div>
      </div>
    </div>
  );
}

export default SystemImprovementPage;