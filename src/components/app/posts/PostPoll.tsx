import type { PostPoll as PostPollModel } from "@/models/app/post/PostPoll";
import type { PostPollOption } from "@/models/app/post/PostPollOption";
import {
  Badge,
  Box,
  Group,
  Progress,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconCircleCheckFilled, IconClock } from "@tabler/icons-react";
import { formatDistanceToNow, isPast } from "date-fns";
import { useMemo } from "react";

export interface PostPollPropsType {
  poll: PostPollModel;
  onVote?: (option: PostPollOption) => void;
  onUnvote?: (option: PostPollOption) => void;
  loading?: boolean;
}

function getPercentage(votes: number, total: number) {
  return total === 0 ? 0 : Math.round((votes / total) * 100);
}

function PostPollOptionRow({
  option,
  totalVotes,
  showResults,
  disabled,
  onClick,
}: {
  option: PostPollOption;
  totalVotes: number;
  showResults: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const percentage = getPercentage(option.total_votes, totalVotes);

  return (
    <UnstyledButton
      onClick={onClick}
      disabled={disabled}
      w="100%"
      style={{ cursor: disabled ? "default" : "pointer" }}
    >
      <Box pos="relative">
        <Progress.Root
          size="2.5rem"
          radius="md"
          transitionDuration={300}
          bg="var(--mantine-color-default)"
        >
          <Progress.Section
            value={showResults ? percentage : 0}
            color={
              option.user_has_voted
                ? "var(--mantine-primary-color-light-hover)"
                : "var(--mantine-color-default-border)"
            }
          />
        </Progress.Root>

        <Group
          pos="absolute"
          inset={0}
          px="sm"
          justify="space-between"
          wrap="nowrap"
          style={{
            borderRadius: "var(--mantine-radius-md)",
            border: option.user_has_voted
              ? "1px solid var(--mantine-primary-color-filled)"
              : "1px solid var(--mantine-color-default-border)",
          }}
        >
          <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
            {option.user_has_voted && (
              <IconCircleCheckFilled
                size="1.1rem"
                color="var(--mantine-primary-color-filled)"
                style={{ flexShrink: 0 }}
              />
            )}
            <Text truncate fw={option.user_has_voted ? 600 : undefined}>
              {option.name}
            </Text>
          </Group>

          {showResults && (
            <Text fw={600} size="sm" style={{ flexShrink: 0 }}>
              {percentage}%
            </Text>
          )}
        </Group>
      </Box>
    </UnstyledButton>
  );
}

export function PostPoll({
  poll,
  onVote,
  onUnvote,
  loading,
}: PostPollPropsType) {
  const options = useMemo(
    () => [...poll.options].sort((a, b) => a.position - b.position),
    [poll.options],
  );

  const hasEnded = poll.ends_at !== null && isPast(poll.ends_at);
  const hasVoted = options.some((o) => o.user_has_voted);
  const showResults = hasVoted || hasEnded;

  function handleOptionClick(option: PostPollOption) {
    if (option.user_has_voted) {
      onUnvote?.(option);
    } else {
      onVote?.(option);
    }
  }

  return (
    <Stack gap="xs">
      <Group justify="center">
        {poll.allow_multiple_votes && (
          <Badge size="xs" variant="light">
            multiple choice
          </Badge>
        )}
      </Group>

      {options.map((option) => (
        <PostPollOptionRow
          key={option.id}
          option={option}
          totalVotes={poll.total_votes}
          showResults={showResults}
          disabled={hasEnded || !!loading}
          onClick={() => {
            handleOptionClick(option);
          }}
        />
      ))}

      <Group justify="space-between" gap="xs">
        <Text c="dimmed" size="xs">
          {poll.total_votes} {poll.total_votes === 1 ? "vote" : "votes"}
        </Text>
        {poll.ends_at !== null && (
          <Group gap={3} wrap="nowrap">
            <IconClock color="var(--mantine-color-dimmed)" size="1rem" />
            <Text c="dimmed" size="xs">
              {hasEnded
                ? `Ended ${formatDistanceToNow(poll.ends_at, { addSuffix: true })}`
                : `Ends ${formatDistanceToNow(poll.ends_at, { addSuffix: true })}`}
            </Text>
          </Group>
        )}
      </Group>
    </Stack>
  );
}
