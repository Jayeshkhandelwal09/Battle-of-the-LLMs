import React from 'react';
import { Clock, Copy, Check } from 'lucide-react';

const SummaryComparison = ({ 
  results, 
  loading, 
  onRatingChange, 
  ratings 
}) => {
  const [copiedStates, setCopiedStates] = React.useState({});

  const copyToClipboard = async (text, summaryId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [summaryId]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [summaryId]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const formatProcessingTime = (time) => {
    return time ? `${time}s` : '-';
  };

  const StarRating = ({ rating, onRatingChange, disabled }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => !disabled && onRatingChange(star)}
            disabled={disabled}
            className={`w-5 h-5 transition-colors ${
              star <= rating 
                ? 'text-yellow-400' 
                : 'text-gray-600 hover:text-yellow-300'
            } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
        {[1, 2].map((i) => (
          <div key={i} className="bg-chat-input border border-chat-border rounded-lg p-6">
            <div className="h-4 bg-gray-600 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-600 rounded"></div>
              <div className="h-3 bg-gray-600 rounded w-5/6"></div>
              <div className="h-3 bg-gray-600 rounded w-4/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center text-gray-400 py-12">
        <div className="text-6xl mb-4">⚔️</div>
        <h3 className="text-xl font-semibold mb-2">Ready for Battle!</h3>
        <p>Select your models and input text to compare summaries</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-chat-text mb-2">Battle Results</h2>
        <p className="text-gray-400">
          {results.word_count} words • {results.text_length} characters
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model 1 Summary */}
        <div className="bg-chat-input border border-chat-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-chat-text">
                {results.model1.model_name}
              </h3>
              <div className="flex items-center text-sm text-gray-400 mt-1">
                <Clock className="w-4 h-4 mr-1" />
                {formatProcessingTime(results.model1.processing_time)}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {results.model1.success && (
                <span className="text-green-400 text-sm">✅</span>
              )}
              <button
                onClick={() => copyToClipboard(results.model1.summary, 'model1')}
                className="p-2 text-gray-400 hover:text-chat-text"
                title="Copy summary"
              >
                {copiedStates.model1 ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-chat-text leading-relaxed whitespace-pre-wrap">
              {results.model1.summary}
            </p>
          </div>

          {/* Rating Section for Model 1 */}
          <div className="border-t border-chat-border pt-4 space-y-3">
            <h4 className="text-sm font-medium text-chat-text">Rate this summary:</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Clarity</span>
                <StarRating
                  rating={ratings.model1?.clarity || 0}
                  onRatingChange={(rating) => onRatingChange('model1', 'clarity', rating)}
                  disabled={!results.model1.success}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Accuracy</span>
                <StarRating
                  rating={ratings.model1?.accuracy || 0}
                  onRatingChange={(rating) => onRatingChange('model1', 'accuracy', rating)}
                  disabled={!results.model1.success}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Conciseness</span>
                <StarRating
                  rating={ratings.model1?.conciseness || 0}
                  onRatingChange={(rating) => onRatingChange('model1', 'conciseness', rating)}
                  disabled={!results.model1.success}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Model 2 Summary */}
        <div className="bg-chat-input border border-chat-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-chat-text">
                {results.model2.model_name}
              </h3>
              <div className="flex items-center text-sm text-gray-400 mt-1">
                <Clock className="w-4 h-4 mr-1" />
                {formatProcessingTime(results.model2.processing_time)}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {results.model2.success && (
                <span className="text-green-400 text-sm">✅</span>
              )}
              <button
                onClick={() => copyToClipboard(results.model2.summary, 'model2')}
                className="p-2 text-gray-400 hover:text-chat-text"
                title="Copy summary"
              >
                {copiedStates.model2 ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-chat-text leading-relaxed whitespace-pre-wrap">
              {results.model2.summary}
            </p>
          </div>

          {/* Rating Section for Model 2 */}
          <div className="border-t border-chat-border pt-4 space-y-3">
            <h4 className="text-sm font-medium text-chat-text">Rate this summary:</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Clarity</span>
                <StarRating
                  rating={ratings.model2?.clarity || 0}
                  onRatingChange={(rating) => onRatingChange('model2', 'clarity', rating)}
                  disabled={!results.model2.success}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Accuracy</span>
                <StarRating
                  rating={ratings.model2?.accuracy || 0}
                  onRatingChange={(rating) => onRatingChange('model2', 'accuracy', rating)}
                  disabled={!results.model2.success}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Conciseness</span>
                <StarRating
                  rating={ratings.model2?.conciseness || 0}
                  onRatingChange={(rating) => onRatingChange('model2', 'conciseness', rating)}
                  disabled={!results.model2.success}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Preference */}
      {results.model1.success && results.model2.success && (
        <div className="bg-chat-input border border-chat-border rounded-lg p-6">
          <h4 className="text-lg font-semibold text-chat-text mb-4">Overall Preference</h4>
          <div className="flex items-center justify-center space-x-6">
            <button
              onClick={() => onRatingChange('overall', 'preference', 'model1')}
              className={`px-6 py-3 rounded-lg border transition-colors ${
                ratings.overall?.preference === 'model1'
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'border-chat-border text-gray-300 hover:border-blue-500'
              }`}
            >
              {results.model1.model_name}
            </button>
            <span className="text-gray-400">vs</span>
            <button
              onClick={() => onRatingChange('overall', 'preference', 'model2')}
              className={`px-6 py-3 rounded-lg border transition-colors ${
                ratings.overall?.preference === 'model2'
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'border-chat-border text-gray-300 hover:border-blue-500'
              }`}
            >
              {results.model2.model_name}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryComparison; 