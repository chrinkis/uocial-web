import { Flex } from "@mantine/core";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <Flex justify="center" align="center" h="100%">
      <Outlet />
    </Flex>
  );
}
