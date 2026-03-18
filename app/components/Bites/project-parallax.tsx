"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "motion/react";
import Link from "next/link";

export const ProjectsParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 100]),
    springConfig
  );


  const buttonOpacity = useSpring(
    useTransform(scrollYProgress, [0.6, 0.95], [0, 1]),
    springConfig
  );

  const buttonY = useSpring(
    useTransform(scrollYProgress, [0.6, 0.95], [20, 0]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="h-[170vh] md:h-[190vh] py-10 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />

      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20 ">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        style={{
          opacity: buttonOpacity,
          y: buttonY
        }}
        className="absolute bottom-10 right-5 z-50 md:bottom-20"
      >
        <Link
          href="/projects"
          className="group flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium transition-all hover:bg-white/20 hover:scale-105 hover:border-purple-500/50"
        >
          <span>See All Projects</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-10 md:py-20 px-4 w-full left-0 top-0">
      <h1 className="text-4xl md:text-7xl font-bold text-white">
        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-700">Projects</span>
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 text-neutral-200">
        A collection of projects I have worked on, ranging from web applications to experiments with new technologies. Each project represents a step in my learning journey.
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  const imgUrl = `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/${product.thumbnail}`;

  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -20 }}
      key={product.title}
      className="group/product w-[30rem] relative shrink-0"
    >
      <Link href={product.link} className="block relative w-full">

        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">

          <img
            src={imgUrl}
            className="absolute inset-0 w-full h-full object-cover 
                   group-hover/product:shadow-2xl transition-shadow"
            alt={product.title}
          />

          <div className="absolute inset-0 bg-black/50 opacity-0
                      group-hover/product:opacity-80 transition-opacity" />

          <h2 className="absolute bottom-4 left-4 text-white font-bold text-xl
                     opacity-0 group-hover/product:opacity-100 transition-opacity">
            {product.title}
          </h2>

        </div>
      </Link>
    </motion.div>

  );
};