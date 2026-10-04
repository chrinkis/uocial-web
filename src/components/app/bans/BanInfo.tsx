import type { Ban } from "@/models/app/Ban";
import { Badge, Group, Stack, Text } from "@mantine/core";
import { format, formatDistance } from "date-fns";
import type { ReactNode } from "react";

function formatDate(date: string) {
  return format(date, "PP·p");
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Group gap="xs" align="baseline" wrap="nowrap">
      <Text size="sm" c="dimmed" w={90} style={{ flexShrink: 0 }}>
        {label}
      </Text>
      <Text size="sm" style={{ overflowWrap: "anywhere" }} component="div">
        {children}
      </Text>
    </Group>
  );
}

export function BanStatus({ ban }: { ban: Ban }) {
  if (ban.admin?.lifted_at) {
    return <Badge color="gray">Lifted</Badge>;
  }

  if (ban.expires_at && new Date(ban.expires_at) <= new Date()) {
    return <Badge color="gray">Expired</Badge>;
  }

  return <Badge color="red">Active</Badge>;
}

export function BanInfo({ ban }: { ban: Ban }) {
  return (
    <Stack gap={6}>
      {ban.admin && <Row label="User">{ban.admin.user_id}</Row>}
      <Row label="Reason">{ban.reason}</Row>
      <Row label="Banned at">{formatDate(ban.banned_at)}</Row>
      <Row label="Duration">
        {ban.expires_at
          ? formatDistance(ban.banned_at, ban.expires_at)
          : "Permanent"}
      </Row>
      {ban.expires_at && (
        <Row label="Expires at">{formatDate(ban.expires_at)}</Row>
      )}
      {ban.admin?.lifted_at && (
        <Row label="Lifted at">{formatDate(ban.admin.lifted_at)}</Row>
      )}
      {ban.admin?.notes && <Row label="Notes">{ban.admin.notes}</Row>}
      {ban.admin && (
        <Row label="Thread">{ban.admin.thread_closed ? "Closed" : "Open"}</Row>
      )}
    </Stack>
  );
}
