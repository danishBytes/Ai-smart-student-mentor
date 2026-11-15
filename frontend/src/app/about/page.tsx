import ContentPage from "@/components/public/ContentPage";
import { publicPages } from "@/lib/public-content";

export default function AboutPage() {
  return <ContentPage {...publicPages.about} />;
}