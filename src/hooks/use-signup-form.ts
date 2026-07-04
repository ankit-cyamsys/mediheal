import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    age: z
      .string()
      .min(1, 'Age is required')
      .refine((v) => Number(v) >= 13 && Number(v) <= 120, 'Age must be between 13 and 120'),
    gender: z.string().min(1, 'Please select a gender'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupForm = z.infer<typeof signupSchema>;

export function useSignupForm() {
  return useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', age: '', gender: '', email: '', password: '', confirmPassword: '' },
  });
}
