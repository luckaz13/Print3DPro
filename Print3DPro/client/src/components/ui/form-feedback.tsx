import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export type FeedbackStatus = "success" | "error" | "idle";

interface FormFeedbackProps {
  status: FeedbackStatus;
  message?: string;
  className?: string;
  autoHide?: boolean;
  autoHideDuration?: number;
  showToast?: boolean;
}

export const FormFeedback: React.FC<FormFeedbackProps> = ({
  status,
  message,
  className,
  autoHide = true,
  autoHideDuration = 5000,
  showToast = false,
}) => {
  const [visible, setVisible] = useState(status !== "idle");
  const { toast } = useToast();

  useEffect(() => {
    setVisible(status !== "idle");

    if (showToast && status !== "idle" && message) {
      toast({
        title: status === "success" ? "Sucesso" : "Erro",
        description: message,
        variant: status === "success" ? "default" : "destructive",
      });
    }

    if (autoHide && status !== "idle") {
      const timer = setTimeout(() => {
        setVisible(false);
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [status, message, autoHide, autoHideDuration, showToast, toast]);

  if (!visible || status === "idle") return null;

  const statusClasses = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    idle: "",
  };

  const iconClasses = {
    success: "text-green-500",
    error: "text-red-500",
    idle: "",
  };

  return (
    <div
      className={cn(
        "relative flex items-center gap-3 p-4 mb-4 border rounded-md animate-in fade-in slide-in-from-top-5 duration-300",
        statusClasses[status],
        className
      )}
      role="alert"
    >
      {status === "success" ? (
        <CheckCircle className={cn("h-5 w-5", iconClasses[status])} />
      ) : (
        <AlertCircle className={cn("h-5 w-5", iconClasses[status])} />
      )}
      <div className="flex-1">{message}</div>
      <button
        type="button"
        className="text-gray-400 hover:text-gray-600 transition-colors"
        onClick={() => setVisible(false)}
        aria-label="Fechar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// Hook para gerenciar o estado de feedback do formulário
export const useFormFeedback = (initialStatus: FeedbackStatus = "idle") => {
  const [status, setStatus] = useState<FeedbackStatus>(initialStatus);
  const [message, setMessage] = useState<string>("");

  const showSuccess = (msg: string) => {
    setStatus("success");
    setMessage(msg);
  };

  const showError = (msg: string) => {
    setStatus("error");
    setMessage(msg);
  };

  const reset = () => {
    setStatus("idle");
    setMessage("");
  };

  return {
    status,
    message,
    showSuccess,
    showError,
    reset,
    FormFeedback: (props: Omit<FormFeedbackProps, "status" | "message">) => (
      <FormFeedback status={status} message={message} {...props} />
    ),
  };
};