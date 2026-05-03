import { Legal } from "@/components/legal/Legal";
import { useUser } from "@/providers/user/hook";
import { Outlet } from "react-router";

export function LegalGuard() {
  const { user } = useUser();

  const privacyPolicyNeedsAcceptance =
    user?.legal.privacy_policy.needs_acceptance;
  const termsOfUseNeedsAcceptance = user?.legal.terms_of_use.needs_acceptance;

  if (
    user?.legal.privacy_policy.needs_acceptance ||
    user?.legal.terms_of_use.needs_acceptance
  ) {
    return (
      <Legal
        termsOfUseAccepted={!termsOfUseNeedsAcceptance}
        privacyPolicyAccepted={!privacyPolicyNeedsAcceptance}
      />
    );
  }

  return <Outlet />;
}
