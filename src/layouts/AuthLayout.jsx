const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-6 sm:mb-8">
          <span className="text-2xl sm:text-3xl font-semibold text-gray-900">LearnLog</span>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 sm:p-8">
          {children}
        </div>

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6">
          © 2026 LearnLog. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
