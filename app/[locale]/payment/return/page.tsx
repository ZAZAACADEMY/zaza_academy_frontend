"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";

const PaymentReturnContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("Signup.step7"); // Reusing success translations
  
  const status = searchParams.get("status");
  const paymentId = searchParams.get("payment_id");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (status === "success") {
        // Redirect back to signup flow, Step 7 (Success)
        router.replace("/signup?step=7");
      } else {
        // Redirect back to payment step to try again
        router.replace("/signup?step=5");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [status, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FAFAFA]">
      <div className="w-full max-w-md bg-white p-8 rounded-[32px] shadow-card-1 border border-gray-50 text-center flex flex-col items-center gap-6">
        {status === "success" ? (
          <>
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-500 mb-2">
              <CheckCircle2 size={48} />
            </div>
            <h1 className="font-display font-bold text-2xl text-brand-black">
              Payment Successful!
            </h1>
            <p className="text-gray-500">
              We've received your payment. Redirecting you to finish your setup...
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
              <XCircle size={48} />
            </div>
            <h1 className="font-display font-bold text-2xl text-brand-black">
              Payment Failed
            </h1>
            <p className="text-gray-500">
              Something went wrong with your payment. Redirecting you back to try again...
            </p>
          </>
        )}
        
        <div className="flex items-center gap-2 text-brand-purple font-medium">
          <Loader2 className="animate-spin" size={20} />
          <span>Please wait...</span>
        </div>
      </div>
    </div>
  );
};

export default function PaymentReturnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-purple" size={40} />
      </div>
    }>
      <PaymentReturnContent />
    </Suspense>
  );
}
