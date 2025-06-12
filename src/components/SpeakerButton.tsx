
import { useState } from "react";
import { Speaker } from "lucide-react";

interface SpeakerButtonProps {
  text: string;
  className?: string;
}

const SpeakerButton = ({ text, className = "" }: SpeakerButtonProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    } else {
      console.log("Speech synthesis not supported");
    }
  };

  return (
    <button
      onClick={handleSpeak}
      className={`p-2 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/30 ${className} ${
        isSpeaking ? "animate-pulse bg-white/20" : "hover:bg-white/10"
      }`}
      aria-label={isSpeaking ? "Stop speaking" : "Read text aloud"}
      title={isSpeaking ? "Stop speaking" : "Read text aloud"}
    >
      <Speaker size={24} className={isSpeaking ? "text-yellow-300" : ""} />
    </button>
  );
};

export default SpeakerButton;
