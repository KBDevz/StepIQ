import { useState, useCallback, useEffect } from 'react';
import { useTestState } from './hooks/useTestState';
import { useMetronome } from './hooks/useMetronome';
import { useAuth } from './hooks/useAuth';
import { useJunction } from './hooks/useJunction';
import { PRE_COUNTDOWN, DEV_PRE_COUNTDOWN } from './utils/protocol';
import LandingPage from './components/screens/LandingPage';
import HowItWorksPage from './components/screens/HowItWorksPage';
import SetupScreen from './components/screens/SetupScreen';
import InstructionsScreen from './components/screens/InstructionsScreen';
import RestingHRScreen from './components/screens/RestingHRScreen';
import PreLevelScreen from './components/screens/PreLevelScreen';
import ActiveLevelScreen from './components/screens/ActiveLevelScreen';
import ResultsScreen from './components/screens/ResultsScreen';
import SetPasswordPage from './components/screens/SetPasswordPage';
import ChecklistScreen from './components/screens/ChecklistScreen';
import PhoneFrame from './components/ui/PhoneFrame';
import AuthModal from './components/ui/AuthModal';

export default function App() {
  const {
    state,
    screen,
    setScreen,
    updateSetup,
    setRestingHR,
    toggleDevMode,
    setWearableConnected,
    logLevel,
    advanceLevel,
    checkStopConditions,
    resetTest,
  } = useTestState();

  const metronome = useMetronome();
  const auth = useAuth();
  const junction = useJunction(auth.user?.id ?? null);

  useEffect(() => {
    setWearableConnected(junction.connected);
  }, [junction.connected, setWearableConnected]);
  const [stopReason, setStopReason] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [authModalEmail, setAuthModalEmail] = useState('');

  // Check URL for /set-password route on mount
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/set-password') {
      setScreen('setPassword');
    }
  }, [setScreen]);

  const handleTestEnd = useCallback(
    (reason: string) => {
      setStopReason(reason);
      setScreen('results');
    },
    [setScreen],
  );

  const openSignIn = useCallback((prefillEmail?: string) => {
    setAuthModalMode('signin');
    if (prefillEmail) setAuthModalEmail(prefillEmail);
    setShowAuthModal(true);
  }, []);

  const openSignUp = useCallback(() => {
    setAuthModalMode('signup');
    setShowAuthModal(true);
  }, []);

  // Shared auth props for all NavBars
  const authNavProps = {
    userName: auth.profile?.first_name || null,
    onSignIn: () => openSignIn(),
    onSignOut: auth.signOut,
  };

  // ── SET PASSWORD PAGE ──
  if (screen === 'setPassword') {
    return (
      <SetPasswordPage
        onUpdatePassword={auth.updatePassword}
        onComplete={() => {
          window.history.replaceState({}, '', '/');
          setScreen('landing');
        }}
      />
    );
  }

  // ── MARKETING PAGES: full viewport width ──

  if (screen === 'landing') {
    return (
      <>
        <LandingPage
          onStart={() => setScreen('setup')}
          onHowItWorks={() => setScreen('howItWorks')}
          authNavProps={authNavProps}
        />
        {showAuthModal && (
          <AuthModal
            initialMode={authModalMode}
            initialEmail={authModalEmail}
            onClose={() => { setShowAuthModal(false); setAuthModalEmail(''); }}
            onSignUp={auth.signUp}
            onSignIn={auth.signIn}
            onResetPassword={auth.resetPassword}
          />
        )}
      </>
    );
  }

  if (screen === 'howItWorks') {
    return (
      <>
        <HowItWorksPage
          onStart={() => setScreen('setup')}
          onHowItWorks={() => setScreen('howItWorks')}
          onLogoClick={() => setScreen('landing')}
          authNavProps={authNavProps}
        />
        {showAuthModal && (
          <AuthModal
            initialMode={authModalMode}
            initialEmail={authModalEmail}
            onClose={() => { setShowAuthModal(false); setAuthModalEmail(''); }}
            onSignUp={auth.signUp}
            onSignIn={auth.signIn}
            onResetPassword={auth.resetPassword}
          />
        )}
      </>
    );
  }

  // ── SETUP: its own full-width two-column layout ──

  if (screen === 'setup') {
    return (
      <>
        <SetupScreen
          state={state}
          updateSetup={updateSetup}
          toggleDevMode={toggleDevMode}
          onBegin={() => {
            metronome.resumeAudio();
            setScreen('instructions');
          }}
          onLogoClick={() => setScreen('landing')}
          onHowItWorks={() => setScreen('howItWorks')}
          authNavProps={authNavProps}
          junctionProps={{
            connected: junction.connected,
            provider: junction.provider,
            loading: junction.loading,
            error: junction.error,
            onConnect: junction.connect,
            onDisconnect: junction.disconnect,
          }}
          isLoggedIn={!!auth.user}
        />
        {showAuthModal && (
          <AuthModal
            initialMode={authModalMode}
            initialEmail={authModalEmail}
            onClose={() => { setShowAuthModal(false); setAuthModalEmail(''); }}
            onSignUp={auth.signUp}
            onSignIn={auth.signIn}
            onResetPassword={auth.resetPassword}
          />
        )}
      </>
    );
  }

  // ── RESULTS: full-width two-column layout ──

  if (screen === 'results') {
    return (
      <>
        <ResultsScreen
          state={state}
          stopReason={stopReason}
          onNewTest={resetTest}
          onHowItWorks={() => setScreen('howItWorks')}
          authNavProps={authNavProps}
          isLoggedIn={!!auth.user}
          userId={auth.user?.id || null}
          userProfile={auth.profile}
          onOpenSignIn={openSignIn}
          onOpenSignUp={openSignUp}
          signUpFromLead={auth.signUpFromLead}
        />
        {showAuthModal && (
          <AuthModal
            initialMode={authModalMode}
            initialEmail={authModalEmail}
            onClose={() => { setShowAuthModal(false); setAuthModalEmail(''); }}
            onSignUp={auth.signUp}
            onSignIn={auth.signIn}
            onResetPassword={auth.resetPassword}
          />
        )}
      </>
    );
  }

  // ── TEST FLOW SCREENS: inside PhoneFrame ──

  return (
    <>
      <PhoneFrame>
        {screen === 'instructions' && (
          <InstructionsScreen
            state={state}
            onBegin={() => setScreen('checklist')}
            onBack={() => setScreen('setup')}
          />
        )}
        {screen === 'checklist' && (
          <ChecklistScreen
            onBegin={() => setScreen('restingHR')}
            onBack={() => setScreen('instructions')}
          />
        )}
        {screen === 'restingHR' && (
          <RestingHRScreen
            onConfirm={(hr) => {
              setRestingHR(hr);
              setScreen('preLevel');
            }}
            onSkip={() => setScreen('preLevel')}
          />
        )}
        {screen === 'preLevel' && (
          <PreLevelScreen
            level={state.currentLevel}
            countdownSeconds={state.devMode ? DEV_PRE_COUNTDOWN : PRE_COUNTDOWN}
            onComplete={() => setScreen('activeLevel')}
            playCountBeep={metronome.playCountBeep}
          />
        )}
        {screen === 'activeLevel' && (
          <ActiveLevelScreen
            state={state}
            playBeep={metronome.playBeep}
            playCountBeep={metronome.playCountBeep}
            logLevel={logLevel}
            advanceLevel={advanceLevel}
            checkStopConditions={checkStopConditions}
            onTestEnd={handleTestEnd}
            fetchWearableHR={junction.connected ? junction.fetchHR : undefined}
          />
        )}
      </PhoneFrame>
      {showAuthModal && (
        <AuthModal
          initialMode={authModalMode}
          initialEmail={authModalEmail}
          onClose={() => { setShowAuthModal(false); setAuthModalEmail(''); }}
          onSignUp={auth.signUp}
          onSignIn={auth.signIn}
          onResetPassword={auth.resetPassword}
        />
      )}
    </>
  );
}
