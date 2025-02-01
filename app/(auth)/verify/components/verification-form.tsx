"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface VerificationFormProps {
  email: string | null;
}

export function VerificationForm({ email }: VerificationFormProps) {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const handleInput = async (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < 5) {
      refs.current[index + 1]?.focus();
    }

    if (index === 5 && value && newCode.every((digit) => digit)) {
      await handleVerification(newCode.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const newCode = [...verificationCode];
      newCode[index - 1] = "";
      setVerificationCode(newCode);
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...verificationCode];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newCode[index] = char;
    });
    setVerificationCode(newCode);

    if (pastedData.length === 6) {
      handleVerification(pastedData);
    } else {
      const focusIndex = Math.min(pastedData.length, 5);
      refs.current[focusIndex]?.focus();
    }
  };

  const handleVerification = async (code: string) => {
    if (!email) {
      setError("Email is missing");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      router.push("/login?verified=true");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Verification failed");
      setVerificationCode(["", "", "", "", "", ""]);
      refs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refs.current[0]?.focus();
  }, [refs]);

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              Invalid verification link. Please try registering again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/register")} className="w-full">
              Go to Register
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>
            Enter the code sent to <span className="font-bold">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2 justify-center">
              {verificationCode.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    refs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInput(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={isLoading}
                  className="w-12 h-12 text-center text-2xl p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              ))}
            </div>
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
