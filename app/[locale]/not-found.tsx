import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-cream px-4 text-center">
      <h1 className="font-display font-bold text-9xl text-brand-accent mb-4">
        404
      </h1>
      <h2 className="font-display font-bold text-3xl text-brand-black mb-6">
        Page Not Found
      </h2>
      <p className="font-sans text-gray-500 max-w-md mb-8">
        Oops! The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-brand-dark text-white font-bold py-4 px-8 rounded-full hover:bg-[#1F1235] transition-all shadow-lg hover:shadow-xl"
      >
        <ArrowLeft size={20} />
        Back to Home
      </Link>
    </div>
  );
}
