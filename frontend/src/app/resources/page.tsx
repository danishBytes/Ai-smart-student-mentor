import ContentPage from "@/components/public/ContentPage";
import { publicPages } from "@/lib/public-content";

export default function ResourcesPage() {
  return <ContentPage {...publicPages.resources} />;
}