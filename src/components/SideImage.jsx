import { Check } from "lucide-react";

export default function SideImage() {
  return (
    <>
      <div className="hidden lg:flex flex-1 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-indigo-700 opacity-80 mix-blend-multiply"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-4">Find Your Perfect Space</h1>
            <p className="text-lg opacity-90">
              Join thousands of users who have found their ideal living space
              through our platform. Whether you're renting, managing, or owning
              properties, we make the process seamless.
            </p>
            <div className="flex items-center mt-8 space-x-2">
              <Check className="w-5 h-5 text-white" />
              <span>Verified properties and tenants</span>
            </div>
            <div className="flex items-center mt-2 space-x-2">
              <Check className="w-5 h-5 text-white" />
              <span>Secure payment processing</span>
            </div>
            <div className="flex items-center mt-2 space-x-2">
              <Check className="w-5 h-5 text-white" />
              <span>24/7 customer support</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
