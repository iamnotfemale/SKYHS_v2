import { create } from 'zustand'
import {
  SRCQ, SRCLABEL,
  CHAR_EVIDENCE_MULT,
  INTERP_BASE, INTERP_BAD_PENALTY, INTERP_CONTRA_FACTOR,
  getScenarioData,
} from '../data/gameContent'

// ?demo=1 → 주사위 결정론 모드 (시연용)
const DEMO = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('demo')

const scenarioData = (scenario) => {
  const d = getScenarioData(scenario)
  return {
    turns:       d.turns,
    scoreTable:  d.scoreTable,
    reveal:      d.reveal,
    priceSeries: d.priceSeries,
    entry:       d.entryPrice,
    invested:    d.invested,
  }
}

const initialState = {
  screen:            'start',
  char:              'kim',
  scenario:          'doge',
  turn:              0,
  trust:             45,
  startTrust:        45,
  pity:              false,          // 직전 턴 주사위 실패 시 다음 턴 판정 +8 (연속 억울함 방지)
  phase:             'advice',      // instinct → advice → evidence → (intervention) → result
  advice:            null,
  customAdvice:      null,           // 자유 입력 조언 원문 (LLM이 방향만 분류, 채점은 코드)
  result:            null,
  stage:             0,
  hist:              [],
  opened:            [],
  help:              null,
  blew:              false,
  tradeIdx:          null,
  difficulty:        '보통',
  fixedDice:         DEMO,
  selectedEvidences: [],             // [{src, idx}] — idx는 해석 카드 인덱스 (레거시 시나리오는 null)
  // 포지션 모델
  units:             0,              // 보유 수량 (투자금/진입가)
  cash:              0,              // 현금화된 금액 (만원)
  investedTotal:     0,              // 누적 투입 원금 (만원)
  // 스트라이크 & 긴급개입
  strikes:           0,
  interventionUsed:  false,
  pending:           null,           // 긴급개입 대기 중인 result
  interventionOptions: [],
  // 본능 체크
  instincts:         [],             // [{turn, pick, trap}]
  // 튜토리얼 (첫 판 온보딩 오버레이)
  tutorial:          false,
  tutorialStep:      0,
}

