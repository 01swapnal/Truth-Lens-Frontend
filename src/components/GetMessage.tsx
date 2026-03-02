import { useState } from "react";

/* 🔊 Web Speech Function */
const speakText = (text: string) => {
  const synth = window.speechSynthesis;

  // stop previous speech
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // get available voices
  const voices = synth.getVoices();

  // choose a valid English voice
  const selectedVoice =
    voices.find(v => v.name.includes("Google")) ||
    voices.find(v => v.lang.startsWith("en")) ||
    voices[0];

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  // small delay fixes Chrome timing issue
  setTimeout(() => {
    synth.speak(utterance);
  }, 100);
};

export default function GetMessage() {
  const [message, setMessage] = useState("");

  const getMessage = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/message");
      const data = await response.json();

      setMessage(data.text);

      // 🔊 Speak message
      speakText(data.text);
    } catch (error) {
      console.error("Error fetching message:", error);
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={getMessage}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Fetch Message
      </button>

      <p className="mt-4 text-lg">{message}</p>
    </div>
  );
}