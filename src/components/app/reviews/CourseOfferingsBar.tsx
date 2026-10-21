import { Box, Group, Progress, Stack, Text, Tooltip } from "@mantine/core";

export interface CourseOfferingsBarPropsType {
  fall: number;
  spring: number;
}

function getSemesterPercentages(fall: number, spring: number) {
  const total = fall + spring;

  if (total === 0) {
    return { fall: 0, spring: 0 };
  }

  const fallPercentage = Math.round((fall / total) * 100);

  return { fall: fallPercentage, spring: 100 - fallPercentage };
}

function SemesterLegend({
  color,
  semester,
  count,
}: {
  color: string;
  semester: string;
  count: number;
}) {
  return (
    <Group gap={6} wrap="nowrap">
      <Box
        w={10}
        h={10}
        bg={color}
        style={{ borderRadius: "50%", flexShrink: 0 }}
      />
      <Text size="sm" c="dimmed">
        {semester}
      </Text>
      <Text size="sm" fw={600}>
        {count}
      </Text>
    </Group>
  );
}

export function CourseOfferingsBar({
  fall,
  spring,
}: CourseOfferingsBarPropsType) {
  const percentages = getSemesterPercentages(fall, spring);

  return (
    <Stack gap="xs">
      <Progress.Root
        size="lg"
        radius="xl"
        bg="var(--mantine-color-default)"
        aria-label="Offerings by semester"
      >
        <Tooltip label={`Fall – ${String(fall)} offerings`}>
          <Progress.Section value={percentages.fall} color="yellow" />
        </Tooltip>

        <Tooltip label={`Spring – ${String(spring)} offerings`}>
          <Progress.Section value={percentages.spring} color="teal" />
        </Tooltip>
      </Progress.Root>

      <Group gap="lg" justify="center" wrap="wrap">
        <SemesterLegend
          color="var(--mantine-color-orange-6)"
          semester="Fall"
          count={fall}
        />
        <SemesterLegend
          color="var(--mantine-color-teal-6)"
          semester="Spring"
          count={spring}
        />
      </Group>
    </Stack>
  );
}
