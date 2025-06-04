import React from 'react';

const ModelSelector = ({ 
  models, 
  selectedModel, 
  onModelChange, 
  label, 
  disabled 
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-chat-text">
        {label}
      </label>
      <select
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        disabled={disabled}
        className="w-full p-3 bg-chat-input border border-chat-border rounded-lg 
                   text-chat-text focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">Select a model...</option>
        
        {models.closed_source && models.closed_source.length > 0 && (
          <optgroup label="🔒 Closed Source (API)">
            {models.closed_source.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </optgroup>
        )}
        
        {models.open_source && models.open_source.length > 0 && (
          <optgroup label="🔓 Open Source (Local)">
            {models.open_source.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </optgroup>
        )}
      </select>
    </div>
  );
};

export default ModelSelector; 