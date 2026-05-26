import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={id}
          className="block text-[13px] font-medium text-zinc-400"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={`w-full resize-none rounded-xl border bg-black/30 px-4 py-3 text-sm text-white shadow-inner placeholder:text-zinc-600 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
          error
            ? "border-red-500/40"
            : "border-white/[0.06] focus:border-violet-500/30"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
);

Textarea.displayName = "Textarea";
