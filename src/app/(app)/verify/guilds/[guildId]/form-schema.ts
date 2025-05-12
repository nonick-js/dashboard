import { z } from 'zod';

export const captchaFormSchema = z.object({
  turnstileToken: z.string(),
});
