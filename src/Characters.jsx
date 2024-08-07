import React, { useRef, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useSpring } from '@react-spring/three';
import { useFrame } from '@react-three/fiber';

const Characters = () => {
  const ref = useRef();
  const { scene } = useGLTF('/assets/glb/Character.glb');

  // Breathing effect: alternate scaling of the torso
  const breathingSpring = useSpring({
    scale: [1, 1.05, 1],
    config: { duration: 2000 },
    loop: { reverse: true }
  });

  // Smile effect
  const [smile, setSmile] = useState(false); // True for smiling, false for neutral
  const smileSpring = useSpring({
    shape: smile ? [1, 1.2] : [1, 1],
    config: { duration: 1000 },
  });

  // Laugh effect
  const [laugh, setLaugh] = useState(false); // True for laughing, false for neutral
  const laughSpring = useSpring({
    shape: laugh ? [1.2, 1.2] : [1, 1],
    config: { duration: 1000 },
  });

  // Head and eye movement effect
  const [headRotation, setHeadRotation] = useState([0, 0, 0]);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const smileInterval = setInterval(() => {
      setSmile(prev => !prev);
    }, 10000); // Change smile every 10 seconds

    const laughInterval = setInterval(() => {
      setLaugh(prev => !prev);
    }, 15000); // Change laugh every 15 seconds

    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;

      const xRotation = (clientY / innerHeight - 0.5) * 0.4; // Rotation range -0.2 to 0.2
      const yRotation = (clientX / innerWidth - 0.5) * 0.4; // Rotation range -0.2 to 0.2

      setHeadRotation([xRotation, yRotation, 0]);
      mousePos.current = { x: yRotation, y: xRotation };
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(smileInterval);
      clearInterval(laughInterval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [smile, laugh]);

  useFrame(() => {
    if (ref.current) {
      const torso = ref.current.getObjectByName('Torso');
      const head = ref.current.getObjectByName('Head'); // Make sure your model has this
      const leftEye = ref.current.getObjectByName('LeftEye');
      const rightEye = ref.current.getObjectByName('RightEye');
      const mouth = ref.current.getObjectByName('Mouth'); // Make sure your model has this

      if (torso) {
        torso.scale.set(...breathingSpring.scale.get());
      }

      if (head) {
        head.rotation.set(headRotation[0], headRotation[1], headRotation[2]);
      }

      if (leftEye && rightEye) {
        leftEye.rotation.set(mousePos.current.y, mousePos.current.x, 0);
        rightEye.rotation.set(mousePos.current.y, mousePos.current.x, 0);
      }

      if (mouth) {
        const smileShape = smileSpring.shape.get();
        const laughShape = laughSpring.shape.get();
        // Apply smile and laugh shapes to the mouth
        mouth.scale.set(smileShape[0], smileShape[1], 1);
        // If both smile and laugh are applied, you might want to combine them
        if (laugh) {
          mouth.scale.set(laughShape[0], laughShape[1], 1);
        }
      }
    }
  });

  return <primitive ref={ref} object={scene} scale={1} />;
};

export default Characters;
