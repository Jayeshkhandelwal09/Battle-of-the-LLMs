import React from 'react';
import { BarChart3 } from 'lucide-react';

const RatingChart = ({ ratings, results }) => {
  const calculateAverage = (modelRatings) => {
    if (!modelRatings) return 0;
    const values = [
      modelRatings.clarity || 0,
      modelRatings.accuracy || 0,
      modelRatings.conciseness || 0
    ].filter(v => v > 0);
    
    return values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : 0;
  };

  const model1Avg = calculateAverage(ratings.model1);
  const model2Avg = calculateAverage(ratings.model2);

  const categories = ['Clarity', 'Accuracy', 'Conciseness'];

  if (!results || (!ratings.model1 && !ratings.model2)) {
    return null;
  }

  return (
    <div className="bg-chat-input border border-chat-border rounded-lg p-6">
      <div className="flex items-center mb-6">
        <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
        <h3 className="text-lg font-semibold text-chat-text">Rating Comparison</h3>
      </div>

      {/* Overall Averages */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-chat-bg rounded-lg">
          <div className="text-2xl font-bold text-blue-400">{model1Avg}</div>
          <div className="text-sm text-gray-400">{results.model1.model_name}</div>
          <div className="text-xs text-gray-500">Average Score</div>
        </div>
        <div className="text-center p-4 bg-chat-bg rounded-lg">
          <div className="text-2xl font-bold text-green-400">{model2Avg}</div>
          <div className="text-sm text-gray-400">{results.model2.model_name}</div>
          <div className="text-xs text-gray-500">Average Score</div>
        </div>
      </div>

      {/* Detailed Comparison */}
      <div className="space-y-4">
        {categories.map((category) => {
          const key = category.toLowerCase();
          const model1Score = ratings.model1?.[key] || 0;
          const model2Score = ratings.model2?.[key] || 0;

          return (
            <div key={category} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">{category}</span>
                <div className="flex space-x-4">
                  <span className="text-blue-400">{model1Score}/5</span>
                  <span className="text-green-400">{model2Score}/5</span>
                </div>
              </div>
              
              <div className="flex space-x-2 h-3">
                {/* Model 1 Bar */}
                <div className="flex-1 bg-gray-700 rounded-l">
                  <div
                    className="h-full bg-blue-400 rounded-l transition-all duration-300"
                    style={{ width: `${(model1Score / 5) * 100}%` }}
                  ></div>
                </div>
                
                {/* Model 2 Bar */}
                <div className="flex-1 bg-gray-700 rounded-r">
                  <div
                    className="h-full bg-green-400 rounded-r transition-all duration-300"
                    style={{ width: `${(model2Score / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Preference */}
      {ratings.overall?.preference && (
        <div className="mt-6 pt-4 border-t border-chat-border">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">Overall Preference</div>
            <div className="text-lg font-semibold text-chat-text">
              🏆 {ratings.overall.preference === 'model1' 
                   ? results.model1.model_name 
                   : results.model2.model_name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingChart; 