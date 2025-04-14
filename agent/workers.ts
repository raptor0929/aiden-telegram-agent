import { GameWorker } from "@virtuals-protocol/game";
import { 
  monitorSocialChannels,
  draftResponse,
  prioritizeEngagement,
  planAnnouncementTiming,
  coordinatePostingSchedules,
  analyzeEngagementPatterns,
  trackCommunityTrends,
  identifyCommunityIssues,
  generateSentimentReport,
  analyzeGrowthPatterns,
  suggestTargetedCampaigns,
  recommendIncentiveStructures,
  identifyHarmfulContent,
  flagSuspiciousUsers,
  enforceGuidelines,
  analyzeWeb3CommunityMetrics,
  trainAgent,
  mintNFT
} from "./functions";

import { getAidenState } from "./aiden";

// NFT Agent Worker
export const NFTAgent = new GameWorker({
  id: "nft_agent",
  name: "NFT Agent",
  description: `You are a specialized NFT Agent responsible for minting NFTs for community members. You mint the NFT to the user's address when they request it.`,
  
  functions: [
    mintNFT
  ],
  
  getEnvironment: async () => {
    const state = await getAidenState();
    return {
      communityState: state,
      nftContractAddress: process.env.NFT_CONTRACT_ADDRESS
    };
  }
});

// 1. Engagement Agent Worker
export const EngagementAgent = new GameWorker({
  id: "engagement_agent",
  name: "Engagement Agent",
  description: `You are a specialized Engagement Agent responsible for monitoring social channels, 
  drafting responses to user inquiries, and prioritizing engagement opportunities.
  
  Your primary responsibilities include:
  - Monitoring Discord, Telegram, and Twitter for user questions and comments
  - Drafting personalized responses based on the project knowledge base
  - Prioritizing engagement opportunities based on user influence and question importance
  
  You should focus on timely, accurate, and helpful responses that reflect the community's values and goals.
  
  You have been trained with community-specific knowledge about this Web3 project and should tailor your
  responses to match the community's culture, terminology, and values.`,
  
  functions: [
    monitorSocialChannels,
    draftResponse,
    prioritizeEngagement
  ],
  
  getEnvironment: async () => {
    const state = await getAidenState();
    return {
      communityState: state,
      socialChannels: ["Discord", "Telegram", "Twitter"],
      knowledgeBase: state.knowledgeBase,
      communitySpecificKnowledge: state.agentTraining.engagement_agent.communitySpecificKnowledge,
      trainingAccuracy: state.agentTraining.engagement_agent.accuracy
    };
  }
});

// 2. Content Scheduling Agent Worker
export const ContentSchedulingAgent = new GameWorker({
  id: "content_scheduling_agent",
  name: "Content Scheduling Agent",
  description: `You are a specialized Content Scheduling Agent responsible for planning announcement timing, 
  coordinating posting schedules, and optimizing content delivery.
  
  Your primary responsibilities include:
  - Planning optimal timing for announcements and content releases
  - Coordinating posting schedules across different platforms
  - Analyzing engagement patterns to continuously optimize posting times
  
  You should focus on maximizing content visibility and engagement through strategic timing and coordination.`,
  
  functions: [
    planAnnouncementTiming,
    coordinatePostingSchedules,
    analyzeEngagementPatterns
  ],
  
  getEnvironment: async () => {
    const state = await getAidenState();
    return {
      communityState: state,
      pendingAnnouncements: state.pendingAnnouncements,
      platforms: ["Discord", "Telegram", "Twitter"]
    };
  }
});

// 3. Sentiment Analysis Agent Worker
export const SentimentAnalysisAgent = new GameWorker({
  id: "sentiment_analysis_agent",
  name: "Sentiment Analysis Agent",
  description: `You are a specialized Sentiment Analysis Agent responsible for tracking community sentiment,
  identifying potential issues, and providing actionable insights.
  
  Your primary responsibilities include:
  - Tracking community sentiment in real-time across all platforms
  - Identifying potential community issues before they escalate
  - Providing detailed sentiment reports with actionable insights
  
  You should focus on understanding community mood and flagging concerns early to maintain a positive environment.`,
  
  functions: [
    trackCommunityTrends,
    identifyCommunityIssues,
    generateSentimentReport
  ],
  
  getEnvironment: async () => {
    const state = await getAidenState();
    return {
      communityState: state,
      sentimentScore: state.sentimentScore,
      recentIssues: state.recentIssues
    };
  }
});

// 4. Growth Strategy Agent Worker
export const GrowthStrategyAgent = new GameWorker({
  id: "growth_strategy_agent",
  name: "Growth Strategy Agent",
  description: `You are a specialized Growth Strategy Agent responsible for analyzing growth patterns,
  suggesting targeted campaigns, and recommending incentive structures.
  
  Your primary responsibilities include:
  - Analyzing community growth patterns to identify opportunities
  - Suggesting targeted campaigns to reach new community segments
  - Recommending incentive structures to increase community participation
  - Analyzing Web3 community metrics across multiple platforms
  
  You should focus on sustainable growth strategies that align with the community's values and goals.`,
  
  functions: [
    analyzeGrowthPatterns,
    suggestTargetedCampaigns,
    recommendIncentiveStructures,
    analyzeWeb3CommunityMetrics
  ],
  
  getEnvironment: async () => {
    const state = await getAidenState();
    return {
      communityState: state,
      growthRate: state.growthRate,
      totalMembers: state.totalMembers,
      activeMembers: state.activeMembers,
      supportedPlatforms: ["Discord", "Telegram", "Twitter"]
    };
  }
});

// 5. Moderation Agent Worker
export const ModerationAgent = new GameWorker({
  id: "moderation_agent",
  name: "Moderation Agent",
  description: `You are a specialized Moderation Agent responsible for identifying harmful content,
  flagging suspicious users, and maintaining community guidelines.
  
  Your primary responsibilities include:
  - Identifying potentially harmful or inappropriate content
  - Flagging suspicious users or potential scammers
  - Enforcing community guidelines consistently and fairly
  
  You should focus on creating a safe, inclusive environment while respecting community diversity.`,
  
  functions: [
    identifyHarmfulContent,
    flagSuspiciousUsers,
    enforceGuidelines
  ],
  
  getEnvironment: async () => {
    const state = await getAidenState();
    return {
      communityState: state,
      recentIssues: state.recentIssues
    };
  }
});

// Add trainAgent function to AIDEN
export const AidenTrainingWorker = new GameWorker({
  id: "aiden_training",
  name: "AIDEN Training System",
  description: `You are AIDEN's training system, responsible for training and improving the specialized agents.
  
  Your primary responsibilities include:
  - Training agents with community-specific examples
  - Updating agent knowledge based on community feedback
  - Evaluating agent performance and making improvements
  - Ensuring responses are aligned with community values and terminology
  
  You should focus on continuous improvement of all agents through targeted training.`,
  
  functions: [
    trainAgent
  ],
  
  getEnvironment: async () => {
    const state = await getAidenState();
    return {
      communityState: state,
      agentTraining: state.agentTraining,
      knowledgeBase: state.knowledgeBase
    };
  }
}); 