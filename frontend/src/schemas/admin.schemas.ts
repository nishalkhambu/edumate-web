import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain at least one letter and one number"
    ),
  role: z.enum(["user", "admin"]),
  status: z.enum(["active", "inactive"]),
});

export type CreateUserFormValues = z.infer<typeof CreateUserSchema>;

export const EditUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  role: z.enum(["user", "admin"]),
  status: z.enum(["active", "inactive"]),
  password: z.string().optional(),
});

export type EditUserFormValues = z.infer<typeof EditUserSchema>;
