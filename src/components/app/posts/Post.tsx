import * as post from "@/models/app/post/Post";
import {
  Group,
  Paper,
  Stack,
  Title,
  Text,
  Spoiler,
  Badge,
  Anchor,
  UnstyledButton,
  useMantineTheme,
  Button,
  Box,
  Typography,
  Popover,
  Textarea,
} from "@mantine/core";
import {
  IconBookmark,
  IconBookmarkFilled,
  IconFlag,
  IconFlagFilled,
  IconMessageCircle,
  IconMessageCirclePlus,
  IconMessageCircleX,
  IconShare,
} from "@tabler/icons-react";
import { NavLink } from "react-router";
import { Carousel } from "@mantine/carousel";
import { useMeasure } from "react-use";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { CommentPreview } from "./comments/CommentPreview";
import { uniqBy } from "lodash";
import type { EmblaCarouselType } from "embla-carousel";
import {
  usePost,
  useReactToPost,
  useSavePost,
  useUnsavePost,
} from "@/queries/app/post/post";
import { notifications } from "@mantine/notifications";
import { getErrorMessage, type LaravelValidationResponse } from "@/utils/error";
import type { ReactionValue } from "@/models/app/post/Reaction";
import { Comments } from "./comments/Comments";
import { Timestamp } from "@/components/Timestamp";
import { ReactButton } from "@/components/app/posts/ReactButton";
import { useSettings } from "@/providers/settings/hook";
import { ReportForm } from "./reports/ReportForm";
import { useModals } from "@/providers/modals/hook";
import { isModerator } from "@/utils/user";
import { useUser } from "@/providers/user/hook";
import invariant from "tiny-invariant";
import { Reports } from "./reports/Reports";
import { useModeratePost } from "@/queries/app/post/post-moderation";
import { useForm } from "@mantine/form";
import axios from "axios";
import type { ModerationAction } from "@/models/app/post/ModerationAction";
import { PostSkeleton } from "./PostSkeleton";
import { IconExclamationCircle } from "@tabler/icons-react";

export interface PostPropsType {
  post: post.Post;
  highlight?: boolean;
  w?: number | string;
}

export type PostWithFetcherPropsType = {
  id: number | string;
  errorMessage?: string;
} & Omit<PostPropsType, "post">;

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
  const { settings } = useSettings();

  return (
    <Group justify="space-between" gap="xs" wrap="wrap">
      <Group gap={6}>
        <Popover withArrow arrowSize={12}>
          <Popover.Target>
            <Badge
              size="md"
              variant="gradient"
              gradient={{ from: "grape", to: "violet", deg: 90 }}
            >
              #{post.id}
            </Badge>
          </Popover.Target>
          <Popover.Dropdown>
            <Text maw={300}>Each post has a unique id.</Text>
          </Popover.Dropdown>
        </Popover>

        {post.location && (
          <Badge
            size="md"
            variant="gradient"
            gradient={{ from: "grape", to: "violet", deg: 90 }}
          >
            {post.location}
          </Badge>
        )}

        {post.is_official && (
          <Popover withArrow arrowSize={12}>
            <Popover.Target>
              <Badge
                size="md"
                variant="gradient"
                gradient={{ from: "grape", to: "violet", deg: 90 }}
              >
                official
              </Badge>
            </Popover.Target>
            <Popover.Dropdown>
              <Text maw={300}>This post was created by Uocial owners.</Text>
            </Popover.Dropdown>
          </Popover>
        )}

        {settings.showYouBadge && post.author.is_current_user && (
          <Popover withArrow arrowSize={12}>
            <Popover.Target>
              <Badge
                size="md"
                variant="gradient"
                gradient={{ from: "grape", to: "violet", deg: 90 }}
              >
                yours
              </Badge>
            </Popover.Target>
            <Popover.Dropdown>
              <Text maw={300}>
                This post was created by you. You can hide this badge through
                settings.
              </Text>
            </Popover.Dropdown>
          </Popover>
        )}
      </Group>

      <Timestamp date={post.created_at} />
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
      <Text ta="justify" style={{ whiteSpace: "pre-line" }}>
        {post.body}
      </Text>
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
          <Anchor
            component={NavLink}
            key={h.value}
            to={`/app/posts/hashtags/${h.value}`}
          >
            #{h.value}
          </Anchor>
        ))}
      </Group>
    </Spoiler>
  );
}

