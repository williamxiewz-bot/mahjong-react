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
  type Tile
} from './mahjongGame'

describe('麻将游戏核心逻辑', () => {
  describe('createTiles', () => {
    it('应该创建136张牌', () => {
      const tiles = createTiles()
      expect(tiles).toHaveLength(136)
    })

    it('应该包含万子(1-9)各4张', () => {
      const tiles = createTiles()
      const wanTiles = tiles.filter(t => t.suit === 1)
      expect(wanTiles).toHaveLength(36) // 9 * 4
      const counts = new Set(wanTiles.map(t => t.num))
      expect(counts.size).toBe(9)
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

  describe('checkHu', () => {
    beforeEach(() => {
      clearHuCache()
    })

    it('13张牌时不应该胡牌', () => {
      const hand: Tile[] = Array(13).fill(null).map((_, i) => ({
        suit: 1,
        num: (i % 9) + 1,
        id: `1-${(i % 9) + 1}-${i}`
      }))
      expect(checkHu(hand)).toBe(false)
    })

    it('14张牌且符合胡牌规则时应该胡牌', () => {
      // 搭子+搭子+搭子+搭子+将牌
      const hand: Tile[] = [
        // 111 222 333 444 + 55
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
        { suit: 2, num: 5, id: '2-5-1' }, // 将牌
      ]
      expect(checkHu(hand)).toBe(true)
    })

    it('七对子应该胡牌', () => {
      // 七对子
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
})
