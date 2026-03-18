import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animation';
import { FaGithub, FaLinkedin, FaInstagram, FaPaperPlane } from 'react-icons/fa';
import Link from 'next/link';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useCreteMessageMutation } from '@/app/services/message.service';
import toast from 'react-hot-toast';


const contactSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Please enter a valid email address").required("Email is required"),
  content: yup.string().min(10, "Message must be at least 10 characters").max(200, "Message max 200 characters").required("Message is required"),
});

type ContactFormData = {
  name: string;
  email: string;
  content: string;
};

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      content: "",
    },
  });

  const [createMessage, { isLoading }] = useCreteMessageMutation();

  const onSubmit = async (data: ContactFormData) => {
    try {
      createMessage(data);
      reset();

      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  }

  const socialLinks = [
    {
      name: 'GitHub',
      icon: <FaGithub className="w-6 h-6" />,
      href: 'https://github.com/Ariffadillahh',
      color: 'hover:text-white',
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedin className="w-6 h-6" />,
      href: 'https://linkedin.com/in/arif-fadillah-wicaksono-7b9753218',
      color: 'hover:text-blue-400',
    },
    {
      name: 'Instagram',
      icon: <FaInstagram className="w-6 h-6" />,
      href: 'https://instagram.com/fdlharip',
      color: 'hover:text-pink-500',
    },
  ];

  return (
    <section id="contact" className="relative w-full pt-20 pb-10 px-7 md:px-10 overflow-hidden">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Let's work <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-700">
                Together
              </span>
            </h2>
            <p className="text-neutral-300 text-lg max-w-md leading-relaxed">
              Have a project in mind or just want to say hi? I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
            </p>

            <div className="pt-4">
              <a href="mailto:fadilaharif99@gmail.com" className="text-xl font-semibold text-white border-b-2 border-purple-500 hover:text-purple-400 transition-colors">
                fadilaharif99@gmail.com
              </a>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.2}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden group">

              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm text-neutral-400 ml-1">Name</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="John Doe"
                      {...register("name")}
                      className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm text-neutral-400 ml-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      {...register("email")}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm text-neutral-400 ml-1">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    {...register("content")}
                    placeholder="Tell me about your project..."
                    className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none"
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold text-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>Send Message</span>
                  <FaPaperPlane className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.4}
          className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <p className="text-neutral-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Arif Fadillah Wicaksono. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                target="_blank"
                className={`text-neutral-400 transition-all duration-300 transform hover:scale-110 ${social.color}`}
                aria-label={social.name}
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Contact;