export const useGameStore = create((set, get) => {

  // ─── 결과 확정: 포지션·스트라이크·기록 반영 + 스테이지 타이머 ───
  const finalize = (result, ctx) => {
    const s = get()
    const { priceSeries } = scenarioData(s.scenario)
    const invested0 = scenarioData(s.scenario).invested

    let { units, cash, investedTotal, strikes, tradeIdx } = s
    let blew = false
    let strikeAction = null
    const price = result.price

    // ── 이번 턴 실제 매매 결정 ──
    // good = 조언을 그대로 실행 · near = 동요만(매매 없음) · panic = 충동대로
    let side = 'none', frac = 0
    if (result.outcome === 'panic') {
      if (result.panicAction === 'sell') {
        // 패닉셀 — 저점 실현손실. 스트라이크 누적, 2차에 게임오버.
        strikeAction = strikes === 0 ? 'partial' : 'full'
        frac  = strikeAction === 'partial' ? 0.5 : 1
        side  = 'sell'
        if (strikeAction === 'partial') strikes = 1
        else { strikes = 2; blew = true; tradeIdx = ctx.revealIdx }
      } else {
        // FOMO 매수 — 게임오버 없음. 현금을 코인에 쏟아부을 뿐(과다 노출).
        // 대가는 엔딩에서: 안 팔고 버틴 코인이 SNL 폭락을 맞는다. 스트라이크 카운트 안 함.
        strikeAction = 'fomo'
        frac = 0.5   // 매번 실탄의 일부를 추격 (남으면 다음에 또)
        side = 'buy'
      }
    } else if (result.outcome === 'good') {
      if      (result.dir === 'sell')         { side = 'sell'; frac = 1 }
      else if (result.dir === 'partial_sell') { side = 'sell'; frac = 0.5 }
      else if (result.dir === 'partial_buy')  { side = 'buy';  frac = 0.5 }
      else if (result.dir === 'buy')          { side = 'buy';  frac = 1 }
      // hold → 매매 없음
    }

    // ── 매매 집행 (금액은 만원 단위) ──
    // 매수는 보유 현금(실탄)에서만 — 빚투 없음. 현금이 없으면 추격은 불발된다.
    let traded = null
    if (side === 'sell' && units > 0) {
      const qty = units * frac
      const krw = qty * price
      cash += krw; units -= qty
      traded = { side: 'sell', krw, frac }
    } else if (side === 'buy') {
      const want  = invested0 * frac
      const spend = Math.min(cash, want)
      if (spend > 0) {
        units += spend / price; cash -= spend
        traded = { side: 'buy', krw: spend, frac, capped: spend < want - 0.5 }
      } else {
        result.buyFizzled = true   // 실탄 소진 — 사고 싶어도 못 삼
      }
    }

    result.strikes = strikes
    result.strikeAction = strikeAction
    result.traded = traded

    set(prev => ({
      phase: 'result', stage: 0, result,
      trust: result.tA, blew,
      pity: !result.rational,
      units, cash, investedTotal, strikes, tradeIdx,
      pending: null, interventionOptions: [],
      selectedEvidences: [],
      hist: [...prev.hist, {
        turnIdx: s.turn,
        advice: result.advice, dir: result.dir, q: result.q, delta: result.delta, src: result.src,
        outcome: result.outcome, evidences: result.evidences,
        greed: result.panicAction === 'buy', panicAction: result.panicAction,
        traded, tB: result.tB, tA: result.tA,
        intervention: result.intervention,
      }],
      opened: prev.opened.includes(ctx.concept) ? prev.opened : [...prev.opened, ctx.concept],
    }))

    setTimeout(() => set({ stage: 1 }), 850)
    setTimeout(() => set({ stage: 2 }), 1800)
    setTimeout(() => set({ stage: 3 }), 2550)
  }

  return {
    ...initialState,

    actions: {
      receive:   () => set({ screen: 'select' }),
      restart:   () => set({ ...initialState, screen: 'start' }),
      backToSelect: () => set({ screen: 'select', tutorial: false, tutorialStep: 0 }),
      selChar:   (id) => set({ char: id }),
      selScen:   (id) => set({ scenario: id }),
      startGame: () => set(s => {
        const { turns, entry, invested } = scenarioData(s.scenario)
        return {
          ...initialState,
          char: s.char, scenario: s.scenario, screen: 'main',
          trust: 45, startTrust: 45,
          phase: turns[0].instinct ? 'instinct' : 'advice',
          // 코인(invested만원어치) + 현금 실탄(invested만원). 원금 총액 = 2×invested
          units: invested / entry, cash: invested, investedTotal: invested * 2,
          fixedDice: s.fixedDice,
          tutorial: true, tutorialStep: 0,
        }
      }),

      nextTutorialStep: () => set(s => s.tutorial ? { tutorialStep: s.tutorialStep + 1 } : {}),
      finishTutorial:   () => set(s => {
        if (!s.tutorial) return {}
        const { turns } = scenarioData(s.scenario)
        const nextTurn  = Math.min(s.turn + 1, turns.length - 1)
        return {
          tutorial: false, tutorialStep: 0,
          turn: nextTurn,
          phase: turns[nextTurn].instinct ? 'instinct' : 'advice',
          advice: null, customAdvice: null, result: null, stage: 0, help: null, selectedEvidences: [],
        }
      }),
      openHelp:  (k) => set(s => ({ help: k, opened: s.opened.includes(k) ? s.opened : [...s.opened, k] })),
      closeHelp: () => set({ help: null }),

      // 본능 체크 — 점수 무관, 기록만
      pickInstinct: (pick) => set(s => {
        if (s.phase !== 'instinct') return {}
        const { turns } = scenarioData(s.scenario)
        const t = turns[s.turn]
        return {
          phase: 'advice',
          instincts: [...s.instincts, { turn: s.turn, pick, trap: t.panicAction }],
        }
      }),

      pickAdvice:     (id) => set(s => s.phase === 'advice' ? { advice: id, customAdvice: null, phase: 'evidence' } : {}),
      pickAdviceFree: (dir, text) => set(s => s.phase === 'advice' ? { advice: dir, customAdvice: text, phase: 'evidence' } : {}),
      resetAdvice:    ()   => set(s => s.phase === 'evidence' ? { advice: null, customAdvice: null, phase: 'advice', selectedEvidences: [] } : {}),

      // 근거(해석 카드) 선택 — 소스당 1개, 최대 3개
      toggleEvidence: (src, idx = null) => {
        const s = get()
        if (s.phase !== 'evidence') return
        const cur = s.selectedEvidences
        const existing = cur.find(e => e.src === src)
        if (existing && existing.idx === idx) {
          set({ selectedEvidences: cur.filter(e => e.src !== src) })
        } else if (existing) {
          set({ selectedEvidences: cur.map(e => e.src === src ? { src, idx } : e) })
        } else if (cur.length < 3) {
          set({ selectedEvidences: [...cur, { src, idx }] })
        }
      },

      submitEvidence: () => {
        const s = get()
        if (s.phase !== 'evidence' || s.selectedEvidences.length === 0) return

        const { turns, scoreTable, reveal, priceSeries } = scenarioData(s.scenario)
        const t     = turns[s.turn]
        const found = t.advices.find(a => a.id === s.advice)
        const adv   = s.customAdvice ? { ...found, label: s.customAdvice } : found
        const useInterps = !!t.interps

        const diffUp = { 쉬움: 1.15, 보통: 1, 어려움: 0.85 }
        const diffDn = { 쉬움: 0.80, 보통: 1, 어려움: 1.20 }
        const weights = [1, 0.5, 0.25]
        const charMult = CHAR_EVIDENCE_MULT[s.char] || {}

        const rawDeltas = s.selectedEvidences.map(sel => {
          let d, q, text = null, supports = null
          if (useInterps) {
            const interp = t.interps[sel.src][sel.idx]
            q = interp.q; text = interp.text
            if (interp.q === 'bad') {
              d = INTERP_BAD_PENALTY; supports = 'bad'
            } else {
              const base = INTERP_BASE[interp.q]
              const aligned = (interp.dirs || []).includes(adv.dir)
              // 신중한 실수(분할)는 무모한 실수(전량)보다 덜 깎인다 — "조금만"이 "다"보다 낫도록
              const contraFactor = (adv.dir === 'partial_buy' || adv.dir === 'partial_sell') ? 0.35 : INTERP_CONTRA_FACTOR
              d = aligned ? base : -Math.round(base * contraFactor)
              supports = aligned ? 'support' : 'contra'
            }
          } else {
            q = SRCQ[sel.src]
            d = scoreTable[adv.dir][q]
          }
          d = Math.round(d > 0 ? d * diffUp[s.difficulty] : d * diffDn[s.difficulty])
          // 캐릭터 선호 배율은 플러스에만 — 벌점은 예측 가능하게 고정
          const cm = charMult[sel.src] ?? 1.0
          if (d > 0) d = Math.round(d * cm)
          return { src: sel.src, idx: sel.idx, q, text, supports, rawDelta: d, charMult: cm }
        })

        const sorted = [...rawDeltas].sort((a, b) => Math.abs(b.rawDelta) - Math.abs(a.rawDelta))

        let totalDelta = 0
        const evidences = sorted.map((e, i) => {
          const w  = weights[i]
          const wd = Math.round(e.rawDelta * w)
          totalDelta += wd
          return { ...e, weight: w, weightedDelta: wd }
        })
        totalDelta = Math.round(totalDelta)

        const tB = s.trust
        const tA = Math.max(5, Math.min(95, tB + totalDelta))
        // 동정 보정: 직전 턴 주사위 실패였으면 이번 판정만 +8 (표시 신뢰도는 그대로)
        const pityBonus = s.pity ? 8 : 0
        const effT = Math.min(97, tA + pityBonus)
        const roll = s.fixedDice
          ? (effT >= 50 ? Math.max(2, effT - 18) : Math.min(98, effT + 18))
          : Math.floor(Math.random() * 100)
        const rational = roll < effT
        // 패닉 문턱 — 이 값 이상이면 실패해도 '동요(무해)', 미만이면 '패닉'.
        // 시작 신뢰도(45)보다 낮게 둬서 한 번의 실수는 회복 가능하게.
        const floor    = { 쉬움: 32, 보통: 40, 어려움: 48 }[s.difficulty]
        const outcome  = rational ? 'good' : (tA >= floor ? 'near' : 'panic')

        const primary   = evidences[0]
        const revealIdx = reveal[s.turn]
        const price     = priceSeries[revealIdx]
        const concept   = primary.src === 'fgi'    ? 'fgi'
                        : primary.src === 'chart'  ? t.chartConcept
                        : primary.src === 'news'   ? t.newsConcept
                        : 'herd'

        const result = {
          advice: adv.label, dir: adv.dir,
          src: primary.src, srcLabel: SRCLABEL[primary.src], q: primary.q,
          delta: totalDelta, evidences,
          tB, tA, roll, rational, pityBonus,
          outcome, price, panicAction: t.panicAction,
          reflect: t.reflect[outcome],
          intervention: null,
        }

        // 긴급개입은 '말리려 했을 때'만 — 조언이 충동과 같은 방향(매수 권유+매수 폭주)이면
        // 개입이 아니라 "당신 조언이 불을 질렀다"로 바로 간다.
        const calmDirs    = t.panicAction === 'buy' ? ['hold', 'sell', 'partial_sell'] : ['hold', 'buy', 'partial_buy']
        const triedToCalm = calmDirs.includes(adv.dir)

        // 패닉 + 말리려던 조언 + 개입 미사용 + 해석 시스템 → 마지막 설득 기회
        if (outcome === 'panic' && triedToCalm && !s.interventionUsed && useInterps) {
          const usedSrcs = s.selectedEvidences.map(e => e.src)
          const options = Object.entries(t.interps)
            .filter(([src]) => !usedSrcs.includes(src))
            .flatMap(([src, interps]) => interps.map((it, idx) => ({ src, idx, text: it.text })))
          set({ phase: 'intervention', pending: { result, ctx: { revealIdx, concept } }, interventionOptions: options, interventionUsed: true })
          return
        }

        finalize(result, { revealIdx, concept })
      },

      // 긴급개입 — 올바른(best/strong) + 패닉을 말리는 방향의 해석이어야 성공. 무작위 없음.
      attemptIntervention: (src, idx) => {
        const s = get()
        if (s.phase !== 'intervention' || !s.pending) return
        const { turns } = scenarioData(s.scenario)
        const t = turns[s.turn]
        const interp = t.interps[src][idx]
        const { result, ctx } = s.pending

        const calmDirs = result.panicAction === 'buy'
          ? ['hold', 'sell', 'partial_sell']
          : ['hold', 'partial_buy', 'buy']
        const success = (interp.q === 'best' || interp.q === 'strong')
          && (interp.dirs || []).some(d => calmDirs.includes(d))

        if (success) {
          result.outcome = 'near'
          result.tA = Math.min(95, result.tA + 5)
          result.reflect = t.reflect.near
        }
        result.intervention = { attempted: true, success, text: interp.text, srcLabel: SRCLABEL[src] }
        finalize(result, ctx)
      },

      skipIntervention: () => {
        const s = get()
        if (s.phase !== 'intervention' || !s.pending) return
        const { result, ctx } = s.pending
        result.intervention = { attempted: false, success: false }
        finalize(result, ctx)
      },

      next: () => {
        const s = get()
        const { turns } = scenarioData(s.scenario)
        if (s.blew || s.turn >= turns.length - 1) {
          set({ screen: 'ending' })
        } else {
          const nextTurn = s.turn + 1
          set({
            turn: nextTurn,
            phase: turns[nextTurn].instinct ? 'instinct' : 'advice',
            advice: null, customAdvice: null, result: null, stage: 0, help: null, selectedEvidences: [],
          })
        }
      },
    },
  }
})
