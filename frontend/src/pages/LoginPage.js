// src/pages/LoginPage.js
import { FaGoogle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function LoginPage() {
  // This function just redirects to our backend auth route
  const handleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-blue text-white">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-6xl font-bold">Aide</h1>
        <p className="text-xl mt-2">Your visual health assistant.</p>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogin}
        className="flex items-center gap-3 px-8 py-4 mt-24 text-lg font-semibold bg-white text-brand-dark rounded-full shadow-lg"
      >
        <FaGoogle className="text-red-500" />
        Sign in with Google
      </motion.button>
    </div>
  );
}
