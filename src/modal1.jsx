import { useContext, useEffect, useState } from "react";
import { ContentContext } from "./App";
import { motion } from "framer-motion";
import { Link as ScrollLink, Element, scroller } from "react-scroll";

export default function Content() {
  const { data, setData } = useContext(ContentContext);
  const [isSmallModal, setIsSmallModal] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sections = [
    {
      key: "burger",
      title: "BRAND STRATEGY and ACTIVATION",
      description:
        "We help brands develop effective strategies and create meaningful activations that resonate with their target audience.",
    },
    {
      key: "ferrisWheel", 
      title: "DIGITAL MARKETING",
      description:
        "Comprehensive digital marketing solutions to boost your online presence and drive measurable results.",
    },
    {
      key: "monument",
      title: "ABOUT US", 
      description:
        "A creative agency dedicated to delivering innovative solutions and exceptional results for our clients.",
    },
    {
      key: "clapperboard",
      title: "CONTENT MARKETING and CREATIVE WORKS",
      description:
        "Engaging content creation and creative solutions that tell your brand's story effectively.",
    },
    {
      key: "jumbotron",
      title: "PR and MEDIA BUYING",
      description:
        "Strategic PR campaigns and media buying services to maximize your brand's visibility and impact.",
    },
    {
      key: "stage",
      title: "EVENT ORGANIZER",
      description:
        "End-to-end event planning and execution services that create memorable experiences.",
    },
  ];

  useEffect(() => {
    if (data.boolean && !hasScrolled) {
      setIsSmallModal(true);
      setModalTitle(data.value);
      const section = sections.find((s) => s.title === data.value);
      if (section) {
        setActiveSection(section.key);
        setTimeout(() => {
          const element = document.getElementById(section.key);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            setHasScrolled(true);
          }
        }, 1200);
      }
      const timer = setTimeout(() => setIsFullScreen(true), 1000);
      return () => clearTimeout(timer);
    } else if (!data.boolean) {
      setIsSmallModal(false);
      setIsFullScreen(false);
      setModalTitle("");
      setActiveSection("");
      setHasScrolled(false);
    }
  }, [data.boolean, data.value, sections, hasScrolled]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.getElementById("scrollContainer");
      if (!scrollContainer) return;

      const sectionElements = Array.from(
        scrollContainer.getElementsByClassName("content-section")
      );
      const containerRect = scrollContainer.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;

      let closestSection = null;
      let minDistance = Infinity;

      sectionElements.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - containerCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestSection = section;
        }
      });

      if (closestSection) {
        const sectionId = closestSection.id;
        const matchedSection = sections.find((s) => s.key === sectionId);
        if (matchedSection) {
          setActiveSection(sectionId);
          setModalTitle(matchedSection.title);
        }
      }
    };

    const scrollContainer = document.getElementById("scrollContainer");
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      const scrollContainer = document.getElementById("scrollContainer");
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [sections]);

  const closeModal = () => {
    setData({ ...data, boolean: false });
    setIsSmallModal(false);
    setIsFullScreen(false);
    setModalTitle("");
    setActiveSection("");
    setHasScrolled(false);
  };

  const handleSectionClick = (key) => {
    const section = sections.find((s) => s.key === key);
    if (section) {
      setData({ boolean: true, value: section.title });
      setModalTitle(section.title);
      setActiveSection(key);

      scroller.scrollTo(key, {
        containerId: "scrollContainer",
        smooth: true,
        offset: -100,
        duration: 500,
      });

      setTimeout(() => {
        const element = document.getElementById(key);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 1200);
    }
  };

  return (
    <>
      {data.boolean && (
        <>
          <motion.div
            className="fixed inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.3 }}
          />

          {isSmallModal && !isFullScreen && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-[99999999999999999]"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="bg-white shadow-xl rounded-lg p-6 text-xl font-bold text-center w-80">
                {modalTitle}
              </div>
            </motion.div>
          )}

          {isFullScreen && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-[999999999]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <motion.div
                className="bg-white w-screen h-screen inset-0 flex flex-col relative overflow-hidden"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <div className="flex justify-between items-center p-6 bg-gray-100 border-b shadow-md">
                  <motion.div
                    key={activeSection}
                    className="text-2xl font-semibold"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {modalTitle}
                  </motion.div>
                  <div
                    className="cursor-pointer hover:text-red-500 text-2xl"
                    onClick={closeModal}
                  >
                    ✖
                  </div>
                </div>

                <div className={`flex flex-1 overflow-hidden ${isMobile ? "flex-col" : ""}`}>
                  <nav className={`${isMobile ? "w-full h-1/4" : "w-1/4"} border-r p-4 relative bg-gray-50 overflow-y-auto`}>
                    <motion.div
                      animate={{
                        [isMobile ? "left" : "top"]: isMobile
                          ? `${sections.findIndex((s) => s.key === activeSection) * 120}px`
                          : `${sections.findIndex((s) => s.key === activeSection) * 50}px`,
                      }}
                      className={`absolute ${isMobile ? "top-0 h-1 w-20" : "left-0 w-1 h-10"} bg-green-500 rounded-r-md`}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                    <ul className={`${isMobile ? "flex space-x-4 overflow-x-auto" : "space-y-2"}`}>
                      {sections.map(({ key, title }) => (
                        <li key={key} className={isMobile ? "flex-shrink-0" : ""}>
                          <ScrollLink
                            to={key}
                            containerId="scrollContainer"
                            spy={true}
                            smooth={true}
                            duration={500}
                            offset={-100}
                            isDynamic={true}
                            onClick={() => handleSectionClick(key)}
                            className={`cursor-pointer text-lg block px-3 py-2 rounded-md transition-all ${
                              activeSection === key
                                ? "bg-green-500 text-white font-bold shadow-md"
                                : "text-gray-400 hover:bg-gray-100"
                            } ${isMobile ? "whitespace-nowrap" : ""}`}
                          >
                            {title}
                          </ScrollLink>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  <div className={`${isMobile ? "w-full h-3/4" : "w-3/4"} p-6 overflow-y-auto`} id="scrollContainer">
                    <div className="flex flex-col space-y-8">
                      {sections.map(({ key, title, description }) => (
                        <Element
                          key={key}
                          name={key}
                          id={key}
                          className={`content-section ${isMobile ? "min-h-[75vh]" : "min-h-screen"} flex flex-col justify-center border-b py-6`}
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`transition-opacity duration-300 ${activeSection === key ? "opacity-100" : "opacity-50"}`}
                          >
                            <section>
                              <h3 className="text-3xl font-bold mb-4">{title}</h3>
                              <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
                            </section>
                          </motion.div>
                        </Element>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </>
  );
}