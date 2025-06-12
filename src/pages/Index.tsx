
import { Link } from "react-router-dom";
import SpeakerButton from "@/components/SpeakerButton";

const Index = () => {
  const welcomeText = "Welcome to LEXT. Lens plus Text: Your smart, lightweight document extractor";

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#43CEA2] via-[#185A9D] to-[#6A1B9A] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-2xl border border-white/20">
          <div className="flex justify-center items-center gap-4 mb-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Welcome to LEXT
            </h1>
            <SpeakerButton text={welcomeText} className="text-white hover:text-yellow-300" />
          </div>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            Lens + Text: Your smart, lightweight document extractor
          </p>
          
          <div className="space-y-4">
            <Link
              to="/login"
              className="inline-block bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg border border-white/30"
            >
              Continue to Login
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-white/70 text-sm">
          Secure • Private • Client-side only
        </div>
      </div>
    </div>
  );
};

export default Index;
