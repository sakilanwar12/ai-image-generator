"use client";
import { useState } from "react";
import {
  Container,
  TextInput,
  Button,
  Paper,
  Image,
  Stack,
  Group,
  Text,
  Box,
  Badge,
  Grid,
  Card,
  Progress,
  Loader,
  rem,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { BookOpen, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

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

export default function StoryGenerator() {
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
          pages: data.pages.map((p: { text: string; imagePrompt: string }) => ({
            ...p,
            isLoadingImage: true,
          })),
        };
        setStory(initialStory);
        setIsGeneratingStory(false);

        // Trigger image generation for all pages in parallel
        data.pages.forEach((page: { imagePrompt: string }, index: number) => {
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
      py={60}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fafafa 0%, #f0f2f5 100%)",
      }}
    >
      <Container size="md">
        <Stack gap={40}>
          <Stack gap={10} align="center">
            <Badge variant="light" color="indigo" size="lg" radius="sm">
              AI Storyteller
            </Badge>
            <Text
              size={rem(48)}
              fw={900}
              variant="gradient"
              gradient={{ from: "indigo.7", to: "cyan.7", deg: 45 }}
              style={{ letterSpacing: "-1.5px", textAlign: "center" }}
            >
              Magic Storybook
            </Text>
            <Text
              c="dimmed"
              size="lg"
              ta="center"
              maw={600}
              style={{ fontWeight: 400 }}
            >
              Unlock your imagination. Enter a theme, and watch as Gemini crafts
              a tale and FLUX illustrates it page by page.
            </Text>
          </Stack>

          <Paper
            withBorder
            p="xl"
            radius="lg"
            shadow="sm"
            bg="white"
            style={{ border: "1px solid rgba(0,0,0,0.05)" }}
          >
            <Stack gap="md">
              <TextInput
                size="xl"
                placeholder="A small robot who wants to learn how to paint..."
                label="Your Story Theme"
                value={prompt}
                onChange={(e) => setPrompt(e.currentTarget.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerateStory()}
                disabled={isGeneratingStory}
                leftSection={
                  <BookOpen size={20} color="var(--mantine-color-indigo-6)" />
                }
                styles={{
                  input: {
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: "12px",
                  },
                  label: { marginBottom: "8px", fontWeight: 600 },
                }}
                rightSectionWidth={160}
                rightSection={
                  <Button
                    onClick={handleGenerateStory}
                    loading={isGeneratingStory}
                    disabled={!prompt.trim()}
                    size="md"
                    radius="md"
                    variant="gradient"
                    gradient={{ from: "indigo", to: "blue" }}
                    leftSection={<Sparkles size={18} />}
                    style={{ marginRight: "4px" }}
                  >
                    Build Story
                  </Button>
                }
              />
            </Stack>
          </Paper>

          {story && (
            <Stack gap="xl">
              <Stack gap="xs">
                <Group justify="space-between" align="flex-end">
                  <Text size="xl" fw={800} c="indigo.8">
                    {story.title}
                  </Text>
                  <Text size="sm" fw={600} c="dimmed">
                    {completedPages} / {story.pages.length} Illustrations
                  </Text>
                </Group>
                <Progress
                  value={progressPercent}
                  animated={progressPercent < 100}
                  color="indigo"
                  radius="xl"
                  size="sm"
                  style={{ background: "rgba(0,0,0,0.05)" }}
                />
              </Stack>

              <Grid gutter="xl">
                <Grid.Col span={{ base: 12, md: 7 }}>
                  <Card
                    p={0}
                    radius="xl"
                    withBorder
                    shadow="sm"
                    style={{
                      overflow: "hidden",
                      aspectRatio: "1/1",
                      border: "1px solid rgba(0,0,0,0.05)",
                    }}
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
                        <Text size="sm" c="dimmed" fw={500} fs="italic">
                          Painting scene {currentPage + 1}...
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
                      radius="xl"
                      bg="rgba(76, 110, 245, 0.02)"
                      style={{
                        flex: 1,
                        border: "1px solid rgba(76, 110, 245, 0.1)",
                      }}
                    >
                      <Stack gap="xl">
                        <Badge
                          size="sm"
                          variant="light"
                          color="indigo"
                          radius="sm"
                        >
                          Page {currentPage + 1} of {story.pages.length}
                        </Badge>
                        <Text
                          size="xl"
                          fw={500}
                          style={{
                            lineHeight: 1.7,
                            fontFamily: "serif",
                            color: "#2c3e50",
                          }}
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
                        color="gray"
                      >
                        Previous
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
            <Box py={80} style={{ display: "flex", justifyContent: "center" }}>
              <Stack
                align="center"
                gap="sm"
                c="dimmed"
                style={{ opacity: 0.6 }}
              >
                <Box
                  style={{
                    background: "rgba(0,0,0,0.03)",
                    padding: "30px",
                    borderRadius: "50%",
                  }}
                >
                  <BookOpen size={48} strokeWidth={1} />
                </Box>
                <Text fw={500}>Your magical journey begins with a prompt.</Text>
              </Stack>
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
