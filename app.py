from flask import Flask, request, jsonify
import subprocess
import whisper
import os
from flask_cors import CORS
from translate import translate_text

app = Flask(__name__)
CORS(app) 
model = whisper.load_model("base")

@app.route('/stt', methods=['POST'])
def transcribe_audio():
     audio = request.files['audio']
     webm_path = "temp.webm"
     wav_path = "temp.wav"
     audio.save(webm_path)
     print("✅ Received file:", webm_path)
     print("📦 Size:", os.path.getsize(webm_path), "bytes")

    # Convert to WAV using ffmpeg
     subprocess.run(["ffmpeg", "-i", webm_path, wav_path], check=True)
     print("🎧 Converted file:", wav_path)
     print("📦 Size:", os.path.getsize(wav_path), "bytes")

     result = model.transcribe(wav_path)
     text = result['text']
     print("[TRANSCRIPT]:", text)
     target_lang = request.form.get("target", "fr")
     translated = translate_text(text, target_lang)
     print("Translated Text:", translated)

     return jsonify({
        "transcript": transcript,
        "translatedText": translated
     })

if __name__ == '__main__':
    app.run(debug=True)
