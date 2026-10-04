import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import type { Ban as BanModel } from "@/models/app/Ban";
import { useUserBans } from "@/queries/app/ban";
import { Ban } from "./Ban";
import { BanSkeleton } from "./BanSkeleton";

function BanComponent({ data }: { data: BanModel }) {
  return <Ban ban={data} />;
}

export function UserBanHistory({ userId }: { userId: number | string }) {
  return (
    <InfiniteScrolling
      name="bans"
      useQuery={useUserBans}
      queryArgs={[userId]}
      Component={BanComponent}
      Fallback="This user has never been banned."
      loader={<BanSkeleton />}
      gap="sm"
    />
  );
}
