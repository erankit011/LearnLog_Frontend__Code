import { Link } from 'react-router-dom';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-3 sm:px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-full shadow-lg mb-4 sm:mb-6">
            <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 text-red-600" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-2">404</h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-3 sm:mb-4">Page Not Found</p>
          <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4">
          <Link to="/" className="w-full">
            <Button className="w-full min-h-[44px]">
              <Home className="h-5 w-5 mr-2" />
              Go to Dashboard
            </Button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full px-6 py-2.5 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center justify-center gap-2 min-h-[44px]"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-300">
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
            Need help? Contact our support team
          </p>
          <a
            href="mailto:support@learnlog.com"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
          >
            support@learnlog.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
