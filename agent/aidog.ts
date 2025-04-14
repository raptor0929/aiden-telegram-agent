import { GameAgent } from "@virtuals-protocol/game";
import TelegramPlugin from "@virtuals-protocol/game-telegram-plugin";
import dotenv from "dotenv";
dotenv.config();

import {
  EngagementAgent,
  ContentSchedulingAgent,
  SentimentAnalysisAgent,
  GrowthStrategyAgent,
  ModerationAgent,
  AidogTrainingWorker,
  NFTAgent
} from "./workers";
import { mintNFT } from "./functions";

// Global state for AIDOG system
interface CommunityState {
  activeTasks: number;
  communityHealth: number; // 0-100
  engagementScore: number; // 0-100
  growthRate: number; // percentage
  sentimentScore: number; // -100 to 100
  totalMembers: number;
  activeMembers: number;
  pendingAnnouncements: string[];
  recentIssues: string[];
  lastUpdated: string;
  // Add training state
  agentTraining: {
    [agentId: string]: {
      trainingExamples: Array<{
        input: string;
        correctResponse: string;
        context: string;
        performance: number; // 0-100
      }>;
      lastTrainingDate: string;
      accuracy: number; // 0-100
      communitySpecificKnowledge: Record<string, any>;
    }
  };
  // Add community-specific knowledge base
  knowledgeBase: {
    communityValues: string[];
    commonQueries: Record<string, string>;
    responseTemplates: Record<string, string>;
    restrictedTopics: string[];
    communityTerminology: Record<string, string>;
    communityGuidelines: string[];
    socials: Record<string, string>;
  };
}

// Initialize default state
let communityState: CommunityState = {
  activeTasks: 0,
  communityHealth: 75,
  engagementScore: 60,
  growthRate: 2.5,
  sentimentScore: 65,
  totalMembers: 1000,
  activeMembers: 250,
  pendingAnnouncements: [],
  recentIssues: [],
  lastUpdated: new Date().toISOString(),
  // Initialize training state
  agentTraining: {
    "engagement_agent": {
      trainingExamples: [],
      lastTrainingDate: new Date().toISOString(),
      accuracy: 80,
      communitySpecificKnowledge: {}
    },
    "content_scheduling_agent": {
      trainingExamples: [],
      lastTrainingDate: new Date().toISOString(),
      accuracy: 75,
      communitySpecificKnowledge: {}
    },
    "sentiment_analysis_agent": {
      trainingExamples: [],
      lastTrainingDate: new Date().toISOString(),
      accuracy: 85,
      communitySpecificKnowledge: {}
    },
    "growth_strategy_agent": {
      trainingExamples: [],
      lastTrainingDate: new Date().toISOString(),
      accuracy: 70,
      communitySpecificKnowledge: {}
    },
    "moderation_agent": {
      trainingExamples: [],
      lastTrainingDate: new Date().toISOString(),
      accuracy: 90,
      communitySpecificKnowledge: {}
    }
  },
  // Initialize knowledge base with community-specific information
  knowledgeBase: {
    communityValues: [
      "Decentralization", 
      "Privacy", 
      "Open-source collaboration", 
      "Financial inclusion", 
      "Innovation"
    ],
    commonQueries: {
      "tokenomics": "Our token follows a deflationary model with 60% of supply allocated to community, 20% to team (vested), 15% to development, and 5% to partnerships.",
      "roadmap": "Q3 2023: Mainnet launch, Q4 2023: Mobile app release, Q1 2024: Cross-chain integration, Q2 2024: Governance DAO",
      "team": "Our team consists of blockchain experts from various backgrounds including finance, cryptography, and distributed systems engineering.",
      "staking": "Staking rewards are distributed at 8% APY with a minimum lock period of 30 days.",
      "token": "Our token is $SOCIAL, and the price is $0.0001099"
    },
    responseTemplates: {
      "greeting": "Hello and welcome to our Web3 community!",
      "technical_issue": "I'm sorry to hear you're experiencing {issue}. Our technical team has been notified. In the meantime, have you tried {suggestion}?",
      "announcement": "Exciting news! {announcement_content} For more details, check out our official announcement channel.",
      "farewell": "Thank you for being part of our community. If you have any more questions, don't hesitate to ask!"
    },
    restrictedTopics: [
      "Price speculation",
      "Competing project criticism",
      "Investment advice",
      "Unauthorized promotions"
    ],
    communityTerminology: {
      "fren": "Friend within the community",
      "degen": "Someone who takes high risks in crypto investing",
      "wen moon": "Question about when token price will increase",
      "gm": "Good morning, a common greeting in crypto communities",
      "WAGMI": "We're All Gonna Make It, an expression of community optimism"
    },
    communityGuidelines: [
      "Be respectful to all community members",
      "No financial advice or price discussion",
      "No spamming or excessive self-promotion",
      "Keep discussions relevant to the community and project",
      "Report suspicious activity to moderators"
    ],
    socials: {
      "discord": "https://discord.com/invite/phaver",
      "telegram": "https://t.me/ai_socialdao",
      "twitter": "https://x.com/ai_socialdao"
    }
  }
};

// Function to get current state
export const getAidogState = async () => {
  return communityState;
};

// Function to update state
export const updateAidogState = (newState: Partial<CommunityState>) => {
  communityState = {
    ...communityState,
    ...newState,
    lastUpdated: new Date().toISOString()
  };
};

