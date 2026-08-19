import { AlertCircle, X } from "lucide-react";

export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="error-message">
      <div className="error-message__content">
        <AlertCircle size={18} />
        <span>{message}</span>
      </div>
      {onDismiss && (
        <button className="error-message__close" onClick={onDismiss} aria-label="Dismiss error">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
