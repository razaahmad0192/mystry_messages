"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ConfessionForm() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit() {
    if (!content.trim()) {
      toast.error("Confession cannot be empty");
      return;
    }

    if (content.trim().length > 500) {
      toast.error("Confession must be 500 characters or less");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/confessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || "Confession posted successfully!");
        setContent("");
        router.push("/");
        router.refresh();
      } else {
        toast.error(data.message || "Failed to post confession");
      }
    } catch (error) {
      console.error("Error posting confession:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <textarea
        className="w-full border border-gray-600 bg-gray-800 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
        rows={6}
        placeholder="Write your confession... (max 500 characters)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={500}
        disabled={loading}
      />
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">
          {content.length}/500 characters
        </span>
        <Button
          onClick={submit}
          disabled={loading || !content.trim()}
          className="bg-pink-600 hover:bg-pink-700 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            "Post Confession"
          )}
        </Button>
      </div>
    </div>
  );
}
