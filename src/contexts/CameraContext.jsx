import { createContext, useContext } from 'react';

const CameraContext = createContext(null);

export const useCameraControls = () => {
    const context = useContext(CameraContext);
    
    if (!context) {
        console.warn('CameraContext not found. Are you using CameraProvider?');
        // Return a dummy implementation to prevent crashes
        return {
            resetCamera: async () => {
                console.warn('Camera controls not available');
                return Promise.resolve();
            }
        };
    }
    
    return context;
};

export const CameraProvider = ({ children, controls }) => {
    return (
        <CameraContext.Provider value={controls}>
            {children}
        </CameraContext.Provider>
    );
};

export { CameraContext };
