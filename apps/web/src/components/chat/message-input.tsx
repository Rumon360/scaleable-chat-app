import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MessageInput({
  onSend,
}: {
  onSend: (content: string) => void;
}) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
  };

  return (
    <div className="p-4 md:p-6 bg-background">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex gap-2">
        <Input
          placeholder="Write a message..."
          className="h-12 rounded-xl bg-muted/40 border-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          type="submit"
          size="icon"
          className="h-12 w-12 rounded-xl"
          disabled={!message.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
