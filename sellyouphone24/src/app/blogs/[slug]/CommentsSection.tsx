"use client";

import { useState } from "react";
import { MessageSquare, Send, User } from "lucide-react";

type Comment = {
  id: number;
  author: string;
  content: string;
  createdAt: string;
};

const CommentsSection = ({ postId }: { postId: number | string }) => {
  // Pre-seed some mock comments depending on the blog post
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "Adnan Yousuf",
      content: "Very informative article! I always forget to sign out of my iCloud before reset. Appreciate the detailed steps.",
      createdAt: "3 days ago",
    },
    {
      id: 2,
      author: "Mariam Al Suwaidi",
      content: "Eco-friendly recycling is so important. Good to see platforms focusing on carbon offsets and circular economy in Dubai.",
      createdAt: "1 week ago",
    },
  ]);

  const [authorName, setAuthorName] = useState("");
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!authorName.trim() || !commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      author: authorName,
      content: commentText,
      createdAt: "Just now",
    };

    setComments((prev) => [newComment, ...prev]);
    setAuthorName("");
    setCommentText("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b pb-3">
        <MessageSquare size={20} className="text-emerald-500" />
        <h3 className="font-bold text-slate-800 text-base md:text-lg">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
        <h4 className="font-bold text-xs text-slate-600 uppercase">Write a comment</h4>
        
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500 text-xs bg-white text-slate-700 w-full"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
          />
        </div>

        <div className="relative">
          <textarea
            placeholder="Share your thoughts or questions..."
            rows={3}
            className="border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500 text-xs bg-white text-slate-700 w-full resize-none pr-10"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
          />
          <button
            type="submit"
            className="absolute bottom-3 right-3 p-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg transition cursor-pointer"
            title="Post Comment"
          >
            <Send size={14} />
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4 p-4 border border-slate-100 rounded-2xl bg-white shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0">
              <User size={18} />
            </div>
            
            <div className="space-y-1.5 flex-1">
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-xs text-slate-800">{comment.author}</h4>
                <span className="text-[10px] text-slate-400 font-semibold">{comment.createdAt}</span>
              </div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed text-justify">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
