import { Sparkles } from "lucide-react";

const OurMission = () => {
  return (
    <section
      id="mission"
      className="pt-20 pb-35  bg-gradient-to-t from-pink-50 via-white to-transparent"
    >
      <div className="max-w-5xl mx-auto px-4 text-center">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative flex items-center justify-center mb-3">
            <div className="w-14 h-14 rounded-full border-2 border-pink-300 flex items-center justify-center bg-white shadow-sm">
              <Sparkles className="w-6 h-6 text-pink-400" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Our Mission
          </h2>
          <div className="w-16 h-1 bg-pink-300 mt-2 rounded-full"></div>
        </div>

        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
          At{" "}
          <span className="font-semibold text-gray-900">Miala Cosmetics</span>,
          our mission is to help you look and feel like the best version of
          yourself — without breaking the bank. We believe beauty should be
          simple, natural, and empowering, crafted for every shade of
          confidence.
        </p>
      </div>
    </section>
  );
};

export default OurMission;
