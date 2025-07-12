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

// 👉 Form tổng hợp, dùng cho trang thay đổi mật khẩu
export const FormSchema = baseSchema
  .refine(data => data.newPassword === data.rePassword, {
    path: ['rePassword'],
    message: 'Mật khẩu nhập lại không khớp',
  })
  .refine(data => data.password === data.rePassword, {
    path: ['rePassword'],
    message: 'Mật khẩu nhập lại không khớp',
  })

// 👉 Đăng nhập
export const LoginSchema = baseSchema.pick({
  userName: true,
  password: true,
})

// 👉 Đăng ký
export const RegisterSchema = baseSchema.pick({
  userName: true,
  firstName: true,
  lastName: true,
  password: true,
  email: true,
  phoneNumber: true,
})

// 👉 Quên mật khẩu
export const ForgetSchema = baseSchema.pick({
  email: true,
})

// 👉 Đặt lại mật khẩu
export const ResetSchema = baseSchema
  .pick({
    password: true,
    rePassword: true,
  })
  .refine(data => data.password === data.rePassword, {
    path: ['rePassword'],
    message: 'Mật khẩu nhập lại không khớp',
  })

// 👉 Đổi mật khẩu
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

// 👉 Đặt hàng: yêu cầu mô tả
export const OrderSchema = z.object({
  description: z.string().min(1, 'Description is required').max(25, 'Description must be at most 25 characters'),
})

export type LoginFormValues = z.infer<typeof LoginSchema>
export type RegisterFormValues = z.infer<typeof RegisterSchema>
export type ForgetFormValues = z.infer<typeof ForgetSchema>
export type ResetFormValues = z.infer<typeof ResetSchema>
export type ChangeFormValues = z.infer<typeof ChangeSchema>
export type OrderFormValues = z.infer<typeof OrderSchema>
