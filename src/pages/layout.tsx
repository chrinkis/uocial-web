import { Header } from "@/components/Header";
import { Flex } from "@mantine/core";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <Flex direction="column" justify="center" align="center" h="100%">
      <Header />
      <Flex
        direction="column"
        justify="center"
        align="center"
        style={{ flexGrow: 1 }}
      >
        <Outlet />
      </Flex>
    </Flex>
  );
}
