// src/components/TailwindExample.tsx
import React from 'react';

const TailwindExample: React.FC = () => {
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-secondary">Tailwind CSS Example</h2>
      <p className="text-gray-600">
        This component is styled using Tailwind utility classes.
      </p>
      <button className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-75 transition-colors">
        Primary Button
      </button>
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-light">
        <p className="text-sm text-gray-500">Container with brand gray-light background.</p>
      </div>
    </div>
  );
};

export default TailwindExample;
