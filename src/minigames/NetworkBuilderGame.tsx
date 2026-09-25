import { useState } from 'react';
import { Shield, Globe, ArrowDown, CheckCircle2, RotateCcw, HelpCircle } from 'lucide-react';

interface NetworkSlot {
  id: string;
  name: string;
  expected: string;
  placed?: string;
  description: string;
}

interface ComponentItem {
  id: string;
  name: string;
  iconName: string;
  type: string;
  role: string;
}

interface NetworkBuilderGameProps {
  config?: {
    slots?: NetworkSlot[];
    availableComponents?: ComponentItem[];
  };
  onSolve?: (answer: any, isCorrect: boolean) => void;
  disabled?: boolean;
}

const DEFAULT_SLOTS: NetworkSlot[] = [
  { id: 'slot-1', name: 'Perimeter Defense', expected: 'comp-firewall', description: 'Inspects and filters incoming untrusted packets' },
  { id: 'slot-2', name: 'Network Gateway', expected: 'comp-router', description: 'Routes packets between external WAN and internal LAN' },
  { id: 'slot-3', name: 'Internal Distribution', expected: 'comp-switch', description: 'Distributes traffic to internal network nodes' },
  { id: 'slot-4', name: 'Protected Database', expected: 'comp-db', description: 'High-value encrypted storage isolated from direct web access' },
];

const DEFAULT_COMPONENTS: ComponentItem[] = [
  { id: 'comp-firewall', name: 'Next-Gen Firewall', iconName: 'Shield', type: 'Defense', role: 'Filters malicious traffic' },
  { id: 'comp-router', name: 'Core Router', iconName: 'Cpu', type: 'Gateway', role: 'WAN/LAN routing' },
  { id: 'comp-db', name: 'Encrypted Database', iconName: 'Server', type: 'Storage', role: 'Secure data store' },
  { id: 'comp-switch', name: 'Managed Switch', iconName: 'Cpu', type: 'Distribution', role: 'VLAN & internal links' },
  { id: 'comp-attacker', name: 'Rogue AP / Attacker', iconName: 'AlertOctagon', type: 'Threat', role: 'Unauthorized entity' },
];

