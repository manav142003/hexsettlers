import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function StatGainFloat({ amount, triggerKey }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (amount && amount !== 0) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [triggerKey]);

  if (!amount || amount === 0) return null;
  const isPositive = amount > 0;
  const displayText = isPositive ? `+${amount}` : amount;
  const colourClass = isPositive ? "text-green-400" : "text-red-400";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={triggerKey} // ensures rerun when new amount comes in
          initial={{ opacity: 0, y: 0, scale: 0.8 }}
          animate={{ opacity: 1, y: -30, scale: 1.2 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 0.25 }}
          className={`absolute ${colourClass} text-2xl font-bold pointer-events-none`}
        >
          {displayText}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
