import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, className = "", id, ...props }, ref) => (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={id}
          className="block text-[13px] font-medium text-zinc-400"
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={`w-full rounded-xl border border-white/[0.06] bg-black/30 px-4 py-3 text-sm text-white shadow-inner transition-all focus:border-violet-500/30 focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${className}`}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-zinc-900">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
);

Select.displayName = "Select";
