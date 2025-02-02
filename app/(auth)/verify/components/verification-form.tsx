"use client";

import { verifyAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { VerifyFormData, verifySchema } from "@/lib/schemas/auth";
import { FormState } from "@/lib/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";

interface VerificationFormProps {
  email: string | null;
}

const initialState: FormState = {
  errors: {},
  message: "",
};

export function VerificationForm({ email }: VerificationFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(verifyAction, initialState);
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);

  const form = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: email || "",
      code: "",
    },
  });

  const {
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = form;

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (state.success) {
      router.push("/login?verified=true");
    }
  }, [state.success, router]);

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    const code = newDigits.join("");
    setValue("code", code, { shouldValidate: true });
    clearErrors("code");

    if (value && index < 5) {
      refs.current[index + 1]?.focus();
    }

    if (index === 5 && value && code.length === 6) {
      handleSubmit(onSubmit)();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const newDigits = [...digits];
      newDigits[index - 1] = "";
      setDigits(newDigits);
      setValue("code", newDigits.join(""), { shouldValidate: true });
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) {
      setError("code", { message: "Code must contain only numbers" });
      return;
    }

    const newDigits = pastedData.padEnd(6, "").split("");
    setDigits(newDigits);
    setValue("code", pastedData, { shouldValidate: true });
    clearErrors("code");

    if (pastedData.length === 6) {
      handleSubmit(onSubmit)();
    } else {
      const focusIndex = Math.min(pastedData.length, 5);
      refs.current[focusIndex]?.focus();
    }
  };

  const onSubmit = async (data: VerifyFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    startTransition(() => {
      formAction(formData);
    });
  };

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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-2 justify-center">
              {digits.map((digit, index) => (
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
                  disabled={isSubmitting}
                  className="w-12 h-12 text-center text-2xl p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              ))}
            </div>
            {(errors.code || (state.message && !state.success)) && (
              <p className="text-sm text-red-500 text-center flex items-center justify-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.code?.message || state.message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
