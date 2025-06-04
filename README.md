# Battle of the LLMs 🤖⚔️

A web application that allows you to compare summarization capabilities between different AI models side-by-side. Compare closed-source APIs (OpenAI, Google Gemini) against open-source local models (BART, Pegasus) and rate their performance.

![Battle of the LLMs](https://img.shields.io/badge/Status-Ready%20to%20Battle-green?style=for-the-badge)

## 🚀 Features

- **Dual Model Selection**: Choose between closed-source APIs and open-source local models
- **Side-by-side Comparison**: View summaries from both models simultaneously
- **Rating System**: Rate summaries on clarity, accuracy, and conciseness (1-5 stars)
- **Sample Texts**: Pre-loaded articles for quick testing
- **Real-time Processing**: Parallel model execution for faster results
- **ChatGPT-style UI**: Clean, modern interface inspired by ChatGPT
- **Performance Metrics**: View processing times for each model

## 🚀 Screenshots

<img width="1470" alt="Screenshot 2025-06-04 at 2 51 26 PM" src="https://github.com/user-attachments/assets/7fffbfa9-313c-4355-9c34-016dfe74048c" />
<img width="1469" alt="Screenshot 2025-06-04 at 2 51 38 PM" src="https://github.com/user-attachments/assets/ef467308-c4f4-48e6-80a3-dc35f9730547" />
<img width="1463" alt="Screenshot 2025-06-04 at 2 51 54 PM" src="https://github.com/user-attachments/assets/c833d7ec-6a88-4098-a195-714365538fdd" />
<img width="1470" alt="Screenshot 2025-06-04 at 2 52 15 PM" src="https://github.com/user-attachments/assets/c4814a74-11c4-486b-9571-ef1c63c3c4e4" />


## 🏗️ Architecture

```
Battle-of-the-LLMs/
├── backend/                 # Python Flask API
│   ├── models/              # Model handlers
│   │   ├── openai_model.py  # OpenAI GPT integration
│   │   ├── gemini_model.py  # Google Gemini integration
│   │   └── huggingface_models.py # Local BART/Pegasus models
│   ├── app.py              # Main Flask application
│   ├── sample_texts.py     # Sample articles
│   └── requirements.txt    # Python dependencies
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API integration
│   │   └── App.js         # Main app component
│   └── package.json       # Node dependencies
└── README.md              # This file
```

## 🔧 Available Models

### Closed-Source APIs
- **OpenAI GPT-3.5 Turbo** - Fast and efficient
- **OpenAI GPT-4** - Most capable but slower
- **Google Gemini Pro** - Google's latest language model

### Open-Source Local Models
- **BART Large CNN** - Facebook's summarization model
- **Pegasus XSum** - Google's news summarization model

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.12+
- Node.js 18+
- OpenAI API Key
- Google Gemini API Key

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

3. **Set up environment variables**
Create a `.env` file in the backend directory:
```bash
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
FLASK_ENV=development
FLASK_DEBUG=True
```

4. **Start the Flask server**
```bash
python app.py
```

The backend will be available at `http://localhost:5001`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install Node dependencies**
```bash
npm install
```

3. **Start the React development server**
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## 🔑 API Keys Setup

### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to API Keys section
4. Create a new secret key
5. Add to your `.env` file

### Google Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Create a new API key
4. Add to your `.env` file

## 🎯 How to Use

1. **Start Both Servers**: Ensure both backend (Flask) and frontend (React) are running
2. **Select Models**: Choose one model from each category (closed-source vs open-source)
3. **Input Text**: Either paste your own text or select from sample articles
4. **Battle!**: Click "Start Battle!" to generate summaries
5. **Rate Results**: Rate each summary on clarity, accuracy, and conciseness
6. **Compare**: View the rating comparison chart

## 📊 Sample Texts

The app includes 4 pre-loaded sample texts:
- **Tech**: AI in Healthcare, Quantum Computing Breakthrough
- **News**: Climate Summit Agreement, Economic Recovery Analysis

## 🔧 Technical Details

### Backend (Flask)
- **Parallel Processing**: Both models run simultaneously using ThreadPoolExecutor
- **Error Handling**: Comprehensive error handling for API failures
- **Memory Management**: Automatic model caching and cleanup for HuggingFace models
- **CORS Enabled**: Frontend can communicate with backend

### Frontend (React)
- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: Live status updates during processing
- **Copy to Clipboard**: Copy summaries with one click
- **Rating System**: Interactive star ratings with visual feedback

### Local Models
- **BART Large CNN**: ~1.3GB model specialized for news summarization
- **Pegasus XSum**: ~2.3GB model optimized for extreme summarization
- **Auto-download**: Models download automatically on first use

## 🚨 Troubleshooting

### Backend Issues
- **Port 5001 in use**: Change port in `app.py` and update frontend API URL
- **Model download fails**: Ensure stable internet connection
- **API key errors**: Verify keys are correctly set in `.env`

### Frontend Issues
- **CORS errors**: Ensure Flask-CORS is installed and configured
- **API connection fails**: Check backend is running on correct port

### Memory Issues
- **HuggingFace models**: Use "Clear Cache" button to free memory
- **Low RAM**: Close other applications when using local models

## 🔮 Future Enhancements

- [ ] Support for more models (Claude, Llama, etc.)
- [ ] Batch processing for multiple texts
- [ ] Export results to PDF/CSV
- [ ] User authentication and result history
- [ ] Model fine-tuning capabilities
- [ ] Advanced metrics (ROUGE, BLEU scores)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open-source and available under the MIT License.

## 🙏 Acknowledgments

- OpenAI for GPT models
- Google for Gemini and Pegasus models
- Meta for BART model
- HuggingFace for the transformers library
- React and Flask communities

---

**Ready to battle? Let the best LLM win! 🏆**
