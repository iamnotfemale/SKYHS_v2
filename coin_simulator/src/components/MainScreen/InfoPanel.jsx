import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { DICT, CHAR_EVIDENCE_MULT, CHARACTERS, getScenarioData } from '../../data/gameContent'
import PriceChart from './PriceChart'
import ChartModal from './ChartModal'

const WEIGHT_LABELS = ['1st', '2nd', '3rd']
const WEIGHT_COLORS = ['#2f9e6f', '#3a6fd0', '#dd8a4a']
const WEIGHT_PCT    = ['100%', '50%', '25%']

function PrefBadge({ mult, hue }) {
  if (mult >= 1.3) return (
    <span style={{ fontSize:'11px', color: hue, fontWeight:700, border:`1px solid ${hue}55`, borderRadius:'4px', padding:'1px 6px', opacity:.9, whiteSpace:'nowrap', flexShrink:0 }}>선호</span>
  )
  if (mult <= 0.8) return (
    <span style={{ fontSize:'11px', color:'#9aa3b0', fontWeight:600, border:'1px solid #e4e7ec', borderRadius:'4px', padding:'1px 6px', whiteSpace:'nowrap', flexShrink:0 }}>비선호</span>
  )
  return null
}

function HelpPopup({ helpKey, actions }) {
  if (!helpKey || !DICT[helpKey]) return null
  return (
    <div className="anim-pop" style={{
      background: '#f7f9fc', border: '1px solid #e4e7ec', borderRadius: '14px', padding: '14px',
      marginTop: '8px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#3a6fd0' }}>{DICT[helpKey].term}</div>
        <button onClick={actions.closeHelp} style={{ fontSize: '11px', color: '#606c7e', cursor: 'pointer', border: 'none', background: 'none' }}>닫기 ✕</button>
      </div>
      <div style={{ fontSize: '12.5px', color: '#3d4858', lineHeight: 1.6, marginTop: '7px' }}>{DICT[helpKey].body}</div>
    </div>
  )
}

