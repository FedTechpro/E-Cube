import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  {
    category: "General Questions",
    items: [
      {
        question: "What is Camirent?",
        answer:
          "Camirent is a real estate rental platform that connects tenants directly with landlords and caretakers—no agent involved. It’s free, always live, and easy to use.",
      },
      {
        question: "Do you have a physical office?",
        answer:
          "No, we don’t currently have a physical office. However, we are always available to assist users through the Support > Contact page.",
      },
      {
        question: "How can I contact Camirent for support?",
        answer:
          "You can reach us via WhatsApp using the number on Support > Contact or send an in-app message through the same page.",
      },
    ],
  },
  {
    category: "For Tenants",
    items: [
      {
        question: "How do I find a property on Camirent?",
        answer:
          "Register for an account and browse available properties, or use the search and filter tools to quickly find properties that match your needs.",
      },
      {
        question: "How do I contact a landlord?",
        answer:
          "Once you find a property you like, tap on it to view details and message the landlord directly via WhatsApp.",
      },
      {
        question: "Are all listings trustworthy?",
        answer:
          "Yes! All listings are verified, reviewed, and approved before going live. Any fake listings will result in sanctions and possible banning of the landlord or caretaker.",
      },
      {
        question: "Can I report a problem or fake listing?",
        answer:
          "Absolutely! Use the Support > Contact page to report issues or suspicious listings.",
      },
    ],
  },
  {
    category: "For Landlords & Caretakers",
    items: [
      {
        question: "How do I post a property?",
        answer:
          "After being verified by our team, you can post your property. Listings go live only after review and approval.",
      },
      {
        question: "How can I manage my posted properties?",
        answer:
          "Use the My Listings tab. You can mark properties as Available, Rented, Deactivate, Activate, or Delete (use deactivation instead if possible).",
      },
      {
        question: "How are landlords and caretakers reviewed?",
        answer:
          "We verify all landlords and caretakers via WhatsApp after signup. If a user is unverified, their property will remain under review until they are verified as trustworthy and professional.",
      },
      {
        question: "Can Camirent help me post my property?",
        answer:
          "Yes! We can post properties on behalf of landlords and caretakers who find it difficult to do so themselves, ensuring the listing goes live correctly.",
      },
    ],
  },
  {
    category: "Technical / App Usage",
    items: [
      {
        question: "How do I use the Help section?",
        answer:
          "If you are unsure about any feature or section of the app, tap Support > Help for detailed instructions.",
      },
      {
        question: "Can I use Camirent for free?",
        answer:
          "Yes! Camirent is completely free to use for both tenants and landlords/caretakers.",
      },
      {
        question:
          "What happens if my property is marked as rented or deactivated?",
        answer: "It will not be live or visible to tenants until reactivated.",
      },
    ],
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-12 text-black">
        Frequently Asked Questions
      </h1>

      {faqs.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-10">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            {section.category}
          </h2>
          <div className="space-y-3">
            {section.items.map((faq, index) => {
              const globalIndex = sectionIndex * 10 + index; // unique index
              const isOpen = openIndex === globalIndex;

              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <button
                    onClick={() => toggleFAQ(globalIndex)}
                    className="w-full px-5 py-4 flex justify-between items-center text-left bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none"
                  >
                    <span className="font-medium text-gray-800">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp size={20} className="text-indigo-600" />
                    ) : (
                      <ChevronDown size={20} className="text-indigo-600" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 py-4 bg-white text-gray-700 border-t border-gray-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Extra help / contact section */}
      <div className="mt-12 text-center bg-indigo-50 p-6 rounded-xl shadow-md">
        <p className="mb-4 text-gray-800">
          Need more assistance? Visit our{" "}
          <Link
            to="/contact"
            className="text-indigo-700 font-semibold hover:underline"
          >
            Contact
          </Link>{" "}
          page or check our{" "}
          <Link
            to="/help"
            className="text-indigo-700 font-semibold hover:underline"
          >
            Help
          </Link>{" "}
          section.
        </p>
      </div>
    </div>
  );
}
