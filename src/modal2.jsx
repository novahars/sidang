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
  const [activeSubSection, setActiveSubSection] = useState("");

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
      subSections: [
        { id: "burger-1", title: "Brand Identity" },
        { id: "burger-2", title: "Brand Strategy" },
        { id: "burger-3", title: "Market Research" },
        { id: "burger-4", title: "Brand Activation" }
      ]
    },
    {
      key: "ferrisWheel",
      title: "DIGITAL MARKETING",
      description:
        "Comprehensive digital marketing solutions to boost your online presence and drive measurable results.",
      subSections: [
        { id: "ferris-1", title: "Social Media", description: "Strategic social media management" },
        { id: "ferris-2", title: "SEO", description: "Search engine optimization services" },
        { id: "ferris-3", title: "Content Strategy", description: "Digital content strategy development" },
        { id: "ferris-4", title: "Analytics", description: "Data-driven marketing insights" }
      ]
    },
    {
      key: "monument",
      title: "ABOUT US",
      description:
        "A creative agency dedicated to delivering innovative solutions and exceptional results for our clients.",
      subSections: [
        { id: "monument-1", title: "Our Story", description: "The journey of our agency" },
        { id: "monument-2", title: "Team", description: "Meet our expert team" },
        { id: "monument-3", title: "Vision", description: "Our vision for the future" },
        { id: "monument-4", title: "Values", description: "Our core values and principles" }
      ]
    },
    {
      key: "clapperboard",
      title: "CONTENT MARKETING and CREATIVE WORKS",
      description:
        "Engaging content creation and creative solutions that tell your brand's story effectively.",
      subSections: [
        { id: "clapper-1", title: "Video Production", description: "Professional video content creation" },
        { id: "clapper-2", title: "Copywriting", description: "Compelling copywriting services" },
        { id: "clapper-3", title: "Design", description: "Creative design solutions" },
        { id: "clapper-4", title: "Animation", description: "Dynamic animation services" }
      ]
    },
    {
      key: "jumbotron",
      title: "PR and MEDIA BUYING",
      description:
        "Strategic PR campaigns and media buying services to maximize your brand's visibility and impact.",
      subSections: [
        { id: "jumbotron-1", title: "Media Relations", description: "Building strong media relationships" },
        { id: "jumbotron-2", title: "Press Releases", description: "Strategic press release distribution" },
        { id: "jumbotron-3", title: "Media Planning", description: "Effective media planning services" },
        { id: "jumbotron-4", title: "Crisis Management", description: "Professional crisis management" }
      ]
    },
    {
      key: "stage",
      title: "EVENT ORGANIZER",
      description:
        "End-to-end event planning and execution services that create memorable experiences.",
      subSections: [
        { id: "stage-1", title: "Corporate Events", description: "Professional corporate event management" },
        { id: "stage-2", title: "Conferences", description: "Large-scale conference organization" },
        { id: "stage-3", title: "Product Launches", description: "Innovative product launch events" },
        { id: "stage-4", title: "Virtual Events", description: "Digital and hybrid event solutions" }
      ]
    }
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
      const subSectionElements = Array.from(
        scrollContainer.getElementsByClassName("sub-section")
      );

      const containerRect = scrollContainer.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;

      // Check subsections first
      let closestSubSection = null;
      let minSubDistance = Infinity;

      subSectionElements.forEach((subSection) => {
        const rect = subSection.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - containerCenter);

        if (distance < minSubDistance) {
          minSubDistance = distance;
          closestSubSection = subSection;
        }
      });

      if (closestSubSection) {
        setActiveSubSection(closestSubSection.id);
      }

      // Then check main sections
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

    // Add this line to reset camera when modal closes
    if (window.cameraControls) {
      window.cameraControls.resetCamera();
    }
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
                    className="cursor-pointer text-black hover:text-red-500 text-2xl"
                    onClick={closeModal}
                  >
                    X
                  </div>
                </div>

                {/* sidebar + content */}
                <div className={`flex flex-1 overflow-hidden ${isMobile ? "flex-col" : ""}`}>
                  <nav className={`${isMobile ? "w-full h-1/4" : "w-1/4"} border-r p-4 relative bg-gray-50 overflow-y-auto`}>
                    {activeSection && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                      >
                        {sections
                          .filter(({ key }) => key === activeSection)
                          .map(({ key, title, subSections }) => (
                            <div key={key} className="space-y-2">
                              <div className="text-lg font-bold text-green-500 p-2 bg-white rounded-md shadow-md">
                                {title}
                              </div>
                              <div className="pl-4 space-y-2">
                                {subSections.map((sub) => (
                                  <motion.div
                                    key={sub.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`cursor-pointer p-2 hover:bg-white rounded-md transition-all ${
                                      activeSubSection === sub.id ? "bg-white text-green-500 font-bold" : ""
                                    }`}
                                    onClick={() => {
                                      const element = document.getElementById(sub.id);
                                      if (element) {
                                        element.scrollIntoView({ behavior: "smooth", block: "center" });
                                      }
                                    }}
                                  >
                                    <h4 className="font-medium text-gray-700">{sub.title}</h4>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          ))}
                      </motion.div>
                    )}
                  </nav>

                  <div className={`${isMobile ? "w-full h-3/4" : "w-3/4"} p-6 overflow-y-auto`} id="scrollContainer">
                    {activeSection && sections
                      .filter(({ key }) => key === activeSection)
                      .map(({ key, title, description, subSections }) => (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="content-section"
                          id={key}
                        >
                          <h3 className="text-3xl font-bold mb-4">{title}</h3>
                          <p className="text-gray-600 text-lg leading-relaxed mb-8">{description}</p>
                          
                          <div className="space-y-12">
                            {subSections.map((sub) => (
                              <motion.div
                                key={sub.id}
                                id={sub.id}
                                className="sub-section p-6 bg-white rounded-lg shadow-md"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                              >
                                <h4 className="text-2xl font-bold mb-4">{sub.title}</h4>
                                <p className="text-gray-600">{sub.description}</p>
                                {/* Add more content for each subsection as needed */}
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
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