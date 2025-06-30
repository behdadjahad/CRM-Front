import { toast } from "react-hot-toast";

export type ToastType = "success" | "error" | "custom";

interface CustomToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  position?: "top-center" | "top-right" | "bottom-center" | "bottom-right";
  onConfirm?: () => void;
}

export function CustomToast({
  message,
  type,
  duration = 2000,
  position = "top-center",
  onConfirm,
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
    case "custom":
      toast.custom(
        (t) => (
          <div
            style={{
              width: "300px",
              padding: "16px",
              borderRadius: "16px",
              backgroundColor: "#FFF",
              border: "1px solid #888",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              color: "#000",
            }}
          >
            <span>{message}</span>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <button
                style={{
                  backgroundColor: "#D80027",
                  color: "#FFF",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "none",
                }}
                onClick={() => {
                  toast.dismiss(t.id);
                  onConfirm?.();
                }}
              >
                بله
              </button>
              <button
                style={{
                  backgroundColor: "#CCC",
                  color: "#000",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "none",
                }}
                onClick={() => toast.dismiss(t.id)}
              >
                خیر
              </button>
            </div>
          </div>
        ),
        {
          position,
          duration: Infinity, // Stay open until user decides
        }
      );
  }
}
