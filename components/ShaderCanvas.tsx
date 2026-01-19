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
  const { size, gl } = useThree();
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
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
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
  ({ vertexShader, fragmentShader, uniformValues, isPlaying, timeScale, onCompileError }, ref) => {
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

    return (
      <div className="w-full h-full bg-black">
        <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
          <ShaderPlane
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniformValues={uniformValues}
            isPlaying={isPlaying}
            timeScale={timeScale}
            onCompileError={onCompileError}
            onReady={(gl) => setRenderer(gl)}
          />
        </Canvas>
      </div>
    );
  }
);

ShaderCanvas.displayName = 'ShaderCanvas';

export default ShaderCanvas;
