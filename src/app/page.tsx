"use client";
import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  Group,
  Box,
  SimpleGrid,
  Card,
  Badge,
  ThemeIcon,
  rem,
} from "@mantine/core";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  MessageSquare,
  ArrowRight,
  Image as ImageIcon,
} from "lucide-react";
import services from "../lib/services";

const iconMap: Record<string, React.ReactNode> = {
  "generate-image": <ImageIcon size={24} />,
  "generate-story": <BookOpen size={24} />,
  chat: <MessageSquare size={24} />,
};

export default function LandingPage() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        style={{
          paddingTop: 120,
          paddingBottom: 120,
          background:
            "radial-gradient(circle at top right, rgba(76, 110, 245, 0.05), transparent), radial-gradient(circle at bottom left, rgba(21, 170, 191, 0.05), transparent)",
        }}
      >
        <Container size="lg">
          <Stack align="center" gap="xl">
            <Badge
              variant="light"
              color="indigo"
              size="lg"
              radius="sm"
              style={{ padding: "10px 20px" }}
            >
              The Future of Creativity
            </Badge>
            <Text
              style={{
                fontSize: rem(64),
                fontWeight: 900,
                lineHeight: 1.1,
                textAlign: "center",
                letterSpacing: "-2px",
              }}
              variant="gradient"
              gradient={{ from: "indigo.8", to: "cyan.8", deg: 45 }}
            >
              Infinite Creation <br /> Powered by AI
            </Text>
            <Text
              size="xl"
              c="dimmed"
              ta="center"
              maw={600}
              style={{ lineHeight: 1.6, fontWeight: 400 }}
            >
              Explore a suite of AI-powered tools designed to help you imagine,
              write, and create without limits. Beautifully simple, accessible
              for everyone.
            </Text>
            <Group gap="md">
              <Button
                component={Link}
                href="/generate-image"
                size="lg"
                radius="md"
                variant="gradient"
                gradient={{ from: "indigo", to: "blue" }}
                rightSection={<ArrowRight size={18} />}
              >
                Get Started
              </Button>
              <Button
                component={Link}
                href="/generate-story"
                size="lg"
                radius="md"
                variant="light"
                color="indigo"
              >
                View Storytelling
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* Services Section */}
      <Container size="lg" py={100}>
        <Stack gap={50}>
          <Box ta="center">
            <Title
              order={2}
              size={32}
              fw={800}
              style={{ letterSpacing: "-1px" }}
            >
              Explore our Services
            </Title>
            <Text c="dimmed" mt="xs">
              Select a tool to start your creative journey
            </Text>
          </Box>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={30}>
            {services.map((service) => (
              <Card
                key={service.id}
                padding="xl"
                radius="xl"
                withBorder
                style={{
                  transition: "transform 200ms ease, box-shadow 200ms ease",
                  cursor: "pointer",
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
                className="hover-card"
                component={Link}
                href={service.path}
              >
                <ThemeIcon
                  size={50}
                  radius="md"
                  variant="light"
                  color="indigo"
                  mb="xl"
                >
                  {iconMap[service.id] || <Sparkles size={24} />}
                </ThemeIcon>
                <Text fw={700} size="lg" mb="sm">
                  {service.name}
                </Text>
                <Text size="sm" c="dimmed" mb="xl" style={{ lineHeight: 1.6 }}>
                  {service.description}
                </Text>
                <Group justify="flex-end">
                  <ArrowRight size={18} color="var(--mantine-color-indigo-6)" />
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>

      <style jsx global>{`
        .hover-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </Box>
  );
}
