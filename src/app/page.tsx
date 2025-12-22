"use client";
import { useState } from "react";
import {
  Container,
  Title,
  TextInput,
  Button,
  Paper,
  Image,
  Stack,
  Group,
  Text,
  Skeleton,
  ActionIcon,
  Tooltip,
  Box,
  Badge,
  Grid,
  Card,
  Progress,
  Loader,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  BookOpen,
  Sparkles,
  Download,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

interface StoryPage {
  text: string;
  imagePrompt: string;
  imageUrl?: string;
  isLoadingImage: boolean;
}

interface Story {
  title: string;
  pages: StoryPage[];
}

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [story, setStory] = useState<Story | null>(null);
  const [isGeneratingStory, setIsGeneratingStory] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const generateImageForPage = async (
    pageIndex: number,
    imagePrompt: string
  ) => {
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt }),
      });

      const data = await response.json();
      if (response.ok && data.imageUrl) {
        setStory((prev) => {
          if (!prev) return null;
          const newPages = [...prev.pages];
          newPages[pageIndex] = {
            ...newPages[pageIndex],
            imageUrl: data.imageUrl,
            isLoadingImage: false,
          };
          return { ...prev, pages: newPages };
        });
      } else {
        throw new Error(data.error || "Failed to generate image");
      }
    } catch (err) {
      console.error(`Error generating image for page ${pageIndex}:`, err);
      setStory((prev) => {
        if (!prev) return null;
        const newPages = [...prev.pages];
        newPages[pageIndex] = { ...newPages[pageIndex], isLoadingImage: false };
        return { ...prev, pages: newPages };
      });
    }
  };

  const handleGenerateStory = async () => {
    if (!prompt.trim()) return;

    setIsGeneratingStory(true);
    setStory(null);
    setCurrentPage(0);

    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.pages) {
        const initialStory: Story = {
          title: data.title,
          pages: data.pages.map((p: any) => ({ ...p, isLoadingImage: true })),
        };
        setStory(initialStory);
        setIsGeneratingStory(false);

        // Trigger image generation for all pages in parallel
        data.pages.forEach((page: any, index: number) => {
          generateImageForPage(index, page.imagePrompt);
        });

        notifications.show({
          title: "Story Crafted!",
          message: "The narrative is ready. Illustrations are being painted...",
          color: "blue",
        });
      } else {
        throw new Error(data.error || "Failed to generate story structure");
      }
    } catch (err: unknown) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      notifications.show({
        title: "Magic Failed",
        message: errorMessage,
        color: "red",
        autoClose: 5000,
      });
      setIsGeneratingStory(false);
    }
  };

  const completedPages =
    story?.pages.filter((p) => !p.isLoadingImage).length || 0;
  const progressPercent = story
    ? (completedPages / story.pages.length) * 100
    : 0;

  return (
    <Box
      component="main"
      py={60}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
      }}
    >
      <Container size="md">
        <Stack gap={40}>
          <Stack gap={10} align="center">
            <Badge variant="dot" color="grape" size="lg">
              AI Powered Storytelling
            </Badge>
            <Title
              order={1}
              size={42}
              fw={900}
              style={{ letterSpacing: "-1px" }}
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan", deg: 45 }}
            >
              Magic Storybook
            </Title>
            <Text c="dimmed" size="lg" ta="center" maw={600}>
              Enter a theme, and watch as Gemini crafts a tale and FLUX
              illustrates it page by page.
            </Text>
          </Stack>

          <Paper withBorder p="xl" radius="lg" shadow="md" bg="white">
            <Stack gap="md">
              <TextInput
                size="lg"
                placeholder="A small robot who wants to learn how to paint..."
                label="What is your story about?"
                value={prompt}
                onChange={(e) => setPrompt(e.currentTarget.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerateStory()}
                disabled={isGeneratingStory}
                leftSection={<BookOpen size={18} />}
                rightSectionWidth={140}
                rightSection={
                  <Button
                    onClick={handleGenerateStory}
                    loading={isGeneratingStory}
                    disabled={!prompt.trim()}
                    size="sm"
                    radius="md"
                    variant="gradient"
                    gradient={{ from: "indigo", to: "blue" }}
                    leftSection={<Sparkles size={16} />}
                  >
                    Create Story
                  </Button>
                }
              />
            </Stack>
          </Paper>

          {story && (
            <Stack gap="xl">
              <Stack gap="xs">
                <Group justify="space-between">
                  <Title order={2} size="h3" fw={800} c="indigo">
                    {story.title}
                  </Title>
                  <Text size="sm" fw={600} c="dimmed">
                    {completedPages} / {story.pages.length} Illustrations
                    Finished
                  </Text>
                </Group>
                <Progress
                  value={progressPercent}
                  animated={progressPercent < 100}
                  color="indigo"
                  radius="xl"
                  size="sm"
                />
              </Stack>

              <Grid gutter="xl">
                <Grid.Col span={{ base: 12, md: 7 }}>
                  <Card
                    p={0}
                    radius="lg"
                    withBorder
                    shadow="sm"
                    style={{ overflow: "hidden", aspectRatio: "1/1" }}
                  >
                    {story.pages[currentPage].isLoadingImage ? (
                      <Stack
                        align="center"
                        justify="center"
                        h="100%"
                        bg="gray.0"
                        gap="md"
                      >
                        <Loader color="indigo" type="bars" />
                        <Text size="sm" c="dimmed" fw={500} italic>
                          Illustrating scene {currentPage + 1}...
                        </Text>
                      </Stack>
                    ) : story.pages[currentPage].imageUrl ? (
                      <Image
                        src={story.pages[currentPage].imageUrl}
                        alt={`Story illustration page ${currentPage + 1}`}
                        fit="cover"
                        h="100%"
                        w="100%"
                      />
                    ) : (
                      <Stack
                        align="center"
                        justify="center"
                        h="100%"
                        bg="red.0"
                        gap="xs"
                      >
                        <Text c="red" size="sm">
                          Failed to paint this scene.
                        </Text>
                        <Button
                          variant="subtle"
                          size="xs"
                          onClick={() => {
                            setStory((prev) => {
                              if (!prev) return null;
                              const newPages = [...prev.pages];
                              newPages[currentPage] = {
                                ...newPages[currentPage],
                                isLoadingImage: true,
                              };
                              return { ...prev, pages: newPages };
                            });
                            generateImageForPage(
                              currentPage,
                              story.pages[currentPage].imagePrompt
                            );
                          }}
                        >
                          Try Again
                        </Button>
                      </Stack>
                    )}
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 5 }}>
                  <Stack justify="space-between" h="100%">
                    <Paper
                      p="xl"
                      withBorder
                      radius="lg"
                      bg="rgba(76, 110, 245, 0.03)"
                      style={{ flex: 1 }}
                    >
                      <Stack gap="xl">
                        <Badge size="xs" variant="light" color="indigo">
                          Page {currentPage + 1} of {story.pages.length}
                        </Badge>
                        <Text
                          size="xl"
                          fw={500}
                          style={{ lineHeight: 1.6, fontFamily: "serif" }}
                        >
                          {story.pages[currentPage].text}
                        </Text>
                      </Stack>
                    </Paper>

                    <Group grow gap="md" mt="xl">
                      <Button
                        variant="light"
                        leftSection={<ArrowLeft size={18} />}
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        radius="md"
                      >
                        Back
                      </Button>
                      <Button
                        variant="filled"
                        rightSection={<ArrowRight size={18} />}
                        disabled={currentPage === story.pages.length - 1}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        radius="md"
                        color="indigo"
                      >
                        Next Page
                      </Button>
                    </Group>
                  </Stack>
                </Grid.Col>
              </Grid>
            </Stack>
          )}

          {!story && !isGeneratingStory && (
            <Center py={100}>
              <Stack align="center" gap="sm" c="dimmed">
                <BookOpen size={64} strokeWidth={1} />
                <Text>Your magical journey begins with a prompt.</Text>
              </Stack>
            </Center>
          )}
        </Stack>
      </Container>
    </Box>
  );
}

import { Center } from "@mantine/core";
