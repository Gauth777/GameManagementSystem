import toast from "react-hot-toast";

export function useToast() {
  const success = (message: string) => {
    toast.success(message, {
      style: {
        background: "#0F1523",
        color: "#00D4A4",
        border: "1px solid #1E2D4A",
        borderRadius: "8px",
        fontSize: "14px",
      },
      iconTheme: {
        primary: "#00D4A4",
        secondary: "#0F1523",
      },
    });
  };

  const error = (message: string) => {
    toast.error(message, {
      style: {
        background: "#0F1523",
        color: "#FF4655",
        border: "1px solid #1E2D4A",
        borderRadius: "8px",
        fontSize: "14px",
      },
      iconTheme: {
        primary: "#FF4655",
        secondary: "#0F1523",
      },
    });
  };

  const info = (message: string) => {
    toast(message, {
      style: {
        background: "#0F1523",
        color: "#0BC4FF",
        border: "1px solid #1E2D4A",
        borderRadius: "8px",
        fontSize: "14px",
      },
      icon: "ℹ️",
    });
  };

  const loading = (message: string) => {
    return toast.loading(message, {
      style: {
        background: "#0F1523",
        color: "#F0E6D3",
        border: "1px solid #1E2D4A",
        borderRadius: "8px",
        fontSize: "14px",
      },
    });
  };

  const dismiss = (toastId: string) => {
    toast.dismiss(toastId);
  };

  return { success, error, info, loading, dismiss };
}
