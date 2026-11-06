import { Header } from "@/components/Header";
import { Flex } from "@mantine/core";
import { useEffect } from "react";
import { Outlet } from "react-router";
import { saveLastCategory } from "@/utils/categories";
import { useActiveCategory } from "@/hooks/useActiveCategory";

export default function Layout() {
  const category = useActiveCategory();

  useEffect(() => {
    if (category) {
      saveLastCategory(category);
    }
  }, [category]);

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
