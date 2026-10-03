import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppReview, RatingSummary } from '../types';
import { getStoredSupabaseConfig, getSupabaseClient } from '../lib/supabase';

// Real community reviews (initialized empty to adhere strictly to truthfulness)
const INITIAL_REVIEWS: AppReview[] = [];

const LOCAL_STORAGE_KEY = 'qabas_verified_reviews_v2';

interface RatingContextType {
  reviews: AppReview[];
  summary: RatingSummary;
  isRatingModalOpen: boolean;
  openRatingModal: () => void;
  closeRatingModal: () => void;
  submitReview: (review: Omit<AppReview, 'id' | 'createdAt' | 'helpfulCount' | 'verifiedUser'>) => Promise<void>;
  voteHelpful: (reviewId: string) => void;
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);

export const RatingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<AppReview[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_REVIEWS;
  });

  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.warn('Could not save reviews to localStorage:', e);
    }
  }, [reviews]);

  // Compute live mathematical summary
  const summary: RatingSummary = React.useMemo(() => {
    const totalCount = reviews.length;
    if (totalCount === 0) {
      return {
        averageRating: 0,
        totalCount: 0,
        starsCount: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const starsCount = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;

    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      starsCount[star] = (starsCount[star] || 0) + 1;
      sum += r.rating;
    });

    const averageRating = parseFloat((sum / totalCount).toFixed(1));

    return {
      averageRating,
      totalCount,
      starsCount
    };
  }, [reviews]);

  const submitReview = async (reviewData: Omit<AppReview, 'id' | 'createdAt' | 'helpfulCount' | 'verifiedUser'>) => {
    const newReview: AppReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
      verifiedUser: true
    };

    setReviews((prev) => [newReview, ...prev]);

    // Optional Supabase insertion
    const config = getStoredSupabaseConfig();
    if (config.isConfigured) {
      try {
        const supabase = getSupabaseClient();
        await supabase.from('app_reviews').insert({
          id: newReview.id,
          author_name: newReview.authorName,
          rating: newReview.rating,
          category_rating: newReview.categoryRating,
          app_version: newReview.appVersion,
          device_model: newReview.deviceModel,
          comment: newReview.comment,
          created_at: newReview.createdAt,
          verified_user: true
        });
      } catch (err) {
        console.warn('Supabase review insert error:', err);
      }
    }
  };

  const voteHelpful = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
  };

  return (
    <RatingContext.Provider
      value={{
        reviews,
        summary,
        isRatingModalOpen,
        openRatingModal: () => setIsRatingModalOpen(true),
        closeRatingModal: () => setIsRatingModalOpen(false),
        submitReview,
        voteHelpful
      }}
    >
      {children}
    </RatingContext.Provider>
  );
};

export const useRating = () => {
  const context = useContext(RatingContext);
  if (!context) {
    throw new Error('useRating must be used within a RatingProvider');
  }
  return context;
};
