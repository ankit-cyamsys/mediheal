import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const guestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z
    .string()
    .min(1, 'Age is required')
    .refine((v) => Number(v) >= 13 && Number(v) <= 120, 'Age must be between 13 and 120'),
  gender: z.string().min(1, 'Please select a gender'),
});

export type GuestForm = z.infer<typeof guestSchema>;

export function useGuestForm() {
  return useForm<GuestForm>({
    resolver: zodResolver(guestSchema),
    defaultValues: { name: '', age: '', gender: '' },
  });
}
