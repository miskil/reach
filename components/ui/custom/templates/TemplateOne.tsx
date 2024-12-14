import React from "react";

const TemplateOne: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 h-full">
      <header className="w-full bg-blue-500 text-white text-center p-4">
        <h1 className="text-2xl">Header Text</h1>
      </header>
      <main className="flex-grow w-full text-center p-4">
        <p>Main Content Area</p>
      </main>
      <footer className="w-full bg-gray-800 text-white text-center p-4">
        <p>Footer Text</p>
      </footer>
    </div>
  );
};

export default TemplateOne;
