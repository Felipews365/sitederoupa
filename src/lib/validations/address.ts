import { z } from 'zod'

export const addressSchema = z.object({
  label: z.string().optional(),
  recipient: z.string().min(3, 'Nome do destinatário obrigatório'),
  zip_code: z
    .string()
    .regex(/^\d{5}-\d{3}$/, 'CEP inválido (formato: 00000-000)'),
  street: z.string().min(3, 'Rua obrigatória'),
  number: z.string().min(1, 'Número obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().length(2, 'Estado inválido'),
  is_default: z.boolean().optional(),
})

export type AddressInput = z.infer<typeof addressSchema>
