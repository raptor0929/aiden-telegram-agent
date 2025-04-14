"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { useAgentDeployment } from "@/app/hooks/useAgentDeployment"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

const formSchema = z.object({
  botToken: z.string().min(1, "Bot token is required"),
  communityName: z.string().min(1, "Community name is required"),
  openaiKey: z.string().min(1, "OpenAI API key is required"),
})

export default function DeployForm() {
  const [isDeploying, setIsDeploying] = useState(false);
  const {
    account,
    isPaid,
    isLoading: isPaymentLoading,
    payDeploymentFee,
    checkPaymentStatus,
  } = useAgentDeployment();

  useEffect(() => {
    if (account) {
      checkPaymentStatus();
    }
  }, [account, checkPaymentStatus]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      botToken: "",
      communityName: "",
      openaiKey: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsDeploying(true)
    try {
      // Process payment first if not already paid
      if (!isPaid) {
        try {
          toast.info("Processing payment...");
          await payDeploymentFee();
          toast.success("Payment successful!");
        } catch (error) {
          console.error('Payment failed:', error);
          toast.error("Payment failed. Please try again.");
          setIsDeploying(false);
          return;
        }
      }

      // Deploy the bot after payment is confirmed
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          userAddress: account, // Include the wallet address
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to deploy bot");
      }

      const data = await response.json();
      toast.success("Bot deployed successfully!");
      form.reset();
    } catch (error) {
      toast.error("Failed to deploy bot. Please try again.");
      console.error(error);
    } finally {
      setIsDeploying(false);
    }
  }

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deploy Telegram Bot</h1>
          <p className="text-muted-foreground">Create and deploy a new Telegram bot agent for your community management</p>
        </div>
      </div>

      {!account ? (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Wallet required</AlertTitle>
          <AlertDescription>
            Please connect your wallet using the Connect Wallet button in the sidebar to deploy a bot.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="outline" className="border-green-500/20 bg-green-500/5">
          <Info className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-500">Wallet connected</AlertTitle>
          <AlertDescription>
            Connected as {formatAddress(account)}
            {isPaid && " • Deployment fee already paid"}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="botToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bot Token</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Telegram bot token" {...field} />
                    </FormControl>
                    <FormDescription>
                      Get this from @BotFather on Telegram
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="communityName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Community Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your community name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be used to identify your community
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="openaiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OpenAI API Key</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your OpenAI API key" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Required for the AI capabilities of your bot
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                disabled={isDeploying || isPaymentLoading || !account}
              >
                {isDeploying || isPaymentLoading ? 
                  (isPaid ? "Deploying..." : "Processing Payment...") : 
                  (isPaid ? "Deploy Bot" : "Pay & Deploy Bot")
                }
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 