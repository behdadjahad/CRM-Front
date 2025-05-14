import { toast } from "react-hot-toast";

export type ToastType = "success" | "error" | "custom";

interface CustomToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  position?: "top-center" | "top-right" | "bottom-center" | "bottom-right";
}

export function CustomToast({
  message,
  type,
  duration = 2000,
  position = "top-center",
}: CustomToastProps) {
  switch (type) {
    case "success":
      toast.success(message, {
        duration,
        position,
        style: {
          width: "300px",
          height: "60px",
          borderRadius: "16px",
          backgroundColor: "#FFF",
          border: "1px solid #1CB771",
          color: "#000",
        },
      });
      break;
    case "error":
      toast.error(message, {
        duration,
        position,
        style: {
          width: "300px",
          height: "60px",
          borderRadius: "16px",
          backgroundColor: "#FFF",

          border: "1px solid #D80027",
          color: "#000",
          textAlign: "right",
        },
      });

      break;
  }
}
