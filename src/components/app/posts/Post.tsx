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
  Box,
  Typography,
} from "@mantine/core";
import {
  IconArrowBigDown,
  IconArrowBigDownFilled,
  IconArrowBigUp,
  IconArrowBigUpFilled,
  IconBookmark,
  IconBookmarkFilled,
  IconClock,
  IconFlag,
  IconMessageCircle,
  IconMessageCirclePlus,
  IconMessageCircleX,
  IconShare,
} from "@tabler/icons-react";
import { format, formatDistanceToNow } from "date-fns";
import { NavLink } from "react-router";
import { Carousel } from "@mantine/carousel";
import { useMeasure } from "react-use";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { Comment } from "./Comment";
import { uniqBy } from "lodash";
import type { EmblaCarouselType } from "embla-carousel";

export interface PostPropsType {
  post: post.Post;
}

const BUTTON_PROPS = {
  variant: "light",
  w: "90%",
  maw: "12rem",
};

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
    <Group justify="space-between" wrap="nowrap" gap="xs">
      <Group wrap="wrap" style={{ flex: 1 }} gap={6}>
        <Badge
          size="md"
          variant="gradient"
          gradient={{ from: "grape", to: "violet", deg: 90 }}
        >
          #{post.id}
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

      <Group justify="flex-end" gap={3} wrap="nowrap">
        <IconClock color="var(--mantine-color-dimmed)" size="1rem" />
        <Tooltip
          label={format(createdAt, "PP·p")}
          events={{ touch: true, hover: true, focus: false }}
        >
          <Text c="dimmed" size="xs">
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
  return (
    <Stack align="center">
      <Button {...BUTTON_PROPS}>
        {props.post.saved ? (
          <Group gap="0.1rem">
            <IconBookmarkFilled size="1.1rem" />
            Saved
          </Group>
        ) : (
          <Group gap="0.1rem">
            <IconBookmark size="1.1rem" />
            Save
          </Group>
        )}
      </Button>
      <Button {...BUTTON_PROPS}>
        <Group gap="0.1rem">
          <IconShare size="1.1rem" />
          Share
        </Group>
      </Button>
      <Button {...BUTTON_PROPS}>
        <Group gap="0.1rem">
          <IconFlag size="1.1rem" />
          Report
        </Group>
      </Button>
    </Stack>
  );
}

export function PostPeakedComments(props: PostPropsType) {
  const selectedComments = useMemo(
    () =>
      uniqBy(
        [
          ...props.post.comments.most_popular.map((c) => ({
            comment: c,
            label: "top",
          })),
          ...props.post.comments.most_recent.map((c) => ({
            comment: c,
            label: "new",
          })),
        ],
        "comment.id",
      ).slice(0, 4),
    [props.post.comments],
  );

  if (selectedComments.length === 0) {
    return (
      <Stack align="center">
        <IconMessageCircleX size={40} color="var(--mantine-color-dimmed)" />
        <Typography c="var(--mantine-color-dimmed)">No comments yet</Typography>
        <Button {...BUTTON_PROPS} size="compact-md">
          <Group gap="0.2rem">
            <IconMessageCirclePlus size="1.1rem" />
            Add a comment
          </Group>
        </Button>
      </Stack>
    );
  }

  return (
    <Stack align="center" gap="xs">
      {selectedComments.map((c) => (
        <Comment comment={c.comment} key={c.comment.id} label={c.label} />
      ))}
      <Button {...BUTTON_PROPS} size="compact-md">
        <Group gap="0.1rem">
          <IconMessageCircle size="1.1rem" />
          All comments
        </Group>
      </Button>
    </Stack>
  );
}

export const Post = memo((props: PostPropsType) => {
  const theme = useMantineTheme();
  const [firstSlideRef, { height: firstSlideHeight }] =
    useMeasure<HTMLDivElement>();
  const [secondSlideRef, { height: secondSlideHeight }] =
    useMeasure<HTMLDivElement>();
  const [thirdSlideRef, { height: thirdSlideHeight }] =
    useMeasure<HTMLDivElement>();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [slideForHeight, setSlideForHeight] = useState(0);
  const emblaRef = useRef<EmblaCarouselType | null>(null);

  const setEmblaApi = useCallback(
    (embla: EmblaCarouselType) => {
      const height = [firstSlideHeight, secondSlideHeight, thirdSlideHeight];

      emblaRef.current = embla;

      function onSlidesInView() {
        const slidesInView = embla.slidesInView();
        setSlideForHeight(
          height.indexOf(Math.max(...slidesInView.map((i) => height[i]))),
        );
      }

      embla.on("slidesInView", onSlidesInView);

      onSlidesInView();
    },
    [firstSlideHeight, secondSlideHeight, thirdSlideHeight],
  );

  function handleSlideChange() {
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
    <Paper withBorder w="90%" maw="50rem">
      <Carousel
        withIndicators
        withControls={false}
        onSlideChange={handleSlideChange}
        getEmblaApi={setEmblaApi}
        ref={carouselRef}
        emblaOptions={{ inViewThreshold: 0.02 }}
        styles={{
          indicator: { backgroundColor: theme.colors[theme.primaryColor][5] },
          root: { transition: "height 0.3s ease" },
        }}
        h={
          (slideForHeight === 0
            ? firstSlideHeight
            : slideForHeight === 1
              ? secondSlideHeight
              : thirdSlideHeight) || "auto"
        }
      >
        <Carousel.Slide>
          <div ref={firstSlideRef}>
            <Box p="md">
              <Stack>
                <PostTitle {...props} />
                <PostMetaData {...props} />
                <PostBody {...props} />
                <PostHashtags {...props} />
                <PostReactions {...props} />
              </Stack>
            </Box>
          </div>
        </Carousel.Slide>

        <Carousel.Slide>
          <div ref={secondSlideRef}>
            <Box p="xl">
              <PostPeakedComments {...props} />
            </Box>
          </div>
        </Carousel.Slide>

        <Carousel.Slide>
          <div ref={thirdSlideRef}>
            <Box p="xl">
              <PostOptions {...props} />
            </Box>
          </div>
        </Carousel.Slide>
      </Carousel>
    </Paper>
  );
});
