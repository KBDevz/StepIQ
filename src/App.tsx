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

function DesktopSidebar() {
  return (
    <div className="hidden lg:flex flex-col justify-between w-[380px] flex-shrink-0 px-12 py-12">
      {/* Top */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-[52px] h-[52px] rounded-xl bg-[#00E5A0]/10 border border-[#00E5A0]/20 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h4l3-9 4 18 3-9h4" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-serif text-2xl text-[#EEF2FF]">StepIQ</span>
        </div>

        <p className="font-mono text-xs text-[#5A7090] leading-relaxed mb-10">
          Chester Step Test · VO2 Max Estimator
        </p>

        <div className="space-y-5">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#152238] border border-[#1C2F4A] flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div>
              <p className="font-mono text-xs text-[#EEF2FF]">Clinically Validated</p>
              <p className="font-mono text-[10px] text-[#5A7090] mt-0.5">Chester Step Test by K. Sykes</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#152238] border border-[#1C2F4A] flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div>
              <p className="font-mono text-xs text-[#EEF2FF]">Linear Regression</p>
              <p className="font-mono text-[10px] text-[#5A7090] mt-0.5">Submaximal VO2 max estimation</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#152238] border border-[#1C2F4A] flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
              </svg>
            </div>
            <div>
              <p className="font-mono text-xs text-[#EEF2FF]">AI-Powered Report</p>
              <p className="font-mono text-[10px] text-[#5A7090] mt-0.5">8-week improvement protocol</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <p className="font-mono text-[10px] text-[#5A7090]/40 leading-relaxed">
        Clinically validated by K. Sykes · v1.0
      </p>
    </div>
  );
}

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

  // Landing page renders full-width, outside the phone frame
  if (screen === 'landing') {
    return (
      <LandingPage onStart={() => setScreen('setup')} />
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

  return (
    <div className="min-h-screen bg-[#060C18] text-[#EEF2FF] relative overflow-hidden">
      {/* Background grid */}
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
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, #060C18 100%)' }}
      />

      {/* MOBILE (< 1024px): full-screen app */}
      <div className="lg:hidden relative z-10 mx-auto max-w-[460px] min-h-screen">
        {screenContent}
      </div>

      {/* DESKTOP (>= 1024px): sidebar + phone frame */}
      <div className="hidden lg:flex relative z-10 h-screen">
        <DesktopSidebar />

        {/* Phone frame container */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div
            className="relative w-[390px] bg-[#060C18] rounded-[44px] border border-[#1C2F4A] overflow-hidden flex-shrink-0"
            style={{
              height: 'min(844px, 90vh)',
              boxShadow: '0 60px 120px rgba(0,0,0,0.7)',
            }}
          >
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-[#060C18] rounded-b-2xl border-b border-l border-r border-[#1C2F4A] z-20" />

            {/* Screen content */}
            <div className="h-full overflow-y-auto overflow-x-hidden pt-2">
              {screenContent}
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[100px] h-[4px] rounded-full bg-[#1C2F4A] z-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
