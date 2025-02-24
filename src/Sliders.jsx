import { createRef, useContext, useEffect, useRef, useState } from "react";
import { ContentContext } from "./App";
import { motion, AnimatePresence } from "framer-motion";
import useIntersectionObserver from "./hooks/useIntersectionObserver";
import { useCameraControls } from "./contexts/CameraContext";

const sliderRefContent = [
    { key: 'burger', title: 'BRAND STRATEGY and ACTIVATION', description: 'A comprehensive approach to define a brand\'s identity, position it in the market, and engage audiences through impactful campaigns, creating meaningful connections and driving business growth' },
    { key: 'ferrisWheel', title: 'DIGITAL MARKETING', description: 'Leveraging online platforms and tools to promote brands, products, or services through strategies like SEO, social media, email, and content marketing, driving engagement, awareness, and measurable business growth.' },
    { key: 'monument', title: 'ABOUT US', description: 'Need More information? Click This Button For detail.' },
    { key: 'clapperboard', title: 'CONTENT MARKETING and CREATIVE WORKS', description: 'Crafting engaging, value-driven content and creative assets to connect with audiences, build brand awareness, and drive actions that align with business objectives, fostering long-term relationships and growth.' },
    { key: 'jumbotron', title: 'PR and MEDIA BUYING', description: 'Strategic efforts to build brand reputation through public relations while optimizing ad placements across media channels, ensuring maximum visibility, audience engagement, and return on investment.' },
    { key: 'stage', title: 'EVENT ORGANIZER', description: 'Professionals specializing in planning, coordinating, and executing events, ensuring seamless experiences through detailed logistics, creative concepts, and efficient management to meet client goals and create memorable moments.' },
];

export default function Sliders() {
    const { data, setData } = useContext(ContentContext);
    const cameraControls = useCameraControls();
    const elementRefs = useRef(sliderRefContent.map(() => createRef()));
    const container = useRef();
    const slidersRef = useRef();

    const [isTouchOrClickActive, setIsTouchOrClickActive] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    const handleInteractionState = (isActive) => () => {
        setIsTouchOrClickActive(isActive);
    };

    useEffect(() => {
        const events = [
            { type: 'touchstart', handler: handleInteractionState(true) },
            { type: 'touchend', handler: handleInteractionState(false) },
            { type: 'mousedown', handler: handleInteractionState(true) },
            { type: 'mouseup', handler: handleInteractionState(false) }
        ];

        const handleScroll = () => {
            setIsScrolling(true);
            clearTimeout(window.scrollTimeout);
            window.scrollTimeout = setTimeout(() => setIsScrolling(false), 100);
        };

        // Add all event listeners
        events.forEach(({ type, handler }) => {
            window.addEventListener(type, handler);
        });
        container.current?.addEventListener('scroll', handleScroll);

        // Cleanup function
        return () => {
            events.forEach(({ type, handler }) => {
                window.removeEventListener(type, handler);
            });
            container.current?.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (slidersRef.current && !slidersRef.current.contains(event.target)) {
                setData(prev => ({ ...prev, boolean: false }));
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [setData]);

    const visibleElements = useIntersectionObserver(elementRefs, { root: container.current, threshold: 1.0 });
    const prevVisibleElements = useRef([]);

    useEffect(() => {
        if (
            visibleElements.length <= 0 ||
            isTouchOrClickActive
        ) {
            return;
        }

        if (JSON.stringify(prevVisibleElements.current) !== JSON.stringify(visibleElements)) {
            prevVisibleElements.current = visibleElements;

            const index = sliderRefContent.findIndex(item => item.key === visibleElements[0]);
            if (index !== -1) {
                setData({ ...data, key: sliderRefContent[index].key, move: sliderRefContent[index].key });
            }
        }
    }, [data, visibleElements, isTouchOrClickActive]);

    useEffect(() => {
        if (data.key && data.boolean && !isScrolling) {
            const index = sliderRefContent.findIndex(item => item.key === data.key);
            if (index !== -1 && elementRefs.current[index].current) {
                elementRefs.current[index].current.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [data, data.key, data.boolean, isScrolling]);

    const closeModal = async () => {
        try {
            // First reset camera position
            if (cameraControls && cameraControls.resetCamera) {
                console.log("Calling resetCamera from closeModal");
                await cameraControls.resetCamera();
            }

            // Then close modal with animation
            setData(prev => ({
                ...prev,
                boolean: false,
                key: null,
                move: null,
                description: null
            }));

        } catch (error) {
            console.error("Error in closeModal:", error);
            // Fallback close
            setData(prev => ({ ...prev, boolean: false }));
        }
    };

    useEffect(() => {
        // Cleanup function for modal state
        return () => {
            if (data.boolean) {
                closeModal();
            }
        };
    }, []);

    return (
        <AnimatePresence>
            {data.boolean && (
                <motion.div
                    ref={slidersRef}
                    className="flex md:hidden absolute z-10 p-3 flex-row flex-nowrap gap-5 snap-x snap-mandatory overflow-x-scroll bottom-0 w-screen h-1/3"
                    ref={container}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {sliderRefContent.map((item, index) => (
                        <motion.div
                            ref={elementRefs.current[index]}
                            key={index}
                            layoutId={`modal-${item.key}`}
                            data-comkey={item.key}
                            className="snap-always snap-center card-mobile w-full shrink-0 p-4 md:p-5 bg-white rounded-xl shadow-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-xl md:text-1xl card-title-mobile font-semibold">
                                {item.title}
                            </div>
                            <p className="mt-0 small-desc-mobile overflow-y-auto text-sm md:text-base">
                                {data.description ? data.description : "Deskripsi belum tersedia"}
                            </p>
                            <div
                                className="go-corner cursor-pointer"
                                onClick={closeModal}
                                role="button"
                                aria-label="Close modal"
                            >
                                <div className="go-arrow">X</div>
                            </div>
                            {item.key === "monument" && (
                                <a href="https://indi.marketing/" className="w-full">
                                    <button className="px-3 mt-6 py-2 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                        Explore Now
                                    </button>
                                </a>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
}