import { useState, useCallback } from 'react';
import { useTestState } from './hooks/useTestState';
import { useMetronome } from './hooks/useMetronome';
import { PRE_COUNTDOWN, DEV_PRE_COUNTDOWN } from './utils/protocol';
import LandingPage from './components/screens/LandingPage';
import HowItWorksPage from './components/screens/HowItWorksPage';
import SetupScreen from './components/screens/SetupScreen';
import InstructionsScreen from './components/screens/InstructionsScreen';
import RestingHRScreen from './components/screens/RestingHRScreen';
import PreLevelScreen from './components/screens/PreLevelScreen';
import ActiveLevelScreen from './components/screens/ActiveLevelScreen';
import ResultsScreen from './components/screens/ResultsScreen';
import PhoneFrame from './components/ui/PhoneFrame';

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
    resetTest,
  } = useTestState();

  const metronome = useMetronome();
  const [stopReason, setStopReason] = useState('');

  const handleTestEnd = useCallback(
    (reason: string) => {
      setStopReason(reason);
      setScreen('results');
    },
    [setScreen],
  );

  // ── MARKETING PAGES: full viewport width ──

  if (screen === 'landing') {
    return (
      <LandingPage
        onStart={() => setScreen('setup')}
        onHowItWorks={() => setScreen('howItWorks')}
      />
    );
  }

  if (screen === 'howItWorks') {
    return (
      <HowItWorksPage
        onStart={() => setScreen('setup')}
        onHowItWorks={() => setScreen('howItWorks')}
        onLogoClick={() => setScreen('landing')}
      />
    );
  }

  // ── SETUP: its own full-width two-column layout ──

  if (screen === 'setup') {
    return (
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
      />
    );
  }

  // ── RESULTS: full-width two-column layout ──

  if (screen === 'results') {
    return (
      <ResultsScreen
        state={state}
        stopReason={stopReason}
        onNewTest={resetTest}
      />
    );
  }

  // ── TEST FLOW SCREENS: inside PhoneFrame ──

  return (
    <PhoneFrame>
      {screen === 'instructions' && (
        <InstructionsScreen
          state={state}
          onBegin={() => setScreen('restingHR')}
          onBack={() => setScreen('setup')}
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
          logLevel={logLevel}
          advanceLevel={advanceLevel}
          checkStopConditions={checkStopConditions}
          onTestEnd={handleTestEnd}
        />
      )}
    </PhoneFrame>
  );
}
