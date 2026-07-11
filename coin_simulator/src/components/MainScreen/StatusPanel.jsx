import { useGameStore } from '../../store/gameStore'
import { CHARACTERS, SRCLABEL, getScenarioData } from '../../data/gameContent'

function trustColor(t) {
  return t < 40 ? '#d65a4e' : t < 70 ? '#dd8a4a' : '#2f9e6f'
}

const WEIGHT_COLORS = ['#2f9e6f', '#3a6fd0', '#dd8a4a']
const WEIGHT_PCT    = ['100%', '50%', '25%']

export default function StatusPanel() {
  const turn     = useGameStore(s => s.turn)
  const trust    = useGameStore(s => s.trust)
  const phase    = useGameStore(s => s.phase)
  const stage    = useGameStore(s => s.stage)
  const result   = useGameStore(s => s.result)
  const blew     = useGameStore(s => s.blew)
  const tradeIdx = useGameStore(s => s.tradeIdx)
  const char     = useGameStore(s => s.char)
  const scenario = useGameStore(s => s.scenario)
  const units    = useGameStore(s => s.units)
  const cash     = useGameStore(s => s.cash)
  const investedTotal = useGameStore(s => s.investedTotal)
  const strikes  = useGameStore(s => s.strikes)

  const sd          = getScenarioData(scenario)
  const priceSeries = sd.priceSeries
  const entryPrice  = sd.entryPrice
  const reveal      = sd.reveal
  const priceUnit   = sd.priceUnit

  // 현재 시점 날짜 (년월일)
  const dateArr   = sd.dates
  const iso       = dateArr[reveal[turn]] || dateArr[dateArr.length - 1]
  const [dy, dm, dd] = iso.split('-')
  const dateLabel = `${dy}년 ${+dm}월 ${+dd}일`

  const charData  = CHARACTERS.find(c => c.id === char)
  const charName  = charData?.name || ''
  const inResult  = phase === 'result'
  const r         = result

  const tColor = trustColor(trust)

  const curRevealIdx = reveal[turn]
  const curPrice     = priceSeries[curRevealIdx]
  // 포지션 모델: 코인 평가액 + 현금(실탄). 원금 = investedTotal(2×invested)
  const coinVal      = units * curPrice
  const assetVal     = coinVal + cash
  const pnlVal       = assetVal - investedTotal
  const pnlPct       = (assetVal / investedTotal - 1) * 100
  const won = n => Math.round(Math.abs(n)).toLocaleString('ko-KR')

  const pnlStr = `${pnlVal >= 0 ? '+' : '-'}${won(pnlVal)}만원 (${pnlPct >= 0 ? '+' : ''}${pnlPct.toFixed(1)}%)`

  const diceWaiting = !inResult || stage < 1
  const diceReady   = inResult && stage >= 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '13px', overflowY: 'auto', paddingRight: '2px' }}>

      {/* 날짜 카드 */}
      <div style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '16px', padding: '14px 17px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d65a4e', flexShrink: 0 }} />
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '17px', fontWeight: 700, color: '#1e232b', whiteSpace: 'nowrap' }}>{dateLabel}</div>
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', color: '#9099a6', whiteSpace: 'nowrap' }}>TURN {turn + 1}</div>
      </div>

      <div data-tutorial="trust-dice">
      {/* Trust card */}
      <div style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '16px', padding: '17px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#3d4858', whiteSpace: 'nowrap' }}>신뢰도</div>
          <div style={{ fontSize: '12px', color: '#606c7e' }}>조언을 따를 확률</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '10px 0 12px' }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '38px', fontWeight: 600, color: tColor, lineHeight: 1, transition: 'color .4s' }}>{trust}</div>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '18px', fontWeight: 600, color: tColor }}>%</div>
        </div>
        <div style={{ height: '8px', borderRadius: '6px', background: '#eef0f3', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: '6px', background: tColor, width: `${trust}%`, transition: 'width .6s cubic-bezier(.4,0,.2,1),background .4s' }} />
        </div>

        {inResult && r && (
          <div className="anim-fadeIn" style={{ marginTop: '14px', paddingTop: '13px', borderTop: '1px solid #f0f2f5' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#606c7e', marginBottom: '8px' }}>정합성 판정</div>
            <div style={{ fontSize: '12px', color: '#3d4858', lineHeight: 1.55 }}>
              조언 <b style={{ color: '#1e232b' }}>"{r.advice}"</b>
            </div>

            {/* 멀티근거 분해 */}
            {r.evidences && r.evidences.length > 0 ? (
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {r.evidences.map((e, i) => (
                  <div key={e.src} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '9px', fontWeight: 700, color: '#fff', background: WEIGHT_COLORS[i], borderRadius: '4px', padding: '2px 5px', flexShrink: 0 }}>{WEIGHT_PCT[i]}</span>
                    <span style={{ fontSize: '11.5px', color: '#3d4858', flex: 1 }}>{SRCLABEL[e.src]}</span>
                    {e.supports && (
                      <span style={{ fontSize: '9.5px', fontWeight: 700, borderRadius: '4px', padding: '1px 5px', flexShrink: 0,
                        color:      e.supports === 'support' ? '#27865e' : e.supports === 'contra' ? '#b67e1f' : '#c0473d',
                        background: e.supports === 'support' ? '#eaf6f0' : e.supports === 'contra' ? '#fbf3e3' : '#fbeceb' }}>
                        {e.supports === 'support' ? '뒷받침' : e.supports === 'contra' ? '조언과 모순' : '오독'}
                      </span>
                    )}
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', fontWeight: 700, color: e.weightedDelta >= 0 ? '#27865e' : '#c0473d' }}>
                      {e.weightedDelta >= 0 ? '+' : ''}{e.weightedDelta}
                    </span>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '3px', paddingTop: '6px', borderTop: '1px solid #f0f2f5' }}>
                  <span style={{ fontSize: '11px', color: '#606c7e', flex: 1, fontWeight: 600 }}>합계</span>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '13px', fontWeight: 700, color: r.delta >= 0 ? '#27865e' : '#c0473d', background: r.delta >= 0 ? '#eaf6f0' : '#fbeceb', borderRadius: '7px', padding: '2px 8px' }}>
                    {r.delta >= 0 ? '+' : ''}{r.delta}%
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '14px', color: '#606c7e' }}>{r.tB}% → {r.tA}%</span>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '13px', fontWeight: 700, color: r.delta >= 0 ? '#27865e' : '#c0473d', background: r.delta >= 0 ? '#eaf6f0' : '#fbeceb', borderRadius: '7px', padding: '2px 8px' }}>
                  {r.delta >= 0 ? '+' : ''}{r.delta}%
                </span>
              </div>
            )}

            {r.evidences && r.evidences.length > 0 && (
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '12px', color: '#606c7e', marginTop: '6px' }}>
                {r.tB}% → {r.tA}%
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dice card */}
      <div style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '16px', padding: '17px' }}>
        <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#3d4858', marginBottom: '6px' }}>확률 주사위</div>

        {diceWaiting && (
          <div style={{ fontSize: '12px', color: '#7a8395', lineHeight: 1.55, padding: '6px 0' }}>
            근거를 제출하면, 신뢰도만큼의 확률로 합리적 판단을 굴립니다. 100%는 없어요.
          </div>
        )}

        {diceReady && r && (
          <div className="anim-fadeIn">
            <div style={{ position: 'relative', height: '10px', borderRadius: '6px', marginTop: '8px', background: `linear-gradient(90deg,#2f9e6f ${r.tA}%,#e4b3ad ${r.tA}%)`, overflow: 'visible' }}>
              <div style={{
                position: 'absolute', top: '-6px', width: '6px', height: '22px', borderRadius: '4px',
                background: '#1e232b', border: '2px solid #fff', boxShadow: '0 2px 5px rgba(0,0,0,.3)',
                left: `${Math.round(r.roll)}%`, transform: 'translateX(-50%)',
                animation: 'diceShake .7s ease-out',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', color: '#7a8395', marginTop: '9px' }}>
              <span style={{ color: '#2f9e6f' }}>합리 {r.tA}%</span>
              <span style={{ color: '#c0473d' }}>비합리</span>
            </div>
            <div style={{ marginTop: '11px', fontSize: '13px', fontWeight: 700, color: r.rational ? '#27865e' : '#c0473d' }}>
              {r.rational ? '합리적 판단 — 통과' : '비합리 — 흔들림'}
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', color: '#606c7e', marginTop: '3px' }}>
              주사위 {Math.round(r.roll)} {r.rational ? '<' : '≥'} 신뢰도 {r.tA}{r.pityBonus > 0 ? ` +${r.pityBonus} (안정 보정)` : ''}
            </div>
          </div>
        )}
      </div>

      </div>

      {/* Asset card */}
      <div data-tutorial="assets" style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '16px', padding: '17px' }}>
        <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#3d4858', marginBottom: '13px' }}>{charName}의 자산</div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '9px' }}>
          <span style={{ fontSize: '12px', color: '#4e5a6e' }}>평가금액</span>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '18px', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {won(assetVal)}<span style={{ fontSize: '11px', color: '#606c7e', fontWeight: 400 }}> 만원</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '9px' }}>
          <span style={{ fontSize: '12px', color: '#4e5a6e' }}>평가손익</span>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '14px', fontWeight: 600, color: pnlVal >= 0 ? '#2f9e6f' : '#d65a4e', whiteSpace: 'nowrap' }}>
            {pnlStr}
          </span>
        </div>

        {/* 코인 / 현금 분리 */}
        <div style={{ display: 'flex', gap: '8px', margin: '11px 0 4px' }}>
          <div style={{ flex: 1, background: '#f7f9fc', borderRadius: '10px', padding: '9px 11px' }}>
            <div style={{ fontSize: '10.5px', color: '#7a8395', marginBottom: '3px' }}>코인 자산</div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '13.5px', fontWeight: 600, color: '#1e232b', whiteSpace: 'nowrap' }}>{won(coinVal)}<span style={{ fontSize: '10px', color: '#9099a6', fontWeight: 400 }}> 만원</span></div>
          </div>
          <div style={{ flex: 1, background: '#f7f9fc', borderRadius: '10px', padding: '9px 11px' }}>
            <div style={{ fontSize: '10.5px', color: '#7a8395', marginBottom: '3px' }}>현금 (실탄)</div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '13.5px', fontWeight: 600, color: cash > 0 ? '#27865e' : '#c0473d', whiteSpace: 'nowrap' }}>{won(cash)}<span style={{ fontSize: '10px', color: '#9099a6', fontWeight: 400 }}> 만원</span></div>
          </div>
        </div>
        {cash <= 0 && (
          <div style={{ fontSize: '10.5px', color: '#c0473d', marginBottom: '4px' }}>실탄 소진 — 추가 매수 불가</div>
        )}

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #f0f2f5' }}>
          <span style={{ fontSize: '12px', color: '#4e5a6e' }}>진입가</span>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '13px', color: '#606c7e' }}>
            {entryPrice.toLocaleString('ko-KR')} {priceUnit}
          </span>
        </div>

        {strikes > 0 && (
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 11px', borderRadius: '9px',
            background: blew ? '#fbeceb' : '#fbf3e3', fontSize: '12px', fontWeight: 600, color: blew ? '#c0473d' : '#8a6a1f' }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', letterSpacing: '.05em' }}>
              {blew ? '⚡⚡' : '⚡'} {strikes}/2
            </span>
            <span>
              {blew
                ? (result?.panicAction === 'buy' ? '고점 추격매수 · 물림 확정' : '전량 매도됨 · 손실 확정')
                : (result?.panicAction === 'buy' ? '절반 추가매수 — 한 번 더 폭주하면 끝' : '절반 매도됨 — 한 번 더 무너지면 끝')}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
