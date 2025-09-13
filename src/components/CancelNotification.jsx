import { useState, useEffect } from "react";

export default function CancelNotification({ show, message }) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2500); // hides after 2.5 seconds
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div className="fixed top-6 right-6 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in z-50">
      {message}
    </div>
  );
}
