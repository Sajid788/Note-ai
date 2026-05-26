import { AuthForm } from "@/components/auth/AuthForm";
import { GuestGuard } from "@/components/auth/GuestGuard";

export default function LoginPage() {
  return (
    <GuestGuard>
      <AuthForm mode="login" />
    </GuestGuard>
  );
}