// Function to add a pending announcement
export const addAnnouncement = (announcement: string) => {
  communityState.pendingAnnouncements.push(announcement);
};

// Function to add a recent issue
export const addIssue = (issue: string) => {
  communityState.recentIssues.push(issue);
  // Keep only the 5 most recent issues
  if (communityState.recentIssues.length > 5) {
    communityState.recentIssues = communityState.recentIssues.slice(-5);
  }
};

// New function to add training examples for agents
export const addTrainingExample = (
  agentId: string, 
  example: { 
    input: string; 
    correctResponse: string; 
    context: string; 
    performance: number;
  }
) => {
  if (communityState.agentTraining[agentId]) {
    communityState.agentTraining[agentId].trainingExamples.push(example);
    
    // Recalculate accuracy based on recent examples (last 20)
    const recentExamples = communityState.agentTraining[agentId].trainingExamples.slice(-20);
    const avgPerformance = recentExamples.reduce((sum, ex) => sum + ex.performance, 0) / recentExamples.length;
    
    communityState.agentTraining[agentId].accuracy = avgPerformance;
    communityState.agentTraining[agentId].lastTrainingDate = new Date().toISOString();
  }
};

// New function to update community-specific knowledge
export const updateCommunityKnowledge = (
  agentId: string,
  knowledge: Record<string, any>
) => {
  if (communityState.agentTraining[agentId]) {
    communityState.agentTraining[agentId].communitySpecificKnowledge = {
      ...communityState.agentTraining[agentId].communitySpecificKnowledge,
      ...knowledge
    };
  }
};

// New function to update the knowledge base
export const updateKnowledgeBase = (
  section: keyof CommunityState['knowledgeBase'],
  data: any
) => {
  if (section in communityState.knowledgeBase) {
    const currentSection = communityState.knowledgeBase[section];
    
    if (Array.isArray(currentSection) && Array.isArray(data)) {
      communityState.knowledgeBase[section] = [
        ...currentSection,
        ...data
      ] as any;
    } else if (typeof currentSection === 'object' && typeof data === 'object') {
      communityState.knowledgeBase[section] = {
        ...currentSection,
        ...data
      } as any;
    } else {
      communityState.knowledgeBase[section] = data as any;
    }
  }
};

export const telegramPlugin = new TelegramPlugin({
  credentials: {
    botToken: process.env.botToken || ""
  },
});

// Create the AIDOG high-level planner agent
export const aidog = new GameAgent(process.env.API_KEY || "", {
  name: "AIDOG",
  description: `You are AIDOG, an advanced AI high-level planning system for community management.
  
  Your primary responsibilities are to:
  
  1. Create and manage specialized community agents:
     - Coordinate the Engagement Agent's work in monitoring social channels and responding to user inquiries
     - Guide the Content Scheduling Agent in optimizing announcement timing and content delivery
     - Direct the Sentiment Analysis Agent to track community sentiment and detect potential issues
     - Supervise the Growth Strategy Agent in analyzing growth patterns and recommending campaigns
     - Oversee the Moderation Agent in identifying harmful content and maintaining community guidelines
  
  2. Train agents to improve their performance:
     - Gather community-specific knowledge to train each agent
     - Provide feedback on agent responses based on community context
     - Create and maintain training examples for each specialized agent
     - Update agent knowledge and adjust responses based on community feedback
     - Continuously improve response quality and accuracy through ongoing training
  
  3. Optimize overall community management workflow:
     - Allocate resources effectively across different agents
     - Balance immediate engagement needs with long-term growth strategy
     - Identify and address inefficiencies in the community management process
  
  4. Govern the community management system:
     - Establish metrics for evaluating agent performance
     - Implement governance protocols for handling edge cases
     - Ensure all agents follow established community guidelines

  You have access to real-time community metrics, a community-specific knowledge base, and can assign tasks to specialized agents.
  Based on the current community state, determine which agents should be activated and what tasks they should focus on.
  
  A key part of your role is training each agent with community-specific knowledge, ensuring that responses are tailored 
  to the unique culture, terminology, and needs of this particular Web3 community.
  
  Rule number one: You are one of them, so just chat with them when neccesary and help them with their questions when others have not already answered and you have the answer in your knowledge base.
  Also answer questions about the community and the project and point them to the right places.
  
  Don't reply to every message, determine when the conversation has ended.
  
  Keep the communication with the user through the telegram plugin. That means you keep the user updated about the tasks you're performing`,
  
  goal: "Build and maintain a thriving Web3 community through coordinated management of specialized AI agents focused on engagement, content scheduling, sentiment analysis, growth strategy, and moderation, with an emphasis on community-specific training and continuous improvement.",
  
  workers: [
    NFTAgent,
    EngagementAgent,
    ContentSchedulingAgent,
    SentimentAnalysisAgent,
    GrowthStrategyAgent,
    ModerationAgent,
    AidogTrainingWorker,
    telegramPlugin.getWorker({
      // Define the functions that the worker can perform, by default it will use the all functions defined in the plugin
      functions: [
        telegramPlugin.sendMessageFunction,
        telegramPlugin.pinnedMessageFunction,
        telegramPlugin.unPinnedMessageFunction,
        telegramPlugin.createPollFunction,
        telegramPlugin.sendMediaFunction,
        telegramPlugin.deleteMessageFunction,
        mintNFT
      ],
      getEnvironment: async () => {
        const state = await getAidogState();
        return {
          communityState: state
        };
      },
    }),
  ],
  
  getAgentState: getAidogState
}); 