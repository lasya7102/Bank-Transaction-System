import { Loader2 } from "lucide-react";

export default function Loading({ message = "Loading...", size = 24, fullscreen = false }) {
  if (fullscreen) {
    return (
      <div className="loading-fullscreen">
        <Loader2 className="spin" size={size} />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div className="loading-inline">
      <Loader2 className="spin" size={size} />
      <span>{message}</span>
    </div>
  );
}
