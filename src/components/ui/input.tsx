import * as React from 'react'
import { cn } from '~/utils/cn'
import { Eye, EyeOff } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  classNameWrap?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, classNameWrap = '', type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const isPassword = type === 'password'

    return (
      <div className={`relative ${classNameWrap}`}>
        <input
          ref={ref}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          data-slot='input'
          className={cn(
            'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            isPassword ? '!pr-10' : '',
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type='button'
            onClick={() => setShowPassword(prev => !prev)}
            className='text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 pt-3'
            tabIndex={-1}
          >
            {!showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
