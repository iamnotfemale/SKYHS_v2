import { useEffect, useRef, useState } from 'react'
import { createChart, ColorType, LineStyle, CandlestickSeries, HistogramSeries } from 'lightweight-charts'
import { DOGE_BG, DOGE_GAME, FTX_BG, FTX_GAME } from '../../data/marketData'

// Upbit 공식 API 실데이터 (scripts/fetchMarketData.mjs 생성)
// ChartModal이 이 모듈에서 가져다 쓰므로 재수출한다
export { DOGE_BG, DOGE_GAME, FTX_BG, FTX_GAME }

// ── 인터벌 집계 ───────────────────────────────────────────────
function getMondayStr(dateStr) {
  const d = new Date(dateStr)
  const day = d.getUTCDay()
  d.setUTCDate(d.getUTCDate() - (day === 0 ? 6 : day - 1))
  return d.toISOString().split('T')[0]
}
function getMonthStr(dateStr) { return dateStr.slice(0, 7) + '-01' }

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

function applyInterval(candles, interval) {
  if (interval === 'W') return aggregate(candles, getMondayStr)
  if (interval === 'M') return aggregate(candles, getMonthStr)
  return candles
}

// ── 차트 생성 (앱 테마: 흰 배경) ─────────────────────────────
export function createDarkChart(container, height) {
  return createChart(container, {
    layout: {
      background: { type: ColorType.Solid, color: '#fff' },
      textColor: '#9099a6',
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 11,
    },
    grid: {
      vertLines: { color: '#f0f2f5' },
      horzLines: { color: '#f0f2f5' },
    },
    crosshair: {
      vertLine: { color: '#c8cdd4', style: LineStyle.Dashed, width: 1 },
      horzLine: { color: '#c8cdd4', style: LineStyle.Dashed, width: 1 },
    },
    rightPriceScale: { borderVisible: false, textColor: '#aab0ba', scaleMargins: { top: 0.05, bottom: 0.22 } },
    timeScale: { borderVisible: false, timeVisible: true, secondsVisible: false },
    handleScroll: true,
    handleScale: true,
    width: container.clientWidth,
    height,
  })
}

const INTERVAL_LABEL = { D: '일', W: '주', M: '월' }

