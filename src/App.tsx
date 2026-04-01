import { useState, useCallback } from 'react';
import { useTestState } from './hooks/useTestState';
import { useMetronome } from './hooks/useMetronome';
import { PRE_COUNTDOWN, DEV_PRE_COUNTDOWN } from './utils/protocol';
import LandingPage from './components/screens/LandingPage';
import SetupScreen from './components/screens/SetupScreen';
import InstructionsScreen from './components/screens/InstructionsScreen';
import RestingHRScreen from './components/screens/RestingHRScreen';
import PreLevelScreen from './components/screens/PreLevelScreen';
import ActiveLevelScreen from './components/screens/ActiveLevelScreen';
import ResultsScreen from './components/screens/ResultsScreen';

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

  // Landing page renders full-width, outside any wrapper
  if (screen === 'landing') {
    return (
      <LandingPage
        onStart={() => setScreen('setup')}
        onHowItWorks={() => setScreen('howItWorks')}
      />
    );
  }

  // How It Works page — full-width marketing page (placeholder for now)
  if (screen === 'howItWorks') {
    return (
      <LandingPage
        onStart={() => setScreen('setup')}
        onHowItWorks={() => setScreen('howItWorks')}
      />
    );
  }

  // All test flow screens
  const screenContent = (
    <>
      {screen === 'setup' && (
        <SetupScreen
          state={state}
          updateSetup={updateSetup}
          toggleDevMode={toggleDevMode}
          onBegin={() => {
            metronome.resumeAudio();
            setScreen('instructions');
          }}
        />
      )}
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
      {screen === 'results' && (
        <ResultsScreen
          state={state}
          stopReason={stopReason}
          onNewTest={resetTest}
        />
      )}
    </>
  );

  // Determine if this is a screen that benefits from a narrow container
  const isNarrowScreen = screen === 'setup' || screen === 'instructions' || screen === 'restingHR';
  const isResultsScreen = screen === 'results';

  return (
    <div className="min-h-screen bg-[#060C18] text-[#EEF2FF] relative overflow-hidden">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(28,47,74,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(28,47,74,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(6,12,24,0) 30%, rgba(6,12,24,0.6) 60%, #060C18 100%)',
        }}
      />

      {/* Centered content — responsive max-widths, no phone frame */}
      <div
        className="relative z-10 mx-auto min-h-screen"
        style={{
          maxWidth: isResultsScreen ? '720px' : isNarrowScreen ? '480px' : '520px',
          padding: '0 20px',
        }}
      >
        {screenContent}
      </div>
    </div>
  );
}
