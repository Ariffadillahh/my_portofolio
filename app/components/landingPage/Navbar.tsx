import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

type MenuItem = {
    label: string;
    href: string;
    ariaLabel?: string;
    rotation?: number;
    yOffset?: number;
    zIndex?: number;
    gradient?: string;
};

export type BubbleMenuProps = {
    onMenuClick?: (open: boolean) => void;
    className?: string;
    style?: CSSProperties;
    items?: MenuItem[];
    menuBg?: string;
};

const DEFAULT_ITEMS: MenuItem[] = [
    {
        label: 'home',
        href: '#home',
        rotation: -8,
        yOffset: 0,
        zIndex: 10,
        gradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    },
    {
        label: 'about',
        href: '#about',
        rotation: 3,
        yOffset: 20,
        zIndex: 20,
        gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    },
    {
        label: 'projects',
        href: '#projects',
        rotation: 10,
        yOffset: -5,
        zIndex: 10,
        gradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)'
    },
    {
        label: 'contact',
        href: '#contact',
        rotation: 6,
        yOffset: 15,
        zIndex: 20,
        gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
    }
];

export default function Navbar({
    onMenuClick,
    className,
    style,
    items,
}: BubbleMenuProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);

    const overlayRef = useRef<HTMLDivElement>(null);
    const bubblesRef = useRef<HTMLAnchorElement[]>([]);
    const labelRefs = useRef<HTMLSpanElement[]>([]);

    const menuItems = items?.length ? items : DEFAULT_ITEMS;

    const animationEase = 'back.out(1.4)';
    const animationDuration = 0.6;
    const staggerDelay = 0.06;

    const containerClassName = [
        'bubble-menu',
        'fixed',
        'left-0 right-0 top-6',
        'flex items-center justify-between',
        'px-6 md:10 lg:px-20',
        'pointer-events-none',
        'z-[1001]',
        className
    ]
        .filter(Boolean)
        .join(' ');

    const handleToggle = () => {
        const nextState = !isMenuOpen;
        if (nextState) setShowOverlay(true);
        setIsMenuOpen(nextState);
        onMenuClick?.(nextState);
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();

        // Close menu first
        setIsMenuOpen(false);

        // Smooth scroll after menu closes
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

    useEffect(() => {
        const overlay = overlayRef.current;
        const bubbles = bubblesRef.current.filter(Boolean);
        const labels = labelRefs.current.filter(Boolean);
        if (!overlay || !bubbles.length) return;

        if (isMenuOpen) {
            gsap.set(overlay, { display: 'flex', opacity: 0 });
            gsap.killTweensOf([overlay, ...bubbles, ...labels]);

            gsap.to(overlay, {
                opacity: 1,
                duration: 0.4,
                ease: 'power2.out'
            });

            gsap.set(bubbles, { scale: 0.8, opacity: 0 });
            gsap.set(labels, { y: 5, autoAlpha: 0 });

            bubbles.forEach((bubble, i) => {
                const delay = i * staggerDelay;
                const tl = gsap.timeline({ delay });
                tl.to(bubble, {
                    scale: 1,
                    opacity: 1,
                    duration: animationDuration,
                    ease: animationEase
                });

                if (labels[i]) {
                    tl.to(labels[i], {
                        y: 0,
                        autoAlpha: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    }, '-=0.4');
                }
            });
        } else if (showOverlay) {
            gsap.killTweensOf([overlay, ...bubbles, ...labels]);

            gsap.to(labels, { autoAlpha: 0, duration: 0.15 });
            gsap.to(bubbles, {
                scale: 0.9,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in'
            });

            gsap.to(overlay, {
                opacity: 0,
                duration: 0.5,
                ease: 'power2.inOut',
                delay: 0.1,
                onComplete: () => {
                    gsap.set(overlay, { display: 'none' });
                    setShowOverlay(false);
                }
            });
        }
    }, [isMenuOpen, showOverlay]);

    useEffect(() => {
        const handleResize = () => {
            if (isMenuOpen) {
                const bubbles = bubblesRef.current.filter(Boolean);
                const isDesktop = window.innerWidth >= 768;
                bubbles.forEach((bubble, i) => {
                    const item = menuItems[i];
                    if (bubble && item) {
                        const rotation = isDesktop ? (item.rotation ?? 0) : 0;
                        gsap.set(bubble, { rotation });
                    }
                });
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMenuOpen, menuItems]);

    return (
        <>
            <style>{`
        .bubble-menu-items {
            background: 
                radial-gradient(ellipse at top left, rgba(88, 28, 135, 0.3) 0%, transparent 50%),
                radial-gradient(ellipse at top right, rgba(29, 78, 216, 0.3) 0%, transparent 50%),
                radial-gradient(ellipse at bottom, rgba(109, 40, 217, 0.25) 0%, transparent 50%),
                rgba(10, 10, 30, 0.72);
            backdrop-filter: blur(20px) saturate(1.5);
            perspective: 1200px;
        }

        .bubble-menu-items .pill-list {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            max-width: 900px;
            margin: 0 auto;
            gap: 10px;
            padding: 20px;
        }

        .bubble-menu-items .pill-col {
            flex: 0 0 auto;
            display: flex;
            justify-content: center;
        }

        @media (min-width: 768px) {
           .bubble-menu-items .pill-link {
               transform: rotate(var(--item-rot)) translateY(var(--item-y));
               transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
           }
           .bubble-menu-items .pill-link:hover {
               transform: rotate(var(--item-rot)) translateY(var(--item-y)) scale(1.15);
               filter: brightness(1.15) saturate(1.2);
               box-shadow: 
                 0 0 40px rgba(255,255,255,0.4),
                 0 20px 60px -10px rgba(0,0,0,0.6),
                 inset 0 1px 0 rgba(255,255,255,0.6) !important;
               z-index: 100 !important;
           }
        }

        @media (max-width: 767px) {
            .bubble-menu-items .pill-list {
                flex-direction: column;
                gap: 20px;
                padding: 40px 20px;
            }
            .bubble-menu-items .pill-col { margin: 0; }
            .bubble-menu-items .pill-link {
                width: 200px !important;
                transform: none !important;
            }
        }
      `}</style>

            <nav className={containerClassName} style={style} aria-label="Main navigation">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm text-gray-300 animate-pulse pointer-events-auto">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Available for Hire
                </div>

                <button
                    type="button"
                    onClick={handleToggle}
                    className="w-12 h-12 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)] flex flex-col items-center justify-center gap-[5px] pointer-events-auto transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/30"
                >
                    <span
                        className="block w-6 h-[2px] bg-white rounded-full transition-all duration-300 shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                        style={{ transform: isMenuOpen ? 'translateY(3.5px) rotate(45deg)' : 'none' }}
                    />
                    <span
                        className="block w-6 h-[2px] bg-white rounded-full transition-all duration-300 shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                        style={{ transform: isMenuOpen ? 'translateY(-3.5px) rotate(-45deg)' : 'none' }}
                    />
                </button>
            </nav>

            {showOverlay && (
                <div
                    ref={overlayRef}
                    className="bubble-menu-items fixed inset-0 flex items-center justify-center pointer-events-auto z-[1000]"
                >
                    <ul className="pill-list list-none p-0 m-0">
                        {menuItems.map((item, idx) => (
                            <li key={idx} className="pill-col" style={{ zIndex: item.zIndex }}>
                                <a
                                    href={item.href}
                                    onClick={(e) => handleNavClick(e, item.href)}
                                    className="pill-link relative flex items-center justify-center no-underline uppercase"
                                    style={{
                                        ['--item-rot' as any]: `${item.rotation ?? 0}deg`,
                                        ['--item-y' as any]: `${item.yOffset ?? 0}px`,

                                        background: item.gradient || 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                                        color: '#1a1a2e',

                                        border: 'none',

                                        boxShadow: `
                                            0 10px 40px -10px rgba(0,0,0, 0.4),
                                            inset 0 1px 0 rgba(255,255,255, 0.5),
                                            inset 0 -1px 0 rgba(0,0,0, 0.1)
                                        `,

                                        borderRadius: '60px',
                                        padding: '18px 45px',
                                        minWidth: '140px',
                                        height: 'auto',

                                        fontFamily: 'system-ui, -apple-system, sans-serif',
                                        fontWeight: 500,
                                        fontSize: '1.1rem',
                                        letterSpacing: '-0.02em',
                                    }}
                                    ref={el => { if (el) bubblesRef.current[idx] = el; }}
                                >
                                    <span
                                        className="inline-block relative z-10"
                                        ref={el => { if (el) labelRefs.current[idx] = el; }}
                                    >
                                        {item.label}
                                    </span>

                                    <span
                                        className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white to-transparent opacity-40 rounded-t-full pointer-events-none"
                                    />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}

