"use client";

import { useFormState, useFormStatus } from "react-dom";
import { register } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  data: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 animate-spin" />}
      Create Account
    </Button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useFormState(register, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: state.error,
      });
    }
  }, [state.error, toast]);

  if (state.data) {
    return (
      <Alert variant="default" className="text-center">
          <AlertTitle className="font-bold">Success!</AlertTitle>
          <AlertDescription>
              {state.data}
          </AlertDescription>
      </Alert>
   )
}

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="Your Name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="name@example.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" placeholder="********" required minLength={6} />
      </div>
      <SubmitButton />
    </form>
  );
}
