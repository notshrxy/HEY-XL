import { useState } from 'react';
import { Upload, FileText, TrendingUp } from 'lucide-react';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<string[]>([]);

  // When user selects a file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPredictions([]);
    }
  };

  // Send file to backend and get predictions
  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error analyzing document');
      }

      const data = await response.json();

      // Extract and format predictions
      const clusters = Object.entries(data.sample_per_cluster).map(
        ([key, questions]) => ({
          cluster: key,
          questions: questions as string[],
        })
      );

      // Flatten all questions into a single list for display
      const allQuestions = clusters.flatMap((c) => c.questions);

      setPredictions(allQuestions);
    } catch (error) {
      console.error(error);
      alert('Failed to analyze the document. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      {/* Header Section */}
      <div className="w-full bg-red-900 shadow-md">
        <img
          src="/image.png"
          alt="Header"
          className="w-full h-auto max-h-32 object-contain"
        />
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-red-800 mb-3">
              Question Prediction System
            </h1>
            <p className="text-red-600 text-lg">
              Upload a Word document to predict the most frequently occurring questions
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-red-200">
            <div className="mb-6">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-3 border-dashed border-red-300 rounded-xl cursor-pointer bg-red-50 hover:bg-red-100 transition-all duration-300"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 mb-3 text-red-500" />
                  <p className="mb-2 text-sm text-red-700 font-semibold">
                    <span>Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-red-500">Word documents (.doc, .docx)</p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".doc,.docx"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* File Info */}
            {file && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-red-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">{file.name}</p>
                    <p className="text-xs text-red-600">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Analyze Document'
              )}
            </button>
          </div>

          {/* Prediction Results */}
          {predictions.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 border-2 border-red-200">
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="w-8 h-8 text-red-600" />
                <h2 className="text-2xl font-bold text-red-800">Predicted Questions</h2>
              </div>

              <div className="space-y-3">
                {predictions.map((question, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border-l-4 border-red-500 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <p className="text-red-900 font-medium flex-1 pt-1">{question}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
