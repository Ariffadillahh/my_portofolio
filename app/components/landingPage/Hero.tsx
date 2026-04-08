import React from 'react'
import BlurText from '../Bites/BlurText'
import Lanyard from '../Bites/Lanyard'
import { FaDownload } from 'react-icons/fa';
import { ArrowRightIcon } from 'flowbite-react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animation';
import { useGetCvQuery } from '@/app/services/cv.service';
import DarkVeil from '../Bites/DarkVeil';

const Hero = () => {
  const { data: existingCv } = useGetCvQuery();
  const cvData = existingCv?.cv?.[0];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setTimeout(() => {
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 300);
  };

  return (
    <section
      id="home"
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center"
    >
      <div className="absolute inset-0 z-20 pointer-events-none hidden md:flex">
        <div className="absolute right-0 top-0 w-full md:w-1/2 h-full pointer-events-auto">
          <Lanyard position={[2, 2, 10]} gravity={[0, -40, 0]} fov={25} transparent={true} />
        </div>
      </div>

      <div className="relative z-10 px-6 text-left pointer-events-none mt-20 md:mt-0 grid grid-cols-1 md:grid-cols-2 gap-8 items-center ">

        <div className="space-y-6">

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-2xl leading-tight">
            <BlurText
              text="My Portofolio"
              delay={150}
              animateBy="words"
              direction="top"
              className="inline-block"
            />
          </h1>

          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0.5}
            className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed"
          >
            A computer science student with a strong interest in technology and creativity.
            This portfolio represents my learning journey, experiments, and growth.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0.7}
            className="
              flex 
              flex-col 
              lg:flex-row 
              items-start 
              md:items-center 
              gap-4 
              md:gap-5
              pointer-events-auto
            "
          >
            <button
              onClick={() => {
                if (cvData?.name_cv) {
                  window.open(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/download/cv/${cvData.name_cv}`,
                    '_blank'
                  );
                }
              }}
              className="
                group relative inline-flex items-center justify-center gap-2
                w-full sm:w-full lg:w-auto
                px-6 md:px-7 lg:px-8
                py-3 md:py-3.5 lg:py-4
                bg-white text-black rounded-full font-semibold
                transition-all duration-300
                hover:scale-105 hover:bg-gray-100
              "
            >
              <span>Download CV</span>
              <FaDownload className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            </button>

            <button
              onClick={(e: any) => handleNavClick(e, '#about')}
              className="
                group inline-flex items-center justify-center gap-2
                w-full sm:w-full lg:w-auto
                px-6 md:px-7 lg:px-8
                py-3 md:py-3.5 lg:py-4
                bg-transparent border border-white/20 text-white rounded-full font-medium
                backdrop-blur-sm
                transition-all duration-300
                hover:bg-white/10
              "
            >
              <span>Explore</span>
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>


          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0.9}
            className="pt-5 md:pt-8 border-t border-white/10"
          >
            <p className="text-sm text-gray-400 mb-4">Tech Stack</p>
            <div className="flex flex-wrap gap-3">
              {['React', 'Next.js', 'Laravel', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Golang', 'Figma'].map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="hidden md:block">
        </div>
      </div>
    </section>
  )
}

export default Hero