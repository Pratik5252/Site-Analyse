// src/Components/Auth/LoginForm.tsx
import { AuthFormBase } from "./AuthFormBase";
import { login } from "@/services/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await login({ email, password });
      if (res.token) {
        localStorage.setItem("token", res.token);
        setError(null);
        navigate("/");
      } else {
        setError(res.message || "Login Failed");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <AuthFormBase
      title="Login to your account"
      description="Enter your email below to login to your account"
      onSubmit={handleLogin}
      submitLabel="Login"
      switchLabel="Don't have an account? Sign up"
      onSwitch={onSwitch}
      error={error}
    />
  );
}
