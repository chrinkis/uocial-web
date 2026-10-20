import type { TermsOfUse } from "@/models/legal/terms-of-use";
import type { ResourceResponse } from "@/utils/response";
import axios from "axios";

export async function fetchTermsOfUse() {
  return await axios.get<ResourceResponse<TermsOfUse>>(
    "/api/legal/terms-of-use",
  );
}
