import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export const registerSchema = z
  .object({
    full_name: z.string().min(3, 'Nome completo obrigatório (mínimo 3 caracteres)'),
    email: z.string().email('Email inválido'),
    cpf: z
      .string()
      .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido (formato: 000.000.000-00)'),
    phone: z
      .string()
      .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone inválido (formato: (00) 00000-0000)'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Senhas não conferem',
    path: ['confirm_password'],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
})

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Senhas não conferem',
    path: ['confirm_password'],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
