import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

const helpSections = [
  {
    title: "Getting Started",
    faqs: [
      {
        question: "How do I create an account?",
        answer: (
          <div>
            <p>Follow these steps to create your Camirent account:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>
                Tap the <strong>Sign Up</strong> button on the homepage.
              </li>
              <li>
                Enter your full name, email, and WhatsApp number (recommended).
              </li>
              <li>Create a strong password and confirm it.</li>
              <li>Verify your account via the WhatsApp message sent to you.</li>
              <li>Once verified, log in and start browsing properties.</li>
            </ol>
            <p className="mt-2 text-sm text-gray-500">
              Tip: Use a valid phone number to ensure quick verification.
            </p>
          </div>
        ),
      },
      {
        question: "How do I log in?",
        answer: (
          <div>
            <p>Log in easily by following these steps:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>
                Tap <strong>Login</strong> on the homepage.
              </li>
              <li>Enter your registered email and password.</li>
              <li>
                If you forgot your password, tap{" "}
                <strong>Forgot Password</strong> and follow the reset steps.
              </li>
            </ol>
            <p className="mt-2 text-sm text-gray-500">
              Tip: Keep your password secure and private.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    title: "For Tenants",
    faqs: [
      {
        question: "How do I find a property?",
        answer: (
          <div>
            <p>Finding a property is simple:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Use the search bar at the top of the homepage.</li>
              <li>Filter by location, size, budget, or property type.</li>
              <li>Browse listings and tap a property to view details.</li>
              <li>
                Tap <strong>Message Landlord</strong> to contact directly via
                WhatsApp.
              </li>
            </ol>
            <p className="mt-2 text-sm text-gray-500">
              Note: All listings are verified. Report suspicious listings via{" "}
              <Link to="/contact" className="text-black underline">
                Contact
              </Link>
              .
            </p>
          </div>
        ),
      },

      {
        question: "How do I report a fake listing or issue?",
        answer: (
          <span>
            Navigate to{" "}
            <Link to="/contact" className="text-black underline">
              Support > Contact
            </Link>{" "}
            and submit your report. Our team will verify and take action
            quickly.
          </span>
        ),
      },
    ],
  },
  {
    title: "For Landlords & Caretakers",
    faqs: [
      {
        question: "How do I post a property?",
        answer: (
          <div>
            <p>Posting a property is simple:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Register and complete verification via WhatsApp.</li>
              <li>
                Go to <strong>Post Property</strong>.
              </li>
              <li>
                Fill in all property details: location, type, price,
                description, images.
              </li>
              <li>Submit for review. Only approved properties go live.</li>
            </ol>
            <p className="mt-2 text-sm text-gray-500">
              Tip: Clear photos and accurate details attract more tenants.
            </p>
          </div>
        ),
      },
      {
        question: "Can Camirent post my property for me?",
        answer:
          "Yes! If posting is difficult, our team can post on your behalf after verification.",
      },
      {
        question: "How can I manage my listings?",
        answer: (
          <div>
            <p>
              Use the <strong>My Listings</strong> tab to manage your
              properties:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Mark properties as Available or Rented.</li>
              <li>Deactivate or Activate listings.</li>
              <li>
                Deletion is possible but not recommended; deactivation is safer.
              </li>
            </ul>
          </div>
        ),
      },
    ],
  },
  {
    title: "Technical / App Usage",
    faqs: [
      {
        question: "Is Camirent free to use?",
        answer:
          "Yes! Camirent is completely free for tenants and landlords/caretakers.",
      },
      {
        question: "How do I use the Help section?",
        answer:
          "Tap Support > Help to view instructions for all features. Expand questions for step-by-step guidance.",
      },
      {
        question: "What happens when a property is deactivated or rented?",
        answer:
          "Deactivated or rented properties are hidden from tenants until reactivated by the landlord or caretaker.",
      },
    ],
  },
];

export default function Help() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);

  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-6 text-black">
        Camirent Help Center
      </h1>
      <p className="text-center text-gray-700 mb-10 text-lg">
        Get step-by-step guidance for tenants, landlords, and caretakers.
      </p>

      {helpSections.map((section, secIndex) => (
        <div key={secIndex} className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-black">
            {section.title}
          </h2>
          <div className="space-y-2">
            {section.faqs.map((faq, faqIndex) => {
              const globalIndex = secIndex * 10 + faqIndex;
              const isOpen = openIndex === globalIndex;
              return (
                <div
                  key={faqIndex}
                  className="border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => toggleFAQ(globalIndex)}
                    className="w-full px-5 py-3 flex justify-between items-center text-left bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none"
                  >
                    <span className="font-medium text-black">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 py-4 bg-white text-gray-700 text-sm">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="text-center mt-12">
        <p className="text-lg text-gray-700 mb-4">
          Still need help? Reach out to us anytime!
        </p>
        <Link
          to="/contact"
          className="inline-block bg-black text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
