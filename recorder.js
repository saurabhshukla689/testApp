let mediaRecorder;
let audioChunks = [];

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const statusText = document.getElementById("status");

startBtn.onclick = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
  audioChunks = [];

  mediaRecorder.ondataavailable = (e) => {
    audioChunks.push(e.data);
  };

  mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    console.log("heh",audioBlob)

    // Optional: Play audio for verification
    const audioURL = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioURL);
    audio.play();

    // Upload to backend
    const file = new File([audioBlob], "speech.webm", { type: "audio/webm" });
    const formData = new FormData();
    formData.append("audio", file);
    // console.log("form",formData.keys,formData.values);
    // console.log("audioFile",file);
    for (let [key, value] of formData.entries()) {
        console.log("Key:", key);
        console.log("Value:", value);
      }
      

    const response = await fetch("http://localhost:5000/stt", {
      method: "POST",
      body: formData,
    });

    console.log("Response status",response.status)
    //console.log("Response status",await response.json())

    const data = await response.json();

    console.log("data",data)
    console.log("Transcript:", data.transcript);
    statusText.textContent = "Transcript: " + data.transcript;
  };

  mediaRecorder.start();
  startBtn.disabled = true;
  stopBtn.disabled = false;
  statusText.textContent = "Recording...";
};

stopBtn.onclick = () => {
  mediaRecorder.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;
  statusText.textContent = "Processing...";
};
