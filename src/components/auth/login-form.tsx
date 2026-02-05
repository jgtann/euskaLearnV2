"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const initialState = {
  data: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 animate-spin" />}
      Login
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(login, initialState);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: state.error,
      });
    }
    if (state.data) {
        toast({
            title: "Login Success",
            description: state.data,
        });
        // On successful login, redirect to the dashboard
        router.push('/dashboard');
    }
  }, [state, toast, router]);

  return (
    <form action={formAction} className="space-y-4">
       <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="name@example.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" placeholder="********" required />
      </div>
      <SubmitButton />
    </form>
  );
}
