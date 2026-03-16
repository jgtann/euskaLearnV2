"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;

    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Email and password are required.",
      });
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login Success",
        description: "Welcome back!",
      });
    } catch (error: any) {
      const errorCode = error.code;
      let errorMessage = error.message;
      if (errorCode === 'auth/invalid-credential') {
          errorMessage = "Invalid email or password. Please try again.";
      }
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your email address to reset your password.",
      });
      return;
    }

    setIsResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Email Sent",
        description: "A password reset link has been sent to your email.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send password reset email.",
      });
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="name@example.com" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" placeholder="********" required />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 animate-spin" />}
          Login
        </Button>
      </form>
      <div className="text-center">
        <Button 
          variant="link" 
          size="sm" 
          onClick={handleForgotPassword} 
          disabled={isResetLoading}
          className="text-muted-foreground"
        >
          {isResetLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Forgot password?"}
        </Button>
      </div>
    </div>
  );
}
