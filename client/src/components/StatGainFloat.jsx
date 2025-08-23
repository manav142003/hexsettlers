import { AnimatePresence, motion } from "framer-motion";

function ResourceGainFloat({ amount }) {
  return (
    <AnimatePresence>
      {amount > 0 && (
        <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -30 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }} className="absolute text-green-500 font-bold text-lg">
          +{amount}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
