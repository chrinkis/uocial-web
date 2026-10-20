import {
  Anchor,
  Badge,
  Breadcrumbs,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { NavLink, useParams } from "react-router";
import invariant from "tiny-invariant";
import { useDepartment } from "@/queries/app/reviews/department";
import { DepartmentSkeleton } from "@/components/app/reviews/DepartmentSkeleton";

export default function Page() {
  const { departmentId } = useParams<{ departmentId: string }>();

  invariant(departmentId);

  const { data: department, isLoading } = useDepartment(departmentId);

  return (
    <Stack align="safe center" w="100%" h="100%" gap="md">
      <Breadcrumbs>
        <Anchor component={NavLink} to="/app/reviews/departments">
          departments
        </Anchor>
        <Anchor>{department?.code.toUpperCase() ?? "department"}</Anchor>
      </Breadcrumbs>

      {isLoading || !department ? (
        <DepartmentSkeleton />
      ) : (
        <Paper withBorder shadow="sm" radius="lg" p="lg" w="90%" maw="50rem">
          <Stack gap="sm">
            <Group gap="md" wrap="nowrap">
              <Badge
                variant="light"
                size="lg"
                radius="md"
                ff="monospace"
                tt="uppercase"
                w={68}
                h={44}
              >
                {department.code}
              </Badge>

              <Title order={2} size="h3">
                {department.name}
              </Title>
            </Group>

            <Text c="dimmed">
              Course reviews for this department are coming soon.
            </Text>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}
