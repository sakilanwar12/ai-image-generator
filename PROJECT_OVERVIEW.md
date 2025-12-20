Text to Image Generator
Project Overview (AI-Friendly Specification)
Purpose of This Document

This document defines what to build, how it should work, and what constraints to follow.
AI coding tools should read this file before generating any code for the project.

1. Project Description

The Text to Image Generator is a web application that allows users to generate images from text prompts using an AI image generation model.

The entire application must be implemented using Next.js only, without any external backend server.

2. Core Requirements (Must Follow)
2.1 Framework Rules

Use Next.js (App Router)

Use TypeScript

Use server-side API routes or server actions

Do NOT use Express, Fastify, or separate backend services

2.2 AI Model Rules

Use a free AI image generation model

AI inference must be done server-side

API keys must be stored in environment variables

The frontend must never access AI keys directly

Example sources (not mandatory):

Hugging Face Inference API

Other free-tier image inference providers

2.3 UI Rules

Simple and minimal UI

One main page

Clear input field for text prompt

Generate button

Loading indicator while generating image

Display generated image clearly

3. Functional Flow (Step-by-Step)

User opens the application

User enters a text prompt describing an image

User clicks the “Generate Image” button

The frontend sends the prompt to a server-side route

The server route sends the prompt to the AI image model

The AI model returns a generated image

The server returns the image to the frontend

The frontend displays the image to the user

4. Features Scope
4.1 Required Features

Text prompt input

Image generation from prompt

Loading state handling

Error handling for failed generation

Image preview after success

4.2 Optional / Future Features

(Do NOT implement unless requested)

Style presets (anime, realistic, cyberpunk)

Image size selection

Image download button

Prompt history

Dark mode

Authentication

Paid AI models

5. Non-Functional Requirements
Performance

Handle slow AI responses gracefully

Show loading indicators

Avoid blocking the UI

Security

Never expose API keys to the client

Validate prompt input

Respect free-tier rate limits

Scalability

Structure code cleanly for future upgrades

Keep AI logic isolated from UI logic

6. Project Structure Expectations

The project should follow a clean and understandable structure, separating:

UI components

Server-side logic

Utility/helper logic

AI tools should prioritize clarity over over-engineering.

7. What NOT to Do

Do NOT hardcode API keys

Do NOT use paid AI APIs by default

Do NOT add unnecessary dependencies

Do NOT build complex authentication systems

Do NOT over-design UI components

8. Intended Use

This project is intended for:

Learning AI integration with Next.js

Portfolio demonstration

Demo and experimentation

AI-assisted coding workflows

It is not intended for large-scale production.

9. Instructions for AI Coding Tools

When generating code for this project:

Follow all constraints in this document

Prefer simplicity and readability

Ask for clarification if requirements are unclear

Do not introduce features outside the defined scope

10. End of Specification

This document serves as the single source of truth for the project.
All implementation decisions should align with the goals and constraints described above.