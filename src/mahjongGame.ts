// 麻将牌类型
export interface Tile {
  suit: number;  // 1=万子, 2=筒子, 3=条子, 4=字牌
  num: number;   // 牌面数字
  id: string;    // 唯一标识
}

export const TILE_CHARS: Record<number, string[]> = {
  1: ['🀇', '🀈', '🀉', '🀊', '🀋', '🀌', '🀍', '🀎', '🀏'],
  2: ['🀐', '🀑', '🀒', '🀓', '🀔', '🀕', '🀖', '🀗', '🀘'],
  3: ['🀙', '🀚', '🀛', '🀜', '🀝', '🀞', '🀟', '🀠', '🀡'],
  4: ['🀀', '🀁', '🀂', '🀃', '🀄', '🀅', '🀆'],
};

export const TILE_NAMES: Record<number, string[]> = {
  1: ['1万', '2万', '3万', '4万', '5万', '6万', '7万', '8万', '9万'],
  2: ['1筒', '2筒', '3筒', '4筒', '5筒', '6筒', '7筒', '8筒', '9筒'],
  3: ['1条', '2条', '3条', '4条', '5条', '6条', '7条', '8条', '9条'],
  4: ['东', '南', '西', '北', '中', '发', '白'],
};

export function getTileChar(tile: Tile): string {
  if (tile.suit <= 3) {
    return TILE_CHARS[tile.suit][tile.num - 1];
  } else if (tile.suit === 4) {
    return TILE_CHARS[4][tile.num - 1];
  }
  return '🀄';
}

export function createTiles(): Tile[] {
  const tiles: Tile[] = [];
  // 万子、筒子、条子各9种，每种4张
  for (let suit = 1; suit <= 3; suit++) {
    for (let num = 1; num <= 9; num++) {
      for (let i = 0; i < 4; i++) {
        tiles.push({ suit, num, id: `${suit}-${num}-${i}` });
      }
    }
  }
  // 字牌7种，每种4张
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 4; j++) {
      tiles.push({ suit: 4, num: i + 1, id: `4-${i + 1}-${j}` });
    }
  }
  return tiles;
}

