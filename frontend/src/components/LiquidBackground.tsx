"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// 1. THE SHADER CODE (This creates the liquid effect on the GPU)
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Noise function to create organic liquid movement
  float random (in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }
  float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 uv = vUv;
    
    // Calculate distance from mouse
    float dist = distance(uv, uMouse);
    
    // Create ripples based on mouse distance
    float wave = sin(dist * 10.0 - uTime * 2.0) * 0.05;
    float interaction = 0.0;
    
    // If mouse is close, distort stronger
    if (dist < 0.3) {
      interaction = (0.3 - dist) * 0.5;
    }

    // Color Palette (Dark Blue/Grey like the reference site)
    vec3 colorA = vec3(0.05, 0.05, 0.05); // Almost Black
    vec3 colorB = vec3(0.1, 0.15, 0.3);   // Deep Blue
    
    // Mix colors based on noise and time
    float n = noise(uv * 3.0 + uTime * 0.2 + interaction);
    vec3 finalColor = mix(colorA, colorB, n + wave);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const FluidPlane = () => {
  const mesh = useRef<THREE.Mesh>(null);
  const { viewport, size } = useThree();
  
  // Uniforms are variables we pass from JS to the Shader
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    []
  );

  useFrame((state) => {
    if (mesh.current) {
      // 1. Update Time
      mesh.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
      
      // 2. Smooth Mouse Movement (Linear Interpolation)
      const targetX = (state.mouse.x + 1) / 2;
      const targetY = (state.mouse.y + 1) / 2;
      
      mesh.current.material.uniforms.uMouse.value.x += (targetX - mesh.current.material.uniforms.uMouse.value.x) * 0.1;
      mesh.current.material.uniforms.uMouse.value.y += (targetY - mesh.current.material.uniforms.uMouse.value.y) * 0.1;
    }
  });

  return (
    <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export default function LiquidBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-black">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <FluidPlane />
      </Canvas>
    </div>
  );
}