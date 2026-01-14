import * as React from "react"
import { cn } from "@/lib/utils"

export interface RadioGroupProps {
  options: Array<{ value: string; label: string }>
  name: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, options, name, value, onChange, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)} role="radiogroup">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="h-4 w-4 border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...props}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    )
  }
)
RadioGroup.displayName = "RadioGroup"

export { RadioGroup }
