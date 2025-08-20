// frontend/src/App.js
import React, { useState, useRef, useEffect } from 'react';
import InterviewForm from './components/InterviewForm';
import ChatBox from './components/ChatBox';
import InputBox from './components/InputBox';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';

function App() {
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [interviewConfig, setInterviewConfig] = useState({});
  const { speak, speaking, cancel } = useSpeechSynthesis();
  const { 
    transcript, 
    listening, 
    startListening, 
    stopListening, 
    resetTranscript 
  } = useSpeechRecognition();

  const chatBoxRef = useRef(null);

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startInterview = async (config) => {
    setInterviewStarted(true);
    setInterviewConfig(config);
    setIsLoading(true);
    
    const prompt = `You are an interviewer for a ${config.role} job. Difficulty: ${config.difficulty}. Resume: ${config.resume || 'Not provided'}. Ask one question at a time. Start with the first interview question.`;
    
    try {
      const response = await fetch('http://localhost:5000/api/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      
      if (data.text) {
        const aiMessage = { sender: 'ai', text: data.text };
        setMessages([aiMessage]);
        speak(data.text);
      }
    } catch (error) {
      console.error('Error starting interview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;
    
    // Add user message
    const userMessage = { sender: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    
    setIsLoading(true);
    
    try {
      // Generate next question
      const conversation = messages.map(msg => 
        `${msg.sender === 'user' ? 'Candidate' : 'Interviewer'}: ${msg.text}`
      ).join('\n');
      
      const prompt = `${conversation}\nCandidate: ${text}\nInterviewer: Ask the next question.`;
      
      const response = await fetch('http://localhost:5000/api/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      
      if (data.text) {
        const aiMessage = { sender: 'ai', text: data.text };
        setMessages(prev => [...prev, aiMessage]);
        speak(data.text);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeechInput = () => {
    if (listening) {
      stopListening();
      if (transcript) {
        sendMessage(transcript);
      }
      resetTranscript();
    } else {
      startListening();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto max-w-4xl bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">AI Interview Taker</h1>
        
        {!interviewStarted ? (
          <InterviewForm onStart={startInterview} />
        ) : (
          <>
            <ChatBox 
              messages={messages} 
              isLoading={isLoading}
              ref={chatBoxRef}
            />
            <InputBox 
              onSendMessage={sendMessage}
              isLoading={isLoading}
              speaking={speaking}
              listening={listening}
              onSpeechInput={handleSpeechInput}
              transcript={transcript}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;