import { useGameStore } from '../store/gameStore'
import { DICT, CHARACTERS, SRCLABEL, PRICE_SERIES, ENTRY_PRICE, INVESTED, PLAYED_LEN, FTX_DATES } from '../data/gameContent'
import { DOGE_FULL } from '../data/marketData'

const DIR_LABEL = { sell:'전량 매도', partial_sell:'분할 매도', hold:'관망', partial_buy:'분할 매수', buy:'추격 매수' }
const OUTCOME_META = {
  good:  { label: '설득 성공',   color: '#27865e', bg: '#e7f4ee' },
  near:  { label: '가까스로',    color: '#b67e1f', bg: '#fbf3e3' },
  panic: { label: '폭주',        color: '#c0473d', bg: '#fbeceb' },
}

// 턴별 "왜 좋았나/아쉬웠나" 판정 — 근거 구성 + 결과로 문장 생성
function turnVerdict(h) {
  const evs    = h.evidences || []
  const strong = evs.filter(e => e.q === 'best' || e.q === 'strong').length
  const bad    = evs.filter(e => e.supports === 'bad').length
  const contra = evs.filter(e => e.supports === 'contra').length
  if (h.outcome === 'panic') {
    if (h.intervention?.attempted && !h.intervention.success)
      return '설득도, 마지막 개입도 실패 — ' + (h.greed ? 'FOMO 폭주를 막지 못함' : '패닉셀을 막지 못함')
    return '신뢰가 무너져 ' + (h.greed ? 'FOMO 추격매수로 폭주' : '패닉셀로 투매')
  }
  if (h.outcome === 'near') {
    if (h.intervention?.success) return '주사위는 실패했지만 마지막 개입으로 가까스로 진정'
    return bad + contra > 0 ? '근거가 약해 흔들렸지만 사고는 면함' : '아슬아슬하게 막아냄'
  }
  // good
  if (bad > 0)    return '통했지만 오독한 근거가 섞임 — 운이 따른 판단'
  if (contra > 0) return '통했지만 근거와 조언이 어긋남 — 논리가 흔들림'
  if (strong >= 2) return '강한 근거 두 개로 정확히 설득 — 교과서적 판단'
  if (strong === 1) return '핵심 근거를 짚어 설득 성공'
  return '설득 성공'
}

function won(n) {
  return Math.round(Math.abs(n)).toLocaleString('ko-KR')
}

// ─── DOGE: SNL 이후 실제 낙폭 (5/8 종가 → 5/31 종가) ───────
const DOGE_PLAYED = 12
const SNL_IDX     = 12
const SNL_CLOSE   = DOGE_FULL[SNL_IDX]
const DOGE_END    = DOGE_FULL[DOGE_FULL.length - 1]
const SNL_DROP    = Math.round((DOGE_END / SNL_CLOSE - 1) * 100)

// ─── FTX: 11/17(마지막 플레이) 이후 흐름 (11/20 → 11/22) ──
const FTX_EVENT_IDX = 11   // 11/20
const FTX_END_IDX   = 12   // 11/22
const FTX_EVENT_CLOSE = PRICE_SERIES[FTX_EVENT_IDX]
const FTX_END_CLOSE   = PRICE_SERIES[FTX_END_IDX]
const FTX_DROP = Math.round((FTX_END_CLOSE / PRICE_SERIES[PLAYED_LEN - 1] - 1) * 100)

