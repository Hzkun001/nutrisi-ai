import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface EmptyStateCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const EmptyStateCard = ({ icon: Icon, title, description }: EmptyStateCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-12 sm:py-20 text-center bg-gray-50 border border-gray-100 rounded-[2rem] h-full min-h-[280px] sm:min-h-[400px] shadow-sm px-4"
  >
    <div className="h-16 w-16 rounded-3xl bg-white border border-gray-100 flex items-center justify-center mb-6 shadow-sm">
      <Icon className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 max-w-[280px] leading-relaxed">{description}</p>
  </motion.div>
);

export default EmptyStateCard;
