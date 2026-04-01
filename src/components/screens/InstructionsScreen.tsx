import type { TestState } from '../../types';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface InstructionsScreenProps {
  state: TestState;
  onBegin: () => void;
  onBack: () => void;
}

export default function InstructionsScreen({ state, onBegin, onBack }: InstructionsScreenProps) {
  const instructions = [
    'Use a 30cm step (approx 12 inches). A standard stair step works.',
    'Step to the beat: Left up, Right up, Left down, Right down. One cycle per 4 beats.',
    'Each level is 2 minutes. At level end a panel slides up — enter your HR and select your RPE.',
    'Have a heart rate monitor ready — watch, chest strap, or manual pulse.',
    `Test stops at HR >= ${state.stopHR} bpm (85% max) after minimum 3 levels, or RPE >= 7.`,
    'Stop immediately if you feel chest pain, dizziness, or severe breathlessness.',
  ];

  return (
    <div className="flex flex-col px-5 py-8 min-h-screen">
      <Badge>Protocol</Badge>

      <h2 className="font-serif text-2xl text-[#EEF2FF] mt-4 mb-1">Chester Step Test</h2>
      <p className="font-mono text-xs text-[#5A7090] mb-6">5 Levels, 2 min each</p>

      {state.betaBlocker && (
        <div className="mb-5 p-4 rounded-xl bg-[#FF8C42]/10 border border-[#FF8C42]/25">
          <p className="font-mono text-xs text-[#FF8C42] leading-relaxed">
            Beta blocker adjustment active — Max HR calculated using Londeree formula: 164 - (0.7 x {state.age}) = {state.maxHR} bpm
          </p>
        </div>
      )}

      <div className="space-y-3 mb-8">
        {instructions.map((text, i) => (
          <div key={i} className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#152238] border border-[#1C2F4A] flex items-center justify-center font-mono text-xs text-[#5A7090]">
              {i + 1}
            </span>
            <p className="font-mono text-sm text-[#EEF2FF]/80 leading-relaxed pt-0.5">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto space-y-3">
        <Button onClick={onBegin}>Begin Test</Button>
        <Button variant="ghost" onClick={onBack}>Back</Button>
      </div>
    </div>
  );
}
