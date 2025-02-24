import { useContext, useEffect, useRef } from "react";
import { ContentContext } from "./App";
import { motion } from "framer-motion";

export default function Content({ onOutsideClick }) {
  const { data, setData } = useContext(ContentContext);
  const modalRef = useRef();

  // Fungsi untuk menangani klik di luar modal
  const handleClickOutside = (event) => {
    if (
      modalRef.current && 
      !modalRef.current.contains(event.target) && 
      data.boolean 
    ) {
      setData({ ...data, boolean: false, move: null });
      if (onOutsideClick) {
        onOutsideClick(); 
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [data.boolean]); 

  return (
    <>
      {data.boolean && (
        <motion.div
          className="block absolute bottom-0 md:bottom-auto md:top-1/4 md:right-[15%] transform -translate-x-1/2 -translate-y-1/2 z-[99999999] w-screen md:w-auto"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          ref={modalRef} 
        >
          <div className="flex flex-col flex-1 w-96 md:w-80 h-1/2 card p-10 shadow-2xl rounded-xl drop-shadow-xl">
            <div className="text-2xl card-title font-semibold">
              {data.value}
            </div>
            <p className="mt-5 small-desc overflow-y-auto">
              {data.description ? data.description : "Deskripsi belum tersedia"}
            </p>
            <div className="go-corner">
              <div
                className="go-arrow cursor-pointer hover:text-blue-100 text-2xl"
                onClick={() => setData({ ...data, boolean: false, move: null })} 
              >
                X
              </div>
            </div>
            {data.key === "monument" && (
              <a href="https://indi.marketing/" className="w-full">
                <button className="mt-5 px-4 py-2 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Explore Now
                </button>
              </a>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}
