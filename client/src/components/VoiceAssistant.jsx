import React, { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

export default function VoiceAssistant({ 
  language = "English", 
  onSpeechResult = () => {},
  lastBotReply = "" 
}) {
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Language codes for recognition
  const langCodes = {
    English: "en-US",
    Hindi: "hi-IN",
    Kannada: "kn-IN",
    Tamil: "ta-IN",
    Telugu: "te-IN",
    Marathi: "mr-IN"
  };

  useEffect(() => {
    // Check browser compatibility for Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = langCodes[language] || "en-US";

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onSpeechResult(transcript);
      };

      rec.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, [language]);

  // Adjust language code when prop changes
  useEffect(() => {
    if (recognition) {
      recognition.lang = langCodes[language] || "en-US";
    }
  }, [language, recognition]);

  // Read aloud bot responses using speech synthesis
  useEffect(() => {
    if (lastBotReply && soundEnabled && typeof window !== "undefined" && window.speechSynthesis) {
      // Cancel current speaking
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(lastBotReply);
      
      // Attempt to map matching voices
      const voices = window.speechSynthesis.getVoices();
      const targetLang = langCodes[language] || "en-US";
      const matchingVoice = voices.find(v => v.lang.startsWith(targetLang.split("-")[0]));
      
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  }, [lastBotReply, soundEnabled]);

  const toggleListening = () => {
    if (!speechSupported || !recognition) {
      alert("Voice speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      // Cancel any speaking
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsSpeaking(false);
      
      recognition.start();
    }
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (soundEnabled && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div style={styles.container}>
      <button 
        onClick={toggleListening}
        className={`glass-panel ${isListening ? "active-listen" : ""}`}
        style={{
          ...styles.btn,
          background: isListening ? "rgba(239, 35, 60, 0.25)" : "var(--glass-bg)",
          borderColor: isListening ? "#ef233c" : "var(--glass-border)",
          color: isListening ? "#ef233c" : "var(--emerald-green)"
        }}
        title={isListening ? "Stop listening" : "Talk to Farmverse AI"}
      >
        {isListening ? (
          <div style={styles.pulseContainer}>
            <MicOff size={20} />
            <span style={styles.pulseRing} />
          </div>
        ) : (
          <Mic size={20} />
        )}
      </button>

      <button 
        onClick={toggleSound}
        className="glass-panel"
        style={{
          ...styles.btn,
          color: soundEnabled ? "var(--golden-yellow)" : "#94a3b8"
        }}
        title={soundEnabled ? "Mute Assistant Audio" : "Unmute Assistant Audio"}
      >
        {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      {isListening && (
        <span style={styles.statusText}>
          🎙️ Listening ({language})...
        </span>
      )}
      {isSpeaking && (
        <span style={styles.statusText}>
          🔊 Reading response...
        </span>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  btn: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "1px solid var(--glass-border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    outline: "none",
    transition: "all 0.3s ease",
    position: "relative"
  },
  pulseContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: "100%",
    height: "100%"
  },
  pulseRing: {
    position: "absolute",
    width: "100%",
    height: "100%",
    border: "2px solid #ef233c",
    borderRadius: "50%",
    animation: "audioPulse 1.2s infinite ease-out"
  },
  statusText: {
    fontSize: "12px",
    fontFamily: "'Inter', sans-serif",
    color: "#a7f3d0",
    textShadow: "0 0 4px rgba(16, 185, 129, 0.4)",
    marginLeft: "5px"
  }
};

// Add pulse keyframe directly
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    @keyframes audioPulse {
      0% { transform: scale(1); opacity: 0.8; }
      100% { transform: scale(1.6); opacity: 0; }
    }
  `;
  document.head.appendChild(styleSheet);
}
