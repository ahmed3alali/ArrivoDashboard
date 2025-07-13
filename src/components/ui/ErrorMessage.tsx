// components/ErrorMessage.tsx
import { AlertCircle } from 'lucide-react';

export const ErrorMessage = ({ message }: { message: string }) => (
  <div className="text-center py-16  rounded-lg shadow-sm mb-4">
    <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
    <h2 className="text-xl font-semibold text-red-600 mb-2">
      An error occurred while fetching data.
    </h2>
    <p className="text-gray-600 max-w-md mx-auto">
      {message || 'Try refreshing the page or contact our support line for backend support.'}
    </p>
  </div>
);
