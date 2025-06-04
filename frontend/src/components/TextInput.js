import React, { useState } from 'react';
import { FileText, Clipboard, RotateCcw } from 'lucide-react';

const TextInput = ({ 
  text, 
  onTextChange, 
  sampleTexts, 
  onSampleSelect, 
  disabled 
}) => {
  const [wordCount, setWordCount] = useState(0);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    onTextChange(newText);
    setWordCount(newText.trim().split(/\s+/).filter(word => word.length > 0).length);
  };

  const handleSampleSelect = (sampleId) => {
    const sample = sampleTexts.find(s => s.id === parseInt(sampleId));
    if (sample) {
      onSampleSelect(sample);
      setWordCount(sample.text.trim().split(/\s+/).filter(word => word.length > 0).length);
    }
  };

  const clearText = () => {
    onTextChange('');
    setWordCount(0);
  };

  const pasteFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      onTextChange(clipboardText);
      setWordCount(clipboardText.trim().split(/\s+/).filter(word => word.length > 0).length);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Sample Text Selector */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-chat-text flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          Quick Start - Sample Texts
        </label>
        <select
          onChange={(e) => handleSampleSelect(e.target.value)}
          disabled={disabled}
          className="w-full p-3 bg-chat-input border border-chat-border rounded-lg 
                     text-chat-text focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent disabled:opacity-50"
        >
          <option value="">Choose a sample text...</option>
          {sampleTexts.map((sample) => (
            <option key={sample.id} value={sample.id}>
              {sample.category} - {sample.title}
            </option>
          ))}
        </select>
      </div>

      {/* Text Input Area */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-chat-text">
            Input Text to Summarize
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">
              {wordCount} words
            </span>
            <button
              onClick={pasteFromClipboard}
              disabled={disabled}
              className="p-1 text-gray-400 hover:text-chat-text disabled:opacity-50"
              title="Paste from clipboard"
            >
              <Clipboard className="w-4 h-4" />
            </button>
            <button
              onClick={clearText}
              disabled={disabled}
              className="p-1 text-gray-400 hover:text-chat-text disabled:opacity-50"
              title="Clear text"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <textarea
          value={text}
          onChange={handleTextChange}
          disabled={disabled}
          placeholder="Paste your article, blog post, transcript, or any long-form text here (500-1000 words recommended)..."
          className="w-full h-64 p-4 bg-chat-input border border-chat-border rounded-lg 
                     text-chat-text placeholder-gray-400 resize-none
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent disabled:opacity-50"
          maxLength={10000}
        />
        
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>
            {text.length > 50 ? '✅' : '⚠️'} Minimum 50 characters required
          </span>
          <span>
            {text.length}/10,000 characters
          </span>
        </div>
      </div>
    </div>
  );
};

export default TextInput; 