import axios from "axios";
import type { ModerationCounts } from "@/models/app/ModerationCounts";

export async function fetchModerationCounts() {
  const { data } = await axios.get<ModerationCounts>(
    "/api/app/moderation-counts",
  );

  return data;
}
