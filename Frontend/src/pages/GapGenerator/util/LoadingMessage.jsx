import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./LoadingMessage.css"; // 👈 for bouncing dots

const friendlyMessages = [
  "Hang tight! We're unpacking your awesome resume 📦✨",
  "Almost there! Crafting your personalized gap story 🛠️",
  "Good things take time… brewing your career story ☕",
  "Crunching the numbers and polishing your resume sparkle 💎",
  "Hold on, superheroes don’t rush their origin stories 🦸‍♂️",
  "Just a moment! Making your gap history shine ✨",
  "Your future is loading… getting everything just right 🚀",
  "Patience, please! We’re weaving your professional narrative 🧵",
];

function LoadingMessage() {
  const [index, setIndex] = React.useState(0);

  // Rotate messages every 4s
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % friendlyMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center max-w-md mx-auto my-6">
      <AnimatePresence mode="wait">
        <motion.p
          key={index} // triggers animation when message changes
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6 }}
          className="text-lg font-medium text-gray-800"
        >
          {friendlyMessages[index]}
          <span className="dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export default LoadingMessage;
