"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowUp, FileText, Mail } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";

interface QuickDockProps {
  onOpenQuickView: () => void;
}

/**
 * QuickDock implements Fitts's Law and the Peak-End Rule.
 * Provides thumb-friendly, persistent access to primary actions
 * (Back to top, Quick resume view, and Contact jump) once the user scrolls.
 */
export function QuickDock({ onOpenQuickView }: QuickDockProps) {
  const { scrollTo, ready } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setVisible(scrollY > 450);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [ready]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          aria-label="Quick actions dock"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-1.5 rounded-full border border-paper/20 bg-carbon p-1.5 shadow-2xl"
        >
          {/* Quick View Button */}
          <button
            type="button"
            onClick={onOpenQuickView}
            aria-label="Open quick resume view"
            data-cursor-label="Resume"
            className="flex h-11 items-center gap-2 rounded-full px-3.5 text-xs text-paper/85 transition-colors hover:bg-paper/10 hover:text-signal focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
          >
            <FileText size={15} aria-hidden />
            <span className="mono hidden sm:inline text-[11px] font-medium tracking-wide">Resume</span>
          </button>

          {/* Contact Jump Button */}
          <button
            type="button"
            onClick={() => scrollTo('[data-chapter="signal"]')}
            aria-label="Jump to contact section"
            data-cursor-label="Contact"
            className="flex h-11 items-center gap-2 rounded-full px-3.5 text-xs text-paper/85 transition-colors hover:bg-paper/10 hover:text-signal focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
          >
            <Mail size={15} aria-hidden />
            <span className="mono hidden sm:inline text-[11px] font-medium tracking-wide">Contact</span>
          </button>

          <span className="h-4 w-px bg-paper/20" aria-hidden />

          {/* Back to top Button */}
          <button
            type="button"
            onClick={() => scrollTo(0)}
            aria-label="Back to the top of the page"
            data-cursor-label="Top"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-paper/10 text-paper transition-all hover:bg-signal hover:text-carbon active:scale-95 focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
          >
            <ArrowUp size={16} aria-hidden />
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
