import { Header } from "@/components/Header";
import { Flex } from "@mantine/core";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <Flex direction="column" justify="safe center" align="center" h="100%">
      <Header />
      <Flex
        direction="column"
        justify="safe center"
        align="center"
        p="md"
        style={{ flexGrow: 1 }}
        w="100%"
      >
        <Outlet />
      </Flex>
    </Flex>
  );
}
