export interface Step {
  id: string; // e.g., "1.1"
  refId: string; // e.g., "ID 1"
  title: string;
  description: string;
  dependencies: string[]; // e.g., ["ID 1"]
}

export interface Phase {
  id: number;
  title: string;
  description: string;
  steps: Step[];
}

export interface StoryboardScene {
  sceneNumber: number;
  title: string;
  visual: string;
  action: string;
  dialogue: string;
  notes?: string;
}

export interface StoryboardProject {
  id: string;
  title: string;
  concept: string;
  scenes: StoryboardScene[];
  createdAt: number;
}

export enum ViewMode {
  PLAYBOOK = 'PLAYBOOK',
  GRAPH = 'GRAPH',
  GENERATOR = 'GENERATOR',
}