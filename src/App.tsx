import { useState, useCallback } from 'react';
import { useTestState } from './hooks/useTestState';
import { useMetronome } from './hooks/useMetronome';
import { PRE_COUNTDOWN, DEV_PRE_COUNTDOWN } from './utils/protocol';
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

  return (
    <div className="min-h-screen bg-[#060C18] text-[#EEF2FF] relative overflow-hidden">
      {/* Background grid texture + vignette */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,229,160,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,160,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, #060C18 100%)',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-[460px] min-h-screen">
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
      </div>
    </div>
  );
}
