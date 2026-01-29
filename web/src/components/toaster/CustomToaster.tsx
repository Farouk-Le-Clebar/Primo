import { Toaster } from "react-hot-toast";

export default function CustomToaster() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        style: {
          borderRadius: "12px",
          background: "#ffffff",
          color: "#1f2937",
          border: "1px solid #e5e7eb",
          padding: "16px",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
        success: {
          duration: 4000,
          iconTheme: {
            primary: "#16a34a",
            secondary: "#ffffff",
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}