import Pusher from "pusher";
import { createClient } from "@supabase/supabase-js";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, message } = req.body;

    // Save message to Supabase
    await supabase.from("messages").insert([{ username, message }]);

    // Trigger Pusher event
    await pusher.trigger("chat-channel", "new-message", {
      username,
      message,
    });

    res.status(200).json({ status: "Message sent and saved" });
  } else if (req.method === "GET") {
    // Fetch messages from Supabase
    const { data } = await supabase.from("messages").select().order("created_at", { ascending: true });
    res.status(200).json(data);
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
