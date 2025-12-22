export type Service = {
    id: string;
    name: string;
    path: string;
    description?: string;
};

const services: Service[] = [
    {
        id: "generate-image",
        name: "Image Generator",
        path: "/generate-image",
        description: "Create images from text prompts",
    },
    {
        id: "generate-story",
        name: "Story Generator",
        path: "/generate-story",
        description: "Generate illustrated stories from a short prompt",
    },
    {
        id: "chat",
        name: "Chat Assistant",
        path: "/chat",
        description: "Conversational AI assistant (coming soon)",
    },
];

export default services;
