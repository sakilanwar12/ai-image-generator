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
  Card,
  Loader,
  rem,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  Sparkles,
  Download,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setImageUrl(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.imageUrl) {
        setImageUrl(data.imageUrl);
        notifications.show({
          title: "Artistic Creation Ready!",
          message: "Your AI-generated image has been successfully painted.",
          color: "blue",
        });
      } else {
        throw new Error(data.error || "Failed to generate image");
      }
    } catch (err: unknown) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      notifications.show({
        title: "Generation Failed",
        message: errorMessage,
        color: "red",
        autoClose: 5000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Box
      py={80}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fdfbfb 0%, #f0f2f5 100%)",
      }}
    >
      <Container size="sm">
        <Stack gap={40}>
          <Stack gap={10} align="center">
            <Badge variant="light" color="cyan" size="lg" radius="sm">
              AI Image Studio
            </Badge>
            <Text
              size={rem(48)}
              fw={900}
              variant="gradient"
              gradient={{ from: "cyan.7", to: "indigo.7", deg: 45 }}
              style={{ letterSpacing: "-1.5px", textAlign: "center" }}
            >
              Imagine Anything
            </Text>
            <Text c="dimmed" size="lg" ta="center" maw={500}>
              Transform your words into stunning visual art in seconds using the
              power of FLUX.
            </Text>
          </Stack>

          <Paper
            withBorder
            p="xl"
            radius="xl"
            shadow="sm"
            bg="white"
            style={{ border: "1px solid rgba(0,0,0,0.05)" }}
          >
            <Stack gap="md">
              <TextInput
                size="xl"
                placeholder="A dreamy landscape with floating islands and purple sky..."
                label="Describe your vision"
                value={prompt}
                onChange={(e) => setPrompt(e.currentTarget.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                disabled={isGenerating}
                leftSection={
                  <ImageIcon size={20} color="var(--mantine-color-cyan-6)" />
                }
                styles={{
                  input: {
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: "16px",
                  },
                  label: { marginBottom: "8px", fontWeight: 600 },
                }}
              />
              <Button
                onClick={handleGenerate}
                loading={isGenerating}
                disabled={!prompt.trim()}
                size="lg"
                radius="md"
                variant="gradient"
                gradient={{ from: "cyan", to: "indigo" }}
                leftSection={<Sparkles size={18} />}
                fullWidth
              >
                Generate Artwork
              </Button>
            </Stack>
          </Paper>

          <Card
            radius="xl"
            withBorder
            shadow="md"
            style={{
              minHeight: 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              background: "white",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            {isGenerating ? (
              <Stack align="center" gap="md">
                <Loader color="cyan" size="xl" type="bars" />
                <Text size="sm" c="dimmed" fw={500} fs="italic">
                  Bringing your vision to life...
                </Text>
              </Stack>
            ) : imageUrl ? (
              <Box
                style={{ width: "100%", height: "100%", position: "relative" }}
              >
                <Image
                  src={imageUrl}
                  alt="Generated AI Art"
                  fit="cover"
                  h="100%"
                  w="100%"
                />
                <Group
                  style={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    zIndex: 10,
                  }}
                >
                  <Button
                    variant="white"
                    color="dark"
                    size="sm"
                    radius="md"
                    leftSection={<Download size={16} />}
                    onClick={handleDownload}
                  >
                    Download
                  </Button>
                  <Button
                    variant="white"
                    color="cyan"
                    size="sm"
                    radius="md"
                    onClick={handleGenerate}
                  >
                    <RefreshCw size={18} />
                  </Button>
                </Group>
              </Box>
            ) : (
              <Stack
                align="center"
                gap="sm"
                c="dimmed"
                style={{ opacity: 0.5 }}
              >
                <Box
                  style={{
                    background: "rgba(0,0,0,0.02)",
                    padding: "40px",
                    borderRadius: "50%",
                  }}
                >
                  <ImageIcon size={64} strokeWidth={1} />
                </Box>
                <Text fw={500}>The canvas is waiting for your prompt.</Text>
              </Stack>
            )}
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
