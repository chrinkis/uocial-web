import * as post from "@/models/app/post/Post";
import {
  Group,
  Paper,
  Stack,
  Title,
  Text,
  Spoiler,
  Tooltip,
  Badge,
  Anchor,
  UnstyledButton,
  useMantineTheme,
  Button,
} from "@mantine/core";
import {
  IconArrowBigDown,
  IconArrowBigDownFilled,
  IconArrowBigUp,
  IconArrowBigUpFilled,
  IconBookmark,
  IconClock,
  IconFlag,
  IconMessageCircle,
  IconShare,
} from "@tabler/icons-react";
import { format, formatDistanceToNow } from "date-fns";
import { NavLink } from "react-router";
import { Carousel } from "@mantine/carousel";
import { useMeasure } from "react-use";
import { useRef, useState } from "react";

export interface PostPropsType {
  post: post.Post;
}

function PostTitle({ post }: PostPropsType) {
  return (
    <Spoiler
      showLabel="Show more"
      hideLabel="Show less"
      style={{ flex: 1 }}
      maxHeight={96}
      styles={{
        control: {
          textAlign: "right",
          width: "100%",
        },
      }}
    >
      <Title order={3} ta="justify">
        {post.title}
      </Title>
    </Spoiler>
  );
}

function PostMetaData({ post }: PostPropsType) {
  const createdAt = new Date(post.created_at);

  return (
    <Group justify="space-between" wrap="nowrap">
      <Group wrap="wrap" style={{ flex: 1 }}>
        <Badge
          size="md"
          variant="gradient"
          gradient={{ from: "grape", to: "violet", deg: 90 }}
        >
          !{post.id}
        </Badge>

        {post.labels.map((l) => (
          <Badge
            key={l.value}
            size="md"
            variant="gradient"
            gradient={{ from: "grape", to: "violet", deg: 90 }}
          >
            {l.value}
          </Badge>
        ))}
      </Group>

      <Group justify="flex-end" gap={5} wrap="nowrap">
        <IconClock color="var(--mantine-color-dimmed)" size="1.2rem" />
        <Tooltip
          label={format(createdAt, "PP·p")}
          events={{ touch: true, hover: true, focus: false }}
        >
          <Text c="dimmed">
            {formatDistanceToNow(createdAt, { addSuffix: true })}
          </Text>
        </Tooltip>
      </Group>
    </Group>
  );
}

function PostBody({ post }: PostPropsType) {
  return (
    <Spoiler
      showLabel="Show more"
      hideLabel="Show less"
      style={{ flex: 1 }}
      maxHeight={200}
      styles={{
        control: {
          textAlign: "right",
          width: "100%",
        },
      }}
    >
      <Text ta="justify">{post.body}</Text>
    </Spoiler>
  );
}

function PostHashtags({ post }: PostPropsType) {
  return (
    <Spoiler
      showLabel="Show more"
      hideLabel="Show less"
      style={{ flex: 1 }}
      maxHeight={75}
      styles={{
        control: {
          textAlign: "right",
          width: "100%",
        },
      }}
    >
      <Group gap="0.5rem" style={{ rowGap: 0 }}>
        {post.hashtags.map((h) => (
          <Anchor component={NavLink} key={h.value} to="">
            #{h.value}
          </Anchor>
        ))}
      </Group>
    </Spoiler>
  );
}

function PostReactions({ post }: PostPropsType) {
  return (
    <Group justify="space-between">
      <Group>
        <Group gap={2} align="stretch">
          {post.reactions.user?.reaction === "Upvote" ? (
            <UnstyledButton c="violet">
              <IconArrowBigUpFilled />
            </UnstyledButton>
          ) : (
            <UnstyledButton>
              <IconArrowBigUp />
            </UnstyledButton>
          )}

          <Text>{post.reactions.total.upvotes}</Text>
        </Group>

        <Group gap={2} align="stretch">
          <Text>{post.reactions.total.downvotes}</Text>

          {post.reactions.user?.reaction === "Downvote" ? (
            <UnstyledButton c="violet">
              <IconArrowBigDownFilled />
            </UnstyledButton>
          ) : (
            <UnstyledButton>
              <IconArrowBigDown />
            </UnstyledButton>
          )}
        </Group>
      </Group>

      <Group gap={2} align="stretch">
        <Text>{post.comments.total}</Text>

        <UnstyledButton>
          <IconMessageCircle />
        </UnstyledButton>
      </Group>
    </Group>
  );
}

export function PostOptions(props: PostPropsType) {
  const buttonProps = {
    variant: "light",
    w: "90%",
    maw: "12rem",
  };

  return (
    <Stack align="center">
      <Button {...buttonProps}>
        <Group gap="0.1rem">
          <IconBookmark size="1.1rem" />
          Save
        </Group>
      </Button>
      <Button {...buttonProps}>
        <Group gap="0.1rem">
          <IconShare size="1.1rem" />
          Share
        </Group>
      </Button>
      <Button {...buttonProps}>
        <Group gap="0.1rem">
          <IconFlag size="1.1rem" />
          Report
        </Group>
      </Button>
    </Stack>
  );
}

export function Post(props: PostPropsType) {
  const theme = useMantineTheme();
  const [firstSlideRef, { height: firstSlideHeight }] =
    useMeasure<HTMLDivElement>();
  const [secondSlideRef, { height: secondSlideHeight }] =
    useMeasure<HTMLDivElement>();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  function handleSlideChange(index: number) {
    setSlideIndex(index);

    requestAnimationFrame(() => {
      if (carouselRef.current) {
        const rect = carouselRef.current.getBoundingClientRect();
        // Check if the top of the carousel is above the viewport (not visible)
        if (rect.top < 0) {
          carouselRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  }

  return (
    <Carousel
      withIndicators
      withControls={false}
      onSlideChange={handleSlideChange}
      ref={carouselRef}
      styles={{
        indicator: { backgroundColor: theme.colors[theme.primaryColor][5] },
        root: { transition: "height 0.3s ease" },
      }}
      w="90%"
      h={slideIndex ? secondSlideHeight : firstSlideHeight}
      maw="50rem"
    >
      <Carousel.Slide>
        <div ref={firstSlideRef}>
          <Paper p="md" withBorder>
            <Stack>
              <PostTitle {...props} />
              <PostMetaData {...props} />
              <PostBody {...props} />
              <PostHashtags {...props} />
              <PostReactions {...props} />
            </Stack>
          </Paper>
        </div>
      </Carousel.Slide>

      <Carousel.Slide>
        <div
          ref={secondSlideRef}
          style={{ maxHeight: firstSlideHeight, overflowY: "auto" }}
        >
          <Paper p="xl" withBorder>
            <PostOptions {...props} />
          </Paper>
        </div>
      </Carousel.Slide>
    </Carousel>
  );
}
