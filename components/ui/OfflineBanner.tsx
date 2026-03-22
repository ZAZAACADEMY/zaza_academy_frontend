"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Wifi } from "lucide-react";

/**
 * Bannière flottante qui détecte la perte / le retour de connexion réseau.
 * Particulièrement utile pour les zones à connectivité instable.
 */
export const OfflineBanner = () => {
  const [isOffline, setIsOffline] = React.useState(false);
  const [showReconnected, setShowReconnected] = React.useState(false);

  React.useEffect(() => {
    // État initial
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setIsOffline(true);
    }

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      // Masquer le message « reconnecté » après 3 s
      const t = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(t);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          key="offline"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3.5 bg-[#1E1240] text-white rounded-2xl shadow-2xl border border-white/10 max-w-[90vw]"
          role="alert"
          aria-live="assertive"
        >
          <span className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
            <WifiOff size={16} className="text-red-400" />
          </span>
          <div className="text-sm leading-snug">
            <p className="font-semibold">Pas de connexion</p>
            <p className="text-white/60 text-xs">
              Vérifiez votre réseau. La page se rechargera automatiquement.
            </p>
          </div>
          {/* Dots de chargement */}
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: "0.8s",
                }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {showReconnected && !isOffline && (
        <motion.div
          key="reconnected"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3.5 bg-green-800 text-white rounded-2xl shadow-2xl border border-green-600/30 max-w-[90vw]"
          role="status"
          aria-live="polite"
        >
          <span className="flex-shrink-0 w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center">
            <Wifi size={16} className="text-green-300" />
          </span>
          <p className="text-sm font-semibold">Connexion rétablie ✓</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
