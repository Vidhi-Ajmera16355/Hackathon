import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2 } from 'lucide-react';
import axios from "axios";
import { BACKEND_URL } from '../config';

const LandingPage = () => {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate('/BuilderPage', { state: { prompt } });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <Wand2 className="h-16 w-16 text-indigo-600" />
          </div>
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            Create Your Dream Website
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Describe your perfect website, and we'll help you bring it to life.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your website... (e.g., 'Create a modern portfolio website with a dark theme')"
                className="w-full p-4 h-32 text-lg border-2 border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
            >
              Generate Website
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;