import { z } from 'zod'

const baseSchema = z.object({
  email: z.string().min(1, { message: 'Email là bắt buộc' }).email({ message: 'Email không hợp lệ' }),
  userName: z.string({ message: 'Tên tài khoản là bắt buộc' }).min(1, { message: 'Tên tài khoản là bắt buộc' }),
  firstName: z.string({ message: 'Họ của bạn là bắt buộc' }).min(1, { message: 'Họ của bạn là bắt buộc' }),
  lastName: z.string({ message: 'Tên của bạn là bắt buộc' }).min(1, { message: 'Tên của bạn là bắt buộc' }),
  phoneNumber: z
    .string()
    .min(10, { message: 'Số điện thoại phải đủ 10–12 chữ số' })
    .max(12, { message: 'Số điện thoại phải đủ 10–12 chữ số' })
    .regex(/^[0-9]+$/, { message: 'Số điện thoại chỉ chứa chữ số' }),
  oldPassword: z.string({ message: 'Mật khẩu là bắt buộc' }).min(1, { message: 'Mật khẩu là bắt buộc' }),
  password: z.string({ message: 'Mật khẩu là bắt buộc' }).min(1, { message: 'Mật khẩu là bắt buộc' }),
  rePassword: z.string({ message: 'Mật khẩu là bắt buộc' }).min(1, { message: 'Mật khẩu là bắt buộc' }),
  newPassword: z.string({ message: 'Mật khẩu là bắt buộc' }).min(1, { message: 'Mật khẩu là bắt buộc' }),
})

export const FormSchema = baseSchema
  .refine(data => data.newPassword === data.rePassword, {
    path: ['rePassword'],
    message: 'Mật khẩu nhập lại không khớp',
  })
  .refine(data => data.password === data.rePassword, {
    path: ['rePassword'],
    message: 'Mật khẩu nhập lại không khớp',
  })

export const LoginSchema = baseSchema.pick({
  userName: true,
  password: true,
})

export const RegisterSchema = baseSchema.pick({
  userName: true,
  firstName: true,
  lastName: true,
  password: true,
  email: true,
  phoneNumber: true,
})

export const ForgetSchema = baseSchema.pick({
  email: true,
})

export const ResetSchema = baseSchema
  .pick({
    password: true,
    rePassword: true,
  })
  .refine(data => data.password === data.rePassword, {
    path: ['rePassword'],
    message: 'Mật khẩu nhập lại không khớp',
  })

export const ChangeSchema = baseSchema
  .pick({
    oldPassword: true,
    newPassword: true,
    rePassword: true,
  })
  .refine(data => data.newPassword === data.rePassword, {
    path: ['rePassword'],
    message: 'Mật khẩu nhập lại không khớp',
  })
