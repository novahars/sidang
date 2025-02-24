
import { Canvas } from "@react-three/fiber";
import { Suspense, createContext, useState, useEffect } from "react";

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import LoadingScreen from "./LoadingScreen";
import {
  EffectComposer,
  Outline,
  Selection,
} from "@react-three/postprocessing";
import Content from "./Content";
import Experience from "./Experience";
import { CameraProvider } from './contexts/CameraContext';
import CameraControll from './models/CameraControll';
import SceneSetup from "./SceneSetup";
import KeyDisplayComponent from './KeyDisplayComponent';

export const ContentContext = createContext();

export default function App() {
  const [data, setData] = useState({
    boolean: false,
    key: "",
    value: "",
    description: "",
    move: null,
  });
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [progress, setProgress] = useState(0);
  // const [loadingComplete, setLoadingComplete] = useState(false);
  const [startZoom, setStartZoom] = useState(false); // Menyimpan status zoom

  const handleOutsideClick = () => {
    console.log("Clicked outside modal, resetting camera.");
    setData({ ...data, boolean: false, move: null }); // Reset data dan kamera
  };
  useEffect(() => {
    let interval = null;

    if (showLoadingScreen) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            setShowLoadingScreen(false);
            return 100;
          }
          return prevProgress + 2;
        });
      }, 100);
    } 

    return () => clearInterval(interval);
  }, [showLoadingScreen]);

  // const handleEnter = () => {
  //   setShowLoadingScreen(false);  // Sembunyikan loading screen
  //   setLoadingComplete(true);     // Tandai loading selesai
  //   setStartZoom(true);           // Trigger zoom setelah tombol ditekan
  // };

  const [sky, setSky] = useState(null);
  const [loadingComplete, setLoadingComplete] = useState(false);


  useEffect(() => {
    const loader = new RGBELoader();
    loader.load("assets/autumn_field_puresky_4kcopy.hdr", (loadedTexture) => {
      loadedTexture.mapping = THREE.EquirectangularReflectionMapping;
      setSky(loadedTexture);
    });
  }, []);

  const controls = CameraControll(/* pass necessary parameters here */);

  return (
    <ContentContext.Provider value={{ data, setData }}>
      <CameraProvider>
        <div className="relative w-full h-screen">
          {showLoadingScreen && (
            <LoadingScreen
              sky={sky}
              loadingComplete={!showLoadingScreen}
            />
          )}
          <Suspense fallback={null}>
            <div className="relative w-full h-full">
              <Canvas
                camera={{
                  position: [0, 100, 200], // Start position during loading
                  fov: 75,
                  near: 0.1,
                  far: 1000
                }}
                className="absolute w-full h-full"
              >
                <Selection>
                  <EffectComposer multisampling={8} autoClear={false}>
                    <Outline
                      blur
                      visibleEdgeColor="white"
                      edgeStrength={100}
                      width={3000}
                    />
                  </EffectComposer>
                  <Experience
                    loadingComplete={!showLoadingScreen}
                  />
                  <KeyDisplayComponent />
                  <SceneSetup />
                </Selection>
              </Canvas>
            </div>
          </Suspense>
          <Content onOutsideClick={handleOutsideClick} />
        </div>
      </CameraProvider>
    </ContentContext.Provider>
  );
}