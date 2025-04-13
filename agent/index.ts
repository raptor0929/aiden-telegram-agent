import { aiden, telegramPlugin } from './aiden';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the correct location
dotenv.config();

(async () => {
    console.log('🤖 Aiden Telegram Agent - Started');
    
    aiden.setLogger((aiden, message) => {
      console.log(`-----[${aiden.name}]-----`);
      console.log(message);
      console.log("\n");
    });

    // Initialize Telegram Plugin
    telegramPlugin.onMessage(async (msg) => {
      const agentTgWorker = aiden.getWorkerById(telegramPlugin.getWorker().id);
      const task = "Reply professionally to chat id: " + msg.chat.id + " and the incoming is message: " + msg.text + " and the message id is: " + msg.message_id;
  
      await agentTgWorker.runTask(task, {
        verbose: true, // Optional: Set to true to log each step
      });
    });
})();