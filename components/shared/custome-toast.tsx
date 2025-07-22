import { toast } from "react-hot-toast";
import { Button } from "../ui/button";
import CustomModal from "./custom-modal";
import { createPortal } from "react-dom";

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

  position = "top-center",
  onConfirm,
}: CustomToastProps) {
  switch (type) {
    case "success":
      toast.success(message, {

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
      toast.custom((t) => (
        <CustomModal
          isOpen={true}
          onRequestClose={() => toast.remove(t.id)}
          maxWidth="400px"
          minWidth="0"
          contentLabel="تایید عملیات"
        >
          <div className="flex flex-col justify-between p-4 gap-4">
            <div className="text-sm text-right text-gray-700 font-bold">
              {message}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="transparent"
                className="w-16 h-8 bg-danger text-card"
                onClick={() => {
                  toast.remove(t.id);

         
                    onConfirm?.(); // This should trigger toast.success
                  // This triggers fetchService, which triggers toast.success
                  // Immediately dismiss modal // Start delete (fire-and-forget)
                }}
              >
                بله
              </Button>
              <Button
                variant="foreground"
                className="w-16 h-8"
                onClick={() => toast.remove(t.id)}
              >
                خیر
              </Button>
            </div>
          </div>
        </CustomModal>
      ));
  }
}
