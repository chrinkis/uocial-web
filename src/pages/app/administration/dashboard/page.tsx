import { BanHistoryForm } from "@/components/app/bans/BanHistoryForm";
import { BanSkeleton } from "@/components/app/bans/BanSkeleton";
import { BanUserForm } from "@/components/app/bans/BanUserForm";
import { UnbanUserForm } from "@/components/app/bans/UnbanUserForm";
import { Ban } from "@/components/app/bans/Ban";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { useBans } from "@/queries/app/ban";
import { Flex, Stack, Tabs } from "@mantine/core";

function BansTab() {
  return (
    <Tabs defaultValue="actions" w="100%" keepMounted={false}>
      <Tabs.List justify="center" mb="lg">
        <Tabs.Tab value="actions">Actions</Tabs.Tab>
        <Tabs.Tab value="review">Review</Tabs.Tab>
        <Tabs.Tab value="all">All</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="actions">
        <Stack align="center" maw={560} mx="auto">
          <BanUserForm />
          <UnbanUserForm />
          <BanHistoryForm />
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel value="review">
        <Stack maw={720} mx="auto">
          <InfiniteScrolling
            useQuery={useBans}
            queryArgs={[{ pending_review: true }]}
            name="bans"
            Component={({ data }) => <Ban ban={data} />}
            Fallback="No bans pending review."
            loader={<BanSkeleton />}
            gap="sm"
          />
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel value="all">
        <Stack maw={720} mx="auto">
          <InfiniteScrolling
            useQuery={useBans}
            name="bans"
            Component={({ data }) => <Ban ban={data} />}
            Fallback="No bans."
            loader={<BanSkeleton />}
            gap="sm"
          />
        </Stack>
      </Tabs.Panel>
    </Tabs>
  );
}

export default function Page() {
  return (
    <Flex flex={1} w="100%" justify="center">
      <Tabs defaultValue="bans" w="100%" variant="pills" keepMounted={false}>
        <Tabs.List
          justify="center"
          mb="lg"
          style={{ overflowX: "auto", flexWrap: "nowrap" }}
        >
          <Tabs.Tab value="bans">Bans</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="bans">
          <BansTab />
        </Tabs.Panel>
      </Tabs>
    </Flex>
  );
}
