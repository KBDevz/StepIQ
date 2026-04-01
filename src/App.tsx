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

function DesktopSidebar() {
  return (
    <div className="hidden md:flex flex-col items-center justify-center flex-1 px-10 relative">
      {/* Logo */}
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-2xl bg-[#00E5A0]/10 border border-[#00E5A0]/20 flex items-center justify-center mb-6">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h4l3-9 4 18 3-9h4" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="font-serif text-5xl text-[#EEF2FF] tracking-tight mb-2">StepIQ</h1>
        <p className="font-mono text-xs text-[#5A7090] tracking-wider text-center">
          Chester Step Test · VO2 Max Estimator
        </p>

        {/* Divider */}
        <div className="w-9 h-[1px] bg-[#00E5A0]/30 my-8" />

        {/* Feature callouts */}
        <div className="space-y-5 max-w-[280px]">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#152238] border border-[#1C2F4A] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div>
              <p className="font-mono text-xs text-[#EEF2FF] font-medium">Clinically Validated</p>
              <p className="font-mono text-[11px] text-[#5A7090] mt-0.5 leading-relaxed">Chester Step Test protocol by K. Sykes</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#152238] border border-[#1C2F4A] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div>
              <p className="font-mono text-xs text-[#EEF2FF] font-medium">Linear Regression Scoring</p>
              <p className="font-mono text-[11px] text-[#5A7090] mt-0.5 leading-relaxed">Most accurate submaximal VO2 estimate</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#152238] border border-[#1C2F4A] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
              </svg>
            </div>
            <div>
              <p className="font-mono text-xs text-[#EEF2FF] font-medium">AI-Powered Report</p>
              <p className="font-mono text-[11px] text-[#5A7090] mt-0.5 leading-relaxed">Personalized 8-week improvement protocol</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <p className="absolute bottom-8 font-mono text-[10px] text-[#5A7090]/50 text-center px-8 leading-relaxed">
        Designed for cardiac rehabilitation and occupational health
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

      {/* MOBILE: full-screen app */}
      <div className="md:hidden relative z-10 mx-auto max-w-[460px] min-h-screen">
        {screenContent}
      </div>

      {/* DESKTOP: sidebar + phone frame */}
      <div className="hidden md:flex relative z-10 h-screen">
        {/* Left sidebar */}
        <DesktopSidebar />

        {/* Right panel — phone frame */}
        <div className="flex items-center justify-center px-10 flex-shrink-0">
          <div
            className="relative w-[390px] bg-[#060C18] rounded-[40px] border-2 border-[#1C2F4A] overflow-hidden shadow-2xl"
            style={{ height: 'min(844px, 90vh)' }}
          >
            {/* Phone notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-[#060C18] rounded-b-2xl border-b-2 border-l-2 border-r-2 border-[#1C2F4A] z-20" />

            {/* Phone screen content */}
            <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-thin">
              {screenContent}
            </div>

            {/* Bottom home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[100px] h-[4px] rounded-full bg-[#1C2F4A] z-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
