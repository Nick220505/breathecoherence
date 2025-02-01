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
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

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

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleInput = async (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

    // If this is the last digit and all digits are filled, submit
    if (index === 5 && value && newCode.every((digit) => digit)) {
      await handleVerification(newCode.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Handle backspace
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const newCode = [...verificationCode];
      newCode[index - 1] = "";
      setVerificationCode(newCode);
      inputRefs[index - 1].current?.focus();
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

    // If we have a complete code after pasting, submit it
    if (pastedData.length === 6) {
      handleVerification(pastedData);
    } else {
      // Focus the next empty input
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs[focusIndex].current?.focus();
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

      // Redirect to login page on success
      router.push("/login?verified=true");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Verification failed");
      // Clear the code on error
      setVerificationCode(["", "", "", "", "", ""]);
      inputRefs[0].current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  // Focus first input on mount
  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

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
                  ref={inputRefs[index]}
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
