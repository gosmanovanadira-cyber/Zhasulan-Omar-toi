import { useState, useRef, useEffect } from 'react';
import { Music } from 'lucide-react';

export const SoundController: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Beautiful Kazakh soft instrumental / dombra / piano ambient track
  const audioUrl = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf7f2.mp3";

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    // Attempt instant autoplay upon entry
    const playAudio = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        }).catch((e) => {
          console.log("Autoplay waiting for initial user interaction:", e);
        });
      }
    };

    playAudio();

    // Attach global listener so any touch/scroll/click triggers music instantly
    const handleInitialInteraction = () => {
      playAudio();
      window.removeEventListener('click', handleInitialInteraction);
      window.removeEventListener('touchstart', handleInitialInteraction);
      window.removeEventListener('scroll', handleInitialInteraction);
      window.removeEventListener('keydown', handleInitialInteraction);
    };

    window.addEventListener('click', handleInitialInteraction, { passive: true });
    window.addEventListener('touchstart', handleInitialInteraction, { passive: true });
    window.addEventListener('scroll', handleInitialInteraction, { passive: true });
    window.addEventListener('keydown', handleInitialInteraction, { passive: true });

    return () => {
      audio.pause();
      audio.src = "";
      window.removeEventListener('click', handleInitialInteraction);
      window.removeEventListener('touchstart', handleInitialInteraction);
      window.removeEventListener('scroll', handleInitialInteraction);
      window.removeEventListener('keydown', handleInitialInteraction);
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setHasInteracted(true);
      }).catch((e) => {
        console.log("Audio playback error:", e);
      });
    }
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-2">
      {!isPlaying && !hasInteracted && (
        <span className="text-xs font-sans px-3 py-1.5 rounded-full luxury-glass text-[#C8A96A] animate-pulse border border-[#C8A96A]/30 flex items-center gap-1.5 shadow-lg select-none pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96A] animate-ping" />
          Әуенді қосу
        </span>
      )}

      <button
        onClick={toggleMusic}
        aria-label="Музыканы басқару"
        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer ${
          isPlaying 
            ? 'bg-[#C8A96A] text-[#2B2620] gold-glow scale-105' 
            : 'luxury-glass text-[#F6F1E8] hover:border-[#C8A96A]/50'
        }`}
      >
        {isPlaying ? (
          <div className="flex items-center gap-0.5 h-4">
            <span className="w-0.5 h-full bg-[#2B2620] animate-[stretch_0.8s_ease-in-out_infinite_alternate]" />
            <span className="w-0.5 h-2/3 bg-[#2B2620] animate-[stretch_0.5s_ease-in-out_infinite_alternate]" />
            <span className="w-0.5 h-1/2 bg-[#2B2620] animate-[stretch_0.6s_ease-in-out_infinite_alternate]" />
            <span className="w-0.5 h-4/5 bg-[#2B2620] animate-[stretch_0.7s_ease-in-out_infinite_alternate]" />
          </div>
        ) : (
          <Music className="w-4 h-4 text-[#C8A96A]" />
        )}
      </button>

      <style>{`
        @keyframes stretch {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
};
