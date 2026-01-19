/// <reference types="vite/client" />

// React Three Fiber types
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

export {}
