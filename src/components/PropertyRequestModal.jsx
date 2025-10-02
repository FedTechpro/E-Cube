import { useState } from "react";

export default function PropertyRequestModal({
  isRequestModalOpen,
  setIsRequestModalOpen,
}) {
  const [requestText, setRequestText] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setError(null);

    if (!requestText.trim()) {
      setError("⚠️ Please enter your property request details.");
      return;
    }
    if (!whatsapp.trim()) {
      setError("⚠️ Please enter your WhatsApp number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:4000/api/properties/request-space",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requestText, whatsapp }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to submit request");
      }

      setMessageSent(true);
      setRequestText("");
      setWhatsapp("");
    } catch (err) {
      setError("❌ Failed to send request. Please try again later.");
      console.error("Error submitting property request:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isRequestModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-11/12 max-w-md p-6 relative">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Submit a Property Request
        </h2>

        {/* Success message */}
        {messageSent && (
          <div className="mb-3 p-3 rounded-lg bg-green-100 text-green-700 text-sm">
            ✅ Your request has been submitted! We’ll contact you on WhatsApp.
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-3 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows="4"
          placeholder="Describe the property you are looking for (location, size, budget, etc.)..."
          value={requestText}
          onChange={(e) => setRequestText(e.target.value)}
          disabled={loading}
        />

        <input
          type="tel"
          className="mt-3 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter your WhatsApp number"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          disabled={loading}
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            onClick={() => setIsRequestModalOpen(false)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-white transition ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-700 hover:bg-indigo-800"
            }`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