export function shuffleTiles(tiles: Tile[]): Tile[] {
  const shuffled = [...tiles];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function sortHand(hand: Tile[]): Tile[] {
  return [...hand].sort((a, b) => {
    if (a.suit !== b.suit) return a.suit - b.suit;
    return a.num - b.num;
  });
}

export function canPeng(hand: Tile[], tile: Tile): boolean {
  const counts: Record<string, number> = {};
  hand.forEach(t => {
    const key = `${t.suit}-${t.num}`;
    counts[key] = (counts[key] || 0) + 1;
  });
  const key = `${tile.suit}-${tile.num}`;
  return (counts[key] || 0) >= 2;
}

export function canGang(hand: Tile[], tile: Tile): boolean {
  const counts: Record<string, number> = {};
  hand.forEach(t => {
    const key = `${t.suit}-${t.num}`;
    counts[key] = (counts[key] || 0) + 1;
  });
  const key = `${tile.suit}-${tile.num}`;
  return (counts[key] || 0) >= 3;
}

export function canChi(hand: Tile[], tile: Tile): boolean {
  if (tile.suit > 3 || tile.suit === 0) return false;

  const sorted = [...hand].sort((a, b) => {
    if (a.suit !== b.suit) return a.suit - b.suit;
    return a.num - b.num;
  });

  const num = tile.num;
  const suit = tile.suit;

  if (num >= 2 && num <= 8) {
    const has1 = sorted.some(t => t.suit === suit && t.num === num - 1);
    const has2 = sorted.some(t => t.suit === suit && t.num === num + 1);
    if (has1 && has2) return true;
  }
  if (num >= 3 && num <= 9) {
    const has1 = sorted.some(t => t.suit === suit && t.num === num - 2);
    const has2 = sorted.some(t => t.suit === suit && t.num === num - 1);
    if (has1 && has2) return true;
  }
  if (num >= 1 && num <= 7) {
    const has1 = sorted.some(t => t.suit === suit && t.num === num + 1);
    const has2 = sorted.some(t => t.suit === suit && t.num === num + 2);
    if (has1 && has2) return true;
  }

  return false;
}

export function findChiOptions(hand: Tile[], tile: Tile): Tile[][] {
  if (tile.suit > 3) return [];

  const options: Tile[][] = [];
  const num = tile.num;
  const suit = tile.suit;

  if (num >= 2 && num <= 8) {
    const has1 = hand.some(t => t.suit === suit && t.num === num - 1);
    const has2 = hand.some(t => t.suit === suit && t.num === num + 1);
    if (has1 && has2) {
      const t1 = hand.filter(t => t.suit === suit && t.num === num - 1)[0];
      const t2 = hand.filter(t => t.suit === suit && t.num === num + 1)[0];
      options.push([t1, t2, tile]);
    }
  }
  if (num >= 3) {
    const has1 = hand.some(t => t.suit === suit && t.num === num - 2);
    const has2 = hand.some(t => t.suit === suit && t.num === num - 1);
    if (has1 && has2) {
      const t1 = hand.filter(t => t.suit === suit && t.num === num - 2)[0];
      const t2 = hand.filter(t => t.suit === suit && t.num === num - 1)[0];
      options.push([t1, t2, tile]);
    }
  }
  if (num <= 7) {
    const has1 = hand.some(t => t.suit === suit && t.num === num + 1);
    const has2 = hand.some(t => t.suit === suit && t.num === num + 2);
    if (has1 && has2) {
      const t1 = hand.filter(t => t.suit === suit && t.num === num + 1)[0];
      const t2 = hand.filter(t => t.suit === suit && t.num === num + 2)[0];
      options.push([t1, t2, tile]);
    }
  }

  return options;
}

export function findPairs(hand: Tile[]): Tile[] {
  const pairs: Tile[] = [];
  const counts: Record<string, number> = {};
  hand.forEach(t => {
    const key = `${t.suit}-${t.num}`;
    counts[key] = (counts[key] || 0) + 1;
  });
  Object.keys(counts).forEach(key => {
    if (counts[key] >= 2) {
      const [suit, num] = key.split('-').map(Number);
      pairs.push({ suit, num, id: `pair-${key}` });
    }
  });
  return pairs;
}

// 胡牌检测缓存
const huCache = new Map<string, boolean>();

function getCacheKey(hand: Tile[]): string {
  return hand.map(t => `${t.suit}-${t.num}`).sort().join(',');
}

export function checkHu(hand: Tile[]): boolean {
  if (hand.length !== 14) return false;

  const cacheKey = getCacheKey(hand);
  if (huCache.has(cacheKey)) {
    return huCache.get(cacheKey)!;
  }

  const sorted = [...hand].sort((a, b) => {
    if (a.suit !== b.suit) return a.suit - b.suit;
    return a.num - b.num;
  });

  const counts: Record<string, number> = {};
  sorted.forEach(t => {
    const key = `${t.suit}-${t.num}`;
    counts[key] = (counts[key] || 0) + 1;
  });

  const keys = Object.keys(counts);
  
  const tryRemovePair = (cnt: Record<string, number>): boolean => {
    for (const key of keys) {
      if (cnt[key] >= 2) {
        const newCnt = { ...cnt };
        newCnt[key] -= 2;
        if (canFormAll(newCnt)) {
          return true;
        }
      }
    }
    return false;
  };

  const canFormAll = (cnt: Record<string, number>): boolean => {
    const remaining = Object.entries(cnt).filter(([, v]) => v > 0);
    if (remaining.length === 0) return true;

    const [firstKey, firstCount] = remaining[0];
    const [suit, num] = firstKey.split('-').map(Number);

    if (suit <= 3) {
      const seq1 = `${suit}-${num + 1}`;
      const seq2 = `${suit}-${num + 2}`;
      
      if (cnt[seq1] && cnt[seq2] && cnt[seq1] > 0 && cnt[seq2] > 0) {
        const newCnt = { ...cnt };
        newCnt[firstKey] -= 1;
        newCnt[seq1] -= 1;
        newCnt[seq2] -= 1;
        return canFormAll(newCnt);
      }
    }

    if (firstCount >= 3) {
      const newCnt = { ...cnt };
      newCnt[firstKey] -= 3;
      return canFormAll(newCnt);
    }

    return false;
  };

  const result = tryRemovePair(counts);
  huCache.set(cacheKey, result);
  return result;
}

// 清除胡牌缓存
export function clearHuCache(): void {
  huCache.clear();
}
