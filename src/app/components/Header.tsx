"use client";
import Link from "next/link";
import {
  Container,
  Group,
  Anchor,
  Button,
  Burger,
  Box,
  Text,
} from "@mantine/core";
import { useState } from "react";
import services from "../../lib/services";

export default function Header() {
  const [opened, setOpened] = useState(false);

  return (
    <Box
      component="header"
      style={{
        height: 70,
        display: "flex",
        alignItems: "center",
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
      }}
    >
      <Container size="lg" style={{ width: "100%" }}>
        <Group justify="space-between" align="center">
          <Anchor component={Link} href="/" style={{ textDecoration: "none" }}>
            <Text
              fw={900}
              size="xl"
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan", deg: 45 }}
              style={{ letterSpacing: "-0.5px" }}
            >
              FreeGenAI
            </Text>
          </Anchor>

          <Group gap="sm" visibleFrom="sm">
            {services.map((s) => (
              <Button
                key={s.id}
                variant="subtle"
                component={Link}
                href={s.path}
                size="sm"
                color="gray"
                style={{ fontWeight: 500 }}
              >
                {s.name}
              </Button>
            ))}
          </Group>

          <Group hiddenFrom="sm">
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
            />
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
