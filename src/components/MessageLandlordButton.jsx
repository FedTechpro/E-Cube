import { useState } from "react";
import { X, Info, CheckCircle } from "lucide-react";

const MessageLandlordButton = ({ propertyTitle, authorWhatsApp }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleProceed = () => {
    const waLink = `https://wa.me/237${authorWhatsApp}?text=${encodeURIComponent(
      `Hello, I'm interested in your ${propertyTitle} listed on Camirent!`
    )}`;
    window.open(waLink, "_blank");
    setModalOpen(false);
  };

  return (
    <>
      {/* WhatsApp Button */}
      <button
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md bg-indigo-700 text-white py-3 rounded-lg shadow-lg hover:bg-indigo-800 transition-colors z-40"
        onClick={() => setModalOpen(true)}
      >
        Message Landlord
      </button>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-200">
            {/* Close Icon */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
              <Info className="w-6 h-6 text-indigo-700 flex-shrink-0" />
              <h2 className="text-2xl font-bold text-gray-800">
                Important Notice
              </h2>
            </div>

            {/* Content */}
            <p className="text-gray-700 mb-4">
              Camirent does not collect rent. All transactions happen directly
              between you and the landlord/caretaker. Please follow these best
              practices:
            </p>

            <ul className="space-y-3 mb-6">
              {[
                "Visit the property physically before making any payment.",
                "Always prefer bank payment. If cash is required, ensure the landlord/caretaker provides a receipt.",
                "Verify the landlord/caretaker with neighbors or trusted sources if needed.",
                "Camirent is not liable for financial losses due to transactions outside the platform.",
              ].map((text, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{text}</span>
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProceed}
                className="px-4 py-2 bg-indigo-700 text-white rounded hover:bg-indigo-800 transition-colors"
              >
                Proceed to Message
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageLandlordButton;
