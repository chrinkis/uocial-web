import { Header } from "@/components/Header";
import { Flex } from "@mantine/core";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { getActiveCategory, saveLastCategory } from "@/utils/categories";

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    const category = getActiveCategory(pathname);
    if (category) {
      saveLastCategory(category);
    }
  }, [pathname]);

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
