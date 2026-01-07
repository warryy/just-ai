import { z } from 'zod';

export const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  // 来自你根目录 .env 里那条
  POSTGRES_URL: z.string().min(1, 'POSTGRES_URL is required'),
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),

  PORT: z.coerce.number().int().positive().default(3000),
});

export type Env = z.infer<typeof EnvSchema>;

export function validateEnv(config: Record<string, unknown>) {
  const parsed = EnvSchema.safeParse(config);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid environment variables:\n${issues}`);
  }
  return parsed.data;
}
