import { Phase } from './types';

export const PLAYBOOK_DATA: Phase[] = [
  {
    id: 1,
    title: "Laying the Foundation",
    description: "Defining Roles, Rules, and Environment",
    steps: [
      {
        id: "1.1",
        refId: "ID 1",
        title: "Defining Roles and Responsibilities",
        description: "Articulate function, duties, and boundaries for each participant. Define Storyboard Creator as a visual narrator.",
        dependencies: []
      },
      {
        id: "1.2",
        refId: "ID 19",
        title: "Establishing Ethical Practices",
        description: "Ensure all operations uphold moral principles and prioritize well-being.",
        dependencies: []
      },
      {
        id: "1.3",
        refId: "ID 21",
        title: "Defining System Rules",
        description: "Establish guidelines for system operation and function specifications.",
        dependencies: []
      },
      {
        id: "1.4",
        refId: "ID 3",
        title: "Establishing Communication Protocols",
        description: "Define rules, formats (ID 13), and channels for interaction.",
        dependencies: ["ID 1"]
      },
      {
        id: "1.5",
        refId: "ID 2",
        title: "Refine System Prompts",
        description: "Improve instructions to AI agents to optimize performance and role adherence.",
        dependencies: ["ID 1"]
      },
      {
        id: "1.6",
        refId: "ID 9",
        title: "Generate High-Level Tasks",
        description: "Decompose the overall goal into abstract, actionable tasks.",
        dependencies: ["ID 1"]
      }
    ]
  },
  {
    id: 2,
    title: "Understanding the Narrative",
    description: "Collaboration and Conceptualization",
    steps: [
      {
        id: "2.1",
        refId: "ID 6",
        title: "Engaging in Meta-Communication",
        description: "Discuss the process, structure, and requirements (ID 14) of the playbook.",
        dependencies: ["ID 1", "ID 2", "ID 3"]
      },
      {
        id: "2.2",
        refId: "ID 12",
        title: "Facilitating Joint Decision-Making",
        description: "Guide the team towards consensus regarding content and structure.",
        dependencies: ["ID 6"]
      },
      {
        id: "2.3",
        refId: "ID 17",
        title: "Facilitating Collaboration",
        description: "Enable cooperative efforts of multiple individuals or agents.",
        dependencies: ["ID 1", "ID 2"]
      },
      {
        id: "2.4",
        refId: "ID 24",
        title: "Holistic Perspective",
        description: "Integrate knowledge from various fields to address complex problems.",
        dependencies: ["ID 1", "ID 6"]
      },
      {
        id: "2.5",
        refId: "ID 7",
        title: "Utilizing Placeholders",
        description: "Employ symbolic placeholders (e.g., [pipe:...]) for undefined areas.",
        dependencies: ["ID 6"]
      }
    ]
  },
  {
    id: 3,
    title: "Crafting the Storyboard",
    description: "Generation and Iteration",
    steps: [
      {
        id: "3.1",
        refId: "ID 8",
        title: "Translating to Formal Structures",
        description: "Convert natural language into formal structures (ID 18) for system execution.",
        dependencies: ["ID 2"]
      },
      {
        id: "3.2",
        refId: "ID 22",
        title: "Generating Tailored Plans",
        description: "Create customized plans aligning with user needs.",
        dependencies: ["ID 1", "ID 9"]
      },
      {
        id: "3.3",
        refId: "ID 20",
        title: "Creating Storyboards",
        description: "The central task. Develop visual narratives illustrating concepts.",
        dependencies: ["ID 1", "ID 6"]
      },
      {
        id: "3.4",
        refId: "ID 16",
        title: "Providing Concise Responses",
        description: "Deliver brief, informative information addressing user needs.",
        dependencies: ["ID 2"]
      }
    ]
  },
  {
    id: 4,
    title: "Operational Oversight",
    description: "Quality Assurance",
    steps: [
      {
        id: "4.1",
        refId: "ID 4",
        title: "Managing Operational Cycles",
        description: "Oversee operations, state management, and procedure adherence.",
        dependencies: ["ID 2", "ID 3"]
      },
      {
        id: "4.2",
        refId: "ID 5",
        title: "Monitoring System Integrity",
        description: "Assess stability, resilience (ID 15), and performance.",
        dependencies: ["ID 4"]
      },
      {
        id: "4.3",
        refId: "ID 11",
        title: "Adapting Roles Dynamically",
        description: "Adjust roles in real-time based on evolving requirements.",
        dependencies: ["ID 1", "ID 4"]
      },
      {
        id: "4.4",
        refId: "ID 10",
        title: "Quality Checks",
        description: "Evaluate deliverables against defined standards.",
        dependencies: ["ID 1", "ID 2"]
      },
      {
        id: "4.5",
        refId: "ID 23",
        title: "CLI Commands",
        description: "Generate precise commands for tools like Plandex.",
        dependencies: ["ID 8"]
      }
    ]
  }
];