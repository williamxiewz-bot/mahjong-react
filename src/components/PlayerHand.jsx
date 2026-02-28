import { memo, useMemo, useCallback } from 'react';
import Tile from './Tile';
import './PlayerHand.css';

const PlayerHand = memo(function PlayerHand({ hand, selectedTile, onTileClick, lastDrawn, pengs, gangs, chis }) {
  const sortedHand = useMemo(() => {
    return [...hand].sort((a, b) => {
      if (a.suit !== b.suit) return a.suit - b.suit;
      return a.num - b.num;
    });
  }, [hand]);

  const handleTileClick = useCallback((tile) => {
    onTileClick(tile);
  }, [onTileClick]);

  const renderHand = useMemo(() => {
    return sortedHand.map((tile) => (
      <Tile
        key={tile.id}
        tile={tile}
        selected={selectedTile?.id === tile.id}
        onClick={handleTileClick}
        size={lastDrawn?.id === tile.id ? 'large' : ''}
      />
    ));
  }, [sortedHand, selectedTile, handleTileClick, lastDrawn]);

  const renderMelds = useMemo(() => {
    const melds = [];
    pengs?.forEach((p, i) => melds.push({ type: 'peng', tiles: p, key: `peng-${i}` }));
    gangs?.forEach((g, i) => melds.push({ type: 'gang', tiles: g, key: `gang-${i}` }));
    chis?.forEach((c, i) => melds.push({ type: 'chi', tiles: c, key: `chi-${i}` }));
    
    return melds.map((meld) => {
      if (meld.type === 'peng') {
        return (
          <div key={meld.key} className="meld peng">
            <Tile tile={meld.tiles[0]} size="small" />
            <Tile tile={meld.tiles[1]} size="small" />
            <Tile tile={meld.tiles[2]} size="small" />
          </div>
        );
      }
      if (meld.type === 'gang') {
        return (
          <div key={meld.key} className="meld gang">
            <Tile tile={meld.tiles[0]} size="small" />
            <Tile tile={meld.tiles[1]} size="small" />
            <Tile tile={meld.tiles[2]} size="small" />
            <Tile tile={meld.tiles[3]} size="small" />
          </div>
        );
      }
      if (meld.type === 'chi') {
        return (
          <div key={meld.key} className="meld chi">
            <Tile tile={meld.tiles[0]} size="small" />
            <Tile tile={meld.tiles[1]} size="small" />
            <Tile tile={meld.tiles[2]} size="small" />
          </div>
        );
      }
      return null;
    });
  }, [pengs, gangs, chis]);

  return (
    <div className="player-hand">
      <div className="melds">
        {renderMelds}
      </div>
      <div className="hand-tiles">
        {renderHand}
      </div>
    </div>
  );
});

export default PlayerHand;
