# backend/app.py
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import requests
import io
import os
from dotenv import load_dotenv
import base64
from gtts import gTTS

load_dotenv()

app = Flask(__name__)
CORS(app)

# Pollinations API endpoints
POLLINATIONS_TEXT_API = "https://text.pollinations.ai"
POLLINATIONS_AUDIO_API = "https://audio.pollinations.ai"

@app.route('/api/generate-text', methods=['POST'])
def generate_text():
    try:
        data = request.json
        prompt = data.get('prompt')
        
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400
        
        # Call Pollinations text API
        response = requests.get(f"{POLLINATIONS_TEXT_API}/{prompt}")
        
        if response.status_code == 200:
            return jsonify({"text": response.text})
        else:
            return jsonify({"error": "Failed to generate text"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/generate-audio', methods=['POST'])
def generate_audio():
    try:
        data = request.json
        text = data.get('text')
        voice = data.get('voice', 'nova')
        
        if not text:
            return jsonify({"error": "Text is required"}), 400
        
        # Generate speech using gTTS (free alternative)
        tts = gTTS(text=text, lang='en', slow=False)
        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        
        # Return base64 encoded audio
        audio_base64 = base64.b64encode(audio_buffer.read()).decode('utf-8')
        return jsonify({"audio": audio_base64})
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/transcribe-audio', methods=['POST'])
def transcribe_audio():
    try:
        # For simplicity, we'll use a mock implementation
        # In a real app, you would use a speech-to-text API
        data = request.json
        audio_data = data.get('audio')
        
        # This is a mock response - you would integrate with a real STT service
        mock_transcription = "This is a mock transcription of your audio input."
        
        return jsonify({"text": mock_transcription})
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)