import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";
function App() {
const [status, setStatus] = useState("Idle");

const startRecording = async () => {
  setStatus("Recording...");
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
  let audioChunks = [];
  mediaRecorder.ondataavailable = (e) => {
    audioChunks.push(e.data);
  };
  mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    const audioURL = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioURL);
    audio.play();
    const file = new File([audioBlob], "speech.webm", { type: "audio/webm" });
    const formData = new FormData();
    formData.append("audio", file);
    const response = await fetch("http://localhost:5000/stt", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log("Transcript:", data.transcript);
    setStatus("Transcript: " + data.transcript);
  };
  mediaRecorder.start();
  document.getElementById("startBtn").disabled = true;
  document.getElementById("stopBtn").disabled = false;
};
const stopRecording = () => {
  const mediaRecorder = document.querySelector("mediaRecorder");
  if (mediaRecorder) {


    mediaRecorder.stop();
    document.getElementById("startBtn").disabled = false;
    document.getElementById("stopBtn").disabled = true;
    
    setStatus("Stopped");
  }
};
  


return (
  <div>
    <h2>Speak and Transcribe</h2>
    <button onClick={startRecording}>Start Recording</button>
    <button onClick={stopRecording} disabled={status !== 'Recording...'}>Stop Recording</button>
    <p>Status: {status}</p>
  </div>
);
}

export default App;
