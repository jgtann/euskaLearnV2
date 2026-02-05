'use server';

import { z } from 'zod';

// Schema for registration
const registerSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

// Schema for login
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export async function register(prevState: any, formData: FormData) {
  const validatedFields = registerSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      error: "Invalid fields. Please check your input.",
    };
  }
  
  // Placeholder for actual registration logic
  console.log('Registering user:', validatedFields.data);
  // In a real app, you would integrate with Firebase Auth here.
  
  return {
    data: "Registration successful! Please login.",
  };
}

export async function login(prevState: any, formData: FormData) {
    const validatedFields = loginSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return {
            error: "Invalid email or password.",
        };
    }

    // Placeholder for actual login logic
    console.log('Logging in user:', validatedFields.data);
    // In a real app, you would integrate with Firebase Auth here.

    // On successful login, you would typically redirect.
    // For now, we'll return a success message.
    return {
        data: "Login successful!",
    };
}
