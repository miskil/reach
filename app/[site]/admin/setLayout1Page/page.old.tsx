// app/templates/page.tsx
"use client";

import React, { useState } from "react";
import templates from "../../../../components/ui/custom/templates/index";

const TemplateSelector: React.FC = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );

  const handleTemplateSelect = (id: string) => {
    setSelectedTemplateId(id);
  };

  const SelectedTemplate = selectedTemplateId
    ? templates.find((template) => template.id === selectedTemplateId)
        ?.component
    : null;

  return (
    <div className="flex flex-col items-center p-6">
      <Layout1Template />
      <h1 className="text-3xl font-bold mb-6">Select a Template</h1>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="border rounded-lg p-4 cursor-pointer hover:shadow-lg"
            onClick={() => handleTemplateSelect(template.id)}
          >
            <img
              src={template.previewImage}
              alt={template.name}
              className="w-15 h-20 object-cover mb-2"
            />
            <h2 className="text-sm font-bold">{template.name}</h2>
            <p className="text-gray-600 text-sm">{template.description}</p>
          </div>
        ))}
      </div>
      <div className="w-full border-t pt-6">
        {SelectedTemplate ? (
          <SelectedTemplate />
        ) : (
          <p className="text-gray-500">Select a template to see a preview.</p>
        )}
      </div>
    </div>
  );
};

export default TemplateSelector;
