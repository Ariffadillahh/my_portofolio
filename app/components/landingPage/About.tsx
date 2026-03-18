import React from 'react'
import { motion } from "framer-motion"
import { fadeInUp } from '@/lib/animation';
import { Timeline } from '../Bites/timeline';

const About = () => {
    const data = [
        {
            title: "2024 - Present",
            content: (
                <div>
                    <h4 className="text-lg font-bold text-white mb-2">Politeknik Negeri Jakarta</h4>
                    <p className="mb-4 text-base font-normal text-neutral-200 text-justify">
                        Currently pursuing a degree in Informatics & Computer Engineering (Teknik Informatika & Komputer). Focusing on deepening my knowledge in full-stack web development and software engineering principles.
                    </p>
                </div>
            ),
        },
        {
            title: "Oct 2025",
            content: (
                <div>
                    <h4 className="text-lg font-bold text-white mb-2">Mentor at EXPERTIK</h4>
                    <p className="mb-4 text-base font-normal text-neutral-200 text-justify">
                        Selected as a Mentor for <strong>EXPECTIK</strong> an orientation event for new TIK students at PNJ. Guided new students in understanding the department culture, academic environment, and basic technical concepts.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="h-40 w-full rounded-xl bg-neutral-800/50 border border-white/10 flex flex-col items-center justify-center text-neutral-500 text-sm p-4 text-center animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2 opacity-50">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            <span>Foto LKS 1</span>
                        </div>

                        <div className="h-40 w-full rounded-xl bg-neutral-800/50 border border-white/10 flex flex-col items-center justify-center text-neutral-500 text-sm p-4 text-center animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2 opacity-50">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            <span>Foto LKS 2</span>
                        </div>
                    </div>
                    <p className="text-xs text-neutral-400 mt-2 italic">
                        Foto Dokumentasi Mentor EXPERTIK 2025.
                    </p>
                </div>
            ),
        },
        {
            title: "Late 2024",
            content: (
                <div>
                    <h4 className="text-lg font-bold text-white mb-2">Computer Student Club (CSC)</h4>
                    <p className="mb-4 text-base font-normal text-neutral-200 text-justify">
                        Active member of the KSM Web Dev (CSC PNJ). Successfully secured <strong>Top 2 in the Final Project Software Development</strong> competition held by the club, demonstrating strong problem-solving skills through the development of a <strong>Perfume Store Website</strong>.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="h-40 w-full rounded-xl bg-neutral-800/50 border border-white/10 flex flex-col items-center justify-center text-neutral-500 text-sm p-4 text-center animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2 opacity-50">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            <span>Foto LKS 1</span>
                        </div>

                        <div className="h-40 w-full rounded-xl bg-neutral-800/50 border border-white/10 flex flex-col items-center justify-center text-neutral-500 text-sm p-4 text-center animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2 opacity-50">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            <span>Foto LKS 2</span>
                        </div>
                    </div>
                    <p className="text-xs text-neutral-400 mt-2 italic">
                        Foto Project / Awarding CSC
                    </p>
                </div>
            ),
        },
        {
            title: "Feb - Apr 2023",
            content: (
                <div>
                    <h4 className="text-lg font-bold text-white mb-2">PT Mitratech Indonesia</h4>
                    <p className="mb-4 text-base font-normal text-neutral-200 text-justify">
                        Internship experience as a <strong>Team Leader</strong>. Led the development of a Geographic Information System (GIS) based on maps for location data management. Responsible for project planning, task distribution, and supervising the project until completion.
                    </p>
                    <div className="mt-4">
                        <div className="h-40 w-full md:w-2/3 rounded-xl bg-neutral-800/50 border border-white/10 flex flex-col items-center justify-center text-neutral-500 text-sm p-4 text-center animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2 opacity-50">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0 6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-xs text-neutral-400 mt-2 italic">
                        Documentation during internship at PT Mitratech Indonesia.
                    </p>
                </div>
            ),
        },
        {
            title: "2021 - 2024",
            content: (
                <div>
                    <h4 className="text-lg font-bold text-white mb-2">SMK Bhumi Husada</h4>
                    <p className="mb-4 text-base font-normal text-neutral-200 text-justify">
                        Graduated with a focus on Software Engineering (Rekayasa Perangkat Lunak). During my studies, I actively honed my skills and participated in prestigious competitions, including the <strong>Lomba Kompetensi Siswa (LKS)</strong>.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="h-40 w-full rounded-xl bg-neutral-800/50 border border-white/10 flex flex-col items-center justify-center text-neutral-500 text-sm p-4 text-center animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2 opacity-50">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            <span>Foto LKS 1</span>
                        </div>

                        <div className="h-40 w-full rounded-xl bg-neutral-800/50 border border-white/10 flex flex-col items-center justify-center text-neutral-500 text-sm p-4 text-center animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2 opacity-50">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            <span>Foto LKS 2</span>
                        </div>
                    </div>
                    <p className="text-xs text-neutral-400 mt-2 italic">
                        Documentation moments from the LKS competition.
                    </p>
                </div>
            ),
        },
    ];

    return (
        <section id='about' className='mx-5 py-20'>
            <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.1}
                className="">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                    About My <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-700">Journey</span>
                </h2>
                <div className="">
                    <p className="text-neutral-300 text-base md:text-lg leading-relaxed text-justify">
                        Hello, I am <strong>Arif Fadillah Wicaksono</strong>, a Computer Science student (Class of 2024) with a keen interest in Software Development, Coding, and AI.
                        Currently, I am focused on mastering web technologies such as <strong>Next.js, Node.js</strong>, and databases for full-stack applications.
                        I also have experience participating in <strong>LKS competitions</strong> and managing external projects.
                        I pride myself on being a problem solver, an effective communicator, and possessing strong leadership skills.
                    </p>
                </div>
            </motion.div>
            <motion.h1
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.3}
                className="relative w-full overflow-clip">
                <Timeline data={data} />
            </motion.h1>
        </section>
    )
}

export default About