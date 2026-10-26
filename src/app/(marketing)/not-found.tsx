import { StatusMessage } from "@/components/shared/status-message";

export default function NotFound() {
  return (
    <StatusMessage
      eyebrow="404"
      title="We couldn't find that page"
      description="It may have moved, or the link may be out of date."
    />
  );
}
