import React, { useContext, useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  HelpCircle,
  FileQuestion,
  Home,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import PropertyRequestModal from "../components/PropertyRequestModal";

export default function Contact({ setIsRequestModalOpen }) {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.whatsapp || "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitted(false);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/properties/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setError("❌ Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-indigo-600 text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-lg max-w-xl mx-auto">
          We’re here to help you find your dream property. Reach out to us
          today!
        </p>
      </div>

      {/* Main Content */}
      <div className="mx-auto lg:px-6 py-12 grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="p-8 rounded-xl shadow-lg bg-white">
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>

          {submitted && (
            <p className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 text-sm font-medium">
              ✅ Your message has been sent successfully!
            </p>
          )}

          {error && (
            <p className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm font-medium">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              disabled={loading}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              disabled={loading}
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number (optional)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              disabled={loading}
            />
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              disabled={loading}
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              rows={5}
              disabled={loading}
            />
            <button
              type="submit"
              className={`w-full font-semibold py-3 rounded-lg transition-colors ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed text-white"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Contact Info + Extra Links */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Contact Info</h2>
            <div className="flex items-center mb-4">
              <MapPin className="mr-3 text-indigo-600" />
              <span>123 Main Street, Your City, Country</span>
            </div>
            <div className="flex items-center mb-4">
              <Phone className="mr-3 text-indigo-600" />
              <span>+1 234 567 890</span>
            </div>
            <div className="flex items-center">
              <Mail className="mr-3 text-indigo-600" />
              <span>info@realestate.com</span>
            </div>
          </div>

          {/* Helpful Links */}
          <div className="bg-white p-8 rounded-xl shadow-lg space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
            <Link
              to="/faq"
              className="flex items-center text-indigo-600 hover:underline"
            >
              <FileQuestion className="mr-2" /> FAQ
            </Link>
            <Link
              to="/help"
              className="flex items-center text-indigo-600 hover:underline"
            >
              <HelpCircle className="mr-2" /> Help Center
            </Link>
            <Link
              onClick={() => setIsRequestModalOpen(true)}
              className="flex items-center text-indigo-600 hover:underline"
            >
              <Home className="mr-2" /> Request Property
            </Link>
          </div>

          {/* Optional Google Map */}
          <div className="rounded-xl overflow-hidden shadow-lg h-64">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086526637113!2d-122.41941538468202!3d37.77492927975915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085816ebd6f1f1b%3A0x4c0bb95b5de9d0e2!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1695838360806!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Google Map"
            ></iframe>
          </div>
        </div>
      </div>
      <PropertyRequestModal />
    </div>
  );
}
