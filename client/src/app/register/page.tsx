import { AuthForm } from "@/components/auth/AuthForm";
import { GuestGuard } from "@/components/auth/GuestGuard";

export default function RegisterPage() {
  return (
    <GuestGuard>
      <AuthForm mode="register" />
    </GuestGuard>
  );
}
