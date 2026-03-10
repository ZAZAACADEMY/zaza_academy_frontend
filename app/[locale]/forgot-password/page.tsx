import { ForgotPassword } from "@/components/auth/ForgotPassword";

interface PageProps {
  searchParams: Promise<{ step?: string; email?: string }>;
}

export default async function ForgotPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return <ForgotPassword initialStep={params.step} initialEmail={params.email} />;
}