function PostReactions({ post }: PostPropsType) {
  const reactToPost = useReactToPost();

  async function handleReaction(reaction?: ReactionValue) {
    try {
      await reactToPost.mutateAsync({ postId: post.id, reaction });
    } catch (error) {
      notifications.show({
        title: "Login failed",
        message: getErrorMessage(error),
        color: "red",
      });
    }
  }

  return (
    <Group justify="space-between">
      <Group gap="xs">
        <ReactButton
          reaction="Upvote"
          total={post.reactions.total.upvotes}
          user={post.reactions.user?.reaction}
          onClick={handleReaction}
          loading={reactToPost.isPending}
        />
        <ReactButton
          reaction="Downvote"
          total={post.reactions.total.downvotes}
          user={post.reactions.user?.reaction}
          onClick={handleReaction}
          loading={reactToPost.isPending}
        />
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
  const modals = useModals();
  const savePost = useSavePost();
  const unsavePost = useUnsavePost();

  async function handleShareClick() {
    const url = `${window.location.origin}/app/posts?postId=${String(props.post.id)}`;

    if (typeof navigator.share !== "function") {
      await navigator.clipboard.writeText(url);
      notifications.show({
        title: "Success",
        message: "Url copied to clipboard",
      });
    }

    void navigator.share({ url });
  }

  function handleReportClick() {
    const modalName = modals.open({
      title: `Reporting post #${String(props.post.id)}`,
      children: <ReportForm postId={props.post.id} onSuccess={onSuccess} />,
      centered: true,
    });

    function onSuccess() {
      modals.close(modalName);
    }
  }

  async function handleSaveClick() {
    try {
      const { message } = await savePost.mutateAsync({ postId: props.post.id });
      notifications.show({
        title: "Success",
        message,
      });
    } catch (error) {
      notifications.show({
        title: "Failed to save post",
        message: getErrorMessage(error),
        color: "red",
      });
    }
  }

  async function handleUnsaveClick() {
    try {
      const { message } = await unsavePost.mutateAsync({
        postId: props.post.id,
      });
      notifications.show({
        title: "Success",
        message,
      });
    } catch (error) {
      notifications.show({
        title: "Failed to unsave post",
        message: getErrorMessage(error),
        color: "red",
      });
    }
  }

  return (
    <Stack align="center">
      {props.post.saved ? (
        <Button
          {...BUTTON_PROPS}
          loading={unsavePost.isPending}
          onClick={() => void handleUnsaveClick()}
        >
          <Group gap="0.1rem">
            <IconBookmarkFilled size="1.1rem" />
            Saved
          </Group>
        </Button>
      ) : (
        <Button
          {...BUTTON_PROPS}
          loading={savePost.isPending}
          onClick={() => void handleSaveClick()}
        >
          <Group gap="0.1rem">
            <IconBookmark size="1.1rem" />
            Save
          </Group>
        </Button>
      )}
      <Button {...BUTTON_PROPS} onClick={() => void handleShareClick()}>
        <Group gap="0.1rem">
          <IconShare size="1.1rem" />
          Share
        </Group>
      </Button>
      <Button
        {...BUTTON_PROPS}
        onClick={handleReportClick}
        disabled={props.post.reported_by_the_user}
      >
        <Group gap="0.1rem">
          {props.post.reported_by_the_user ? (
            <>
              <IconFlagFilled size="1.1rem" />
              Reported
            </>
          ) : (
            <>
              <IconFlag size="1.1rem" />
              Report
            </>
          )}
        </Group>
      </Button>
    </Stack>
  );
}

export function PostPeakedComments(props: PostPropsType) {
  const modals = useModals();

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

  function handleOpenCommentsClick() {
    modals.open({
      fullScreen: true,
      title: `Comments of #${String(props.post.id)}`,
      children: <Comments post={props.post} />,
      styles: {
        content: { display: "flex", flexDirection: "column", height: "100%" },
        header: { flexShrink: 0 },
        body: { flex: 1, overflow: "hidden" },
      },
    });
  }

  if (selectedComments.length === 0) {
    return (
      <Stack align="center">
        <IconMessageCircleX size={40} color="var(--mantine-color-dimmed)" />
        <Typography c="var(--mantine-color-dimmed)">No comments yet</Typography>
        <Button
          {...BUTTON_PROPS}
          size="compact-md"
          onClick={handleOpenCommentsClick}
        >
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
        <CommentPreview
          comment={c.comment}
          postId={props.post.id}
          key={c.comment.id}
          label={c.label}
        />
      ))}
      <Button
        {...BUTTON_PROPS}
        size="compact-md"
        onClick={handleOpenCommentsClick}
      >
        <Group gap="0.1rem">
          <IconMessageCircle size="1.1rem" />
          All comments
        </Group>
      </Button>
    </Stack>
  );
}

function PostModerationReportsButton({ post }: PostPropsType) {
  const modals = useModals();

  function handleClick() {
    modals.open({
      centered: true,
      title: `Reports of #${String(post.id)}`,
      children: <Reports post={post} />,
    });
  }

  return (
    <Button bg="orange" fullWidth onClick={handleClick}>
      Reports ({post.moderation?.reports.total})
    </Button>
  );
}

