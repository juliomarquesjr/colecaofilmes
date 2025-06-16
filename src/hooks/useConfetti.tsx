import confetti from 'canvas-confetti';
import { X } from 'lucide-react';
import { toast } from 'sonner';

export function useConfetti() {
  const showCongratulations = () => {
    toast.custom((t) => (
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-lg shadow-lg border border-purple-400/30 flex items-center gap-3 pr-12 relative">
        <div className="bg-white/20 rounded-full p-2">
          <span className="text-2xl">🎉</span>
        </div>
        <div>
          <h4 className="font-bold text-lg">Parabéns!</h4>
          <p className="text-purple-100">
            Você assistiu todos os filmes! 🎬 ⭐️ 🏆
          </p>
        </div>
        <button
          onClick={() => toast.dismiss(t)}
          className="absolute right-2 top-2 p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="h-4 w-4 text-purple-200" />
        </button>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
    });
  };

  const fireConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 1000,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      origin: { y: 0.7 },
    });

    fire(0.2, {
      spread: 60,
      origin: { y: 0.7 },
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      origin: { y: 0.7 },
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      origin: { y: 0.7 },
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      origin: { y: 0.7 },
    });

    // Exibe a mensagem de parabéns
    showCongratulations();
  };

  return { fireConfetti };
} 