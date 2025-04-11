import React, { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, footer, isLoading }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn"
      onClick={!isLoading ? onClose : undefined}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl p-5 md:p-6 w-full max-w-md mx-auto shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-lg md:text-xl font-bold text-black dark:text-white">
            {title}
          </h2>
          <button
            onClick={!isLoading ? onClose : undefined}
            disabled={isLoading}
            className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto mb-6 flex-grow pr-1 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-200 dark:scrollbar-track-gray-800">
          {children}
        </div>

        {footer && (
          <div className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