function PostModerationActionForm({
  postId,
  onSuccess,
  action,
}: {
  postId: number | string;
  onSuccess?: () => void;
  action: ModerationAction;
}) {
  const moderatePost = useModeratePost();
  const form = useForm({
    mode: "controlled",
    initialValues: {
      comment: action === "hide" ? "" : "Post doesn't violate any term.",
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const { message } = await moderatePost.mutateAsync({
        postId,
        comment: values.comment,
        action,
      });

      notifications.show({
        title: "Success",
        message: message,
      });

      onSuccess?.();
    } catch (error) {
      notifications.show({
        title: "Failed to create comment",
        message: getErrorMessage(error),
        color: "red",
      });

      if (!axios.isAxiosError(error) || !error.response) {
        return;
      }

      const data = error.response.data as LaravelValidationResponse | undefined;
      form.setErrors(data?.errors ?? {});
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <Textarea
          minRows={5}
          autosize
          label="Comment"
          description={
            action === "hide"
              ? "Describe what is wrong with this post."
              : undefined
          }
          placeholder={
            action === "hide"
              ? "Author uses hatefull speech for a University Student."
              : "Post doesn't violate any term."
          }
          {...form.getInputProps("comment")}
          required
        />

        <Group justify="right">
          <Button type="submit" loading={form.submitting}>
            Hide post
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

function PostModerationActionButton({
  post,
  action,
}: PostPropsType & { action: ModerationAction }) {
  const modals = useModals();

  function handleHideClick() {
    const modalId = modals.open({
      title: `Hide post #${String(post.id)}`,
      children: (
        <PostModerationActionForm
          postId={post.id}
          onSuccess={closeModal}
          action={action}
        />
      ),
      centered: true,
    });

    function closeModal() {
      modals.close(modalId);
    }
  }

  return (
    <Button
      bg={action === "hide" ? "red" : "green"}
      flex={1}
      disabled={
        !post.moderation?.by_system &&
        (action === "hide"
          ? post.moderation?.is_hidden
          : !post.moderation?.is_hidden)
      }
      onClick={handleHideClick}
    >
      {action === "hide" ? "Hide" : "Unhide"}
    </Button>
  );
}

function PostModeration(props: PostPropsType) {
  return (
    <Stack gap="xs">
      {props.post.moderation?.reports.total ? (
        <PostModerationReportsButton {...props} />
      ) : undefined}

      <Group gap="xs">
        <PostModerationActionButton action="unhide" {...props} />
        <PostModerationActionButton action="hide" {...props} />
      </Group>
    </Stack>
  );
}

function Post_(props: PostPropsType) {
  const { user } = useUser();
  const { settings } = useSettings();
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

  invariant(user);

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
    <Paper
      withBorder
      w={props.w ?? "90%"}
      maw="50rem"
      style={{ borderColor: props.highlight ? theme.primaryColor : undefined }}
    >
      <Stack p="md">
        <Carousel
          withIndicators
          withControls={false}
          onSlideChange={handleSlideChange}
          getEmblaApi={setEmblaApi}
          ref={carouselRef}
          emblaOptions={{ inViewThreshold: 0.055 }}
          styles={{
            indicator: { backgroundColor: theme.colors[theme.primaryColor][5] },
            indicators: { bottom: "-0.3rem" },
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
              <Stack>
                <PostTitle {...props} />
                <PostMetaData {...props} />
                <PostBody {...props} />
                <PostHashtags {...props} />
                <PostReactions {...props} />
              </Stack>
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

        {isModerator(user) && settings.moderatorMode && (
          <PostModeration {...props} />
        )}
      </Stack>
    </Paper>
  );
}

function PostWithFetcher(props: PostWithFetcherPropsType) {
  const theme = useMantineTheme();
  const { data: post, isLoading, error } = usePost(props.id);

  if (isLoading) {
    return <PostSkeleton />;
  }

  if (error) {
    notifications.show({
      title: `Couldn't fetch post with id #${String(props.id)}`,
      message: getErrorMessage(error),
      color: "red",
    });

    return (
      <Paper withBorder p="md" style={{ borderColor: theme.colors.red[8] }}>
        <Stack align="center">
          <IconExclamationCircle size={40} color={theme.colors.red[8]} />
          <Text>
            {props.errorMessage ?? `Failed to load post #${String(props.id)}.`}
          </Text>
        </Stack>
      </Paper>
    );
  }

  invariant(post);

  return <Post_ post={post} {...props} />;
}

Post_.WithFetcher = PostWithFetcher;

export const Post = memo(Post_);
