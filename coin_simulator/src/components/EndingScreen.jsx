import { useGameStore } from '../store/gameStore'
import { DICT, CHARACTERS, DOGE_INVESTED, PRICE_SERIES, ENTRY_PRICE, INVESTED, PLAYED_LEN, TOP_PRICE_SERIES, TOP_ENTRY_PRICE, TOP_INVESTED, TOP_PLAYED_LEN, NOW_PRICE_SERIES, NOW_ENTRY_PRICE, NOW_INVESTED, NOW_PLAYED_LEN } from '../data/gameContent'

// DOGE 전체 시리즈 (원, Upbit 실데이터): 게임 구간(idx 0~11) + SNL 이후(idx 12~15)
// 날짜: 3/30 4/1 4/6 4/13 4/15 4/16 4/19 4/20 4/21 4/23 4/28 5/3  5/8  5/9  5/15 5/31
const DOGE_FULL   = [65, 77, 86, 121, 228, 467, 513, 395, 388, 295, 376, 539, 774, 703, 636, 381]
const DOGE_ENTRY  = 77    // 4/01 진입가 (원)
const DOGE_PLAYED = 12    // idx 0~11이 게임 구간 (5/3까지)
const SNL_IDX     = 12    // 5/8 SNL 방영일 (실제로는 이 날 오히려 고점을 찍었다)

// FTX 전체 시리즈 (만원, Upbit 실데이터): 게임 구간(idx 0~10) + 12월(idx 11~12)
const FTX_FULL       = PRICE_SERIES
const FTX_RECOVER_IDX = 11 // 12월 15일 시점

