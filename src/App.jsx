import React from 'react';
import './App.css';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Characters from './Characters';

function App() {
  return (
    <div className="App">
      <div className="visualization">
        <Canvas>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          <OrbitControls />
          <Environment preset="sunset" background />
          <Characters />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
