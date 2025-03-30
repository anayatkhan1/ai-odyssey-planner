
import { Check, AlertTriangle, Info, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} {...props} variant={variant}>
            <div className="grid gap-1">
              <div className="flex items-center gap-2">
                {variant === "destructive" && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
                {variant === "success" && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
                {variant === "info" && (
                  <Info className="h-4 w-4 text-blue-500" />
                )}
                {variant === "warning" && (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
                {title && <ToastTitle>{title}</ToastTitle>}
              </div>
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