// 시나리오별 메타 — 결과 화면을 이 표 하나로 도지/FTX 양쪽에 대응시킨다
const SCENARIO_META = {
  doge: {
    label: 'DOGE 2021',
    unit: '원',
    fullSeries: DOGE_FULL,
    entry: DOGE_ENTRY,
    invested: DOGE_INVESTED,
    played: DOGE_PLAYED,
    eventIdx: SNL_IDX,
    eventTag: 'SNL 그 이후 · 2021.05.08',
    entryCaption: '3/30 진입',
    eventCaption: 'SNL 당일 +44%, 이후 급락',
    presentLabel: '5/3 기준 평가수익',
    eventDayLabel: 'SNL 당일 (5/8)',
    aheadLabel: '5월 말까지 버텼다면',
    catalystNote: 'SNL 이후 인기가 식을 조짐이',
    chaseNote: '머스크 트윗 하나에',
    chaseIrony: '공탐지수가 85를 넘었을 때, 당신은 무슨 근거를 댔나요?',
    marketNote: '탐욕장',
    successStory: '분위기보다 숫자로 설득한 당신이 있었기에 김불안은 SNL 열기가 식기 전에 정리할 수 있었습니다.',
    nextScenarioName: "'22년 거래소 파산'",
    nextScenarioMood: '공포장',
    realEventText: 'DOGE 광풍은 2021년 4~5월에 실제로 일어난 일입니다.',
    epilogue: {
      good:  { emoji: '🎯', title: (n) => `${n}, 고점을 피했습니다`,
        story: (n) => `당신의 설득을 믿은 ${n}은(는) 사상 최고가 부근에서 미리 일부 익절했습니다. 공교롭게도 SNL 방영 당일(5/8) 도지코인은 774원까지 더 올랐지만 그 인기는 오래가지 못했습니다. 머스크가 무대에서 도지코인을 '허슬'이라 부른 뒤 실망 매물이 이어지며 3주 만에 381원까지 흘러내렸습니다.`,
        note: 'SNL 당일 774원 → 5월 말 381원 (-51%)', color: '#27865e', bg: '#e7f4ee' },
      near:  { emoji: '⚖️', title: () => '아슬아슬하게 반은 지켰습니다',
        story: (n) => `${n}은(는) 일부만 익절하고 남은 포지션을 유지한 채 SNL을 맞이했습니다. SNL 당일엔 오히려 774원까지 더 올랐지만, 이후 3주간 인기가 식으며 381원까지 빠졌습니다. 미리 팔아둔 절반 덕에 충격은 줄었습니다.`,
        note: 'SNL 당일 774원 → 5월 말 381원 (-51%)', color: '#b67e1f', bg: '#fbf3e3' },
      bad:   { emoji: '📉', title: () => 'SNL 이후, 함께 무너졌습니다',
        story: (n) => `설득에 실패한 ${n}은(는) SNL 이후까지 풀포지션을 유지했습니다. 방영 당일엔 774원까지 오르며 안심했지만, 열기가 식으면서 3주 만에 381원까지 추락했고 그는 결국 고점 대비 큰 손실을 입었습니다.`,
        note: 'SNL 당일 774원 → 5월 말 381원 (-51%)', color: '#c0473d', bg: '#fbeceb' },
    },
  },
  ftx: {
    label: 'FTX 2022',
    unit: '만원',
    fullSeries: FTX_FULL,
    entry: ENTRY_PRICE,
    invested: INVESTED,
    played: PLAYED_LEN,
    eventIdx: FTX_RECOVER_IDX,
    eventTag: '그 이후 · 2022.12',
    entryCaption: '11/7 진입',
    eventCaption: '12월 중순 소폭 반등, 이후 재하락',
    presentLabel: '11/22 기준 평가수익',
    eventDayLabel: '12월 15일 시점',
    aheadLabel: '12월 말까지 버텼다면',
    catalystNote: '12월 중순의 소폭 반등이',
    chaseNote: '거래량 없는 반등에',
    chaseIrony: '데드캣 바운스에, 당신은 무슨 근거를 댔나요?',
    marketNote: '공포장',
    successStory: '분위기보다 숫자로 설득한 당신이 있었기에 그는 패닉셀 없이 버틸 수 있었습니다.',
    nextScenarioName: "'21년 도지코인 광풍'",
    nextScenarioMood: '탐욕장',
    realEventText: 'FTX 파산은 2022년 11월에 실제로 일어난 일입니다.',
    epilogue: {
      good:  { emoji: '🎯', title: (n) => `${n}, 패닉을 피했습니다`,
        story: (n) => `당신의 설득을 믿은 ${n}은(는) 극단적 공포 구간에서도 전량 매도하지 않았습니다. 12월 중순 잠깐 반등했지만 뚜렷한 회복은 아니었고, 연말까지 박스권이 이어졌습니다. 그래도 바닥에서 던지지 않은 것만으로 최악은 피했습니다.`,
        note: '11/22 2,258 → 12/15 2,294(+1.6%) → 12/31 2,108만원(-6.6%)', color: '#27865e', bg: '#e7f4ee' },
      near:  { emoji: '⚖️', title: () => '일부만 지켰습니다',
        story: (n) => `${n}은(는) 공포에 흔들려 일부 포지션을 손절했지만, 나머지는 버텨냈습니다. 12월도 뚜렷한 회복 없이 박스권과 재하락이 반복됐지만, 미리 정리해둔 절반 덕에 충격은 줄었습니다.`,
        note: '11/22 2,258 → 12/15 2,294(+1.6%) → 12/31 2,108만원(-6.6%)', color: '#b67e1f', bg: '#fbf3e3' },
      bad:   { emoji: '📉', title: () => '공포에 함께 무너졌습니다',
        story: (n) => `설득에 실패한 ${n}은(는) 극단적 공포 구간에서 결국 전량 매도했습니다. 12월에도 뚜렷한 회복은 없었지만, 바닥 근처에서 던진 건 그가 가장 두려워하던 시나리오였습니다.`,
        note: '11/22 2,258 → 12/15 2,294(+1.6%) → 12/31 2,108만원(-6.6%)', color: '#c0473d', bg: '#fbeceb' },
    },
  },
  top: {
    label: 'ETH 2021',
    unit: '만원',
    fullSeries: TOP_PRICE_SERIES,
    entry: TOP_ENTRY_PRICE,
    invested: TOP_INVESTED,
    played: TOP_PLAYED_LEN,
    eventIdx: 11,
    eventTag: '고점 그 이후 · 2022.01',
    entryCaption: '10/1 진입',
    eventCaption: '1월 저점 -48%',
    presentLabel: '12/15 기준 평가수익',
    eventDayLabel: '1월 저점 시점',
    aheadLabel: '1년 뒤(22.11)까지 버텼다면',
    catalystNote: '반등 조짐이',
    chaseNote: '연속 신고가 랠리에',
    chaseIrony: '공탐지수가 80을 넘었을 때, 당신은 무슨 근거를 댔나요?',
    marketNote: '탐욕장',
    successStory: '분위기보다 숫자로 설득한 당신이 있었기에 그는 사상 최고가에서도 추격하지 않을 수 있었습니다.',
    nextScenarioName: "'25년 하반기'",
    nextScenarioMood: '최근 알트코인 장',
    realEventText: '이더리움 사상 최고가와 폭락은 2021년 10월~12월에 실제로 일어난 일입니다.',
    epilogue: {
      good:  { emoji: '🎯', title: (n) => `${n}, 고점 추격을 피했습니다`,
        story: (n) => `당신의 설득을 믿은 ${n}은(는) 사상 최고가 부근에서 분할 익절에 성공했습니다. 이후 레버리지 청산과 긴축 공포 속에 이더리움은 폭락했고, 2022년 1월에는 고점 대비 -48%까지 떨어졌습니다. 1년 뒤 FTX 사태 국면에는 고점 대비 -73%까지 밀렸으니, 그는 최악의 국면을 피했습니다.`,
        note: '고점(571) → 1월 저점 298만원(-48%) → 22.11 156만원(-73%)', color: '#27865e', bg: '#e7f4ee' },
      near:  { emoji: '⚖️', title: () => '일부만 지켰습니다',
        story: (n) => `${n}은(는) 고점 근처에서 일부만 정리하고 나머지는 들고 갔습니다. 폭락 이후 남은 포지션의 손실은 피할 수 없었지만, 미리 챙긴 절반 덕에 충격은 줄었습니다.`,
        note: '고점(571) → 1월 저점 298만원(-48%) → 22.11 156만원(-73%)', color: '#b67e1f', bg: '#fbf3e3' },
      bad:   { emoji: '📉', title: () => '고점에서 함께 무너졌습니다',
        story: (n) => `설득에 실패한 ${n}은(는) 사상 최고가 부근까지 풀포지션을 유지했습니다. 이후 이어진 폭락에 그는 고점 대비 큰 손실을 입었고, 1년 뒤 FTX 사태 국면까지 손실은 계속 불어났습니다.`,
        note: '고점(571) → 1월 저점 298만원(-48%) → 22.11 156만원(-73%)', color: '#c0473d', bg: '#fbeceb' },
    },
  },
  now: {
    label: 'SOL 2025',
    unit: '원',
    fullSeries: NOW_PRICE_SERIES,
    entry: NOW_ENTRY_PRICE,
    invested: NOW_INVESTED,
    played: NOW_PLAYED_LEN,
    eventIdx: 11,
    eventTag: '그 이후 · 2025.12~26.06',
    entryCaption: '10/6 진입',
    eventCaption: '12월에도 회복 없이 추가 하락',
    presentLabel: '11/21 기준 평가수익',
    eventDayLabel: '12월 시점',
    aheadLabel: '지금(26.06)까지 버텼다면',
    catalystNote: '뚜렷한 반등 신호가',
    chaseNote: '알트시즌 기대감에',
    chaseIrony: '공탐지수가 8까지 떨어졌을 때, 당신은 무슨 근거를 댔나요?',
    marketNote: '변동성 장세',
    successStory: '분위기보다 숫자로 설득한 당신이 있었기에 그는 사상 최대 레버리지 청산 한복판에서도 흔들리지 않을 수 있었습니다.',
    nextScenarioName: "'21년 도지코인 광풍'",
    nextScenarioMood: '탐욕장',
    realEventText: '2025년 10~11월 솔라나(SOL) 급락은 Upbit 실거래 데이터를 기반으로 합니다(비트코인 사상 최고가·10/10 사상 최대 레버리지 청산·11/21 비트코인 연저점 모두 실제 사건).',
    epilogue: {
      good:  { emoji: '🎯', title: (n) => `${n}, 고점 추격을 피했습니다`,
        story: (n) => `당신의 설득을 믿은 ${n}은(는) 알트시즌 기대감에 휩쓸리지 않고 초반에 일부 익절했습니다. 사상 최대 레버리지 청산 이후에도 시장은 회복하지 못했고, 솔라나는 12월에도 추가 하락했습니다. 26년 1월 반짝 반등이 있었지만 다시 꺾이며 지금(26년 6월)은 고점 대비 -66% 구간입니다. 미리 정리한 덕에 최악은 피했습니다.`,
        note: '11/21 193,400원 → 12월 181,900원 → 26.6월 112,000원 (고점 대비 -66%)', color: '#27865e', bg: '#e7f4ee' },
      near:  { emoji: '⚖️', title: () => '일부만 지켰습니다',
        story: (n) => `${n}은(는) 급락장에서 일부만 정리하고 나머지는 들고 갔습니다. 시장은 12월에도 회복하지 못했고 26년 6월 현재까지 뚜렷한 반등 없이 흘러내렸습니다. 미리 챙긴 절반 덕에 충격은 줄었습니다.`,
        note: '11/21 193,400원 → 12월 181,900원 → 26.6월 112,000원 (고점 대비 -66%)', color: '#b67e1f', bg: '#fbf3e3' },
      bad:   { emoji: '📉', title: () => '급락장에서 함께 무너졌습니다',
        story: (n) => `설득에 실패한 ${n}은(는) 알트시즌 기대감에 추가 매수를 이어갔습니다. 사상 최대 레버리지 청산 이후에도 시장은 회복하지 못했고, 26년 6월 현재까지 고점 대비 -66% 구간에 머물러 있습니다.`,
        note: '11/21 193,400원 → 12월 181,900원 → 26.6월 112,000원 (고점 대비 -66%)', color: '#c0473d', bg: '#fbeceb' },
    },
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

function won(n) {
  return Math.round(Math.abs(n)).toLocaleString('ko-KR')
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
  const actions    = useGameStore(s => s.actions)

  const charName = CHARACTERS.find(c => c.id === char)?.name || '김불안'
  const meta = SCENARIO_META[scenario] || SCENARIO_META.doge

  // ─── 차트 ───────────────────────────────────────────
  const { xs, ys, series, W, H } = buildChart(meta.fullSeries)

  const playedPts = series.slice(0, meta.played)
    .map((p, i) => `${xs(i).toFixed(1)},${ys(p).toFixed(1)}`).join(' ')

  const futurePts = series.slice(meta.played - 1)
    .map((p, i) => `${xs(i + meta.played - 1).toFixed(1)},${ys(p).toFixed(1)}`).join(' ')

  // 게임 종료 도트
  const dotIdx   = blew ? (tradeIdx ?? meta.played - 1) : meta.played - 1
  const dotColor = blew ? '#d65a4e' : '#27865e'

  // 에필로그 수직선 x 위치
  const eventX = xs(meta.eventIdx)
  const eventY = ys(series[meta.eventIdx])

  // ─── 자산 계산 ────────────────────────────────────────
  const presentPrice = series[meta.played - 1]
  const eventPrice   = series[meta.eventIdx]
  const aheadPrice   = series[series.length - 1]

  const presentPnl = meta.invested * (presentPrice / meta.entry) - meta.invested
  const eventPnl   = meta.invested * (eventPrice / meta.entry) - meta.invested
  const aheadPnl   = meta.invested * (aheadPrice / meta.entry) - meta.invested

  const lockedPrice = tradeIdx != null ? series[tradeIdx] : null
  const lockedPnl   = lockedPrice != null ? meta.invested * (lockedPrice / meta.entry) - meta.invested : null

  // ─── 근거 통계 (다중근거 호환) ─────────────────────────
  const allEvidences = hist.flatMap(h =>
    h.evidences ? h.evidences : (h.q ? [{ q: h.q }] : [])
  )
  const total      = Math.max(1, allEvidences.length)
  const strongCount = allEvidences.filter(e => e.q === 'best' || e.q === 'strong').length
  const socialCount = allEvidences.filter(e => e.q === 'social' || e.q === 'news').length
  const strongPct  = Math.round(strongCount / total * 100)
  const socialPct  = Math.round(socialCount / total * 100)
  const goodCombo  = hist.filter(h => (h.totalDelta ?? h.delta ?? 0) > 0).length
  const coherence  = Math.round(goodCombo / Math.max(1, hist.length) * 100)
  const trustGain  = (trust ?? startTrust) - startTrust
  const buyBlow    = blew && result?.panicAction === 'buy'

  // ─── 에필로그 (trust 기반 3단계) ────────────────────
  const epilogueTier = trust >= 70 ? 'good' : trust >= 40 ? 'near' : 'bad'
  const epilogueSpec  = meta.epilogue[epilogueTier]
  const epilogue = {
    emoji: epilogueSpec.emoji,
    title: epilogueSpec.title(charName),
    story: epilogueSpec.story(charName),
    note:  epilogueSpec.note,
    color: epilogueSpec.color,
    bg:    epilogueSpec.bg,
  }

  // ─── Verdict ─────────────────────────────────────────
  let verdictTitle, verdictSub, verdictColor, verdictBg
  let mirrorTitle, mirrorBody, mirrorIrony

  if (blew && buyBlow) {
    verdictColor = '#c0473d'; verdictBg = '#fbeceb'
    verdictTitle = 'FOMO를 막지 못했습니다'
    verdictSub   = `결정적 순간 ${charName}의 FOMO를 막지 못했고, 그는 고점에서 추격매수를 단행했습니다.`
    mirrorTitle  = '당신도 그 분위기에 휩쓸렸습니다'
    mirrorBody   = `강한 근거 대신 커뮤니티 반응이나 뉴스 분위기를 근거로 댄 순간이 많았습니다. ${meta.chaseNote} 휩쓸리는 건 ${charName}만이 아니었어요.`
    mirrorIrony  = meta.chaseIrony
  } else if (blew) {
    verdictColor = '#c0473d'; verdictBg = '#fbeceb'
    verdictTitle = '패닉을 막지 못했습니다'
    verdictSub   = `조정 국면에서 ${charName}의 패닉셀을 막지 못했습니다. ${meta.catalystNote} 남아있었는데도요.`
    mirrorTitle  = '공포도 탐욕만큼 비이성적입니다'
    mirrorBody   = "하락할 때 '손절하는 게 맞지 않을까' 싶어지는 건 자연스럽습니다. 그 감각이 당신 근거 선택에도 영향을 미쳤을 거예요."
    mirrorIrony  = '바닥에서 던지는 건 고점에서 사는 것만큼 비싼 실수입니다.'
  } else if (coherence >= 60) {
    verdictColor = '#27865e'; verdictBg = '#e7f4ee'
    verdictTitle = '설득에 성공했습니다'
    verdictSub   = `${charName}은(는) 끝까지 이성을 유지했어요. 강한 근거로 신뢰도를 높게 유지한 당신 덕분입니다.`
    mirrorTitle  = '당신은 공탐지수로 말했습니다'
    mirrorBody   = `${meta.marketNote} 한복판에서 '지표를 보자'고 말하는 건 쉽지 않습니다. ${meta.successStory}`
    mirrorIrony  = "그런데 — 똑같은 상황이 '당신의' 계좌였다면, 이만큼 근거대로 움직일 수 있었을까요?"
  } else {
    verdictColor = '#b67e1f'; verdictBg = '#fbf3e3'
    verdictTitle = '아슬아슬하게 버텼습니다'
    verdictSub   = `${charName}은(는) 가까스로 사고를 면했어요. 다만 강한 근거보다 분위기에 기댄 순간이 많았습니다.`
    mirrorTitle  = '운과 근거 사이'
    mirrorBody   = "몇 번은 공탐지수와 차트로, 몇 번은 뉴스 분위기로 설득했습니다. 이번엔 주사위가 맞았지만, 다음엔 분위기 근거를 한 번 더 골랐을 때 어떻게 될지 모릅니다."
    mirrorIrony  = '남에겐 "숫자를 보라"고 했죠. 그 말, 다음엔 당신 선택에도 적용해보세요.'
  }

  // 표시할 손익
  const stat1Val   = blew
    ? `${(lockedPnl ?? 0) >= 0 ? '+' : '-'}${won(lockedPnl ?? 0)}만원`
    : `${presentPnl >= 0 ? '+' : '-'}${won(presentPnl)}만원`
  const stat1Color = blew ? '#d65a4e' : (presentPnl >= 0 ? '#27865e' : '#d65a4e')
  const stat1Label = blew ? (buyBlow ? '확정 손실 (고점 물림)' : '확정 손실 (패닉셀)') : meta.presentLabel

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
            {epilogue.note}
          </div>
        </div>

        {/* ───── 1. 결과 카드 ───── */}
        <div style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '20px', padding: '28px', marginTop: '16px', boxShadow: '0 1px 3px rgba(20,30,50,.05)' }}>
          <div style={{ display: 'inline-block', padding: '4px 11px', borderRadius: '20px', background: verdictBg, fontSize: '12px', fontWeight: 700, color: verdictColor }}>① 결과</div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '12px 0 6px', color: verdictColor }}>{verdictTitle}</h2>
          <p style={{ fontSize: '14px', color: '#707a88', margin: '0 0 20px', lineHeight: 1.6 }}>{verdictSub}</p>

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
              {/* 게임 종료 도트 */}
              <circle cx={xs(dotIdx).toFixed(1)} cy={ys(series[dotIdx]).toFixed(1)} r="5" fill={dotColor} stroke="#fff" strokeWidth="2" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', color: '#aab0ba', marginTop: '6px' }}>
              <span>{meta.entryCaption}</span>
              <span style={{ color: dotColor }}>{blew ? (buyBlow ? 'FOMO 풀매수' : '패닉셀') : '보유 중'}</span>
              <span style={{ color: '#FF4444' }}>{meta.eventCaption}</span>
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
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '18px', fontWeight: 600, color: eventPnl >= 0 ? '#27865e' : '#d65a4e', marginTop: '5px' }}>{eventPnl >= 0 ? '+' : '-'}{won(eventPnl)}만원</div>
            </div>
            <div style={{ background: '#f7f9fc', borderRadius: '13px', padding: '14px' }}>
              <div style={{ fontSize: '11px', color: '#707a88' }}>{meta.aheadLabel}</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '18px', fontWeight: 600, color: '#2f64c8', marginTop: '5px' }}>{aheadPnl >= 0 ? '+' : '-'}{won(aheadPnl)}만원</div>
            </div>
          </div>
        </div>

        {/* ───── 2. 거울 카드 ───── */}
        <div style={{ background: '#1e232b', borderRadius: '20px', padding: '28px', marginTop: '16px', color: '#fff' }}>
          <div style={{ display: 'inline-block', padding: '4px 11px', borderRadius: '20px', background: 'rgba(255,255,255,.12)', fontSize: '12px', fontWeight: 700 }}>② 거울</div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '13px 0 12px' }}>{mirrorTitle}</h2>
          <p style={{ fontSize: '14px', lineHeight: 1.75, color: '#d4d8de', margin: '0 0 16px' }}>{mirrorBody}</p>
          <div style={{ padding: '14px 16px', borderRadius: '13px', background: 'rgba(255,255,255,.06)', fontSize: '13px', lineHeight: 1.65, color: '#fff', marginBottom: '16px' }}>
            {mirrorIrony}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,.06)', borderRadius: '11px', padding: '13px' }}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '20px', fontWeight: 600, color: '#7bdcaf' }}>{strongPct}%</div>
              <div style={{ fontSize: '11px', color: '#aab0ba', marginTop: '4px' }}>강한 근거 (공탐·차트)</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,.06)', borderRadius: '11px', padding: '13px' }}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '20px', fontWeight: 600, color: '#f0b366' }}>{socialPct}%</div>
              <div style={{ fontSize: '11px', color: '#aab0ba', marginTop: '4px' }}>분위기 근거 (뉴스·커뮤니티)</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,.06)', borderRadius: '11px', padding: '13px' }}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '20px', fontWeight: 600, color: '#c8a8f0' }}>{trustGain >= 0 ? '+' : ''}{trustGain}%p</div>
              <div style={{ fontSize: '11px', color: '#aab0ba', marginTop: '4px' }}>신뢰도 변화</div>
            </div>
          </div>
        </div>

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
            {Object.entries(DICT).map(([k, v]) => {
              const isOpen = opened.includes(k)
              return (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '11px 14px', borderRadius: '12px', background: isOpen ? '#f3f9f5' : '#f7f8fa' }}>
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: isOpen ? '#27865e' : '#c8cdd4', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', flexShrink: 0 }}>
                    {isOpen ? '✓' : '·'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: isOpen ? '#1e232b' : '#9099a6' }}>{v.term}</div>
                    <div style={{ fontSize: '11px', color: '#9099a6', lineHeight: 1.45, marginTop: '2px' }}>{v.body}</div>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ padding: '14px 17px', borderRadius: '13px', background: '#f7f9fc', fontSize: '13px', color: '#5b6470', lineHeight: 1.6, marginBottom: '18px' }}>
            {meta.realEventText}<br />
            다음엔 <b style={{ color: '#1e232b' }}>{meta.nextScenarioName}</b> 시나리오에서 <b style={{ color: '#1e232b' }}>{meta.nextScenarioMood}</b>도 경험해보세요.
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
