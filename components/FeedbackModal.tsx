import React, { useState } from 'react';
import { X, Star, Send, Loader2, CheckCircle, AlertCircle, Heart } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  // Obfuscated email to prevent scraping
  const RECIP_HASH = 'YmFybmFyZC5uaWNvbGFAZ21haWwuY29t';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert("Please select a star rating.");
      return;
    }

    setIsLoading(true);
    setStatus('idle');

    try {
      const recipient = atob(RECIP_HASH);
      
      const response = await fetch(`https://formsubmit.co/ajax/${recipient}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          type: 'FEEDBACK_RATING',
          rating: `${rating} / 5 Stars`,
          email: email || 'Anonymous',
          message: feedback,
          _subject: `GenPDF Rating: ${rating} Stars`
        })
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          onClose();
          setStatus('idle');
          setRating(0);
          setFeedback('');
          setEmail('');
        }, 2500);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Submission error", error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center space-x-2">
             <div className="bg-amber-100 p-2 rounded-lg">
                <Heart className="w-5 h-5 text-amber-600 fill-amber-600" />
             </div>
             <h3 className="text-lg font-bold text-slate-900">Rate Your Experience</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {status === 'success' ? (
            <div className="text-center py-8 animate-in fade-in zoom-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Thank You!</h3>
              <p className="text-slate-500">We appreciate your feedback. It helps us improve.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === 'error' && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                  Something went wrong. Please try again later.
                </div>
              )}

              {/* Star Rating */}
              <div className="flex flex-col items-center justify-center space-y-2">
                <label className="text-sm font-medium text-slate-700">How would you rate GenPDF?</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star 
                        className={`w-10 h-10 transition-colors ${
                          star <= (hoverRating || rating) 
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-slate-200 fill-slate-50'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
                <div className="h-5 text-sm font-semibold text-rose-600">
                  {hoverRating === 1 && "Needs Improvement"}
                  {hoverRating === 2 && "It's Okay"}
                  {hoverRating === 3 && "Good"}
                  {hoverRating === 4 && "Great!"}
                  {hoverRating === 5 && "Excellent!"}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                    placeholder="To receive a reply..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Feedback or Suggestions</label>
                  <textarea
                    required
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all resize-none"
                    placeholder="What features should we add next?"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || rating === 0}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-all hover:scale-[1.01] shadow-lg shadow-slate-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Feedback
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};