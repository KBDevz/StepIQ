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
import NavBar from './components/ui/NavBar';

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

  // How It Works page — full-width marketing page
  if (screen === 'howItWorks') {
    return (
      <HowItWorksPage
        onStart={() => setScreen('setup')}
        onHowItWorks={() => setScreen('howItWorks')}
        onLogoClick={() => setScreen('landing')}
      />
    );
  }

  // Setup screen renders full-width with its own two-column layout
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

  // Determine max-width for each screen type
  const getMaxWidth = () => {
    if (screen === 'results') return '720px';
    if (screen === 'instructions' || screen === 'restingHR') return '520px';
    return '520px';
  };

  // Should vertically center? (not for results which scrolls, not for active test)
  const shouldCenter = screen === 'instructions' || screen === 'restingHR';

  // All other test flow screens
  const screenContent = (
    <>
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

      {/* Nav bar for test flow screens */}
      <NavBar
        onStart={() => {}}
        onHowItWorks={() => setScreen('howItWorks')}
        onLogoClick={() => setScreen('landing')}
      />

      {/* Centered content */}
      <div
        className="relative z-10 mx-auto"
        style={{
          maxWidth: getMaxWidth(),
          padding: '0 28px',
          paddingTop: '72px',
          minHeight: '100vh',
          ...(shouldCenter ? {
            display: 'flex',
            flexDirection: 'column' as const,
            justifyContent: 'center',
          } : {}),
        }}
      >
        {screenContent}
      </div>
    </div>
  );
}
