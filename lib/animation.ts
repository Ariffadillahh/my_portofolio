import { Variants } from "framer-motion";

export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 40 
  },
  visible: (customDelay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: customDelay,
      duration: 0.5,
      ease: "easeInOut"
    }
  })
};

