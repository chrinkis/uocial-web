import { Navigate } from "react-router";
import { getLastCategory } from "@/utils/categories";

export default function Page() {
  const lastCategory = getLastCategory();
  return <Navigate to={lastCategory?.path ?? "/app/posts"} replace />;
}
