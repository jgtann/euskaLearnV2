"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc } from "firebase/firestore";

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "All fields are required.",
      });
      setIsLoading(false);
      return;
    }
     if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Password must be at least 6 characters.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with name
      await updateProfile(user, { displayName: name });
      
      // Create user document in Firestore
      const userRef = doc(firestore, "users", user.uid);
      const userData = {
        id: user.uid,
        email: user.email,
        name: name,
        lastLogin: Date.now(),
        status: 'active',
        // initialize other fields as needed
        currentMission: null,
        missionDifficulty: null,
        rescueReward: null,
      };
      setDocumentNonBlocking(userRef, userData, { merge: true });

      setIsSuccess(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Alert variant="default" className="text-center">
          <AlertTitle className="font-bold">Success!</AlertTitle>
          <AlertDescription>
              Registration successful! Please login.
          </AlertDescription>
      </Alert>
   )
}

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
       <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 animate-spin" />}
        Create Account
      </Button>
    </form>
  );
}
