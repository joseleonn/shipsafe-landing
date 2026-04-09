"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { CTAS } from "@/lib/constants";

export default function WhatsAppButton() {
  return (
    <motion.a
      href={CTAS.whatsapp.url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-colors hover:bg-green-600"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
      {/* Pulse ring */}
      <span className="absolute inset-0 animate-ping rounded-full bg-green-500/30" style={{ animationDuration: "2s", animationIterationCount: 3 }} />
    </motion.a>
  );
}
