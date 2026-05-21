import { createClient } from "@supabase/supabase-js";
import type { KumoUser } from "@/config/users";

function getSupabase() {
  const url = process.env.SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return createClient(url, key);
}

async function sendMessage(chatId: number, text: string) {
  const token = process.env.BOT_TOKEN;
  if (!token) {
    console.error("BOT_TOKEN is missing");
    return;
  }
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

type AdminState = {
  step: "idle" | "awaiting_username" | "awaiting_password" | "awaiting_name" | "awaiting_balance";
  draftUser: Partial<KumoUser>;
};

export async function handleTelegram(request: Request): Promise<Response> {
  try {
    const update = await request.json();

    if (!update.message || !update.message.text) {
      return new Response("OK");
    }

    const chatId: number = update.message.chat.id;
    const text: string = update.message.text.trim();

    const adminIdStr = process.env.ADMIN_TELEGRAM_ID;
    if (!adminIdStr) {
      await sendMessage(chatId, `Bot configuration is incomplete. Please add ADMIN_TELEGRAM_ID=${chatId} to your Vercel environment variables.`);
      return new Response("OK");
    }

    if (adminIdStr !== chatId.toString()) {
      await sendMessage(chatId, `Unauthorized access. Your Telegram ID (${chatId}) does not match the configured ADMIN_TELEGRAM_ID.`);
      return new Response("OK");
    }

    const supabase = getSupabase();

    const { data: stateRecord } = await supabase
      .from("telegram_states")
      .select("*")
      .eq("chat_id", chatId)
      .single();

    let state: AdminState = stateRecord
      ? { step: stateRecord.step, draftUser: stateRecord.draft_user || {} }
      : { step: "idle", draftUser: {} };

    const saveState = async (newState: AdminState) => {
      await supabase.from("telegram_states").upsert({
        chat_id: chatId,
        step: newState.step,
        draft_user: newState.draftUser,
      });
    };

    const clearState = async () => {
      await supabase.from("telegram_states").delete().eq("chat_id", chatId);
    };

    if (text === "/cancel") {
      await clearState();
      await sendMessage(chatId, "ユーザー作成をキャンセルしました (User creation cancelled).");
      return new Response("OK");
    }

    if (text === "/adduser") {
      state = { step: "awaiting_username", draftUser: {} };
      await saveState(state);
      await sendMessage(chatId, "新しいユーザーを作成します。\nユーザー名を入力してください (Enter username):");
      return new Response("OK");
    }

    switch (state.step) {
      case "awaiting_username":
        state.draftUser.username = text;
        state.step = "awaiting_password";
        await saveState(state);
        await sendMessage(chatId, `ユーザー名: ${text}\n次に、パスワードを入力してください (Enter password):`);
        break;

      case "awaiting_password":
        state.draftUser.password = text;
        state.step = "awaiting_name";
        await saveState(state);
        await sendMessage(chatId, "パスワードを保存しました。\n次に、フルネーム (表示名) を入力してください (Enter full name):");
        break;

      case "awaiting_name":
        state.draftUser.displayName = text;
        state.step = "awaiting_balance";
        await saveState(state);
        await sendMessage(chatId, `名前: ${text}\n最後に、初期残高を数字で入力してください (Enter initial balance):`);
        break;

      case "awaiting_balance": {
        const balance = parseFloat(text);
        if (isNaN(balance)) {
          await sendMessage(chatId, "有効な数値を入力してください (Please enter a valid number for balance):");
          break;
        }
        state.draftUser.balance = balance;
        state.draftUser.id = `u_${Date.now()}`;

        const { error: insertError } = await supabase.from("kumo_users").upsert({
          id: state.draftUser.id,
          username: state.draftUser.username!.toLowerCase(),
          display_name: state.draftUser.displayName,
          password: state.draftUser.password,
          balance: state.draftUser.balance,
        });

        if (insertError) {
          console.error("Error inserting user", insertError);
          await sendMessage(chatId, "ユーザーの作成中にエラーが発生しました (Error creating user).");
          break;
        }

        await clearState();
        await sendMessage(
          chatId,
          `✅ ユーザー作成完了 (User created successfully)!\n\n名前: ${state.draftUser.displayName}\nユーザー名: ${state.draftUser.username}\nパスワード: ${state.draftUser.password}\n残高: $${balance.toLocaleString()}`,
        );
        break;
      }

      default:
        await sendMessage(chatId, "コマンドが認識されません。/adduser で新規ユーザーを作成できます。");
        break;
    }

    return new Response("OK");
  } catch (err) {
    console.error("[telegram] error:", err);
    return new Response("Error", { status: 500 });
  }
}