export default function NetworkBuilderGame({ config, onSolve, disabled }: NetworkBuilderGameProps) {
  const initialSlots = config?.slots || DEFAULT_SLOTS;
  const components = config?.availableComponents || DEFAULT_COMPONENTS;

  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [evaluated, setEvaluated] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const handlePlace = (slotId: string) => {
    if (disabled || evaluated) return;
    if (selectedComponent) {
      const newPlaced = { ...placed, [slotId]: selectedComponent };
      setPlaced(newPlaced);
      setSelectedComponent(null);
      checkCompletion(newPlaced);
    } else if (placed[slotId]) {
      // Remove placed component
      const newPlaced = { ...placed };
      delete newPlaced[slotId];
      setPlaced(newPlaced);
    }
  };

  const checkCompletion = (currentPlaced: Record<string, string>) => {
    const allFilled = initialSlots.every(slot => !!currentPlaced[slot.id]);
    if (allFilled) {
      const correct = initialSlots.every(slot => currentPlaced[slot.id] === slot.expected);
      setIsCorrect(correct);
      setEvaluated(true);
      if (onSolve) {
        onSolve(currentPlaced, correct);
      }
    }
  };

  const handleReset = () => {
    if (disabled) return;
    setPlaced({});
    setSelectedComponent(null);
    setEvaluated(false);
    setIsCorrect(false);
  };

  const getComponent = (id: string) => components.find(c => c.id === id);

  return (
    <div className="bg-[#080C14] border border-cyber-primary/30 p-5 rounded-lg font-mono-cyber">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-cyber-border">
        <div>
          <span className="text-[10px] text-cyber-primary uppercase tracking-widest px-2 py-0.5 bg-cyber-primary/10 border border-cyber-primary/30 rounded">
            INTERACTIVE ARCHITECTURE PUZZLE
          </span>
          <h3 className="text-base font-bold text-white mt-1">BUILD THE SECURE DEFENSE TOPOLOGY</h3>
          <p className="text-xs text-cyber-muted mt-0.5">
            Click a component below, then click a designated slot to place it in proper defense-in-depth order.
          </p>
        </div>
        <button
          onClick={handleReset}
          disabled={disabled}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-cyber-muted hover:text-white bg-white/5 hover:bg-white/10 rounded transition-all border border-white/10"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Layout
        </button>
      </div>

      {/* Network Pipeline Topology */}
      <div className="flex flex-col items-center gap-2 my-4">
        {/* Internet Node (Static) */}
        <div className="w-full max-w-md p-3 bg-red-950/20 border border-red-500/40 rounded flex items-center justify-between text-xs text-red-400">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 animate-pulse" />
            <span className="font-bold">PUBLIC INTERNET (UNTRUSTED WAN)</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-red-500/10 rounded">Source Traffic</span>
        </div>

        <ArrowDown className="w-4 h-4 text-cyber-muted" />

        {/* Dynamic Topology Slots */}
        {initialSlots.map((slot, index) => {
          const placedCompId = placed[slot.id];
          const placedComp = placedCompId ? getComponent(placedCompId) : null;
          const isSlotCorrect = evaluated && placedCompId === slot.expected;
          const isSlotWrong = evaluated && placedCompId !== slot.expected;

          return (
            <div key={slot.id} className="w-full max-w-md flex flex-col items-center">
              <div
                onClick={() => handlePlace(slot.id)}
                className={`w-full p-3 rounded border transition-all cursor-pointer flex items-center justify-between ${
                  placedComp
                    ? isSlotCorrect
                      ? 'bg-cyber-success/15 border-cyber-success text-white shadow-[0_0_15px_rgba(0,255,136,0.15)]'
                      : isSlotWrong
                      ? 'bg-cyber-danger/15 border-cyber-danger text-white'
                      : 'bg-cyber-primary/10 border-cyber-primary text-white shadow-[0_0_15px_rgba(0,255,204,0.15)]'
                    : selectedComponent
                    ? 'border-dashed border-cyber-primary bg-cyber-primary/5 hover:bg-cyber-primary/15 text-cyber-muted animate-pulse'
                    : 'border-dashed border-cyber-border/70 bg-black/40 hover:border-cyber-primary/40 text-cyber-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded flex items-center justify-center bg-black/40 border border-white/10 text-xs font-bold text-cyber-primary">
                    {index + 1}
                  </div>
                  <div>
                    <span className="text-[10px] text-cyber-muted block uppercase">{slot.name}</span>
                    <span className="text-xs font-semibold">
                      {placedComp ? placedComp.name : `[ Click to assign ${slot.name.toLowerCase()} ]`}
                    </span>
                    <span className="text-[10px] text-cyber-muted block">{slot.description}</span>
                  </div>
                </div>

                {placedComp && (
                  <span className="text-[10px] px-2 py-0.5 rounded uppercase font-bold bg-white/10">
                    {placedComp.type}
                  </span>
                )}
              </div>

              {index < initialSlots.length - 1 && (
                <ArrowDown className="w-4 h-4 text-cyber-muted my-1" />
              )}
            </div>
          );
        })}
      </div>

      {/* Component Warehouse */}
      <div className="mt-5 pt-4 border-t border-cyber-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-cyber-secondary" />
            AVAILABLE COMPONENTS IN WAREHOUSE
          </span>
          {selectedComponent && (
            <span className="text-[11px] text-cyber-primary animate-pulse">
              Selected: {getComponent(selectedComponent)?.name} — Choose a slot above!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {components.map((comp) => {
            const isUsed = Object.values(placed).includes(comp.id);
            const isSelected = selectedComponent === comp.id;

            return (
              <button
                key={comp.id}
                onClick={() => {
                  if (disabled || evaluated) return;
                  setSelectedComponent(isSelected ? null : comp.id);
                }}
                disabled={isUsed || disabled || evaluated}
                className={`p-2.5 rounded border text-left transition-all flex items-start gap-2.5 ${
                  isSelected
                    ? 'border-cyber-primary bg-cyber-primary/20 ring-1 ring-cyber-primary'
                    : isUsed
                    ? 'opacity-40 border-white/5 bg-black/20 cursor-not-allowed'
                    : 'border-cyber-border bg-[#0D131F] hover:border-cyber-primary/50 hover:bg-[#121A2B]'
                }`}
              >
                <div className="p-1.5 rounded bg-black/40 border border-white/10 text-cyber-primary shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate">{comp.name}</span>
                    <span className="text-[9px] px-1 bg-white/10 rounded text-cyber-muted">{comp.type}</span>
                  </div>
                  <span className="text-[10px] text-cyber-muted block truncate mt-0.5">{comp.role}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Outcome Banner */}
      {evaluated && (
        <div className={`mt-4 p-3 rounded flex items-center justify-between text-xs ${
          isCorrect 
            ? 'bg-cyber-success/20 border border-cyber-success/40 text-cyber-success'
            : 'bg-cyber-danger/20 border border-cyber-danger/40 text-cyber-danger'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-bold">
              {isCorrect 
                ? 'TOPOLOGY VALIDATED: Defense-in-depth architecture correctly configured!' 
                : 'CONFIGURATION ERROR: Components do not match standard secure perimeter flow.'}
            </span>
          </div>
          <span className="font-bold tracking-widest text-[11px] uppercase">
            {isCorrect ? '+100% DEMONSTRATED' : '0% MATCH'}
          </span>
        </div>
      )}
    </div>
  );
}
