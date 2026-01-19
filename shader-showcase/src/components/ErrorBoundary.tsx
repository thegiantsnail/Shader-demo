import React from 'react';

const serializeError = (error: any) => {
  if (error instanceof Error) {
    // Check for shader compilation errors
    const isShaderError = error.message.includes('shader') || 
                          error.message.includes('GLSL') ||
                          error.message.includes('compile');
    
    if (isShaderError) {
      return `🎨 Shader Compilation Error\n\n${error.message}\n\n${error.stack || ''}`;
    }
    
    return error.message + '\n' + (error.stack || '');
  }
  return JSON.stringify(error, null, 2);
};

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: any }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const errorMsg = serializeError(this.state.error);
      const isShaderError = errorMsg.includes('Shader');
      
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
          <div className="max-w-3xl w-full bg-gray-900 border-2 border-red-500 rounded-xl p-8 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="text-4xl">{isShaderError ? '🎨' : '❌'}</div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-red-400 mb-2">
                  {isShaderError ? 'Shader Error Detected' : 'Something Went Wrong'}
                </h2>
                <p className="text-gray-300 mb-4">
                  {isShaderError 
                    ? 'There was an issue compiling the GLSL shader. Check the error details below:'
                    : 'An unexpected error occurred. Please try refreshing the page.'}
                </p>
                <pre className="bg-gray-950 text-red-300 p-4 rounded-lg overflow-auto text-sm font-mono border border-gray-800 max-h-96">
                  {errorMsg}
                </pre>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
