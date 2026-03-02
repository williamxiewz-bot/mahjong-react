import { memo } from 'react';
import './Opponents.css';

interface OpponentInfo {
  name: string;
  handCount: number;
}

interface OpponentsProps {
  opponents: Record<string, OpponentInfo>;
}

const Opponents = memo(function Opponents({ opponents }: OpponentsProps) {
  return (
    <div className="opponents">
      {/* 上家 */}
      <div className="opponent top">
        <span className="opponent-name">{opponents.top?.name}</span>
        <div className="opponent-hand">
          {Array.from({ length: opponents.top?.handCount || 13 }).map((_, i) => (
            <div key={i} className="opponent-tile back" />
          ))}
        </div>
      </div>
      
      {/* 左侧对手 */}
      <div className="opponent left">
        <span className="opponent-name">{opponents.left?.name}</span>
        <div className="opponent-hand vertical">
          {Array.from({ length: opponents.left?.handCount || 13 }).map((_, i) => (
            <div key={i} className="opponent-tile back" />
          ))}
        </div>
      </div>
      
      {/* 右侧对手 */}
      <div className="opponent right">
        <span className="opponent-name">{opponents.right?.name}</span>
        <div className="opponent-hand vertical">
          {Array.from({ length: opponents.right?.handCount || 13 }).map((_, i) => (
            <div key={i} className="opponent-tile back" />
          ))}
        </div>
      </div>
    </div>
  );
});

export default Opponents;
