import React from 'react';

const PageLoader: React.FC = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-sm font-medium text-slate-500 tracking-wide">Loading...</span>
    </div>
  </div>
);

export default PageLoader;
