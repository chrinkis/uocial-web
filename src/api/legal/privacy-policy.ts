import type { PrivacyPolicy } from "@/models/legal/privacy-policy";
import type { ResourceResponse } from "@/utils/response";
import axios from "axios";

export async function fetchPrivacyPolicy() {
  return await axios.get<ResourceResponse<PrivacyPolicy>>(
    "/api/legal/privacy-policy",
  );
}
