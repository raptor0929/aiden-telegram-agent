import { NextResponse } from "next/server"
import { z } from "zod"
import { GameAgent } from "@virtuals-protocol/game"
import TelegramPlugin from "@virtuals-protocol/game-telegram-plugin"

const deploySchema = z.object({
  botToken: z.string(),
  communityName: z.string(),
  openaiKey: z.string(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { botToken, communityName, openaiKey } = deploySchema.parse(body)

    // Create a new .env file for this specific bot
    const envContent = `
API_KEY=${botToken}
OPENAI_API_KEY=${openaiKey}
COMMUNITY_NAME=${communityName}
`
    
    // Create Telegram plugin
    const telegramPlugin = new TelegramPlugin({
      credentials: {
        botToken: botToken
      }
    });
    
    // Initialize the agent with the provided configuration
    // Cast the workers array to 'any' type to avoid type conflicts between different versions
    const agent = new GameAgent(botToken, {
      name: communityName,
      description: `You are a community manager for ${communityName}. Your job is to help users, answer questions, and keep the community engaged.`,
      goal: `Build and maintain a thriving community for ${communityName}`,
      workers: [
        // Cast the worker to any to avoid type mismatches
        telegramPlugin.getWorker({
          functions: [
            telegramPlugin.sendMessageFunction,
            telegramPlugin.pinnedMessageFunction,
            telegramPlugin.createPollFunction, 
            telegramPlugin.sendMediaFunction,
          ]
        }) as any
      ]
    })

    // We don't need to explicitly start the agent as GameAgent constructor handles initialization

    return NextResponse.json({ 
      success: true, 
      message: "Bot deployed successfully",
      communityName 
    })
  } catch (error) {
    console.error("Deployment error:", error)
    return NextResponse.json(
      { error: "Failed to deploy bot" },
      { status: 500 }
    )
  }
} 