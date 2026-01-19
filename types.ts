export type UniformValue = number;

export interface ShaderUniformConfig {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: UniformValue;
}

export interface ShaderPreset {
  id: string;
  name: string;
  values: Record<string, UniformValue>;
}

export interface ShaderDefinition {
  id: string;
  name: string;
  description: string;
  vertexShader: string;
  fragmentShader: string;
  uniforms: ShaderUniformConfig[];
  presets: ShaderPreset[];
}

export type ShaderUniformValues = Record<string, UniformValue>;
