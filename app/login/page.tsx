
"use client";

import { useForm } from "react-hook-form"; //manages the form 
import { z } from "zod"; //verifies the types and validates the data (define the rules for the form data)
import { zodResolver } from "@hookform/resolvers/zod"; // connects zod with react-hook-form to validate the form data

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>; // infers the type of the form data from the Zod schema

export default function LoginPage() { //creates the login page component
  const {
    register, // lets react hook form know about our inputs
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),// connects the Zod schema to react-hook-form for validation
  });

  // function onSubmit(data: LoginFormData) { //this function runs after form passes validation 
  //   console.log("Login data:", data);  //prints the data into the browser console  
  // }
  async function onSubmit(data: LoginFormData) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

  if (!response.ok) {
  console.log("Login failed:", result.message);
  alert("Email or password is incorrect");
  return;
}

if (result.user.role === "Tenant Admin") {
  window.location.href = "/admin";
} else if (result.user.role === "Recruiter") {
  window.location.href = "/recruiter";
} else if (result.user.role === "Candidate") {
  window.location.href = "/candidate";
} else {
  console.error("Unknown user role:", result.user.role);
}
  } catch (error) {
    console.error("Login request failed:", error);
  }
}

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Login to your AI Interview Platform account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">  
    
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")} //registers the input with react-hook-form and connects it to the form state and validation
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.email && ( //check if there are any errors with the input and displays the error message if there are any
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button //this button submits the form and triggers the onSubmit function if the form passes validation
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}

