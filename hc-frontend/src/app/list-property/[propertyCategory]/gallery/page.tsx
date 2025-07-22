import GalleryClient from "./GalleryClient";

// Force dynamic rendering to avoid server component issues
export const dynamic = "force-dynamic";

export default function GalleryPage() {
  return <GalleryClient />;
}
