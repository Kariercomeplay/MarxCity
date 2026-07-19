'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CityAnimation() {
  const [mounted, setMounted] = useState(false);
  const [winWidth, setWinWidth] = useState(1440);

  useEffect(() => {
    setMounted(true);
    setWinWidth(window.innerWidth);
    const handleResize = () => setWinWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute bottom-0 w-full h-48 text-zinc-800/30" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <rect x="0" y="160" width="80" height="40" fill="currentColor" />
          <rect x="90" y="140" width="60" height="60" fill="currentColor" />
          <rect x="160" y="120" width="50" height="80" fill="currentColor" />
          <rect x="220" y="150" width="70" height="50" fill="currentColor" />
          <rect x="300" y="110" width="45" height="90" fill="currentColor" />
          <rect x="355" y="130" width="55" height="70" fill="currentColor" />
          <rect x="420" y="100" width="40" height="100" fill="currentColor" opacity="0.7" />
          <rect x="470" y="140" width="65" height="60" fill="currentColor" />
          <rect x="545" y="120" width="50" height="80" fill="currentColor" opacity="0.8" />
          <rect x="605" y="150" width="55" height="50" fill="currentColor" />
          <rect x="670" y="90" width="35" height="110" fill="currentColor" />
          <rect x="715" y="130" width="60" height="70" fill="currentColor" />
          <rect x="785" y="145" width="45" height="55" fill="currentColor" />
          <rect x="840" y="105" width="50" height="95" fill="currentColor" opacity="0.6" />
          <rect x="900" y="125" width="40" height="75" fill="currentColor" />
          <rect x="950" y="115" width="55" height="85" fill="currentColor" />
          <rect x="1015" y="135" width="60" height="65" fill="currentColor" />
          <rect x="1085" y="95" width="45" height="105" fill="currentColor" opacity="0.7" />
          <rect x="1140" y="140" width="50" height="60" fill="currentColor" />
          <rect x="1200" y="155" width="70" height="45" fill="currentColor" />
          <rect x="1280" y="110" width="40" height="90" fill="currentColor" />
          <rect x="1330" y="145" width="55" height="55" fill="currentColor" />
          <rect x="1395" y="125" width="45" height="75" fill="currentColor" />
        </svg>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute bottom-0 w-full h-48 text-zinc-800/30" viewBox="0 0 1440 200" preserveAspectRatio="none">
        <rect x="0" y="160" width="80" height="40" fill="currentColor" />
        <rect x="90" y="140" width="60" height="60" fill="currentColor" />
        <rect x="160" y="120" width="50" height="80" fill="currentColor" />
        <rect x="220" y="150" width="70" height="50" fill="currentColor" />
        <rect x="300" y="110" width="45" height="90" fill="currentColor" />
        <rect x="355" y="130" width="55" height="70" fill="currentColor" />
        <rect x="420" y="100" width="40" height="100" fill="currentColor" opacity="0.7" />
        <rect x="470" y="140" width="65" height="60" fill="currentColor" />
        <rect x="545" y="120" width="50" height="80" fill="currentColor" opacity="0.8" />
        <rect x="605" y="150" width="55" height="50" fill="currentColor" />
        <rect x="670" y="90" width="35" height="110" fill="currentColor" />
        <rect x="715" y="130" width="60" height="70" fill="currentColor" />
        <rect x="785" y="145" width="45" height="55" fill="currentColor" />
        <rect x="840" y="105" width="50" height="95" fill="currentColor" opacity="0.6" />
        <rect x="900" y="125" width="40" height="75" fill="currentColor" />
        <rect x="950" y="115" width="55" height="85" fill="currentColor" />
        <rect x="1015" y="135" width="60" height="65" fill="currentColor" />
        <rect x="1085" y="95" width="45" height="105" fill="currentColor" opacity="0.7" />
        <rect x="1140" y="140" width="50" height="60" fill="currentColor" />
        <rect x="1200" y="155" width="70" height="45" fill="currentColor" />
        <rect x="1280" y="110" width="40" height="90" fill="currentColor" />
        <rect x="1330" y="145" width="55" height="55" fill="currentColor" />
        <rect x="1395" y="125" width="45" height="75" fill="currentColor" />
      </svg>

      <motion.div
        className="absolute bottom-20 left-0"
        animate={{ x: [0, winWidth + 100] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
        style={{ x: -100 }}
      >
        <svg className="w-12 h-8 text-yellow-500/30" viewBox="0 0 48 32" fill="currentColor">
          <rect x="4" y="8" width="32" height="16" rx="2" />
          <circle cx="12" cy="24" r="4" />
          <circle cx="28" cy="24" r="4" />
          <rect x="36" y="12" width="10" height="4" rx="1" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-0"
        animate={{ x: [0, winWidth + 100] }}
        transition={{ repeat: Infinity, duration: 12, ease: 'linear', delay: 3 }}
        style={{ x: -150 }}
      >
        <svg className="w-10 h-6 text-blue-500/30" viewBox="0 0 48 28" fill="currentColor">
          <path d="M2 26 L12 6 L24 22 L36 2 L46 26 Z" />
        </svg>
      </motion.div>

      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}
