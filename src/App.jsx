import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  createTiles, 
  shuffleTiles, 
  sortHand, 
  canPeng, 
  canGang, 
  canChi, 
  checkHu,
  findChiOptions 
} from './mahjongGame';
import PlayerHand from './components/PlayerHand';
import Opponents from './components/Opponents';
import TableArea from './components/TableArea';
import ActionButtons from './components/ActionButtons';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [tiles, setTiles] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [discardedTiles, setDiscardedTiles] = useState([]);
  const [selectedTile, setSelectedTile] = useState(null);
  const [lastDrawn, setLastDrawn] = useState(null);
  const [lastDiscarded, setLastDiscarded] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [pengs, setPengs] = useState([]);
  const [gangs, setGangs] = useState([]);
  const [chis, setChis] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [message, setMessage] = useState('');

  const startGame = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const allTiles = shuffleTiles(createTiles());
      setTiles(allTiles);
      
      const playerTiles = sortHand(allTiles.slice(0, 13));
      setPlayerHand(playerTiles);
      setLastDrawn(allTiles[13]);
      
      setDiscardedTiles([]);
      setSelectedTile(null);
      setLastDiscarded(null);
      setCurrentPlayer(0);
      setHasDrawn(false);
      setPengs([]);
      setGangs([]);
      setChis([]);
      setGameStarted(true);
      setMessage('游戏开始！请摸牌');
      setIsLoading(false);
    }, 300);
  }, []);

  const drawTile = useCallback(() => {
    if (currentPlayer !== 0 || hasDrawn) return;
    
    const newTiles = [...tiles];
    const drawnTile = newTiles.shift();
    setTiles(newTiles);
    
    setPlayerHand(prev => sortHand([...prev, drawnTile]));
    setLastDrawn(drawnTile);
    setHasDrawn(true);
    
    const newHand = [...playerHand, drawnTile];
    if (checkHu(newHand)) {
      setMessage('可以胡牌！');
    } else {
      setMessage('请选择要打出的牌');
    }
  }, [currentPlayer, hasDrawn, tiles, playerHand]);

  const discardTile = useCallback((tile) => {
    if (currentPlayer !== 0 || !hasDrawn) return;
    
    const newHand = playerHand.filter(t => t.id !== tile.id);
    setPlayerHand(newHand);
    setDiscardedTiles(prev => [...prev, tile]);
    setLastDiscarded(tile);
    setSelectedTile(null);
    setLastDrawn(null);
    setHasDrawn(false);
    setCurrentPlayer(1);
    setMessage('下家摸牌中...');
    
    setTimeout(() => {
      aiPlay();
    }, 1000);
  }, [currentPlayer, hasDrawn, playerHand]);

  const handleTileClick = useCallback((tile) => {
    if (currentPlayer === 0 && hasDrawn) {
      setSelectedTile(tile);
    }
  }, [currentPlayer, hasDrawn]);

  const handleDiscard = useCallback(() => {
    if (selectedTile) {
      discardTile(selectedTile);
    }
  }, [selectedTile, discardTile]);

  const handleHu = useCallback(() => {
    if (checkHu(playerHand)) {
      setMessage('🎉 胡牌了！恭喜！');
      setGameStarted(false);
    }
  }, [playerHand]);

  const handlePeng = useCallback(() => {
    if (!lastDiscarded || !canPeng(playerHand, lastDiscarded)) return;
    
    const pengTiles = [
      lastDiscarded,
      playerHand.find(t => t.suit === lastDiscarded.suit && t.num === lastDiscarded.num),
      playerHand.find(t => t.suit === lastDiscarded.suit && t.num === lastDiscarded.num)
    ];
    
    const newHand = playerHand.filter(t => t.id !== pengTiles[1].id && t.id !== pengTiles[2].id);
    setPlayerHand(newHand);
    setPengs(prev => [...prev, pengTiles]);
    setDiscardedTiles(prev => prev.filter(t => t.id !== lastDiscarded.id));
    setLastDiscarded(null);
    setHasDrawn(true);
    setMessage('碰了！请打出一张牌');
  }, [lastDiscarded, playerHand]);

  const handleGang = useCallback(() => {
    if (!lastDrawn || !canGang(playerHand, lastDrawn)) return;
    
    const gangTiles = playerHand.filter(t => t.suit === lastDrawn.suit && t.num === lastDrawn.num);
    
    setPlayerHand(prev => prev.filter(t => t.id !== gangTiles[0].id && t.id !== gangTiles[1].id && t.id !== gangTiles[2].id));
    setGangs(prev => [...prev, [...gangTiles, lastDrawn]]);
    setLastDrawn(null);
    setHasDrawn(false);
    setMessage('杠了！继续摸牌');
    drawTile();
  }, [lastDrawn, playerHand, drawTile]);

  const handleChi = useCallback(() => {
    if (!lastDiscarded || !canChi(playerHand, lastDiscarded)) return;
    
    const options = findChiOptions(playerHand, lastDiscarded);
    if (options.length > 0) {
      setMessage('吃牌选项: ' + options.length + ' 种');
    }
  }, [lastDiscarded, playerHand]);

  const handlePass = useCallback(() => {
    setSelectedTile(null);
    setCurrentPlayer(1);
    setMessage('下家摸牌中...');
    
    setTimeout(() => {
      aiPlay();
    }, 1000);
  }, []);

  const aiPlay = useCallback(() => {
    const newTiles = [...tiles];
    if (newTiles.length === 0) {
      setMessage('流局！');
      setGameStarted(false);
      return;
    }
    
    const aiDrawn = newTiles.shift();
    setTiles(newTiles);
    
    const randomIndex = Math.floor(Math.random() * 13);
    const aiHand = [];
    for (let i = 0; i < 13; i++) {
      aiHand.push({ suit: (i % 3) + 1, num: (i % 9) + 1, id: `ai-${i}` });
    }
    const aiDiscard = aiHand[randomIndex];
    
    setDiscardedTiles(prev => [...prev, aiDiscard]);
    setLastDiscarded(aiDiscard);
    setCurrentPlayer(0);
    setMessage('轮到你行动了');
  }, [tiles]);

  useEffect(() => {
    if (selectedTile && hasDrawn && currentPlayer === 0) {
      handleDiscard();
    }
  }, [selectedTile, hasDrawn, currentPlayer, handleDiscard]);

  const opponents = useMemo(() => ({
    top: { name: '上家', handCount: 13 },
    left: { name: '对家', handCount: 13 },
    right: { name: '下家', handCount: 13 }
  }), []);

  const canHu = useMemo(() => checkHu(playerHand), [playerHand]);
  const canPengResult = useMemo(() => lastDiscarded && canPeng(playerHand, lastDiscarded), [lastDiscarded, playerHand]);
  const canGangResult = useMemo(() => lastDrawn && canGang(playerHand, lastDrawn), [lastDrawn, playerHand]);
  const canChiResult = useMemo(() => lastDiscarded && canChi(playerHand, lastDiscarded), [lastDiscarded, playerHand]);

  return (
    <div className="mahjong-game">
      <div className="game-header">
        <h1>🀄 麻将游戏 🀄</h1>
        {message && <div className="message" role="status" aria-live="polite">{message}</div>}
      </div>
      
      {isLoading && (
        <div className="loading-overlay" aria-live="polite">
          <div className="loading-spinner"></div>
          <p>正在加载游戏...</p>
        </div>
      )}
      
      {!gameStarted && !isLoading && (
        <div className="start-screen">
          <button className="start-btn" onClick={startGame} aria-label="开始游戏">
            开始游戏
          </button>
        </div>
      )}
      
      {gameStarted && !isLoading && (
        <>
          <Opponents opponents={opponents} />
          
          <TableArea 
            discardedTiles={discardedTiles}
            lastDiscarded={lastDiscarded}
          />
          
          <div className="player-area">
            <PlayerHand 
              hand={playerHand}
              selectedTile={selectedTile}
              onTileClick={handleTileClick}
              lastDrawn={lastDrawn}
              pengs={pengs}
              gangs={gangs}
              chis={chis}
            />
          </div>
          
          <ActionButtons
            onHu={handleHu}
            onPeng={handlePeng}
            onGang={handleGang}
            onChi={handleChi}
            onPass={handlePass}
            onDraw={drawTile}
            canHu={canHu}
            canPeng={canPengResult}
            canGang={canGangResult}
            canChi={canChiResult}
            isMyTurn={currentPlayer === 0}
            hasDrawn={hasDrawn}
          />
        </>
      )}
    </div>
  );
}

export default App;
