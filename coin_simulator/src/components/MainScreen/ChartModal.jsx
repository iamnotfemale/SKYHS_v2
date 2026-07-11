import { useEffect, useRef, useState } from 'react'
import { CandlestickSeries, HistogramSeries } from 'lightweight-charts'
import { createDarkChart, SCENARIO_CHART_DATA } from './PriceChart'
import { getScenarioData } from '../../data/gameContent'

function aggregate(candles, keyFn) {
  const map = {}
  for (const c of candles) {
    const k = keyFn(c.time)
    if (!map[k]) map[k] = { time: k, open: c.open, high: c.high, low: c.low, close: c.close, volume: c.volume }
    else {
      map[k].high   = Math.max(map[k].high, c.high)
      map[k].low    = Math.min(map[k].low, c.low)
      map[k].close  = c.close
      map[k].volume += c.volume
    }
  }
  return Object.values(map).sort((a, b) => a.time.localeCompare(b.time))
}
function getMondayStr(d) { const dt = new Date(d); const day = dt.getUTCDay(); dt.setUTCDate(dt.getUTCDate() - (day === 0 ? 6 : day - 1)); return dt.toISOString().split('T')[0] }
function getMonthStr(d) { return d.slice(0, 7) + '-01' }
function applyInterval(candles, interval) {
  if (interval === 'W') return aggregate(candles, getMondayStr)
  if (interval === 'M') return aggregate(candles, getMonthStr)
  return candles
}

const INTERVAL_LABEL = { D: '일', W: '주', M: '월' }

export default function ChartModal({ open, onClose, revealedCount, scenario = 'doge' }) {
  const containerRef = useRef(null)
  const chartRef     = useRef(null)
  const cancelRef    = useRef(false)
  const [interval, setIntervalType] = useState('D')

  useEffect(() => {
    if (!open || !containerRef.current) return

    cancelRef.current = true
    if (chartRef.current) { chartRef.current.remove(); chartRef.current = null }

    const chart = createDarkChart(containerRef.current, 420)
    chartRef.current = chart
    cancelRef.current = false

    const cd      = SCENARIO_CHART_DATA[scenario] || SCENARIO_CHART_DATA.doge
    const rawBg   = cd.bg
    const rawGame = cd.game

    const allGame   = applyInterval(rawGame, interval)
    const revGame   = allGame.slice(0, revealedCount)
    // 배경·게임 캔들이 같은 주/월 버킷으로 합쳐지면 거래량 시리즈에 시간 중복이 생겨 차트가 죽는다.
    // 게임 첫 버킷 이후의 배경 캔들을 잘라 중복을 원천 차단.
    const gameStart = allGame[0]?.time
    const bgCandles = gameStart
      ? applyInterval(rawBg, interval).filter(c => c.time < gameStart)
      : applyInterval(rawBg, interval)

    const bgSeries = chart.addSeries(CandlestickSeries, {
      upColor: 'rgba(214,90,78,.08)', downColor: 'rgba(58,111,208,.08)',
      borderUpColor: '#e8c5c2', borderDownColor: '#c2cce8',
      wickUpColor: '#e8c5c2', wickDownColor: '#c2cce8',
      priceFormat: { type: 'price', precision: 0, minMove: 1 },
      lastValueVisible: false, priceLineVisible: false,
    })
    bgSeries.setData(bgCandles)

    const gameSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#d65a4e', downColor: '#3a6fd0',
      borderUpColor: '#d65a4e', borderDownColor: '#3a6fd0',
      wickUpColor: '#d65a4e', wickDownColor: '#3a6fd0',
      priceFormat: { type: 'price', precision: 0, minMove: 1 },
      lastValueVisible: false, priceLineVisible: false,
    })
    gameSeries.setData(revGame)

    const volSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' }, priceScaleId: 'vol', lastValueVisible: false,
    })
    chart.priceScale('vol').applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } })
    volSeries.setData([
      ...bgCandles.map(c => ({ time: c.time, value: c.volume, color: '#eef0f3' })),
      ...revGame.map(c => ({ time: c.time, value: c.volume, color: c.close >= c.open ? 'rgba(214,90,78,.25)' : 'rgba(58,111,208,.25)' })),
    ])

    chart.timeScale().fitContent()

    const ro = new ResizeObserver(entries => {
      if (entries[0] && chartRef.current) chartRef.current.applyOptions({ width: entries[0].contentRect.width })
    })
    ro.observe(containerRef.current)

    return () => {
      cancelRef.current = true
      ro.disconnect()
      if (chartRef.current) { chartRef.current.remove(); chartRef.current = null }
    }
  }, [open, interval, revealedCount, scenario])

  if (!open) return null

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: '20px',
        padding: '20px', width: '100%', maxWidth: '820px',
        boxShadow: '0 24px 60px rgba(20,30,50,.18)',
        border: '1px solid #e4e7ec',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '12px', color: '#9099a6', letterSpacing: '.08em' }}>
            {getScenarioData(scenario).coinLabel} · 가격 차트
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {Object.entries(INTERVAL_LABEL).map(([k, label]) => (
              <button key={k} onClick={() => setIntervalType(k)}
                style={{
                  padding: '4px 10px', borderRadius: '6px', fontSize: '11px',
                  fontFamily: "'IBM Plex Mono',monospace", cursor: 'pointer',
                  background: interval === k ? '#1e232b' : 'transparent',
                  color:      interval === k ? '#fff' : '#aab0ba',
                  border:     `1px solid ${interval === k ? '#1e232b' : 'transparent'}`,
                }}
              >{label}</button>
            ))}
            <button onClick={onClose} style={{
              marginLeft: '10px', fontSize: '12px', color: '#9099a6',
              cursor: 'pointer', border: '1px solid #e4e7ec', background: 'transparent',
              borderRadius: '6px', padding: '4px 10px', fontFamily: "'IBM Plex Mono',monospace",
            }}>✕ 닫기</button>
          </div>
        </div>
        <div ref={containerRef} style={{ width: '100%', height: '420px' }} />
      </div>
    </div>
  )
}
