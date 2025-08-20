// frontend/src/components/InputBox.js
import React, { useState } from 'react';

const InputBox = ({ onSendMessage, isLoading, speaking, listening, onSpeechInput, transcript }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      {listening && (
        <div className="mb-2 p-2 bg-blue-100 rounded-md">
          <p className="text-blue-700 text-sm">Listening: {transcript}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer..."
          disabled={isLoading || speaking}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        
        <button
          type="button"
          onClick={onSpeechInput}
          disabled={isLoading || speaking}
          className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            listening 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          } disabled:bg-gray-300`}
        >
          {listening ? 'Stop' : 'Speak'}
        </button>
        
        <button
          type="submit"
          disabled={isLoading || speaking || !input.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default InputBox;