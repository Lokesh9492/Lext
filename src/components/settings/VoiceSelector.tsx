
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, Play } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const VoiceSelector = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Load saved voice preference
      const savedVoice = localStorage.getItem("lext_voice");
      if (savedVoice) {
        setSelectedVoice(savedVoice);
      } else if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    // Load voices initially
    loadVoices();
    
    // Some browsers need this event listener for voices to load
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const handleVoiceChange = (voiceName: string) => {
    setSelectedVoice(voiceName);
    localStorage.setItem("lext_voice", voiceName);
    toast({
      title: "Voice Updated",
      description: `Selected voice: ${voiceName}`,
    });
  };

  const testVoice = (voiceName: string) => {
    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const voice = voices.find(v => v.name === voiceName);
    if (voice) {
      const utterance = new SpeechSynthesisUtterance("Hello! This is how I sound when reading your documents.");
      utterance.voice = voice;
      utterance.rate = 0.8;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg border-white/20 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Volume2 className="w-5 h-5" />
          <span>Voice Preference</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {voices.length === 0 ? (
          <p className="text-white/70">Loading available voices...</p>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {voices.slice(0, 10).map((voice) => {
              const isSelected = selectedVoice === voice.name;
              
              return (
                <div
                  key={voice.name}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected 
                      ? "bg-white/20 border border-white/40" 
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                  onClick={() => handleVoiceChange(voice.name)}
                >
                  <div className="flex-1">
                    <p className="text-white font-medium">{voice.name}</p>
                    <p className="text-white/60 text-sm">{voice.lang}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isSelected && (
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    )}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        testVoice(voice.name);
                      }}
                      size="sm"
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Play className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceSelector;
