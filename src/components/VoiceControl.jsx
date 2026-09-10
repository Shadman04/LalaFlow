import React from 'react';
import { Mic, MicOff, Volume2, AlertCircle } from 'lucide-react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

export default function VoiceControl({ onSpeechInput, disabled = false }) {
  const { isListening, speechSupported, startListening, stopListening, transcript } = useVoiceAssistant();

  React.useEffect(() => {
    if (transcript && onSpeechInput) {
      onSpeechInput(transcript);
    }
  }, [transcript, onSpeechInput]);

  if (!speechSupported) {
    return (
      <div className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        <span>Voice recognition isn't available in this browser. You can still chat with LALA using text.</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={isListening ? stopListening : startListening}
      disabled={disabled}
      className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-center shrink-0 ${
        isListening
          ? 'bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/40 animate-pulse'
          : 'bg-surface-800 text-slate-300 border-surface-border hover:bg-surface-700 hover:text-white'
      }`}
      title={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {isListening ? (
        <MicOff className="w-4 h-4 text-white" />
      ) : (
        <Mic className="w-4 h-4 text-brand-cyan" />
      )}
    </button>
  );
}