const SCENARIO_META = {
  doge: {
    label: 'DOGE 2021',
    series: DOGE_FULL,
    played: DOGE_PLAYED,
    eventIdx: SNL_IDX,
    entryCaption: '3/31 진입',
    eventTag: 'SNL 에필로그 · 2021.05.08',
    eventDayLabel: 'SNL 당일 (5/8)',
    aheadLabel: '5월 말까지 갔다면',
    eventNote: `SNL 이후 DOGE: ${SNL_CLOSE}원(5/8) → ${DOGE_END}원(5/31), ${SNL_DROP}%`,
    chartEventLabel: 'SNL',
    chartFooterEvent: `5/8 SNL 후 ${SNL_DROP}%`,
    // 트랩 방향: FOMO(고점 매수). "많이 들고 있을수록" 위험 — exposure가 낮을수록 좋다.
    trapIsBuy: true,
    epilogue: (charName, exposure, exposurePct, blew) => {
      if (blew) return {
        emoji: '📉', title: `${charName}, 바닥에서 던졌습니다`,
        story: `조정 국면의 공포를 못 이긴 ${charName}은(는) 저점에서 전량 패닉셀했습니다. 아이러니하게도 도지코인은 그 뒤 SNL 방영일 ${SNL_CLOSE}원까지 더 치솟았습니다 — 던지지만 않았어도 잡을 수 있던 반등이었죠.`,
        color: '#c0473d', bg: '#fbeceb',
      }
      if (exposure <= 0.45) return {
        emoji: '🎯', title: '고점 폭락을 피했습니다',
        story: `${charName}은(는) SNL 전에 코인 대부분을 익절해 현금으로 옮겼습니다(종료 시 코인 비중 ${exposurePct}%). 도지코인은 방영 당일 ${SNL_CLOSE}원까지 치솟았다가 머스크의 '허슬(사기)' 한마디에 방영 중 -30%, 한 달 만에 ${SNL_DROP}% 폭락했지만 — 그는 이미 빠져나온 뒤였습니다.`,
        color: '#27865e', bg: '#e7f4ee',
      }
      if (exposure <= 0.75) return {
        emoji: '⚖️', title: '절반은 지켰습니다',
        story: `${charName}은(는) 일부만 익절하고 코인 ${exposurePct}%를 든 채 SNL을 맞았습니다. 방영과 함께 ${SNL_DROP}% 폭락이 시작됐지만, 미리 덜어낸 절반 덕에 치명상은 면했습니다.`,
        color: '#b67e1f', bg: '#fbf3e3',
      }
      return {
        emoji: '📉', title: 'SNL 폭락을 그대로 맞았습니다',
        story: `${charName}은(는) 고점 물량을 거의 팔지 않고 코인 ${exposurePct}%를 든 채 SNL을 맞았습니다. 머스크가 '허슬'이라 하자 방영 중 -30%, 한 달 만에 ${SNL_DROP}%로 추락 — 많이 산 게 죄가 아니라, 취해서 안 판 게 죄였습니다.`,
        color: '#c0473d', bg: '#fbeceb',
      }
    },
    verdict: (charName, exposure, exposurePct, blew, coherence) => {
      if (blew) return {
        color: '#c0473d', bg: '#fbeceb', title: '패닉을 막지 못했습니다',
        sub: `조정 국면에서 ${charName}의 패닉셀을 막지 못했습니다. SNL 카탈리스트가 남아있었는데도요.`,
        mirrorTitle: '공포도 탐욕만큼 비이성적입니다',
        mirrorBody: "하락할 때 '손절하는 게 맞지 않을까' 싶어지는 건 자연스럽습니다. 그 감각이 당신 근거 선택에도 영향을 미쳤을 거예요.",
        mirrorIrony: '바닥에서 던지는 건 고점에서 사는 것만큼 비싼 실수입니다.',
      }
      if (exposure > 0.75) return {
        color: '#c0473d', bg: '#fbeceb', title: '팔지 못하고 폭락을 맞았습니다',
        sub: `${charName}은(는) 고점 물량을 거의 든 채(코인 ${exposurePct}%) SNL 크래시를 그대로 맞았습니다. 많이 산 게 아니라, 취해서 안 판 게 문제였어요.`,
        mirrorTitle: '살 땐 과감했지만 팔 줄은 몰랐습니다',
        mirrorBody: 'FOMO의 진짜 대가는 사는 순간이 아니라 안 파는 순간에 청구됩니다.',
        mirrorIrony: '당신의 계좌였다면, 두 배 오른 그 코인을 미련 없이 팔 수 있었을까요?',
      }
      if (coherence >= 60) return {
        color: '#27865e', bg: '#e7f4ee', title: '설득에 성공했습니다',
        sub: `${charName}은(는) 끝까지 이성을 유지했어요. 강한 근거로 신뢰도를 높게 유지한 당신 덕분입니다.`,
        mirrorTitle: '당신은 공탐지수로 말했습니다',
        mirrorBody: `탐욕장 한복판에서 '지표를 보자'고 말하는 건 쉽지 않습니다. 분위기보다 숫자로 설득한 당신이 있었기에 ${charName}은(는) SNL 전에 익절할 수 있었습니다.`,
        mirrorIrony: "그런데 — 똑같은 상황이 '당신의' 계좌였다면, 이만큼 근거대로 움직일 수 있었을까요?",
      }
      return {
        color: '#b67e1f', bg: '#fbf3e3', title: '아슬아슬하게 버텼습니다',
        sub: `${charName}은(는) 가까스로 사고를 면했어요. 다만 강한 근거보다 분위기에 기댄 순간이 많았습니다.`,
        mirrorTitle: '운과 근거 사이',
        mirrorBody: '몇 번은 공탐지수와 차트로, 몇 번은 뉴스 분위기로 설득했습니다. 이번엔 주사위가 맞았지만, 다음엔 분위기 근거를 한 번 더 골랐을 때 어떻게 될지 모릅니다.',
        mirrorIrony: '남에겐 "숫자를 보라"고 했죠. 그 말, 다음엔 당신 선택에도 적용해보세요.',
      }
    },
    presentLabel: '5/3 기준 평가손익',
    realEventText: 'DOGE 광풍은 2021년 4~5월에 실제로 일어난 일입니다.',
    nextScenarioText: <>다음엔 <b style={{ color: '#1e232b' }}>'22년 거래소 파산'</b> 시나리오에서 <b style={{ color: '#1e232b' }}>공포장</b>도 경험해보세요.</>,
  },
  ftx: {
    label: 'FTX 2022',
    series: PRICE_SERIES,
    played: PLAYED_LEN,
    eventIdx: FTX_EVENT_IDX,
    entryCaption: '11/7 진입',
    eventTag: '그 이후 · 2022.11.20~22',
    eventDayLabel: '11/20 시점',
    aheadLabel: '11/22까지 갔다면',
    eventNote: `11/17(${PRICE_SERIES[PLAYED_LEN - 1]}만원) 이후: 11/20 ${FTX_EVENT_CLOSE}만원 → 11/22 ${FTX_END_CLOSE}만원, ${FTX_DROP}%`,
    chartEventLabel: '11/20',
    chartFooterEvent: `11/17 이후 ${FTX_DROP}%`,
    // 트랩 방향: 패닉셀(저점 매도). "많이 팔았을수록(exposure 낮을수록)" 위험 — exposure가 높을수록(안 팔았을수록) 좋다.
    trapIsBuy: false,
    epilogue: (charName, exposure, exposurePct, blew) => {
      if (blew) return {
        emoji: '📉', title: `${charName}, 바닥에서 던졌습니다`,
        story: `극단적 공포 구간을 못 이긴 ${charName}은(는) 저점 근처에서 전량 패닉셀했습니다. 이후 시장은 11/20 ${FTX_EVENT_CLOSE}만원, 11/22 ${FTX_END_CLOSE}만원으로 뚜렷한 반등 없이 완만히 더 흘러내렸습니다 — 던지고 나서도 편해지지 않는 하락이었죠.`,
        color: '#c0473d', bg: '#fbeceb',
      }
      if (exposure >= 0.75) return {
        emoji: '🎯', title: '패닉을 이겨내고 버텼습니다',
        story: `${charName}은(는) 극단적 공포 구간에서도 전량 매도하지 않았습니다(종료 시 코인 비중 ${exposurePct}%). 11/17 이후 시장은 11/20 ${FTX_EVENT_CLOSE}만원, 11/22 ${FTX_END_CLOSE}만원으로 여전히 완만한 약세였지만, 바닥에서 던지지 않은 것만으로 최악은 피했습니다.`,
        color: '#27865e', bg: '#e7f4ee',
      }
      if (exposure >= 0.45) return {
        emoji: '⚖️', title: '절반은 지켰습니다',
        story: `${charName}은(는) 일부만 손절하고 코인 ${exposurePct}%를 든 채 버텼습니다. 이후 시장도 뚜렷한 회복 없이 완만히 흘러내렸지만(${FTX_DROP}%), 무너지지 않고 남은 절반을 지켰습니다.`,
        color: '#b67e1f', bg: '#fbf3e3',
      }
      return {
        emoji: '📉', title: '공포에 대부분을 정리했습니다',
        story: `${charName}은(는) 반복된 공포에 물량 대부분을 손절해 코인 비중이 ${exposurePct}%까지 줄었습니다. 이후 시장은 뚜렷한 반등 없이 완만히 더 흘러내렸지만(${FTX_DROP}%), 이미 바닥 근처에서 던진 뒤였습니다.`,
        color: '#c0473d', bg: '#fbeceb',
      }
    },
    verdict: (charName, exposure, exposurePct, blew, coherence) => {
      if (blew) return {
        color: '#c0473d', bg: '#fbeceb', title: '패닉을 막지 못했습니다',
        sub: `극단적 공포 구간에서 ${charName}의 패닉셀을 막지 못했습니다. 완만한 회복 조짐이 남아있었는데도요.`,
        mirrorTitle: '공포는 언제나 가장 그럴듯한 이유를 데려옵니다',
        mirrorBody: "하락할 때 '지금이라도 정리하는 게 맞지 않을까' 싶어지는 건 자연스럽습니다. 그 감각이 당신 근거 선택에도 영향을 미쳤을 거예요.",
        mirrorIrony: '바닥에서 던지는 건 고점에서 사는 것만큼 비싼 실수입니다.',
      }
      if (exposure < 0.45) return {
        color: '#c0473d', bg: '#fbeceb', title: '공포에 대부분을 내줬습니다',
        sub: `${charName}은(는) 반복된 패닉에 물량 대부분을 손절했습니다(코인 비중 ${exposurePct}%). 완전히 무너지진 않았지만, 공포에 너무 많이 양보했어요.`,
        mirrorTitle: '버틸 줄은 몰랐지만 팔 줄만 알았습니다',
        mirrorBody: '패닉셀의 진짜 대가는 던지는 순간이 아니라, 그 뒤로 다시 담지 못하는 데서 청구됩니다.',
        mirrorIrony: '당신의 계좌였다면, 그 공포 속에서 절반이라도 지킬 수 있었을까요?',
      }
      if (coherence >= 60) return {
        color: '#27865e', bg: '#e7f4ee', title: '설득에 성공했습니다',
        sub: `${charName}은(는) 끝까지 이성을 유지했어요. 강한 근거로 신뢰도를 높게 유지한 당신 덕분입니다.`,
        mirrorTitle: '당신은 공탐지수로 말했습니다',
        mirrorBody: `공포장 한복판에서 '지표를 보자'고 말하는 건 쉽지 않습니다. 분위기보다 숫자로 설득한 당신이 있었기에 ${charName}은(는) 바닥에서 던지지 않을 수 있었습니다.`,
        mirrorIrony: "그런데 — 똑같은 상황이 '당신의' 계좌였다면, 이만큼 근거대로 버틸 수 있었을까요?",
      }
      return {
        color: '#b67e1f', bg: '#fbf3e3', title: '아슬아슬하게 버텼습니다',
        sub: `${charName}은(는) 가까스로 사고를 면했어요. 다만 강한 근거보다 분위기에 기댄 순간이 많았습니다.`,
        mirrorTitle: '운과 근거 사이',
        mirrorBody: '몇 번은 공탐지수와 차트로, 몇 번은 뉴스 분위기로 설득했습니다. 이번엔 주사위가 맞았지만, 다음엔 분위기 근거를 한 번 더 골랐을 때 어떻게 될지 모릅니다.',
        mirrorIrony: '남에겐 "숫자를 보라"고 했죠. 그 말, 다음엔 당신 선택에도 적용해보세요.',
      }
    },
    presentLabel: '11/17 기준 평가손익',
    realEventText: 'FTX 파산은 2022년 11월에 실제로 일어난 일입니다.',
    nextScenarioText: <>다음엔 <b style={{ color: '#1e232b' }}>'21년 도지코인 광풍'</b> 시나리오에서 <b style={{ color: '#1e232b' }}>탐욕장</b>도 경험해보세요.</>,
  },
}

