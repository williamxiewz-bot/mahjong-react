import { memo } from 'react';
import './Opponents.css';

interface OpponentInfo {
  name: string;
  handCount: number;
  position: 'left' | 'opposite' | 'right';
}

interface OpponentsProps {
  opponents: Record<string, OpponentInfo>;
}

const Opponents = memo(function Opponents({ opponents }: OpponentsProps) {
  return (
    <div className="opponents">
      {/* 上家 - AI 3 */}
      <div className="opponent top-left">
        <span className="opponent-name">{opponents.left?.name}</span>
        <div className="opponent-hand horizontal">
          {Array.from({ length: opponents.left?.handCount || 13 }).map((_, i) => (
            <div key={i} className="opponent-tile back" />
          ))}
        </div>
      </div>
      
      {/* 对家 - AI 2 */}
      <div className="opponent top">
        <span className="opponent-name">{opponents.opposite?.name}</span>
        <div className="opponent-hand horizontal">
          {Array.from({ length: opponents.opposite?.handCount || 13 }).map((_, i) => (
            <div key={i} className="opponent-tile back" />
          ))}
        </div>
      </div>
      
      {/* 下家 - AI 1 */}
      <div className="opponent top-right">
        <span className="opponent-name">{opponents.right?.name}</span>
        <div className="opponent-hand horizontal">
          {Array.from({ length: opponents.right?.handCount || 13 }).map((_, i) => (
            <div key={i} className="opponent-tile back" />
          ))}
        </div>
      </div>
    </div>
  );
});

export default Opponents;
