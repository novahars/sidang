import { useEffect } from "react";
import { Box3, Vector3, Raycaster, Vector2 } from "three";
import gsap from "gsap";
import { CameraContext } from "../contexts/CameraContext";

export default function CameraControl(
  ref,
  controls,
  camera,
  scene,
  click,
  setClick,
  setData,
  content,
  objectCameraPosition,
  loadingComplete // Add loadingComplete prop
) {
  // Initialize window.cameraControls immediately
  if (!window.cameraControls) {
    window.cameraControls = {};
  }

  // Handle initial third-person camera setup after loading
  useEffect(() => {
    if (loadingComplete && camera) {
      gsap.to(camera.position, {
        x: 0,
        y: 2,
        z: 6,
        duration: 2,
        ease: "power3.inOut",
        onComplete: () => {
          if (controls) {
            controls.target.set(0, 1, 0);
            controls.update();
          }
        }
      });
    }
  }, [loadingComplete, camera, controls]);

  const resetCamera = () => {
    if (!controls) return;

    // Reset to third-person position instead of original position
    gsap.to(camera.position, {
      x: 0,
      y: 2,
      z: 6,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        controls.target.set(0, 1, 0);
        controls.update();
      }
    });

    controls.azimuthRotateSpeed = 0.2;
    controls.polarRotateSpeed = 0.2;
    controls.dollySpeed = 1;

    setClick(false);
    setData((prevData) => ({ ...prevData, boolean: false }));
  };

  const moveCamera = () => {
    if (!ref.current) {
      console.error("Reference to object is not ready.");
      return;
    }

    const object = new Box3().setFromObject(ref.current);
    const center = object.getCenter(new Vector3());

    const tween = gsap.to(controls, {
      duration: 1,
      paused: true,
      onUpdate: () => {
        controls.azimuthRotateSpeed = 0;
        controls.polarRotateSpeed = 0;
        controls.dollySpeed = 0;

        controls.setLookAt(
          objectCameraPosition.x,
          objectCameraPosition.y,
          objectCameraPosition.z,
          center.x,
          center.y,
          center.z,
          true
        );
      },
      onComplete: () => {
        setData((prevData) => ({
          ...prevData,
          key: content.key,
          boolean: true,
          value: content.title,
          description: content.description,
        }));
      },
    });

    tween.play(0);
    setClick(true);
  };


  // Update window.cameraControls immediately
  window.cameraControls.resetCamera = resetCamera;
  window.cameraControls.moveCamera = moveCamera;

  const handleClickOutside = (event) => {
    const mouse = new Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (
      !intersects.some((intersect) => intersect.object === ref.current) &&
      click
    ) {
      console.log("Clicked outside object, resetting camera.");
      resetCamera();
    }
  };

  return {
    moveCamera, resetCamera, handleClickOutside
  };
}