function buildChart(series) {
  const W = 320, H = 160, pad = { top: 14, right: 16, bottom: 24, left: 8 }
  const min = Math.min(...series)
  const max = Math.max(...series)
  const xs = i => pad.left + (i / (series.length - 1)) * (W - pad.left - pad.right)
  const ys = p => pad.top + (1 - (p - min) / (max - min)) * (H - pad.top - pad.bottom)
  return { xs, ys, series, W, H }
}

export default function EndingScreen() {
  const hist       = useGameStore(s => s.hist)
  const trust      = useGameStore(s => s.trust)
  const startTrust = useGameStore(s => s.startTrust)
  const blew       = useGameStore(s => s.blew)
  const tradeIdx   = useGameStore(s => s.tradeIdx)
  const opened     = useGameStore(s => s.opened)
  const result     = useGameStore(s => s.result)
  const char       = useGameStore(s => s.char)
  const scenario   = useGameStore(s => s.scenario)
  const units      = useGameStore(s => s.units)
  const cash       = useGameStore(s => s.cash)
  const investedTotal = useGameStore(s => s.investedTotal)
  const strikes    = useGameStore(s => s.strikes)
  const instincts  = useGameStore(s => s.instincts)
  const actions    = useGameStore(s => s.actions)

  const charName = CHARACTERS.find(c => c.id === char)?.name || '김불안'
  const meta = SCENARIO_META[scenario] || SCENARIO_META.doge

  // ─── 차트 ───────────────────────────────────────────
  const { xs, ys, series, W, H } = buildChart(meta.series)

  const playedPts = series.slice(0, meta.played)
    .map((p, i) => `${xs(i).toFixed(1)},${ys(p).toFixed(1)}`).join(' ')

  const futurePts = series.slice(meta.played - 1)
    .map((p, i) => `${xs(i + meta.played - 1).toFixed(1)},${ys(p).toFixed(1)}`).join(' ')

  // 게임 종료 도트
  const dotIdx   = blew ? (tradeIdx ?? meta.played - 1) : meta.played - 1
  const dotColor = blew ? '#d65a4e' : '#27865e'

  // 에필로그 이벤트 수직선 x 위치
  const eventX = xs(meta.eventIdx)
  const eventY = ys(series[meta.eventIdx])

  // ─── 자산 계산 — 포지션 모델 (스트라이크로 잘린 수량·현금 반영) ───
  const heldVal = (price) => units * price + cash
  const pnlAt   = (price) => heldVal(price) - investedTotal

  const presentPnl = pnlAt(series[meta.played - 1])
  const eventPnl   = pnlAt(series[meta.eventIdx])
  const aheadPnl   = pnlAt(series[series.length - 1])
  const lockedPnl  = tradeIdx != null ? pnlAt(series[tradeIdx]) : null

  const fmt = n => `${n >= 0 ? '+' : '-'}${won(n)}만원`

  // ─── 근거 통계 (다중근거 호환) ─────────────────────────
  const allEvidences = hist.flatMap(h =>
    h.evidences ? h.evidences : (h.q ? [{ q: h.q }] : [])
  )
  const total      = Math.max(1, allEvidences.length)
  const strongCount = allEvidences.filter(e => e.q === 'best' || e.q === 'strong').length
  const socialCount = allEvidences.filter(e => e.q === 'weak' || e.q === 'bad' || e.q === 'social' || e.q === 'news').length
  const strongPct  = Math.round(strongCount / total * 100)
  const socialPct  = Math.round(socialCount / total * 100)
  const goodCombo  = hist.filter(h => (h.totalDelta ?? h.delta ?? 0) > 0).length
  const coherence  = Math.round(goodCombo / Math.max(1, hist.length) * 100)
  const trustGain  = (trust ?? startTrust) - startTrust
  const buyBlow    = blew && result?.panicAction === 'buy'

  // ─── 데이터 거울 — 탐욕/공포 구간별 근거 품질 + 본능 체크 ───
  const strongRatio = evs => {
    if (!evs.length) return null
    return Math.round(evs.filter(e => e.q === 'best' || e.q === 'strong').length / evs.length * 100)
  }
  const greedStrong = strongRatio(hist.filter(h => h.greed).flatMap(h => h.evidences || []))
  const fearStrong  = strongRatio(hist.filter(h => h.greed === false).flatMap(h => h.evidences || []))

  let greedFearLine = null
  if (greedStrong != null && fearStrong != null) {
    if (greedStrong >= fearStrong + 15)
      greedFearLine = `탐욕 구간에선 강한 근거 ${greedStrong}%로 냉정했지만, 공포 구간에선 ${fearStrong}%로 흔들렸습니다. 당신을 무너뜨리는 건 탐욕보다 공포입니다.`
    else if (fearStrong >= greedStrong + 15)
      greedFearLine = `공포 구간에선 강한 근거 ${fearStrong}%로 침착했지만, 탐욕 구간에선 ${greedStrong}%에 그쳤습니다. 당신을 흔드는 건 공포보다 탐욕입니다.`
    else
      greedFearLine = `탐욕 구간 ${greedStrong}% · 공포 구간 ${fearStrong}% — 어느 국면에서든 근거의 질이 일정했습니다. 그 일관성이 당신의 무기입니다.`
  }

  const trapped = instincts.filter(i => i.pick === i.trap).length
  let instinctLine = null
  if (instincts.length > 0) {
    instinctLine = trapped === 0
      ? `본능 체크 ${instincts.length}번 — 당신의 본능은 한 번도 ${charName}의 충동과 같은 방향을 가리키지 않았습니다. 드문 일입니다.`
      : `본능 체크 ${instincts.length}번 중 ${trapped}번, 당신의 손도 ${charName}과(와) 같은 버튼 위에 있었습니다. 남을 말리기는 쉽고, 나를 말리기는 어렵습니다.`
  }

  // ─── 게임 종료 시점 코인 노출도 — "안 팔고 얼마나 들고 갔나" ───
  const endCoinVal = units * series[meta.played - 1]
  const endTotal   = Math.max(1, endCoinVal + cash)
  const exposure   = endCoinVal / endTotal          // 0(전량 현금) ~ 1(전량 코인)
  const exposurePct = Math.round(exposure * 100)

  const epilogue = meta.epilogue(charName, exposure, exposurePct, blew)
  const v = meta.verdict(charName, exposure, exposurePct, blew, coherence)

  // 표시할 손익
  const stat1Val   = blew ? fmt(lockedPnl ?? 0) : fmt(presentPnl)
  const stat1Color = blew ? '#d65a4e' : (presentPnl >= 0 ? '#27865e' : '#d65a4e')
  const stat1Label = blew ? (buyBlow ? '게임오버 시점 (고점 물림)' : '게임오버 시점 (패닉셀)') : meta.presentLabel

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '48px 24px', background: '#f7f9fc' }}>
      <div style={{ width: '700px', maxWidth: '100%', animation: 'fadeIn .45s ease' }}>

        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '12px', letterSpacing: '.16em', color: '#9099a6', textTransform: 'uppercase', textAlign: 'center', marginBottom: '4px' }}>
          Game Over · {meta.label}
        </div>

        {/* ───── 0. 에필로그 ───── */}
        <div style={{ background: epilogue.bg, border: `1.5px solid ${epilogue.color}22`, borderRadius: '20px', padding: '24px 28px', marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ fontSize: '28px' }}>{epilogue.emoji}</span>
            <div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', letterSpacing: '.12em', color: epilogue.color, textTransform: 'uppercase', marginBottom: '3px' }}>{meta.eventTag}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: epilogue.color }}>{epilogue.title}</div>
            </div>
          </div>
          <p style={{ fontSize: '14px', lineHeight: 1.75, color: '#2c333f', margin: '0 0 12px' }}>{epilogue.story}</p>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', color: epilogue.color, background: `${epilogue.color}18`, borderRadius: '8px', padding: '7px 12px', display: 'inline-block' }}>
            {meta.eventNote}
          </div>
        </div>

        {/* ───── 1. 결과 카드 ───── */}
        <div style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '20px', padding: '28px', marginTop: '16px', boxShadow: '0 1px 3px rgba(20,30,50,.05)' }}>
          <div style={{ display: 'inline-block', padding: '4px 11px', borderRadius: '20px', background: v.bg, fontSize: '12px', fontWeight: 700, color: v.color }}>① 결과</div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '12px 0 6px', color: v.color }}>{v.title}</h2>
          <p style={{ fontSize: '14px', color: '#707a88', margin: '0 0 20px', lineHeight: 1.6 }}>{v.sub}</p>

          {/* 차트 */}
          <div style={{ background: '#f7f9fc', borderRadius: '14px', padding: '16px', marginBottom: '18px' }}>
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: `${H}px`, display: 'block', overflow: 'visible' }}>
              {/* 에필로그 점선 (빨강) */}
              <polyline points={futurePts} fill="none" stroke="#FF4444" strokeWidth="1.8" strokeDasharray="4 4" strokeLinejoin="round" />
              {/* 게임 구간 실선 */}
              <polyline points={playedPts} fill="none" stroke="#1e232b" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
              {/* 에필로그 수직선 */}
              <line x1={eventX.toFixed(1)} y1="0" x2={eventX.toFixed(1)} y2={H} stroke="#FF4444" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
              {/* 에필로그 도트 */}
              <circle cx={eventX.toFixed(1)} cy={eventY.toFixed(1)} r="4" fill="#FF4444" stroke="#fff" strokeWidth="2" />
              {/* 에필로그 라벨 */}
              <text x={eventX + 4} y="12" fontSize="9" fill="#FF4444" fontFamily="'IBM Plex Mono',monospace">{meta.chartEventLabel}</text>
              {/* 게임 종료 도트 */}
              <circle cx={xs(dotIdx).toFixed(1)} cy={ys(series[dotIdx]).toFixed(1)} r="5" fill={dotColor} stroke="#fff" strokeWidth="2" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', color: '#aab0ba', marginTop: '6px' }}>
              <span>{meta.entryCaption}</span>
              <span style={{ color: dotColor }}>{blew ? (buyBlow ? 'FOMO 풀매수' : '패닉셀') : '보유 중'}</span>
              <span style={{ color: '#FF4444' }}>{meta.chartFooterEvent}</span>
            </div>
          </div>

          {/* 수치 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div style={{ background: '#f7f9fc', borderRadius: '13px', padding: '14px' }}>
              <div style={{ fontSize: '11px', color: '#707a88' }}>{stat1Label}</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '18px', fontWeight: 600, color: stat1Color, marginTop: '5px' }}>{stat1Val}</div>
            </div>
            <div style={{ background: '#f7f9fc', borderRadius: '13px', padding: '14px' }}>
              <div style={{ fontSize: '11px', color: '#707a88' }}>{meta.eventDayLabel}</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '18px', fontWeight: 600, color: eventPnl >= 0 ? '#27865e' : '#d65a4e', marginTop: '5px' }}>{fmt(eventPnl)}</div>
            </div>
            <div style={{ background: '#f7f9fc', borderRadius: '13px', padding: '14px' }}>
              <div style={{ fontSize: '11px', color: '#707a88' }}>{meta.aheadLabel}</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '18px', fontWeight: 600, color: '#2f64c8', marginTop: '5px' }}>{fmt(aheadPnl)}</div>
            </div>
          </div>
        </div>

        {/* ───── 2. 거울 카드 ───── */}
        <div style={{ background: '#1e232b', borderRadius: '20px', padding: '28px', marginTop: '16px', color: '#fff' }}>
          <div style={{ display: 'inline-block', padding: '4px 11px', borderRadius: '20px', background: 'rgba(255,255,255,.12)', fontSize: '12px', fontWeight: 700 }}>② 거울</div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '13px 0 12px' }}>{v.mirrorTitle}</h2>
          <p style={{ fontSize: '14px', lineHeight: 1.75, color: '#d4d8de', margin: '0 0 16px' }}>{v.mirrorBody}</p>
          <div style={{ padding: '14px 16px', borderRadius: '13px', background: 'rgba(255,255,255,.06)', fontSize: '13px', lineHeight: 1.65, color: '#fff', marginBottom: '16px' }}>
            {v.mirrorIrony}
          </div>

          {/* 데이터 거울 — 이번 판의 실제 기록으로 만든 문장 */}
          {(greedFearLine || instinctLine || strikes > 0) && (
            <div style={{ borderLeft: '2px solid rgba(255,255,255,.25)', paddingLeft: '14px', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', letterSpacing: '.12em', color: '#7a8395', textTransform: 'uppercase' }}>Data Mirror · 이번 판의 기록</div>
              {greedFearLine && <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#d4d8de', margin: 0 }}>{greedFearLine}</p>}
              {instinctLine && <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#d4d8de', margin: 0 }}>{instinctLine}</p>}
              {strikes > 0 && (
                <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#d4d8de', margin: 0 }}>
                  패닉 스트라이크 {strikes}/2 — {strikes >= 2 ? '두 번째 폭주는 막지 못했습니다.' : `한 번의 폭주로 계좌 일부가 잘렸지만, 거기서 멈춰 세웠습니다.`}
                </p>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,.06)', borderRadius: '11px', padding: '13px' }}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '20px', fontWeight: 600, color: '#7bdcaf' }}>{strongPct}%</div>
              <div style={{ fontSize: '11px', color: '#aab0ba', marginTop: '4px' }}>강한 근거 (공탐·차트)</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,.06)', borderRadius: '11px', padding: '13px' }}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '20px', fontWeight: 600, color: '#f0b366' }}>{socialPct}%</div>
              <div style={{ fontSize: '11px', color: '#aab0ba', marginTop: '4px' }}>약한·틀린 근거 (분위기/오독)</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,.06)', borderRadius: '11px', padding: '13px' }}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '20px', fontWeight: 600, color: '#c8a8f0' }}>{trustGain >= 0 ? '+' : ''}{trustGain}%p</div>
              <div style={{ fontSize: '11px', color: '#aab0ba', marginTop: '4px' }}>신뢰도 변화</div>
            </div>
          </div>
        </div>

        {/* ───── 2.5 턴별 타임라인 ───── */}
        {hist.length > 0 && (
          <div style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '20px', padding: '28px', marginTop: '16px', boxShadow: '0 1px 3px rgba(20,30,50,.05)' }}>
            <div style={{ display: 'inline-block', padding: '4px 11px', borderRadius: '20px', background: '#eef2fb', fontSize: '12px', fontWeight: 700, color: '#3a6fd0' }}>③ 턴 타임라인</div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '13px 0 4px' }}>매 턴, 어떤 선택을 했나</h2>
            <p style={{ fontSize: '13px', color: '#707a88', margin: '0 0 20px' }}>조언 · 근거 · {charName}의 실제 매매 · 그 선택의 평가</p>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {hist.map((h, i) => {
                const om   = OUTCOME_META[h.outcome] || OUTCOME_META.near
                const evs  = h.evidences || []
                const last = i === hist.length - 1
                return (
                  <div key={i} style={{ display: 'flex', gap: '13px' }}>
                    {/* 레일 */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: om.bg, color: om.color, fontFamily: "'IBM Plex Mono',monospace", fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${om.color}` }}>
                        {(h.turnIdx ?? i) + 1}
                      </div>
                      {!last && <div style={{ flex: 1, width: '2px', background: '#eef0f3', margin: '2px 0' }} />}
                    </div>
                    {/* 내용 */}
                    <div style={{ flex: 1, paddingBottom: last ? 0 : '18px', minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '5px' }}>
                        <span style={{ fontSize: '10.5px', fontWeight: 700, color: om.color, background: om.bg, borderRadius: '5px', padding: '2px 7px' }}>{om.label}</span>
                        <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e232b', wordBreak: 'keep-all' }}>“{h.advice || DIR_LABEL[h.dir] || h.dir}”</span>
                        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', color: h.delta >= 0 ? '#27865e' : '#c0473d' }}>
                          신뢰 {h.tB}→{h.tA} ({h.delta >= 0 ? '+' : ''}{h.delta})
                        </span>
                      </div>
                      {/* 근거 칩 */}
                      {evs.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '6px' }}>
                          {evs.map((e, j) => {
                            const tag = e.supports === 'support' ? { t:'뒷받침', c:'#27865e', b:'#eaf6f0' }
                                      : e.supports === 'contra'  ? { t:'모순',   c:'#b67e1f', b:'#fbf3e3' }
                                      : e.supports === 'bad'     ? { t:'오독',   c:'#c0473d', b:'#fbeceb' }
                                      : { t:'', c:'#707a88', b:'#f0f2f5' }
                            return (
                              <span key={j} style={{ fontSize: '10.5px', color: tag.c, background: tag.b, borderRadius: '5px', padding: '2px 7px' }}>
                                {SRCLABEL[e.src] || e.src}{tag.t ? ` · ${tag.t}` : ''}
                              </span>
                            )
                          })}
                        </div>
                      )}
                      {/* 매매 + 평가 */}
                      <div style={{ fontSize: '12.5px', color: '#4e5a6e', lineHeight: 1.55 }}>
                        {h.traded
                          ? <span style={{ fontFamily: "'IBM Plex Mono',monospace", color: h.traded.side === 'buy' ? '#c0473d' : '#2f64c8', fontWeight: 600 }}>
                              {charName} {h.traded.side === 'buy' ? '매수' : '매도'} {Math.round(h.traded.krw).toLocaleString('ko-KR')}만원 · </span>
                          : <span style={{ fontFamily: "'IBM Plex Mono',monospace", color: '#9099a6' }}>매매 없음 · </span>}
                        <span>{turnVerdict(h)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ───── 3. 학습 리포트 ───── */}
        <div style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '20px', padding: '28px', marginTop: '16px', boxShadow: '0 1px 3px rgba(20,30,50,.05)' }}>
          <div style={{ display: 'inline-block', padding: '4px 11px', borderRadius: '20px', background: '#eef2fb', fontSize: '12px', fontWeight: 700, color: '#3a6fd0' }}>③ 학습 리포트</div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '13px 0 14px' }}>이번 판 성적표</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
            <div style={{ background: '#f7f9fc', borderRadius: '13px', padding: '15px' }}>
              <div style={{ fontSize: '12px', color: '#707a88' }}>정합성 감각</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '20px', fontWeight: 600, color: '#3a6fd0', marginTop: '5px' }}>{coherence}%</div>
              <div style={{ fontSize: '11px', color: '#9099a6', marginTop: '4px' }}>설득이 실제로 도움된 비율</div>
            </div>
            <div style={{ background: '#f7f9fc', borderRadius: '13px', padding: '15px' }}>
              <div style={{ fontSize: '12px', color: '#707a88' }}>최종 신뢰도</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '20px', fontWeight: 600, color: trust >= 60 ? '#27865e' : trust >= 40 ? '#b67e1f' : '#d65a4e', marginTop: '5px' }}>{trust}%</div>
              <div style={{ fontSize: '11px', color: '#9099a6', marginTop: '4px' }}>시작: {startTrust}% → 종료: {trust}%</div>
            </div>
          </div>

          <div style={{ fontSize: '13px', fontWeight: 700, color: '#5b6470', marginBottom: '10px' }}>
            마주친 개념 — {opened.length}개
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
            {Object.entries(DICT).map(([k, v2]) => {
              const isOpen = opened.includes(k)
              return (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '11px 14px', borderRadius: '12px', background: isOpen ? '#f3f9f5' : '#f7f8fa' }}>
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: isOpen ? '#27865e' : '#c8cdd4', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', flexShrink: 0 }}>
                    {isOpen ? '✓' : '·'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: isOpen ? '#1e232b' : '#9099a6' }}>{v2.term}</div>
                    <div style={{ fontSize: '11px', color: '#9099a6', lineHeight: 1.45, marginTop: '2px' }}>{v2.body}</div>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ padding: '14px 17px', borderRadius: '13px', background: '#f7f9fc', fontSize: '13px', color: '#5b6470', lineHeight: 1.6, marginBottom: '18px' }}>
            {meta.realEventText}<br />
            {meta.nextScenarioText}
          </div>

          <button
            onClick={actions.restart}
            style={{ width: '100%', padding: '15px', borderRadius: '13px', background: '#1e232b', color: '#fff', fontSize: '15px', fontWeight: 600, transition: 'background .15s', cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}
            onMouseOver={e => e.currentTarget.style.background = '#2c333f'}
            onMouseOut={e => e.currentTarget.style.background = '#1e232b'}
          >
            다시 플레이 ↺
          </button>
        </div>

      </div>
    </div>
  )
}
