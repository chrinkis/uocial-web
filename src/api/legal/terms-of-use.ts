import type { TermsOfUse } from "@/models/legal/terms-of-use";
import axios from "axios";

export async function fetchTermsOfUse() {
  return await axios.get<{ data: TermsOfUse }>("/api/legal/terms-of-use");
}
