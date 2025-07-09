import { toast } from "sonner";

export const WarningToast = (msg: string) => {
  return toast.warning(msg, {
    position: "top-right",
    closeButton: true,
  });
};