export default function PriceChart({ revealedCount, scenario = 'doge' }) {
  const containerRef    = useRef(null)
  const chartRef        = useRef(null)
  const cancelRef       = useRef(false)
  const prevRevealedRef = useRef(0)
  const prevIntervalRef = useRef('D')
  const [interval, setIntervalType] = useState('D')

  useEffect(() => {
    if (!containerRef.current) return

    cancelRef.current = true
    if (chartRef.current) { chartRef.current.remove(); chartRef.current = null }

    const chart = createDarkChart(containerRef.current, 220)
    chartRef.current = chart
    cancelRef.current = false

    const rawBg   = scenario === 'doge' ? DOGE_BG   : FTX_BG
    const rawGame = scenario === 'doge' ? DOGE_GAME  : FTX_GAME

    const allGame     = applyInterval(rawGame, interval)
    const revGame     = allGame.slice(0, revealedCount)
    // 배경·게임 캔들이 같은 주/월 버킷에 겹치면 거래량 시리즈에 시간 중복이 생겨 차트가 죽는다.
    const gameStart   = allGame[0]?.time
    const bgCandles   = gameStart
      ? applyInterval(rawBg, interval).filter(c => c.time < gameStart)
      : applyInterval(rawBg, interval)

    // ── 배경 시리즈 (연한 회색 — 히스토리 맥락) ──────────────
    const bgSeries = chart.addSeries(CandlestickSeries, {
      upColor:         'rgba(214,90,78,.08)',
      downColor:       'rgba(58,111,208,.08)',
      borderUpColor:   '#e8c5c2',
      borderDownColor: '#c2cce8',
      wickUpColor:     '#e8c5c2',
      wickDownColor:   '#c2cce8',
      priceFormat:     { type: 'price', precision: 0, minMove: 1 },
      lastValueVisible: false,
      priceLineVisible: false,
    })
    bgSeries.setData(bgCandles)

    // ── 게임 시리즈 (한국 컨벤션: 상승=빨강, 하락=파랑) ──────
    const gameSeries = chart.addSeries(CandlestickSeries, {
      upColor:         '#d65a4e',
      downColor:       '#3a6fd0',
      borderUpColor:   '#d65a4e',
      borderDownColor: '#3a6fd0',
      wickUpColor:     '#d65a4e',
      wickDownColor:   '#3a6fd0',
      priceFormat:     { type: 'price', precision: 0, minMove: 1 },
      lastValueVisible: false,
      priceLineVisible: false,
    })

    // ── 거래량 히스토그램 (하단 20%) ─────────────────────────
    const volSeries = chart.addSeries(HistogramSeries, {
      priceFormat:    { type: 'volume' },
      priceScaleId:   'vol',
      lastValueVisible: false,
    })
    chart.priceScale('vol').applyOptions({
      scaleMargins: { top: 0.82, bottom: 0 },
    })

    const buildVol = (bgC, gameC) => [
      ...bgC.map(c => ({ time: c.time, value: c.volume, color: '#eef0f3' })),
      ...gameC.map(c => ({ time: c.time, value: c.volume, color: c.close >= c.open ? 'rgba(214,90,78,.25)' : 'rgba(58,111,208,.25)' })),
    ]

    // 인터벌 변경 → 즉시 전체 표시
    const intervalChanged = interval !== prevIntervalRef.current
    const startFrom       = intervalChanged ? 0 : Math.min(prevRevealedRef.current, revGame.length)

    if (startFrom > 0) {
      gameSeries.setData(revGame.slice(0, startFrom))
      volSeries.setData(buildVol(bgCandles, revGame.slice(0, startFrom)))
    }

    // 새 캔들만 스태거드 애니메이션
    const animate = async () => {
      for (let i = startFrom; i < revGame.length; i++) {
        if (cancelRef.current) return
        const slice = revGame.slice(0, i + 1)
        gameSeries.setData(slice)
        volSeries.setData(buildVol(bgCandles, slice))
        if (i < revGame.length - 1 && !intervalChanged) {
          await new Promise(r => setTimeout(r, 260))
        }
      }
      if (!cancelRef.current) {
        chart.timeScale().fitContent()
        prevRevealedRef.current = revGame.length
        prevIntervalRef.current = interval
      }
    }
    animate()

    const ro = new ResizeObserver(entries => {
      if (entries[0] && chartRef.current) {
        chartRef.current.applyOptions({ width: entries[0].contentRect.width })
      }
    })
    ro.observe(containerRef.current)

    return () => {
      cancelRef.current = true
      ro.disconnect()
      if (chartRef.current) { chartRef.current.remove(); chartRef.current = null }
    }
  }, [interval, revealedCount, scenario])

  return (
    <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #e4e7ec', marginTop: '2px' }}>
      <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end', padding: '8px 10px 0', background: '#fff' }}>
        {Object.entries(INTERVAL_LABEL).map(([k, label]) => (
          <button key={k} onClick={() => setIntervalType(k)}
            style={{
              padding: '3px 9px', borderRadius: '5px', fontSize: '10px',
              fontFamily: "'IBM Plex Mono',monospace", cursor: 'pointer',
              background: interval === k ? '#1e232b' : 'transparent',
              color:      interval === k ? '#fff' : '#aab0ba',
              border:     `1px solid ${interval === k ? '#1e232b' : 'transparent'}`,
              transition: 'all .12s',
            }}
          >{label}</button>
        ))}
      </div>
      <div ref={containerRef} style={{ width: '100%', height: '220px' }} />
    </div>
  )
}