function PanelCard({ title, glowColor, onToggle, onHelp, onExpand, evidencePhase, src, interps, onPickInterp, selectedEvidences, helpKey, help, actions, prefMult, charHue, children }) {
  const rank       = evidencePhase ? selectedEvidences.findIndex(e => e.src === src) : -1
  const sel        = rank >= 0 ? selectedEvidences[rank] : null
  const isSelected = rank >= 0
  const canAdd     = selectedEvidences.length < 3
  const btnBg      = isSelected ? '#1e232b' : (canAdd ? '#2f9e6f' : '#b0b7c1')
  const btnLabel   = isSelected ? `${WEIGHT_LABELS[rank]} ✓` : '＋ 근거'

  return (
    <div>
      <div style={{
        background: '#fff',
        border: `1.5px solid ${isSelected ? '#1e232b' : glowColor}`,
        borderRadius: '16px', padding: '15px',
        transition: 'border-color .25s',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#3d4858', lineHeight: 1.35, wordBreak: 'keep-all', overflowWrap: 'anywhere' }}>{title}</div>
              {evidencePhase && prefMult != null && <PrefBadge mult={prefMult} hue={charHue} />}
            </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {onExpand && (
              <button onClick={onExpand} style={{ fontSize: '13px', color: '#7a8395', cursor: 'pointer', border: 'none', background: 'none', padding: '2px 4px', lineHeight: 1 }} title="크게보기">↗</button>
            )}
            {evidencePhase && !interps && (
              <button
                onClick={onToggle}
                disabled={!isSelected && !canAdd}
                style={{
                  padding: '4px 10px', borderRadius: '8px', background: btnBg, color: '#fff',
                  fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap', cursor: !isSelected && !canAdd ? 'default' : 'pointer',
                  border: 'none', fontFamily: 'inherit', transition: 'background .15s',
                }}
              >{btnLabel}</button>
            )}
            <button onClick={onHelp} style={{ fontSize: '12px', color: '#7a8395', cursor: 'pointer', border: 'none', background: 'none' }}>ⓘ</button>
          </div>
        </div>
        {children}

        {/* 해석 카드 — 같은 데이터, 다른 읽기. 무엇이 맞는 해석인지는 스스로 판단해야 한다 */}
        {evidencePhase && interps && (
          <div style={{ marginTop: '11px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#27865e', letterSpacing: '.02em' }}>이 카드, 어떻게 읽으시겠어요?</div>
            {interps.map((it, i) => {
              const active   = sel != null && sel.idx === i
              const disabled = !isSelected && !canAdd
              return (
                <button key={i} onClick={() => onPickInterp(i)} disabled={disabled}
                  style={{
                    textAlign: 'left', display: 'flex', alignItems: 'center', gap: '7px',
                    padding: '8px 10px', borderRadius: '9px',
                    border: `1.5px solid ${active ? '#1e232b' : '#e4e7ec'}`,
                    background: active ? '#f2f4f7' : '#fff',
                    cursor: disabled ? 'default' : 'pointer', fontFamily: 'inherit',
                    opacity: disabled ? 0.5 : 1, transition: 'border-color .15s, background .15s',
                  }}>
                  {active && (
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', fontWeight: 700, color: '#fff', background: WEIGHT_COLORS[rank], borderRadius: '4px', padding: '2px 5px', flexShrink: 0 }}>{WEIGHT_PCT[rank]}</span>
                  )}
                  <span style={{ fontSize: '13px', lineHeight: 1.5, color: active ? '#1e232b' : '#3d4858', wordBreak: 'keep-all' }}>{it.text}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
      {help === helpKey && <HelpPopup helpKey={helpKey} actions={actions} />}
    </div>
  )
}

export default function InfoPanel() {
  const turn              = useGameStore(s => s.turn)
  const phase             = useGameStore(s => s.phase)
  const help              = useGameStore(s => s.help)
  const scenario          = useGameStore(s => s.scenario)
  const char              = useGameStore(s => s.char)
  const selectedEvidences = useGameStore(s => s.selectedEvidences)
  const actions           = useGameStore(s => s.actions)
  const [chartExpanded, setChartExpanded] = useState(false)

  const charData  = CHARACTERS.find(c => c.id === char)
  const charHue   = charData?.hue || '#606c7e'
  const charMult  = CHAR_EVIDENCE_MULT[char] || {}

  const sd          = getScenarioData(scenario)
  const turns       = sd.turns
  const reveal      = sd.reveal
  const priceSeries = sd.priceSeries
  const coinLabel   = sd.coinLabel
  const chartData   = sd.chartData
  const chartPlayed = sd.chartPlayed
  const dates       = sd.dates
  // 헤더 날짜(현재 시점)까지만 캔들을 공개 — 미래 캔들이 미리 보이지 않게
  const headerISO   = dates[reveal[turn]] || dates[dates.length - 1]
  const revealedCount = Math.max(1, chartData.slice(0, chartPlayed).filter(c => c.time <= headerISO).length)

  const t             = turns[turn]
  const evidencePhase = phase === 'evidence'
  const evGlow        = evidencePhase ? '#bfe3d0' : '#e4e7ec'

  const revealLen  = reveal[turn]
  const lastPrice  = priceSeries[revealLen]
  const prevPrice  = turn > 0 ? priceSeries[reveal[turn - 1]] : priceSeries[0]
  const chg        = ((lastPrice / prevPrice) - 1) * 100
  const down       = lastPrice < prevPrice
  const lineColor  = down ? '#3a6fd0' : '#d65a4e'
  const fgiColor   = t.fgi < 30 ? '#3a6fd0' : t.fgi < 55 ? '#2f9e6f' : '#d65a4e'
  const priceUnit  = sd.priceUnit
  const won = n => Math.round(n).toLocaleString('ko-KR')

  const selCount = selectedEvidences.length

  const chartHelpKey    = t.chartConcept
  const newsHelpKey     = t.newsConcept

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingRight: '2px' }}>
      {evidencePhase && (
        <div className="anim-fadeIn" style={{
          fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', letterSpacing: '.03em',
          color: '#27865e', background: '#eaf6f0', border: '1px solid #bfe3d0', borderRadius: '9px', padding: '9px 11px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span>{t.interps ? '각 카드의 해석 중 옳은 것을 고르세요 (최대 3개)' : '＋ 버튼으로 근거를 선택하세요 (최대 3개, 가중 합산)'}</span>
          <span style={{ fontWeight: 700, color: selCount > 0 ? '#1e232b' : '#7a8395' }}>{selCount}/3</span>
        </div>
      )}

      {/* Chart */}
      <div data-tutorial="chart"><PanelCard
        title={`${coinLabel} · ${t.chartNote}`} glowColor={evGlow}
        evidencePhase={evidencePhase} src="chart"
        interps={t.interps?.chart}
        onPickInterp={(i) => actions.toggleEvidence('chart', i)}
        selectedEvidences={selectedEvidences}
        onToggle={() => actions.toggleEvidence('chart')}
        onHelp={() => help === chartHelpKey ? actions.closeHelp() : actions.openHelp(chartHelpKey)}
        onExpand={() => setChartExpanded(true)}
        helpKey={chartHelpKey} help={help} actions={actions}
        prefMult={charMult.chart} charHue={charHue}
      >
        <PriceChart
          revealedCount={revealedCount}
          scenario={scenario}
        />
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '7px' }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '17px', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {won(lastPrice)}<span style={{ fontSize: '11px', color: '#606c7e', fontWeight: 400 }}> {priceUnit}</span>
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '13px', fontWeight: 600, color: lineColor }}>
            {chg >= 0 ? '+' : ''}{chg.toFixed(1)}%
          </div>
        </div>
      </PanelCard></div>

      {/* FGI */}
      <div data-tutorial="fgi"><PanelCard
        title="공포탐욕지수" glowColor={evGlow}
        evidencePhase={evidencePhase} src="fgi"
        interps={t.interps?.fgi}
        onPickInterp={(i) => actions.toggleEvidence('fgi', i)}
        selectedEvidences={selectedEvidences}
        onToggle={() => actions.toggleEvidence('fgi')}
        onHelp={() => help === 'fgi' ? actions.closeHelp() : actions.openHelp('fgi')}
        helpKey="fgi" help={help} actions={actions}
        prefMult={charMult.fgi} charHue={charHue}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '27px', fontWeight: 600, color: fgiColor }}>{t.fgi}</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: fgiColor }}>{t.fgiLabel}</div>
        </div>
        <div style={{ position: 'relative', height: '7px', borderRadius: '6px', marginTop: '11px', background: 'linear-gradient(90deg,#3a6fd0,#2f9e6f 50%,#d65a4e)' }}>
          <div style={{
            position: 'absolute', top: '-3px', width: '4px', height: '13px', borderRadius: '3px',
            background: '#1e232b', border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,.25)',
            left: `${t.fgi}%`, transform: 'translateX(-50%)', transition: 'left .5s',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', color: '#7a8395', marginTop: '7px' }}>
          <span>0 공포</span><span>탐욕 100</span>
        </div>
      </PanelCard></div>

      {/* News + Community — 튜토리얼에서 함께 하이라이트 */}
      <div data-tutorial="news-community" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* News */}
        <PanelCard
          title="이 시점의 뉴스" glowColor={evGlow}
          evidencePhase={evidencePhase} src="news"
          interps={t.interps?.news}
          onPickInterp={(i) => actions.toggleEvidence('news', i)}
          selectedEvidences={selectedEvidences}
          onToggle={() => actions.toggleEvidence('news')}
          onHelp={() => help === newsHelpKey ? actions.closeHelp() : actions.openHelp(newsHelpKey)}
          helpKey={newsHelpKey} help={help} actions={actions}
          prefMult={charMult.news} charHue={charHue}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {t.news.map((n, i) => (
              <div key={i} style={{ borderLeft: '2px solid #e4e7ec', paddingLeft: '11px' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 600, lineHeight: 1.5, wordBreak: 'keep-all' }}>{n.t}</div>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', color: '#7a8395', marginTop: '3px' }}>{n.src}</div>
              </div>
            ))}
          </div>
        </PanelCard>

        {/* Community */}
        <PanelCard
          title="커뮤니티" glowColor={evGlow}
          evidencePhase={evidencePhase} src="community"
          interps={t.interps?.community}
          onPickInterp={(i) => actions.toggleEvidence('community', i)}
          selectedEvidences={selectedEvidences}
          onToggle={() => actions.toggleEvidence('community')}
          onHelp={() => help === 'herd' ? actions.closeHelp() : actions.openHelp('herd')}
          helpKey="herd" help={help} actions={actions}
          prefMult={charMult.community} charHue={charHue}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {t.community.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#e8ebef', flexShrink: 0, marginTop: '1px' }} />
                <div style={{ fontSize: '13px', color: '#3d4858', lineHeight: 1.5, wordBreak: 'keep-all' }}>{c.t}</div>
              </div>
            ))}
          </div>
        </PanelCard>
      </div>

      <ChartModal
        open={chartExpanded}
        onClose={() => setChartExpanded(false)}
        revealedCount={revealedCount}
        scenario={scenario}
      />
    </div>
  )
}
