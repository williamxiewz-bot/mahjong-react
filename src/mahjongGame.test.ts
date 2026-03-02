import { describe, it, expect, beforeEach } from 'vitest'
import {
  createTiles,
  shuffleTiles,
  sortHand,
  canPeng,
  canGang,
  canChi,
  findChiOptions,
  checkHu,
  findPairs,
  clearHuCache,
  getTileChar,
  isYaoJiu,
  isHonorTile,
  hasSuit,
  countSuits,
  isQueYiMen,
  isDuanYao,
  isPingHu,
  isJiangYan,
  isBuQiuRen,
  isMenQianQing,
  getWaitType,
  isTenpai,
  calculateFan,
  createTilesWithFlowers,
  type Tile
} from './mahjongGame'

describe('麻将游戏核心逻辑', () => {
  beforeEach(() => {
    clearHuCache()
  })

  describe('createTiles', () => {
    it('应该创建136张牌（无花牌）', () => {
      const tiles = createTiles()
      expect(tiles).toHaveLength(136)
    })

    it('应该包含万子(1-9)各4张', () => {
      const tiles = createTiles()
      const wanTiles = tiles.filter(t => t.suit === 1)
      expect(wanTiles).toHaveLength(36) // 9 * 4
    })

    it('应该包含筒子(1-9)各4张', () => {
      const tiles = createTiles()
      const tongTiles = tiles.filter(t => t.suit === 2)
      expect(tongTiles).toHaveLength(36)
    })

    it('应该包含条子(1-9)各4张', () => {
      const tiles = createTiles()
      const tiaoTiles = tiles.filter(t => t.suit === 3)
      expect(tiaoTiles).toHaveLength(36)
    })

    it('应该包含字牌(7种)各4张', () => {
      const tiles = createTiles()
      const ziTiles = tiles.filter(t => t.suit === 4)
      expect(ziTiles).toHaveLength(28) // 7 * 4
    })

    it('每张牌应该有唯一的id', () => {
      const tiles = createTiles()
      const ids = tiles.map(t => t.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(tiles.length)
    })
  })

  describe('createTilesWithFlowers', () => {
    it('应该创建144张牌（带花牌）', () => {
      const tiles = createTilesWithFlowers()
      expect(tiles).toHaveLength(144)
    })

    it('应该包含8张花牌', () => {
      const tiles = createTilesWithFlowers()
      const flowers = tiles.filter(t => 'type' in t)
      expect(flowers).toHaveLength(8)
    })
  })

  describe('shuffleTiles', () => {
    it('不应该改变原数组长度', () => {
      const tiles = createTiles()
      const originalLength = tiles.length
      shuffleTiles(tiles)
      expect(tiles).toHaveLength(originalLength)
    })

    it('应该返回一个新数组', () => {
      const tiles = createTiles()
      const shuffled = shuffleTiles(tiles)
      expect(shuffled).not.toBe(tiles)
    })

    it('应该包含所有原始牌', () => {
      const tiles = createTiles()
      const shuffled = shuffleTiles(tiles)
      const originalIds = tiles.map(t => t.id).sort()
      const shuffledIds = shuffled.map(t => t.id).sort()
      expect(shuffledIds).toEqual(originalIds)
    })
  })

  describe('sortHand', () => {
    it('应该按花色排序', () => {
      const hand: Tile[] = [
        { suit: 3, num: 1, id: '3-1-0' },
        { suit: 1, num: 1, id: '1-1-0' },
        { suit: 2, num: 1, id: '2-1-0' },
      ]
      const sorted = sortHand(hand)
      expect(sorted[0].suit).toBe(1)
      expect(sorted[1].suit).toBe(2)
      expect(sorted[2].suit).toBe(3)
    })

    it('应该按数字排序', () => {
      const hand: Tile[] = [
        { suit: 1, num: 3, id: '1-3-0' },
        { suit: 1, num: 1, id: '1-1-0' },
        { suit: 1, num: 2, id: '1-2-0' },
      ]
      const sorted = sortHand(hand)
      expect(sorted[0].num).toBe(1)
      expect(sorted[1].num).toBe(2)
      expect(sorted[2].num).toBe(3)
    })

    it('不应该修改原数组', () => {
      const hand: Tile[] = [
        { suit: 1, num: 3, id: '1-3-0' },
        { suit: 1, num: 1, id: '1-1-0' },
      ]
      const original = [...hand]
      sortHand(hand)
      expect(hand).toEqual(original)
    })
  })

  describe('isYaoJiu - 幺九牌判断', () => {
    it('1万应该是幺九牌', () => {
      expect(isYaoJiu({ suit: 1, num: 1, id: '1-1-0' })).toBe(true)
    })

    it('9万应该是幺九牌', () => {
      expect(isYaoJiu({ suit: 1, num: 9, id: '1-9-0' })).toBe(true)
    })

    it('字牌应该是幺九牌', () => {
      expect(isYaoJiu({ suit: 4, num: 1, id: '4-1-0' })).toBe(true)
    })

    it('5万不是幺九牌', () => {
      expect(isYaoJiu({ suit: 1, num: 5, id: '1-5-0' })).toBe(false)
    })
  })

  describe('isHonorTile - 字牌判断', () => {
    it('东应该是字牌', () => {
      expect(isHonorTile({ suit: 4, num: 1, id: '4-1-0' })).toBe(true)
    })

    it('中发白应该是字牌', () => {
      expect(isHonorTile({ suit: 4, num: 5, id: '4-5-0' })).toBe(true)
      expect(isHonorTile({ suit: 4, num: 6, id: '4-6-0' })).toBe(true)
      expect(isHonorTile({ suit: 4, num: 7, id: '4-7-0' })).toBe(true)
    })

    it('数牌不是字牌', () => {
      expect(isHonorTile({ suit: 1, num: 5, id: '1-5-0' })).toBe(false)
    })
  })

  describe('countSuits - 花色统计', () => {
    it('应该正确统计各花色数量', () => {
      const hand: Tile[] = [
        { suit: 1, num: 1, id: '1-1-0' },
        { suit: 1, num: 2, id: '1-2-0' },
        { suit: 2, num: 1, id: '2-1-0' },
        { suit: 4, num: 1, id: '4-1-0' },
      ]
      const counts = countSuits(hand)
      expect(counts[1]).toBe(2)
      expect(counts[2]).toBe(1)
      expect(counts[3]).toBe(0)
      expect(counts[4]).toBe(1)
    })
  })

  describe('isQueYiMen - 缺一门（广东麻将六独之一）', () => {
    it('缺一门应该返回true', () => {
      // 只有两门数牌 + 有字牌
      const hand: Tile[] = [
        ...Array(4).fill(null).map((_, i) => ({ suit: 1, num: i % 9 + 1, id: `1-${i}-0` })),
        ...Array(4).fill(null).map((_, i) => ({ suit: 2, num: i % 9 + 1, id: `2-${i}-0` })),
        { suit: 4, num: 1, id: '4-1-0' },
        { suit: 4, num: 1, id: '4-1-1' },
      ]
      expect(isQueYiMen(hand)).toBe(true)
    })

    it('三门数牌齐全应该返回false', () => {
      const hand: Tile[] = [
        { suit: 1, num: 1, id: '1-1-0' },
        { suit: 2, num: 1, id: '2-1-0' },
        { suit: 3, num: 1, id: '3-1-0' },
      ]
      expect(isQueYiMen(hand)).toBe(false)
    })
  })

  describe('isDuanYao - 断幺（广东麻将六独之一）', () => {
    it('无幺九牌应该返回true', () => {
      const hand: Tile[] = [
        { suit: 1, num: 2, id: '1-2-0' },
        { suit: 1, num: 3, id: '1-3-0' },
        { suit: 2, num: 5, id: '2-5-0' },
        { suit: 3, num: 7, id: '3-7-0' },
      ]
      expect(isDuanYao(hand)).toBe(true)
    })

    it('有幺九牌应该返回false', () => {
      const hand: Tile[] = [
        { suit: 1, num: 1, id: '1-1-0' },
        { suit: 1, num: 2, id: '1-2-0' },
      ]
      expect(isDuanYao(hand)).toBe(false)
    })

    it('有字牌应该返回false', () => {
      const hand: Tile[] = [
        { suit: 1, num: 2, id: '1-2-0' },
        { suit: 4, num: 1, id: '4-1-0' },
      ]
      expect(isDuanYao(hand)).toBe(false)
    })
  })

  describe('isPingHu - 平糊（只有顺子无刻子）', () => {
    it('纯顺子应该返回true', () => {
      // 123 456 789 111 222 + 55
      const hand: Tile[] = [
        { suit: 1, num: 1, id: '1-1-0' },
        { suit: 1, num: 2, id: '1-2-0' },
        { suit: 1, num: 3, id: '1-3-0' },
        { suit: 1, num: 4, id: '1-4-0' },
        { suit: 1, num: 5, id: '1-5-0' },
        { suit: 1, num: 6, id: '1-6-0' },
        { suit: 1, num: 7, id: '1-7-0' },
        { suit: 1, num: 8, id: '1-8-0' },
        { suit: 1, num: 9, id: '1-9-0' },
        { suit: 2, num: 1, id: '2-1-0' },
        { suit: 2, num: 1, id: '2-1-1' },
        { suit: 2, num: 1, id: '2-1-2' },
        { suit: 2, num: 5, id: '2-5-0' },
        { suit: 2, num: 5, id: '2-5-1' },
      ]
      expect(isPingHu(hand)).toBe(true)
    })
  })

  describe('isJiangYan - 将对（广东麻将六独之一）', () => {
    it('2、5、8的对子应该返回true', () => {
      const hand: Tile[] = [
        { suit: 1, num: 2, id: '1-2-0' },
        { suit: 1, num: 2, id: '1-2-1' }, // 2万对子
        { suit: 1, num: 1, id: '1-1-0' },
        { suit: 1, num: 1, id: '1-1-1' },
        { suit: 1, num: 1, id: '1-1-2' },
        { suit: 1, num: 4, id: '1-4-0' },
        { suit: 1, num: 5, id: '1-5-0' },
        { suit: 1, num: 6, id: '1-6-0' },
        { suit: 1, num: 7, id: '1-7-0' },
        { suit: 1, num: 8, id: '1-8-0' },
        { suit: 1, num: 9, id: '1-9-0' },
        { suit: 2, num: 5, id: '2-5-0' },
        { suit: 2, num: 5, id: '2-5-1' },
        { suit: 2, num: 5, id: '2-5-2' },
      ]
      expect(isJiangYan(hand)).toBe(true)
    })

    it('字牌对子应该返回false', () => {
      const hand: Tile[] = [
        { suit: 4, num: 1, id: '4-1-0' },
        { suit: 4, num: 1, id: '4-1-1' }, // 字牌对子
      ]
      expect(isJiangYan(hand)).toBe(false)
    })
  })

  describe('isBuQiuRen - 不求人（广东麻将六独之一）', () => {
    it('自摸且无碰杠吃应该返回true', () => {
      expect(isBuQiuRen([], true, [false, false, false])).toBe(true)
    })

    it('不是自摸应该返回false', () => {
      expect(isBuQiuRen([], false, [false, false, false])).toBe(false)
    })

    it('有碰应该返回false', () => {
      expect(isBuQiuRen([], true, [true, false, false])).toBe(false)
    })

    it('有杠应该返回false', () => {
      expect(isBuQiuRen([], true, [false, true, false])).toBe(false)
    })
  })

  describe('isMenQianQing - 门前清（广东麻将六独之一）', () => {
    it('不是自摸且无碰杠吃应该返回true', () => {
      expect(isMenQianQing([], false, [false, false, false])).toBe(true)
    })

    it('自摸应该返回false', () => {
      expect(isMenQianQing([], true, [false, false, false])).toBe(false)
    })

    it('有碰应该返回false', () => {
      expect(isMenQianQing([], false, [true, false, false])).toBe(false)
    })
  })

  describe('canPeng', () => {
    it('手牌中有两张相同牌时应该可以碰', () => {
      const hand: Tile[] = [
        { suit: 1, num: 1, id: '1-1-0' },
        { suit: 1, num: 2, id: '1-2-0' },
        { suit: 1, num: 1, id: '1-1-1' },
      ]
      const tile: Tile = { suit: 1, num: 1, id: '1-1-2' }
      expect(canPeng(hand, tile)).toBe(true)
    })

    it('手牌中只有一张相同牌时不应该可以碰', () => {
      const hand: Tile[] = [
        { suit: 1, num: 1, id: '1-1-0' },
        { suit: 1, num: 2, id: '1-2-0' },
      ]
      const tile: Tile = { suit: 1, num: 1, id: '1-1-1' }
      expect(canPeng(hand, tile)).toBe(false)
    })

    it('不同花色不应该可以碰', () => {
      const hand: Tile[] = [
        { suit: 1, num: 1, id: '1-1-0' },
        { suit: 1, num: 1, id: '1-1-1' },
      ]
      const tile: Tile = { suit: 2, num: 1, id: '2-1-0' }
      expect(canPeng(hand, tile)).toBe(false)
    })
  })

  describe('canGang', () => {
    it('手牌中有三张相同牌时应该可以杠', () => {
      const hand: Tile[] = [
        { suit: 1, num: 1, id: '1-1-0' },
        { suit: 1, num: 1, id: '1-1-1' },
        { suit: 1, num: 1, id: '1-1-2' },
      ]
      const tile: Tile = { suit: 1, num: 1, id: '1-1-3' }
      expect(canGang(hand, tile)).toBe(true)
    })

    it('手牌中只有两张相同牌时不应该可以杠', () => {
      const hand: Tile[] = [
        { suit: 1, num: 1, id: '1-1-0' },
        { suit: 1, num: 1, id: '1-1-1' },
      ]
      const tile: Tile = { suit: 1, num: 1, id: '1-1-2' }
      expect(canGang(hand, tile)).toBe(false)
    })
  })

  describe('canChi', () => {
    it('有顺子时应该可以吃', () => {
      const hand: Tile[] = [
        { suit: 1, num: 1, id: '1-1-0' },
        { suit: 1, num: 3, id: '1-3-0' },
      ]
      const tile: Tile = { suit: 1, num: 2, id: '1-2-0' }
      expect(canChi(hand, tile)).toBe(true)
    })

    it('字牌不应该可以吃', () => {
      const hand: Tile[] = [
        { suit: 4, num: 1, id: '4-1-0' },
        { suit: 4, num: 3, id: '4-3-0' },
      ]
      const tile: Tile = { suit: 4, num: 2, id: '4-2-0' }
      expect(canChi(hand, tile)).toBe(false)
    })

    it('边张不应该可以吃', () => {
      const hand: Tile[] = [
        { suit: 1, num: 1, id: '1-1-0' },
        { suit: 1, num: 2, id: '1-2-0' },
      ]
      const tile: Tile = { suit: 1, num: 9, id: '1-9-0' }
      expect(canChi(hand, tile)).toBe(false)
    })
  })

  describe('findChiOptions', () => {
    it('应该返回所有可能的吃牌组合', () => {
      const hand: Tile[] = [
        { suit: 1, num: 1, id: '1-1-0' },
        { suit: 1, num: 3, id: '1-3-0' },
        { suit: 1, num: 4, id: '1-4-0' },
      ]
      const tile: Tile = { suit: 1, num: 2, id: '1-2-0' }
      const options = findChiOptions(hand, tile)
      expect(options.length).toBeGreaterThan(0)
    })

    it('没有顺子时应该返回空数组', () => {
      const hand: Tile[] = [
        { suit: 1, num: 1, id: '1-1-0' },
        { suit: 1, num: 5, id: '1-5-0' },
      ]
      const tile: Tile = { suit: 1, num: 3, id: '1-3-0' }
      const options = findChiOptions(hand, tile)
      expect(options).toHaveLength(0)
    })
  })

  describe('checkHu - 胡牌检测', () => {
    it('13张牌时不应该胡牌', () => {
      const hand: Tile[] = Array(13).fill(null).map((_, i) => ({
        suit: 1,
        num: (i % 9) + 1,
        id: `1-${(i % 9) + 1}-${i}`
      }))
      expect(checkHu(hand)).toBe(false)
    })

    it('14张牌且符合胡牌规则时应该胡牌', () => {
      const hand: Tile[] = [
        { suit: 1, num: 1, id: '1-1-0' },
        { suit: 1, num: 1, id: '1-1-1' },
        { suit: 1, num: 1, id: '1-1-2' },
        { suit: 1, num: 2, id: '1-2-0' },
        { suit: 1, num: 2, id: '1-2-1' },
        { suit: 1, num: 2, id: '1-2-2' },
        { suit: 1, num: 3, id: '1-3-0' },
        { suit: 1, num: 3, id: '1-3-1' },
        { suit: 1, num: 3, id: '1-3-2' },
        { suit: 1, num: 4, id: '1-4-0' },
        { suit: 1, num: 4, id: '1-4-1' },
        { suit: 1, num: 4, id: '1-4-2' },
        { suit: 2, num: 5, id: '2-5-0' },
        { suit: 2, num: 5, id: '2-5-1' },
      ]
      expect(checkHu(hand)).toBe(true)
    })

    it('七对子应该胡牌', () => {
      const hand: Tile[] = [
        { suit: 1, num: 1, id: '1-1-0' },
        { suit: 1, num: 1, id: '1-1-1' },
        { suit: 1, num: 2, id: '1-2-0' },
        { suit: 1, num: 2, id: '1-2-1' },
        { suit: 1, num: 3, id: '1-3-0' },
        { suit: 1, num: 3, id: '1-3-1' },
        { suit: 1, num: 4, id: '1-4-0' },
        { suit: 1, num: 4, id: '1-4-1' },
        { suit: 1, num: 5, id: '1-5-0' },
        { suit: 1, num: 5, id: '1-5-1' },
        { suit: 1, num: 6, id: '1-6-0' },
        { suit: 1, num: 6, id: '1-6-1' },
        { suit: 1, num: 7, id: '1-7-0' },
        { suit: 1, num: 7, id: '1-7-1' },
      ]
      expect(checkHu(hand)).toBe(true)
    })

    it('不应该胡牌时返回false', () => {
      const hand: Tile[] = [
        { suit: 1, num: 1, id: '1-1-0' },
        { suit: 1, num: 1, id: '1-1-1' },
        { suit: 1, num: 2, id: '1-2-0' },
        { suit: 1, num: 3, id: '1-3-0' },
        { suit: 1, num: 4, id: '1-4-0' },
        { suit: 1, num: 5, id: '1-5-0' },
        { suit: 1, num: 6, id: '1-6-0' },
        { suit: 1, num: 7, id: '1-7-0' },
        { suit: 1, num: 8, id: '1-8-0' },
        { suit: 1, num: 9, id: '1-9-0' },
        { suit: 2, num: 1, id: '2-1-0' },
        { suit: 2, num: 2, id: '2-2-0' },
        { suit: 2, num: 3, id: '2-3-0' },
        { suit: 2, num: 4, id: '2-4-0' },
      ]
      expect(checkHu(hand)).toBe(false)
    })
  })

  describe('findPairs', () => {
    it('应该找到所有对子', () => {
      const hand: Tile[] = [
        { suit: 1, num: 1, id: '1-1-0' },
        { suit: 1, num: 1, id: '1-1-1' },
        { suit: 1, num: 2, id: '1-2-0' },
        { suit: 1, num: 2, id: '1-2-1' },
      ]
      const pairs = findPairs(hand)
      expect(pairs).toHaveLength(2)
    })

    it('没有对子时返回空数组', () => {
      const hand: Tile[] = [
        { suit: 1, num: 1, id: '1-1-0' },
        { suit: 1, num: 2, id: '1-2-0' },
        { suit: 1, num: 3, id: '1-3-0' },
      ]
      const pairs = findPairs(hand)
      expect(pairs).toHaveLength(0)
    })
  })

  describe('getTileChar', () => {
    it('应该返回正确的万子字符', () => {
      const tile: Tile = { suit: 1, num: 1, id: '1-1-0' }
      expect(getTileChar(tile)).toBe('🀇')
    })

    it('应该返回正确的筒子字符', () => {
      const tile: Tile = { suit: 2, num: 5, id: '2-5-0' }
      expect(getTileChar(tile)).toBe('🀔')
    })

    it('应该返回正确的条子字符', () => {
      const tile: Tile = { suit: 3, num: 9, id: '3-9-0' }
      expect(getTileChar(tile)).toBe('🀡')
    })

    it('应该返回正确的字牌字符', () => {
      const tile: Tile = { suit: 4, num: 1, id: '4-1-0' }
      expect(getTileChar(tile)).toBe('🀀')
    })

    it('中发白应该返回正确字符', () => {
      expect(getTileChar({ suit: 4, num: 5, id: '4-5-0' })).toBe('🀄')
      expect(getTileChar({ suit: 4, num: 6, id: '4-6-0' })).toBe('🀅')
      expect(getTileChar({ suit: 4, num: 7, id: '4-7-0' })).toBe('🀆')
    })
  })

  describe('calculateFan - 番数计算', () => {
    it('基本胡牌应该有1番', () => {
      const hand: Tile[] = [
        { suit: 1, num: 1, id: '1-1-0' },
        { suit: 1, num: 1, id: '1-1-1' },
        { suit: 1, num: 1, id: '1-1-2' },
        { suit: 1, num: 2, id: '1-2-0' },
        { suit: 1, num: 2, id: '1-2-1' },
        { suit: 1, num: 2, id: '1-2-2' },
        { suit: 1, num: 3, id: '1-3-0' },
        { suit: 1, num: 3, id: '1-3-1' },
        { suit: 1, num: 3, id: '1-3-2' },
        { suit: 1, num: 4, id: '1-4-0' },
        { suit: 1, num: 4, id: '1-4-1' },
        { suit: 1, num: 4, id: '1-4-2' },
        { suit: 2, num: 5, id: '2-5-0' },
        { suit: 2, num: 5, id: '2-5-1' },
      ]
      const result = calculateFan(hand, false, [false, false, false], false, false, false)
      expect(result.total).toBeGreaterThanOrEqual(1)
    })

    it('自摸应该增加番数', () => {
      const hand: Tile[] = [
        { suit: 1, num: 1, id: '1-1-0' },
        { suit: 1, num: 1, id: '1-1-1' },
        { suit: 1, num: 1, id: '1-1-2' },
        { suit: 1, num: 2, id: '1-2-0' },
        { suit: 1, num: 2, id: '1-2-1' },
        { suit: 1, num: 2, id: '1-2-2' },
        { suit: 1, num: 3, id: '1-3-0' },
        { suit: 1, num: 3, id: '1-3-1' },
        { suit: 1, num: 3, id: '1-3-2' },
        { suit: 1, num: 4, id: '1-4-0' },
        { suit: 1, num: 4, id: '1-4-1' },
        { suit: 1, num: 4, id: '1-4-2' },
        { suit: 2, num: 5, id: '2-5-0' },
        { suit: 2, num: 5, id: '2-5-1' },
      ]
      const resultNoSelf = calculateFan(hand, false, [false, false, false], false, false, false)
      const resultSelf = calculateFan(hand, true, [false, false, false], false, false, false)
      expect(resultSelf.total).toBeGreaterThan(resultNoSelf.total)
    })
  })
})

describe('吃牌组合查找 (findChiOptions)', () => {
  it('找到正确的吃牌组合', () => {
    const hand: Tile[] = [
      { suit: 1, num: 1, id: '1-1-0' },
      { suit: 1, num: 3, id: '1-3-0' },
    ];
    const tile: Tile = { suit: 1, num: 2, id: '1-2-0' };
    const options = findChiOptions(hand, tile);
    expect(options.length).toBeGreaterThan(0);
  });

  it('没有吃牌组合时返回空数组', () => {
    const hand: Tile[] = [
      { suit: 1, num: 1, id: '1-1-0' },
      { suit: 1, num: 5, id: '1-5-0' },
    ];
    const tile: Tile = { suit: 1, num: 3, id: '1-3-0' };
    const options = findChiOptions(hand, tile);
    expect(options).toHaveLength(0);
  });

  it('字牌不能吃', () => {
    const hand: Tile[] = [
      { suit: 4, num: 1, id: '4-1-0' },
      { suit: 4, num: 3, id: '4-3-0' },
    ];
    const tile: Tile = { suit: 4, num: 2, id: '4-2-0' };
    const options = findChiOptions(hand, tile);
    expect(options).toHaveLength(0);
  });
});

describe('碰牌判断 (canPeng)', () => {
  it('两张相同牌可以碰', () => {
    const hand: Tile[] = [
      { suit: 1, num: 1, id: '1-1-0' },
      { suit: 1, num: 1, id: '1-1-1' },
    ];
    const tile: Tile = { suit: 1, num: 1, id: '1-1-2' };
    expect(canPeng(hand, tile)).toBe(true);
  });

  it('一张相同牌不能碰', () => {
    const hand: Tile[] = [
      { suit: 1, num: 1, id: '1-1-0' },
    ];
    const tile: Tile = { suit: 1, num: 1, id: '1-1-1' };
    expect(canPeng(hand, tile)).toBe(false);
  });

  it('不同花色不能碰', () => {
    const hand: Tile[] = [
      { suit: 1, num: 1, id: '1-1-0' },
      { suit: 1, num: 1, id: '1-1-1' },
    ];
    const tile: Tile = { suit: 2, num: 1, id: '2-1-0' };
    expect(canPeng(hand, tile)).toBe(false);
  });
});

describe('杠牌判断 (canGang)', () => {
  it('三张相同牌可以杠', () => {
    const hand: Tile[] = [
      { suit: 1, num: 1, id: '1-1-0' },
      { suit: 1, num: 1, id: '1-1-1' },
      { suit: 1, num: 1, id: '1-1-2' },
    ];
    const tile: Tile = { suit: 1, num: 1, id: '1-1-3' };
    expect(canGang(hand, tile)).toBe(true);
  });

  it('两张相同牌不能杠', () => {
    const hand: Tile[] = [
      { suit: 1, num: 1, id: '1-1-0' },
      { suit: 1, num: 1, id: '1-1-1' },
    ];
    const tile: Tile = { suit: 1, num: 1, id: '1-1-2' };
    expect(canGang(hand, tile)).toBe(false);
  });
});

describe('胡牌检测 (checkHu)', () => {
  it('13张牌不能胡', () => {
    const hand = Array(13).fill(null).map((_, i) => ({
      suit: 1,
      num: (i % 9) + 1,
      id: `1-${(i % 9) + 1}-${i}`
    }));
    expect(checkHu(hand)).toBe(false);
  });

  it('基本胡牌牌型', () => {
    const hand: Tile[] = [
      { suit: 1, num: 1, id: '1-1-0' },
      { suit: 1, num: 1, id: '1-1-1' },
      { suit: 1, num: 1, id: '1-1-2' },
      { suit: 1, num: 2, id: '1-2-0' },
      { suit: 1, num: 2, id: '1-2-1' },
      { suit: 1, num: 2, id: '1-2-2' },
      { suit: 1, num: 3, id: '1-3-0' },
      { suit: 1, num: 3, id: '1-3-1' },
      { suit: 1, num: 3, id: '1-3-2' },
      { suit: 1, num: 4, id: '1-4-0' },
      { suit: 1, num: 4, id: '1-4-1' },
      { suit: 1, num: 4, id: '1-4-2' },
      { suit: 2, num: 5, id: '2-5-0' },
      { suit: 2, num: 5, id: '2-5-1' },
    ];
    expect(checkHu(hand)).toBe(true);
  });

  it('七对子胡牌', () => {
    const hand: Tile[] = [];
    for (let i = 0; i < 7; i++) {
      hand.push({ suit: 1, num: i + 1, id: `1-${i + 1}-0` });
      hand.push({ suit: 1, num: i + 1, id: `1-${i + 1}-1` });
    }
    expect(checkHu(hand)).toBe(true);
  });

  it('错误牌型不能胡', () => {
    const hand: Tile[] = [
      { suit: 1, num: 1, id: '1-1-0' },
      { suit: 1, num: 2, id: '1-2-0' },
      { suit: 1, num: 4, id: '1-4-0' },
      { suit: 1, num: 5, id: '1-5-0' },
      { suit: 1, num: 6, id: '1-6-0' },
      { suit: 1, num: 7, id: '1-7-0' },
      { suit: 1, num: 8, id: '1-8-0' },
      { suit: 1, num: 9, id: '1-9-0' },
      { suit: 2, num: 1, id: '2-1-0' },
      { suit: 2, num: 2, id: '2-2-0' },
      { suit: 2, num: 3, id: '2-3-0' },
      { suit: 2, num: 4, id: '2-4-0' },
      { suit: 2, num: 5, id: '2-5-0' },
      { suit: 2, num: 6, id: '2-6-0' },
    ];
    expect(checkHu(hand)).toBe(false);
  });
});

describe('对子查找 (findPairs)', () => {
  it('找到所有对子', () => {
    const hand: Tile[] = [
      { suit: 1, num: 1, id: '1-1-0' },
      { suit: 1, num: 1, id: '1-1-1' },
      { suit: 1, num: 2, id: '1-2-0' },
      { suit: 1, num: 2, id: '1-2-1' },
      { suit: 1, num: 3, id: '1-3-0' },
    ];
    const pairs = findPairs(hand);
    expect(pairs).toHaveLength(2);
  });

  it('没有对子返回空数组', () => {
    const hand: Tile[] = [
      { suit: 1, num: 1, id: '1-1-0' },
      { suit: 1, num: 2, id: '1-2-0' },
      { suit: 1, num: 3, id: '1-3-0' },
    ];
    const pairs = findPairs(hand);
    expect(pairs).toHaveLength(0);
  });
});
