import React, { useState } from "react";
import { X, Star, Loader2, CheckCircle } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) return; // prevent empty submissions

    setSending(true);

    // Simulate sending
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);

      // Auto-close after success
      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
        setMessage("");
        onClose();
      }, 2000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
      
      <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in duration-200">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Heading */}
        <div className="flex items-center mb-6">
          <div className="bg-amber-500 p-3 rounded-xl shadow-inner mr-4">
            <Star className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Rate Your Experience</h2>
        </div>

        {/* Success View */}
        {submitted ? (
          <div className="flex flex-col items-center text-center py-10">
            <CheckCircle className="w-12 h-12 text-green-600 mb-3" />
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              Thank You!
            </h3>
            <p className="text-slate-600 max-w-sm">
              We appreciate your feedback and use it to improve the tool.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* 5-star rating */}
            <div className="flex justify-center space-x-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = hoverRating >= star || rating >= star;
                return (
                  <Star
                    key={star}
                    className={`w-10 h-10 cursor-pointer transition-all ${
                      filled
                        ? "text-amber-400 fill-amber-400 scale-110"
                        : "text-slate-300"
                    }`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  />
                );
              })}
            </div>

            {/* Rating Label */}
            <p className="text-center text-sm text-slate-600">
              {rating === 0
                ? "Tap a star to rate"
                : rating === 5
                ? "Excellent!"
                : rating === 4
                ? "Very good!"
                : rating === 3
                ? "Average"
                : rating === 2
                ? "Needs improvement"
                : "Poor experience"}
            </p>

            {/* Message box */}
            <textarea
              className="w-full p-4 rounded-xl border border-slate-300 shadow-sm 
                         focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none
                         text-slate-800 resize-none"
              rows={4}
              placeholder="Tell us more (optional)..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            {/* Button */}
            <button
              type="submit"
              disabled={sending || rating === 0}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold
                         hover:bg-slate-800 transition shadow-lg shadow-slate-900/20
                         disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {sending ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Submitting...
                </span>
              ) : (
                "Submit Feedback"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
