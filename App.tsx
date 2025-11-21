import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabase';
import { User } from '@supabase/supabase-js';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { ToolGrid } from './components/ToolGrid';
import { Converter } from './components/Converter';
import { AboutSection } from './components/AboutSection';
import { ToolType } from './types';
import { logPageView } from './services/analytics';
import { AuthModal } from './components/AuthModal';
import { HistoryModal } from './components/HistoryModal';
import { ContactModal } from './components/ContactModal';
import { FeedbackModal } from './components/FeedbackModal';

const App: React.FC = () => {
  const [currentTool, setCurrentTool] = useState<ToolType | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Track page views based on current state
  useEffect(() => {
    if (currentTool) {
      // Track Tool View
      logPageView(`/tool/${currentTool.toLowerCase()}`, `Tool: ${currentTool.replace(/_/g, ' ')}`);
    } else {
      // Track Home View
      logPageView('/', 'GenPDF - Home');
    }
  }, [currentTool]);

  return (
    <Layout 
      onLogoClick={() => setCurrentTool(null)}
      user={user}
      onLoginClick={() => setIsAuthModalOpen(true)}
      onHistoryClick={() => setIsHistoryModalOpen(true)}
      onLogoutClick={() => supabase.auth.signOut()}
      onContactClick={() => setIsContactModalOpen(true)}
      onFeedbackClick={() => setIsFeedbackModalOpen(true)}
    >
      {!currentTool ? (
        <>
          <Hero />
          <ToolGrid onSelectTool={setCurrentTool} />
          <AboutSection />
        </>
      ) : (
        <Converter 
          toolType={currentTool} 
          onBack={() => setCurrentTool(null)} 
          user={user}
        />
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        user={user}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </Layout>
  );
};

export default App;