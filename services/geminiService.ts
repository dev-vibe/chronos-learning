import { TimelineNodeStub, NodeContent } from "../types";
import { STATIC_CONTENT } from "../staticContent";

export const fetchNodeContent = async (node: TimelineNodeStub): Promise<NodeContent> => {
  // Simulate a short "decryption" delay for the UI effect
  await new Promise((resolve) => setTimeout(resolve, 400));

  const content = STATIC_CONTENT[node.id];

  if (!content) {
    // This error message triggers the "Locked" UI state in NodeContentDisplay
    throw new Error("ARCHIVE LOCKED: Data pending historical analysis.");
  }
  
  return content;
};
