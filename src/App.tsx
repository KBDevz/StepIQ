import { useState, useCallback, useEffect } from 'react';
import { useTestState } from './hooks/useTestState';
import { useMetronome } from './hooks/useMetronome';
import { useAuth } from './hooks/useAuth';
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
import PreTestConditionsScreen from './components/screens/PreTestConditionsScreen';
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
    logLevel,
    advanceLevel,
    checkStopConditions,
    captureTestTime,
    resetTest,
  } = useTestState();

  const metronome = useMetronome();
  const auth = useAuth();
  const [stopReason, setStopReason] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [authModalEmail, setAuthModalEmail] = useState('');

  // Check URL for /set-password route and ?dev=true param on mount
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/set-password') {
      setScreen('setPassword');
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get('dev') === 'true' && !state.devMode) {
      toggleDevMode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTestEnd = useCallback(
    (reason: string) => {
      captureTestTime();
      setStopReason(reason);
      setScreen('results');
    },
    [setScreen, captureTestTime],
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
        {state.devMode && (
          <div
            className="font-mono"
            style={{
              fontSize: '0.6rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--warn)',
              background: 'rgba(245,165,36,0.15)',
              borderBottom: '1px solid rgba(245,165,36,0.3)',
              textAlign: 'center',
              padding: '6px',
            }}
          >
            DEV MODE — 10s levels
          </div>
        )}
        {screen === 'instructions' && (
          <InstructionsScreen
            state={state}
            onBegin={() => { metronome.resumeAudio(); setScreen('preTestConditions'); }}
            onBack={() => setScreen('setup')}
          />
        )}
        {screen === 'preTestConditions' && (
          <PreTestConditionsScreen
            betaBlocker={state.betaBlocker}
            onContinue={() => { metronome.resumeAudio(); setScreen('checklist'); }}
            onBack={() => setScreen('instructions')}
          />
        )}
        {screen === 'checklist' && (
          <ChecklistScreen
            onBegin={() => { metronome.resumeAudio(); setScreen('restingHR'); }}
            onBack={() => setScreen('preTestConditions')}
          />
        )}
        {screen === 'restingHR' && (
          <RestingHRScreen
            onConfirm={(hr) => {
              metronome.resumeAudio();
              setRestingHR(hr);
              setScreen('preLevel');
            }}
            onSkip={() => { metronome.resumeAudio(); setScreen('preLevel'); }}
          />
        )}
        {screen === 'preLevel' && (
          <PreLevelScreen
            level={state.currentLevel}
            countdownSeconds={state.devMode ? DEV_PRE_COUNTDOWN : PRE_COUNTDOWN}
            onComplete={() => { metronome.resumeAudio(); setScreen('activeLevel'); }}
            playCountBeep={metronome.playCountBeep}
          />
        )}
        {screen === 'activeLevel' && (
          <ActiveLevelScreen
            state={state}
            startMetronome={metronome.start}
            stopMetronome={metronome.stop}
            playBeep={metronome.playBeep}
            playCountBeep={metronome.playCountBeep}
            logLevel={logLevel}
            advanceLevel={advanceLevel}
            checkStopConditions={checkStopConditions}
            onTestEnd={handleTestEnd}
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
