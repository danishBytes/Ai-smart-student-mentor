import ContentPage from "@/components/public/ContentPage";
import { publicPages } from "@/lib/public-content";

export default function SuccessStoriesPage() {
  return <ContentPage {...publicPages["success-stories"]} />;
}