import { createAPIFileRoute } from '@tanstack/react-start/api';
import { Redis } from "@upstash/redis";
import type { KumoUser } from '@/config/users';

const kv = Redis.fromEnv();

// Admin IDs that are allowed to use this bot (You can replace this or fetch from KV)
const ALLOWED_ADMINS = [
  // You should add your own Telegram User ID here, or leave empty to allow first interaction to be admin
];

async function sendMessage(chatId: number, text: string) {
  const token = process.env.BOT_TOKEN;
  if (!token) {
    console.error("BOT_TOKEN is missing");
    return;
  }
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

type AdminState = {
  step: 'idle' | 'awaiting_username' | 'awaiting_password' | 'awaiting_name' | 'awaiting_balance';
  draftUser: Partial<KumoUser>;
};

export const APIRoute = createAPIFileRoute('/api/telegram')({
  POST: async ({ request }) => {
    try {
      const update = await request.json();
      
      if (!update.message || !update.message.text) {
        return new Response("OK");
      }

      const chatId = update.message.chat.id;
      const text = update.message.text.trim();

      // Get current state from KV for this chat
      const stateKey = `admin_state:${chatId}`;
      let state: AdminState | null = await kv.get(stateKey);

      if (!state) {
        state = { step: 'idle', draftUser: {} };
      }

      if (text === '/cancel') {
        await kv.del(stateKey);
        await sendMessage(chatId, "ユーザー作成をキャンセルしました (User creation cancelled).");
        return new Response("OK");
      }

      if (text === '/adduser') {
        state = { step: 'awaiting_username', draftUser: {} };
        await kv.set(stateKey, state);
        await sendMessage(chatId, "新しいユーザーを作成します。\nユーザー名を入力してください (Enter username):");
        return new Response("OK");
      }

      // State machine processing
      switch (state.step) {
        case 'awaiting_username':
          state.draftUser.username = text;
          state.step = 'awaiting_password';
          await kv.set(stateKey, state);
          await sendMessage(chatId, `ユーザー名: ${text}\n次に、パスワードを入力してください (Enter password):`);
          break;
          
        case 'awaiting_password':
          state.draftUser.password = text;
          state.step = 'awaiting_name';
          await kv.set(stateKey, state);
          await sendMessage(chatId, "パスワードを保存しました。\n次に、フルネーム (表示名) を入力してください (Enter full name):");
          break;
          
        case 'awaiting_name':
          state.draftUser.displayName = text;
          state.step = 'awaiting_balance';
          await kv.set(stateKey, state);
          await sendMessage(chatId, `名前: ${text}\n最後に、初期残高を数字で入力してください (Enter initial balance):`);
          break;
          
        case 'awaiting_balance':
          const balance = parseFloat(text);
          if (isNaN(balance)) {
            await sendMessage(chatId, "有効な数値を入力してください (Please enter a valid number for balance):");
            break;
          }
          state.draftUser.balance = balance;
          state.draftUser.id = `u_${Date.now()}`;
          
          // Save the user to KV
          await kv.hset('users', {
            [state.draftUser.username!.toLowerCase()]: state.draftUser
          });
          
          await kv.del(stateKey);
          await sendMessage(chatId, `✅ ユーザー作成完了 (User created successfully)!\n\n名前: ${state.draftUser.displayName}\nユーザー名: ${state.draftUser.username}\nパスワード: ${state.draftUser.password}\n残高: $${balance.toLocaleString()}`);
          break;

        case 'idle':
        default:
          await sendMessage(chatId, "コマンドが認識されません。/adduser で新規ユーザーを作成できます。");
          break;
      }

      return new Response("OK");
    } catch (err) {
      console.error(err);
      return new Response("Error", { status: 500 });
    }
  }
});
