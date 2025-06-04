import React, { useState, useEffect } from 'react';
import { Bot, Zap, Settings, MessageSquare } from 'lucide-react';
import ModelSelector from './components/ModelSelector';
import TextInput from './components/TextInput';
import SummaryComparison from './components/SummaryComparison';
import RatingChart from './components/RatingChart';
import { 
  getAvailableModels, 
  getSampleTexts, 
  compareSummaries,
  clearModelCache,
  healthCheck 
} from './services/api';

function App() {
  const [models, setModels] = useState({ closed_source: [], open_source: [] });
  const [sampleTexts, setSampleTexts] = useState([]);
  const [selectedModel1, setSelectedModel1] = useState('');
  const [selectedModel2, setSelectedModel2] = useState('');
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [error, setError] = useState('');
  const [ratings, setRatings] = useState({
    model1: {},
    model2: {},
    overall: {}
  });

  // Initialize app data
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check backend health
      await healthCheck();
      setBackendStatus('connected');

      // Load models and sample texts
      const [modelsData, textsData] = await Promise.all([
        getAvailableModels(),
        getSampleTexts()
      ]);

      setModels(modelsData);
      setSampleTexts(textsData);
    } catch (err) {
      setBackendStatus('error');
      setError('Failed to connect to backend. Please make sure the Flask server is running on port 5001.');
    }
  };

  const handleSampleSelect = (sample) => {
    setInputText(sample.text);
    setResults(null);
    setRatings({ model1: {}, model2: {}, overall: {} });
  };

  const handleCompare = async () => {
    if (!selectedModel1 || !selectedModel2) {
      setError('Please select both models');
      return;
    }

    if (inputText.length < 50) {
      setError('Please enter at least 50 characters of text');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);
    setRatings({ model1: {}, model2: {}, overall: {} });

    try {
      const data = await compareSummaries(inputText, selectedModel1, selectedModel2);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (model, dimension, rating) => {
    setRatings(prev => ({
      ...prev,
      [model]: {
        ...prev[model],
        [dimension]: rating
      }
    }));
  };

  const handleClearCache = async () => {
    try {
      await clearModelCache();
      alert('Model cache cleared successfully!');
    } catch (err) {
      alert('Failed to clear cache: ' + err.message);
    }
  };

  const canCompare = selectedModel1 && selectedModel2 && inputText.length >= 50;

  if (backendStatus === 'checking') {
    return (
      <div className="min-h-screen bg-chat-bg flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-12 h-12 mx-auto mb-4 animate-pulse text-blue-400" />
          <p className="text-chat-text">Connecting to Battle API...</p>
        </div>
      </div>
    );
  }

  if (backendStatus === 'error') {
    return (
      <div className="min-h-screen bg-chat-bg flex items-center justify-center p-4">
        <div className="max-w-md text-center bg-chat-input border border-red-500 rounded-lg p-6">
          <Bot className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-semibold text-chat-text mb-2">Backend Connection Failed</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={initializeApp}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chat-bg">
      {/* Header */}
      <header className="bg-chat-sidebar border-b border-chat-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-chat-text">Battle of the LLMs</h1>
                <p className="text-sm text-gray-400">Compare AI model summaries side by side</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-xs px-2 py-1 bg-green-600 text-white rounded-full">
                Connected
              </span>
              <button
                onClick={handleClearCache}
                className="p-2 text-gray-400 hover:text-chat-text"
                title="Clear model cache"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Model Selection */}
        <div className="bg-chat-input border border-chat-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-chat-text mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Choose Your Fighters
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModelSelector
              models={models}
              selectedModel={selectedModel1}
              onModelChange={setSelectedModel1}
              label="Fighter 1"
              disabled={loading}
            />
            <ModelSelector
              models={models}
              selectedModel={selectedModel2}
              onModelChange={setSelectedModel2}
              label="Fighter 2"
              disabled={loading}
            />
          </div>
        </div>

        {/* Text Input */}
        <div className="bg-chat-input border border-chat-border rounded-lg p-6">
          <TextInput
            text={inputText}
            onTextChange={setInputText}
            sampleTexts={sampleTexts}
            onSampleSelect={handleSampleSelect}
            disabled={loading}
          />
        </div>

        {/* Battle Button */}
        <div className="text-center">
          <button
            onClick={handleCompare}
            disabled={!canCompare || loading}
            className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
              canCompare && !loading
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 animate-pulse" />
                <span>Battle in Progress...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Start Battle!</span>
              </div>
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-600 bg-opacity-20 border border-red-500 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Results */}
        <SummaryComparison
          results={results}
          loading={loading}
          onRatingChange={handleRatingChange}
          ratings={ratings}
        />

        {/* Rating Chart */}
        {results && (ratings.model1 || ratings.model2) && (
          <RatingChart ratings={ratings} results={results} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-chat-sidebar border-t border-chat-border mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          <p>Built with React, Flask, OpenAI, Gemini, and HuggingFace Transformers</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
