"use client";
import { Container, Text, Group, Box, Stack, Anchor } from "@mantine/core";
import Link from "next/link";

export default function Footer() {
  return (
    <Box
      component="footer"
      style={{
        paddingTop: 60,
        paddingBottom: 40,
        background: "rgba(248, 249, 250, 0.7)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(0, 0, 0, 0.05)",
        marginTop: "auto",
      }}
    >
      <Container size="lg">
        <Stack gap="xl">
          <Group justify="space-between" align="flex-start">
            <Stack gap="xs">
              <Text
                fw={900}
                size="xl"
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan", deg: 45 }}
              >
                FreeGenAI
              </Text>
              <Text size="sm" c="dimmed" maw={300}>
                Empowering creativity through the magic of artificial
                intelligence. Simple, elegant, and free.
              </Text>
            </Stack>

            <Group gap={60} align="flex-start">
              <Stack gap="xs">
                <Text fw={700} size="sm">
                  Services
                </Text>
                <Anchor
                  component={Link}
                  href="/generate-story"
                  size="sm"
                  c="dimmed"
                >
                  Story Generator
                </Anchor>
                <Anchor
                  component={Link}
                  href="/generate-image"
                  size="sm"
                  c="dimmed"
                >
                  Image Generator
                </Anchor>
                <Anchor component={Link} href="/chat" size="sm" c="dimmed">
                  Chat Assistant
                </Anchor>
              </Stack>
              <Stack gap="xs">
                <Text fw={700} size="sm">
                  Company
                </Text>
                <Anchor href="#" size="sm" c="dimmed">
                  About Us
                </Anchor>
                <Anchor href="#" size="sm" c="dimmed">
                  Privacy Policy
                </Anchor>
                <Anchor href="#" size="sm" c="dimmed">
                  Terms of Service
                </Anchor>
              </Stack>
            </Group>
          </Group>

          <Box
            style={{
              paddingTop: 24,
              borderTop: "1px solid rgba(0, 0, 0, 0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text size="xs" c="dimmed">
              © {new Date().getFullYear()} FreeGenAI. Crafted with love.
            </Text>
            <Group gap="md">{/* Add social links here if needed */}</Group>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
