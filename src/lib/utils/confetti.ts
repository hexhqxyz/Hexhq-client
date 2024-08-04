import confetti from "canvas-confetti";


const count = 200;
const defaults = {
  origin: { y: 0.7 },
};

function fire(particleRatio: any, opts: any) {
  confetti({
    ...defaults,
    ...opts,
    particleCount: Math.floor(count * particleRatio),
  });
}

export const fireConfetti = () => {
    fire(0.25, {
      spread: 360, // Spread over a full circle
      startVelocity: 55,
      decay: 0.95, // Slow down the decay rate
    });
    fire(0.2, {
      spread: 360,
    });
    fire(0.35, {
      spread: 360,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 360,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 360,
      startVelocity: 45,
    });
  };
  