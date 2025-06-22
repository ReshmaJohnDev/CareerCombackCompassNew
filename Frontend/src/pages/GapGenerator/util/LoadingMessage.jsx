import React from "react";

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
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % friendlyMessages.length);
    }, 4000); // rotate every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const [dots, setDots] = React.useState("");
  React.useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((d) => (d.length < 3 ? d + "." : ""));
    }, 500);
    return () => clearInterval(dotsInterval);
  }, []);

  return (
    <p className="text-gray-300 text-center max-w-md mx-auto my-4">
      {friendlyMessages[index]}
      {dots}
    </p>
  );
}

export default LoadingMessage;
