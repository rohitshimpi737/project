import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="p-4 bg-red-50 rounded-lg border border-red-200 flex items-center gap-3">
      <ExclamationTriangleIcon className="w-6 h-6 text-red-600 flex-shrink-0" />
      <div>
        <p className="text-red-700">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm text-red-700 underline hover:text-red-800"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
