'use client'
import React, { useState, useEffect } from 'react'
import Navbar from '@/app/components/landingPage/Navbar'
import Hero from './components/landingPage/Hero';
import { motion, AnimatePresence } from "framer-motion"
import About from './components/landingPage/About';
import Projects from './components/landingPage/Projects';
import Contact from './components/landingPage/Contact';
import DarkVeil from './components/Bites/DarkVeil';

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030014] text-white"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-xl md:text-2xl text-gray-400 font-light mb-2"
          >
            Portofolio
          </motion.div>
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-600 to-purple-700 uppercase"
          >
            Arif Fadillah Wicaksono
          </motion.h1>
        </motion.div>
      ) : (

        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full min-h-screen bg-[#030014]"
        >
          <div
            className="fixed inset-0 z-0 pointer-events-none opacity-90"
            style={{
              backgroundImage: `
                radial-gradient(circle at 0% 0%, rgba(113, 47, 255, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 100% 0%, rgba(0, 163, 255, 0.25) 0%, transparent 60%),
                radial-gradient(circle at 50% 100%, rgba(76, 29, 149, 0.2) 0%, transparent 50%)
              `,
            }}
          />

          <div className="absolute top-0 left-0 w-full h-screen z-0">
            <DarkVeil />
          </div>

          <div className="relative z-10 flex flex-col w-full md:px-10 lg:px-[60px]">
            <Navbar />
            <Hero />
            <About />
            <Projects />
            <Contact />
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}