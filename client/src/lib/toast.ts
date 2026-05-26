import { toast as sonner } from "sonner";

export const toast = {
  success: (message: string) =>
    sonner.success(message, {
      style: {
        background: "#18181b",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "#fafafa",
      },
    }),
  error: (message: string) =>
    sonner.error(message, {
      style: {
        background: "#18181b",
        border: "1px solid rgba(239,68,68,0.3)",
        color: "#fafafa",
      },
    }),
};
