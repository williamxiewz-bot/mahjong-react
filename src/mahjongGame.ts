// 麻将牌类型
export interface Tile {
  suit: number;  // 1=万子, 2=筒子, 3=条子, 4=字牌
  num: number;   // 牌面数字
  id: string;    // 唯一标识
}

// 花牌类型（广东麻将8张花牌）
export interface FlowerTile {
  type: 'spring' | 'summer' | 'autumn' | 'winter' | 'plum' | 'orchid' | 'bamboo' | 'chrysanthemum';
  id: string;
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

// 门风类型
export type WindDirection = 'east' | 'south' | 'west' | 'north';

// 圈风类型
export type RoundWind = 'east' | 'south' | 'west' | 'north';

export function getTileChar(tile: Tile): string {
  if (tile.suit <= 3) {
    return TILE_CHARS[tile.suit][tile.num - 1];
  } else if (tile.suit === 4) {
    return TILE_CHARS[4][tile.num - 1];
  }
  return '🀄';
}

// 创建一副完整的广东麻将牌（136张，无花牌）
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

// 创建带花牌的完整麻将（144张）
export function createTilesWithFlowers(): (Tile | FlowerTile)[] {
  const tiles = createTiles();
  const flowers: FlowerTile[] = [
    { type: 'spring', id: 'flower-spring' },
    { type: 'summer', id: 'flower-summer' },
    { type: 'autumn', id: 'flower-autumn' },
    { type: 'winter', id: 'flower-winter' },
    { type: 'plum', id: 'flower-plum' },
    { type: 'orchid', id: 'flower-orchid' },
    { type: 'bamboo', id: 'flower-bamboo' },
    { type: 'chrysanthemum', id: 'flower-chrysanthemum' },
  ];
  return [...tiles, ...flowers];
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

// 判断是否为幺九牌（1、9或字牌）
export function isYaoJiu(tile: Tile): boolean {
  return tile.num === 1 || tile.num === 9 || tile.suit === 4;
}

// 判断是否为字牌
export function isHonorTile(tile: Tile): boolean {
  return tile.suit === 4;
}

// 判断是否为一门（万、筒、条中的一种）
export function hasSuit(hand: Tile[], suit: number): boolean {
  return hand.some(t => t.suit === suit);
}

// 统计手牌中各花色的数量
export function countSuits(hand: Tile[]): Record<number, number> {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  hand.forEach(t => counts[t.suit]++);
  return counts;
}

// 统计各数字牌的数量
export function countNumbers(hand: Tile[], suit: number): number[] {
  const counts = new Array(10).fill(0);
  hand.filter(t => t.suit === suit).forEach(t => counts[t.num]++);
  return counts;
}

// 是否缺一门（广东麻将六独之一）
export function isQueYiMen(hand: Tile[]): boolean {
  const suits = countSuits(hand);
  // 缺少一门，且有字牌
  const numberSuits = [suits[1], suits[2], suits[3]].filter(s => s > 0).length;
  return numberSuits === 2 && suits[4] > 0;
}

// 断幺（广东麻将六独之一）
// 整副牌里无任何幺九牌和番子
export function isDuanYao(hand: Tile[]): boolean {
  return !hand.some(t => isYaoJiu(t));
}

// 是否为平糊（只有顺子，无刻子）
export function isPingHu(hand: Tile[]): boolean {
  if (hand.length !== 14) return false;
  
  // 移除将牌后检查是否全是顺子
  const sorted = sortHand(hand);
  const counts: Record<string, number> = {};
  sorted.forEach(t => {
    const key = `${t.suit}-${t.num}`;
    counts[key] = (counts[key] || 0) + 1;
  });

  // 找到并移除一个对子
  const keys = Object.keys(counts);
  for (const key of keys) {
    if (counts[key] >= 2) {
      const newCnt = { ...counts };
      newCnt[key] -= 2;
      
      // 检查剩下的牌是否全是顺子
      if (canFormAllSets(newCnt)) {
        return true;
      }
    }
  }
  return false;
}

// 辅助函数：将所有牌组成顺子或刻子
function canFormAllSets(cnt: Record<string, number>): boolean {
  const entries = Object.entries(cnt).filter(([, v]) => v > 0);
  if (entries.length === 0) return true;

  const [key, count] = entries[0];
  const [suit, num] = key.split('-').map(Number);

  // 尝试组成顺子
  if (suit <= 3) {
    const seq1 = `${suit}-${num + 1}`;
    const seq2 = `${suit}-${num + 2}`;
    if (cnt[seq1] && cnt[seq2] && cnt[seq1] > 0 && cnt[seq2] > 0) {
      const newCnt = { ...cnt };
      newCnt[key] -= 1;
      newCnt[seq1] -= 1;
      newCnt[seq2] -= 1;
      if (canFormAllSets(newCnt)) return true;
    }
  }

  // 尝试组成刻子
  if (count >= 3) {
    const newCnt = { ...cnt };
    newCnt[key] -= 3;
    if (canFormAllSets(newCnt)) return true;
  }

  return false;
}

// 将眼（广东麻将六独之一）- 必须是2、5、8的对子
export function isJiangYan(hand: Tile[]): boolean {
  const pairs = findPairs(hand);
  return pairs.some(p => [2, 5, 8].includes(p.num) && p.suit <= 3);
}

// 不求人（广东麻将六独之一）- 自摸胡牌，无上或碰过牌
export function isBuQiuRen(hand: Tile[], isSelfDrawn: boolean, melded: boolean[]): boolean {
  // isSelfDrawn: 是否自摸
  // melded: 是否有碰/杠/吃操作 [peng, gang, chi]
  return isSelfDrawn && !melded[0] && !melded[1] && !melded[2];
}

// 门前清（广东麻将六独之一）- 食糊的牌是靠出冲，非自摸，且无碰杠吃
export function isMenQianQing(hand: Tile[], isSelfDrawn: boolean, melded: boolean[]): boolean {
  return !isSelfDrawn && !melded[0] && !melded[1] && !melded[2];
}

// 偏坎独（广东麻将六独之一）
// 边张、嵌张、单吊
export type WaitType = 'edge' | 'center' | 'single' | 'none';

export function getWaitType(hand: Tile[], winningTile: Tile): WaitType {
  const testHand = [...hand, winningTile];
  const sorted = sortHand(testHand);
  
  // 移除一个对子后检查听牌类型
  const counts: Record<string, number> = {};
  sorted.forEach(t => {
    const key = `${t.suit}-${t.num}`;
    counts[key] = (counts[key] || 0) + 1;
  });

  const keys = Object.keys(counts);
  for (const key of keys) {
    if (counts[key] >= 2) {
      const newCnt = { ...counts };
      newCnt[key] -= 2;
      
      // 找出剩余的搭子数量
      const remaining = Object.entries(newCnt).filter(([, v]) => v > 0);
      if (remaining.length === 4) { // 4搭
        // 检查听的牌类型
        const waitTiles = findWaitingTiles(newCnt);
        for (const wait of waitTiles) {
          // 边张：12->3, 78->7
          if ((wait.num === 3 && [1, 2].includes(winningTile.num)) ||
              (wait.num === 7 && [8, 9].includes(winningTile.num))) {
            return 'edge';
          }
          // 嵌张：24->3, 57->6, etc
          if (Math.abs(wait.num - winningTile.num) === 1) {
            // 排除边张
            if (!((wait.num === 2 && winningTile.num === 1) || 
                  (wait.num === 8 && winningTile.num === 9))) {
              return 'center';
            }
          }
        }
        // 单吊
        if (waitTiles.length === 1) {
          return 'single';
        }
      }
    }
  }
  return 'none';
}

// 找出听牌时需要的牌
function findWaitingTiles(cnt: Record<string, number>): Tile[] {
  const tiles: Tile[] = [];
  const entries = Object.entries(cnt).filter(([, v]) => v > 0);
  
  for (const [key, count] of entries) {
    const [suit, num] = key.split('-').map(Number);
    
    // 检查是否能组成顺子
    if (suit <= 3) {
      // 前一张
      if (num > 1) {
        const prev = `${suit}-${num - 1}`;
        if (cnt[prev] && cnt[prev] > 0) {
          tiles.push({ suit, num: num - 1, id: `wait-${suit}-${num - 1}` });
        }
      }
      // 后一张
      if (num < 9) {
        const next = `${suit}-${num + 1}`;
        if (cnt[next] && cnt[next] > 0) {
          tiles.push({ suit, num: num + 1, id: `wait-${suit}-${num + 1}` });
        }
      }
    }
  }
  return tiles;
}

// 是否听牌
export function isTenpai(hand: Tile[]): boolean {
  if (hand.length !== 13) return false;
  
  // 尝试加入每张可能的牌，看是否能胡
  for (let suit = 1; suit <= 4; suit++) {
    for (let num = 1; num <= (suit === 4 ? 7 : 9); num++) {
      const testTile: Tile = { suit, num, id: `test-${suit}-${num}` };
      const testHand = [...hand, testTile];
      if (checkHu(testHand)) {
        return true;
      }
    }
  }
  return false;
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

// 计算番数（广东麻将）
export interface FanResult {
  total: number;
  details: string[];
}

// 广东麻将番数计算
export function calculateFan(
  hand: Tile[],
  isSelfDrawn: boolean,
  melded: boolean[], // [peng, gang, chi]
  isLastTile: boolean, // 牌局最后一张
  isRobbedKong: boolean, // 抢杠
  isDingQue: boolean // 定缺
): FanResult {
  const details: string[] = [];
  let total = 0;

  // 基本胡牌
  if (checkHu(hand)) {
    total += 1;
    details.push('基本胡牌');
  }

  // 平糊
  if (isPingHu(hand)) {
    total += 1;
    details.push('平糊');
  }

  // 断幺
  if (isDuanYao(hand)) {
    total += 1;
    details.push('断幺');
  }

  // 不求人
  if (isBuQiuRen(hand, isSelfDrawn, melded)) {
    total += 1;
    details.push('不求人');
  }

  // 门前清
  if (isMenQianQing(hand, isSelfDrawn, melded)) {
    total += 1;
    details.push('门前清');
  }

  // 缺一门
  if (isQueYiMen(hand)) {
    total += 1;
    details.push('缺一门');
  }

  // 将对
  if (isJiangYan(hand)) {
    total += 1;
    details.push('将对');
  }

  // 自摸
  if (isSelfDrawn) {
    total += 1;
    details.push('自摸');
  }

  // 抢杠
  if (isRobbedKong) {
    total += 1;
    details.push('抢杠');
  }

  // 海底捞月（最后一张自摸）
  if (isLastTile && isSelfDrawn) {
    total += 1;
    details.push('海底捞月');
  }

  return { total, details };
}
