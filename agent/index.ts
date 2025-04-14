import { aidog, telegramPlugin } from './aidog';
import dotenv from 'dotenv';

// Load environment variables from the correct location
dotenv.config();

(async () => {
    console.log('Starting...');

    await aidog.init();

    console.log('🤖 Aidog Telegram Agent - Started');
    
    aidog.setLogger((aidog, message) => {
      console.log(`-----[${aidog.name}]-----`);
      console.log(message);
      console.log("\n");
    });

    // Initialize Telegram Plugin
    telegramPlugin.onMessage(async (msg) => {
      const agentTgWorker = aidog.getWorkerById(telegramPlugin.getWorker().id);
      const task = "Reply professionally and fullfill the request to chat id: " + msg.chat.id + " and the incoming is message: " + msg.text + " and the message id is: " + msg.message_id;
  
      await agentTgWorker.runTask(task, {
        verbose: false, // Optional: Set to true to log each step
      });
    });
})();