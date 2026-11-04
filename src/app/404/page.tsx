import { notFound } from "next/navigation";

// Kept for old links to /404: render the shared not-found screen with a real
// 404 status instead of a page that answers 200.
export default function Legacy404Page() {
  notFound();
}
