import * as THREE from 'three';
import { ShaderUniformValues } from '../types';

interface ShaderUniformMap {
  [key: string]: { value: number | THREE.Vector2 };
}

export const buildUniforms = (
  values: ShaderUniformValues,
  resolution: { width: number; height: number }
): ShaderUniformMap => {
  const uniforms: ShaderUniformMap = {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(resolution.width, resolution.height) },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
  };

  Object.entries(values).forEach(([key, value]) => {
    uniforms[key] = { value };
  });

  return uniforms;
};

export const updateUniforms = (uniforms: ShaderUniformMap, values: ShaderUniformValues) => {
  Object.entries(values).forEach(([key, value]) => {
    if (uniforms[key]) {
      uniforms[key].value = value;
    }
  });
};

export const updateResolution = (
  uniforms: ShaderUniformMap,
  width: number,
  height: number
) => {
  if (uniforms.uResolution?.value instanceof THREE.Vector2) {
    uniforms.uResolution.value.set(width, height);
  }
};

const compileShader = (
  gl: WebGLRenderingContext,
  type: number,
  source: string
): string | null => {
  const shader = gl.createShader(type);
  if (!shader) {
    return 'Unable to allocate shader.';
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    gl.deleteShader(shader);
    return null;
  }
  const log = gl.getShaderInfoLog(shader) || 'Unknown shader compilation error.';
  gl.deleteShader(shader);
  return log;
};

export const validateShaderProgram = (
  gl: WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string
): string | null => {
  const vertexError = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  if (vertexError) {
    return `Vertex shader error:\n${vertexError}`;
  }

  const fragmentError = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (fragmentError) {
    return `Fragment shader error:\n${fragmentError}`;
  }

  return null;
};

export const downloadDataUrl = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
