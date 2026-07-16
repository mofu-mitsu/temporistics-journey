import { motion, AnimatePresence } from 'motion/react';

interface Props {
  show: boolean;
  text: string;
  isAwa?: boolean;
  position?: 'top' | 'bottom';
}

export default function DarlingOverlay({ show, text, isAwa, position = 'bottom' }: Props) {
  const isTop = position === 'top';
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: isTop ? -50 : 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: isTop ? -20 : 20, scale: 0.95 }}
          className={`absolute z-50 left-0 right-0 mx-auto w-[90%] max-w-md pointer-events-none ${isTop ? 'top-8' : 'bottom-8'}`}
        >
          <div className={`p-4 rounded-2xl shadow-2xl border ${isAwa ? 'bg-slate-900/95 border-slate-700 text-slate-200' : 'bg-pink-50/95 border-pink-200 text-slate-800'} backdrop-blur-md relative`}>
            <div className="flex items-start gap-3">
              <div className="text-3xl mt-1">🥺</div>
              <div className={`text-sm leading-relaxed ${isAwa ? 'font-mono' : 'font-sans font-medium'}`}>
                {text}
              </div>
            </div>
            {/* 吹き出しのしっぽ */}
            <div className={`absolute ${isTop ? '-top-2 border-t border-l' : '-bottom-2 border-b border-r'} left-8 w-4 h-4 rotate-45 ${isAwa ? 'bg-slate-900 border-slate-700' : 'bg-pink-50 border-pink-200'}`} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
