// frontend/src/components/ChatBox.js
import React, { forwardRef } from 'react';

const ChatBox = forwardRef(({ messages, isLoading }, ref) => {
  return (
    <div 
      ref={ref}
      className="border border-gray-200 rounded-lg p-4 h-96 overflow-y-auto mb-4 bg-white"
    >
      {messages.length === 0 && !isLoading ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          The interview will begin once you click "Start Interview"
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

ChatBox.displayName = 'ChatBox';

export default ChatBox;