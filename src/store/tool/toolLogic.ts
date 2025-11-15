import type { Tool, CreateToolInput, UpdateToolInput } from '../../types/tool';

export function createTool(input: CreateToolInput): Tool {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: input.name,
    description: input.description,
    function: input.function,
    price: input.price,
    serialNumber: input.serialNumber,
    imageData: input.imageData,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateToolItem(tool: Tool, updates: Omit<UpdateToolInput, 'id'>): Tool {
  return {
    ...tool,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
}

export function softDeleteToolItem(tool: Tool): Tool {
  return {
    ...tool,
    isDeleted: true,
    updatedAt: new Date().toISOString(),
  };
}

export function restoreToolItem(tool: Tool): Tool {
  return {
    ...tool,
    isDeleted: false,
    updatedAt: new Date().toISOString(),
  };
}

export function findToolById(tools: Tool[], id: string): Tool | undefined {
  return tools.find((tool) => tool.id === id);
}

export function filterActiveTools(tools: Tool[]): Tool[] {
  return tools.filter((tool) => !tool.isDeleted);
}
