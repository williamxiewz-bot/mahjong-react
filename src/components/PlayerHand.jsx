import Tile from './Tile';
import './PlayerHand.css';

function PlayerHand({ hand, selectedTile, onTileClick, lastDrawn, pengs, gangs, chis }) {
  const renderHand = () => {
    const tiles = [...hand].sort((a, b) => {
      if (a.suit !== b.suit) return a.suit - b.suit;
      return a.num - b.num;
    });

    return tiles.map((tile, index) => (
      <Tile
        key={tile.id}
        tile={tile}
        selected={selectedTile?.id === tile.id}
        onClick={() => onTileClick(tile)}
        size={lastDrawn?.id === tile.id ? 'large' : ''}
      />
    ));
  };

  const renderMeld = (meld, index) => {
    if (meld.type === 'peng') {
      return (
        <div key={`peng-${index}`} className="meld peng">
          <Tile tile={meld.tiles[0]} size="small" />
          <Tile tile={meld.tiles[1]} size="small" />
          <Tile tile={meld.tiles[2]} size="small" />
        </div>
      );
    }
    if (meld.type === 'gang') {
      return (
        <div key={`gang-${index}`} className="meld gang">
          <Tile tile={meld.tiles[0]} size="small" />
          <Tile tile={meld.tiles[1]} size="small" />
          <Tile tile={meld.tiles[2]} size="small" />
          <Tile tile={meld.tiles[3]} size="small" />
        </div>
      );
    }
    if (meld.type === 'chi') {
      return (
        <div key={`chi-${index}`} className="meld chi">
          <Tile tile={meld.tiles[0]} size="small" />
          <Tile tile={meld.tiles[1]} size="small" />
          <Tile tile={meld.tiles[2]} size="small" />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="player-hand">
      <div className="melds">
        {pengs?.map((p, i) => renderMeld({ type: 'peng', tiles: p }, `peng-${i}`))}
        {gangs?.map((g, i) => renderMeld({ type: 'gang', tiles: g }, `gang-${i}`))}
        {chis?.map((c, i) => renderMeld({ type: 'chi', tiles: c }, `chi-${i}`))}
      </div>
      <div className="hand-tiles">
        {renderHand()}
      </div>
    </div>
  );
}

export default PlayerHand;
