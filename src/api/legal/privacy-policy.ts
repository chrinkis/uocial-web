import type { PrivacyPolicy } from "@/models/legal/privacy-policy";
import axios from "axios";

export async function fetchPrivacyPolicy() {
  return await axios.get<{ data: PrivacyPolicy }>("/api/legal/privacy-policy");
}
