import type { Icon } from "@tabler/icons-react";
import {
  IconFileInvoice,
  IconHash,
  IconMessageChatbot,
  IconStar,
  IconTie,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";

export interface Category {
  id: string;
  title: string;
  icon: Icon;
  path: string;
  enabled: boolean;
}

export const CATEGORIES: Category[] = [
  {
    id: "posts",
    title: "Anonymous Posts",
    icon: IconHash,
    path: "/app/posts",
    enabled: true,
  },
  {
    id: "course-reviews",
    title: "Course Reviews",
    icon: IconStar,
    path: "/app/course-reviews",
    enabled: false,
  },
  {
    id: "live-chat",
    title: "Chat With Stranger",
    icon: IconMessageChatbot,
    path: "/app/stranger-chat",
    enabled: false,
  },
  {
    id: "meet-students",
    title: "Meet Other Students",
    icon: IconUsers,
    path: "/app/meet-students",
    enabled: false,
  },
  {
    id: "cultural-groups",
    title: "Cultural Groups",
    icon: IconUsersGroup,
    path: "/app/meet-students",
    enabled: false,
  },
  {
    id: "political-groups",
    title: "Political Groups",
    icon: IconTie,
    path: "/app/political-groups",
    enabled: false,
  },
  {
    id: "articles",
    title: "Official Articles",
    icon: IconFileInvoice,
    path: "/app/articles",
    enabled: false,
  },
];

export function getActiveCategory(pathname: string) {
  return CATEGORIES.find(
    ({ path }) => pathname === path || pathname.startsWith(`${path}/`),
  );
}
