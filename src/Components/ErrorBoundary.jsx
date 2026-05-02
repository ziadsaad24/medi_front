import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50" dir="rtl">
          <div className="text-center max-w-md p-8">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-4xl text-white">!</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">حدث خطأ غير متوقع</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              عذراً، حدث خطأ أثناء تحميل هذه الصفحة. يرجى المحاولة مرة أخرى.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-gradient-to-r from-[#0F427D] to-[#008080] text-white rounded-xl font-bold shadow-lg hover:brightness-110 transition-all"
              >
                إعادة المحاولة
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-white text-[#0F427D] border border-blue-200 rounded-xl font-bold shadow-sm hover:bg-blue-50 transition-all"
              >
                العودة للرئيسية
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
