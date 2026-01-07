import { z } from 'zod';

export const CreateDocumentSchema = z.object({
  tenant_id: z.string().min(1).default('default'),
  title: z.string().min(1),
  source: z.string().min(1).default('manual'),
  content: z.string().min(1),
});

export type CreateDocumentDto = z.infer<typeof CreateDocumentSchema>;
