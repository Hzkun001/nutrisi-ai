import { motion } from "framer-motion";

interface LabelBadgeProps {
  label: string;
  index?: number;
}

const LabelBadge = ({ label, index = 0 }: LabelBadgeProps) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.04 }}
    className="inline-flex items-center rounded-full bg-cyan-50 border border-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-600 shadow-sm"
  >
    {label}
  </motion.span>
);

export default LabelBadge;
