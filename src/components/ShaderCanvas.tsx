import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ShaderUniformValues } from '../types';
import {
  buildUniforms,
  downloadDataUrl,
  updateResolution,
  updateUniforms,
  validateShaderProgram,
} from '../utils/shaderUtils';

export interface ShaderCanvasHandle {
  capture: () => void;
}

interface ShaderCanvasProps {
  vertexShader: string;
  fragmentShader: string;
  uniformValues: ShaderUniformValues;
  isPlaying: boolean;
  timeScale: number;
  onCompileError?: (error: string | null) => void;
  onFpsUpdate?: (fps: number) => void;
}

interface ShaderPlaneProps extends ShaderCanvasProps {
  onReady: (gl: THREE.WebGLRenderer) => void;
}

const ShaderPlane: React.FC<ShaderPlaneProps> = ({
  vertexShader,
  fragmentShader,
  uniformValues,
  isPlaying,
  timeScale,
  onCompileError,
  onReady,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size, gl, viewport } = useThree();
  const dpr = gl.getPixelRatio();

  const uniforms = useMemo(
    () => buildUniforms(uniformValues, { width: size.width * dpr, height: size.height * dpr }),
    [vertexShader, fragmentShader]
  );

  useEffect(() => {
    onReady(gl);
    const error = validateShaderProgram(gl.getContext(), vertexShader, fragmentShader);
    if (onCompileError) {
      onCompileError(error);
    }
  }, [gl, vertexShader, fragmentShader, onCompileError, onReady]);

  useEffect(() => {
    updateUniforms(uniforms, uniformValues);
  }, [uniformValues, uniforms]);

  useEffect(() => {
    updateResolution(uniforms, size.width * dpr, size.height * dpr);
  }, [size.width, size.height, dpr, uniforms]);

  const [frameCount, setFrameCount] = useState(0);
  const lastTimeRef = useRef(performance.now());

  useFrame((state, delta) => {
    if (!meshRef.current) {
      return;
    }
    const material = meshRef.current.material as THREE.ShaderMaterial;
    if (isPlaying) {
      material.uniforms.uTime.value += delta * timeScale;
    }
    material.uniforms.uMouse.value.lerp(
      new THREE.Vector2((state.mouse.x + 1) / 2, (state.mouse.y + 1) / 2),
      0.1
    );

    // FPS monitoring
    setFrameCount(prev => prev + 1);
    const now = performance.now();
    if (now - lastTimeRef.current >= 1000) {
      if (onFpsUpdate) {
        onFpsUpdate(Math.round((frameCount * 1000) / (now - lastTimeRef.current)));
      }
      setFrameCount(0);
      lastTimeRef.current = now;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
};

const ShaderCanvas = forwardRef<ShaderCanvasHandle, ShaderCanvasProps>(
  ({ vertexShader, fragmentShader, uniformValues, isPlaying, timeScale, onCompileError, onFpsUpdate }, ref) => {
    const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);

    useImperativeHandle(ref, () => ({
      capture: () => {
        if (!renderer) {
          return;
        }
        const url = renderer.domElement.toDataURL('image/png');
        downloadDataUrl(url, `shader-${Date.now()}.png`);
      },
    }));

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    return (
      <div className="w-full h-full bg-black">
        <Canvas 
          camera={{ position: [0, 0, 1] }} 
          dpr={isMobile ? [1, 1.5] : [1, 2]}
          gl={{
            antialias: !isMobile,
            alpha: false,
            powerPreference: isMobile ? 'default' : 'high-performance'
          }}
        >
          <ShaderPlane
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniformValues={uniformValues}
            isPlaying={isPlaying}
            timeScale={timeScale}
            onCompileError={onCompileError}
            onFpsUpdate={onFpsUpdate}
            onReady={(gl) => setRenderer(gl)}
          />
        </Canvas>
      </div>
    );
  }
);

ShaderCanvas.displayName = 'ShaderCanvas';

export default ShaderCanvas;
