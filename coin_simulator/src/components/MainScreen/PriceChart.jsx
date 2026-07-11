import { useEffect, useRef, useState } from 'react'
import { createChart, ColorType, LineStyle, CandlestickSeries, HistogramSeries } from 'lightweight-charts'

// ── Upbit KRW-DOGE 실데이터 (원 단위) ─────────────────────────
// 배경 캔들: 시나리오 시작 전 히스토리 (월봉). DOGE-KRW 상장 시점상 21년 2월부터 존재.
export const DOGE_BG = [
  { time: '2021-02-01', open: 130, high: 241, low: 52, close: 56, volume: 12969466607 },
  { time: '2021-03-01', open: 55,  high: 78,  low: 55, close: 66, volume: 18132589294 },
]

// 게임 캔들: 게임 진행 구간 (일봉)
export const DOGE_GAME = [
  { time: '2021-03-30', open: 65,  high: 67,  low: 64,  close: 65,  volume: 426710062   },
  { time: '2021-04-01', open: 66,  high: 98,  low: 65,  close: 77,  volume: 10469496114 },
  { time: '2021-04-06', open: 81,  high: 95,  low: 75,  close: 86,  volume: 4382040430  },
  { time: '2021-04-13', open: 92,  high: 125, low: 92,  close: 121, volume: 10364152084 },
  { time: '2021-04-15', open: 155, high: 238, low: 151, close: 228, volume: 14682869304 },
  { time: '2021-04-16', open: 229, high: 540, low: 223, close: 467, volume: 45034939707 },
  { time: '2021-04-19', open: 434, high: 575, low: 408, close: 513, volume: 19057469187 },
  { time: '2021-04-20', open: 514, high: 535, low: 340, close: 395, volume: 13737558884 },
  { time: '2021-04-21', open: 398, high: 439, low: 371, close: 388, volume: 6428637074  },
  { time: '2021-04-23', open: 302, high: 316, low: 198, close: 295, volume: 11308049101 },
  { time: '2021-04-28', open: 322, high: 419, low: 298, close: 376, volume: 12573618024 },
  { time: '2021-05-03', open: 453, high: 548, low: 453, close: 539, volume: 4918077240  },
]

// ── Upbit KRW-BTC 실데이터 (만원 단위) — 22년 거래소 파산 ──────────
export const FTX_BG = [
  { time: '2022-01-01', open: 5678, high: 5830, low: 4087, close: 4727, volume: 186665 },
  { time: '2022-02-01', open: 4730, high: 5538, low: 4258, close: 5233, volume: 172489 },
  { time: '2022-03-01', open: 5233, high: 5768, low: 4653, close: 5535, volume: 195589 },
  { time: '2022-04-01', open: 5533, high: 5765, low: 4830, close: 4928, volume: 108908 },
  { time: '2022-05-01', open: 4928, high: 5100, low: 3639, close: 3992, volume: 199855 },
  { time: '2022-06-01', open: 3993, high: 4015, low: 2380, close: 2600, volume: 261944 },
  { time: '2022-07-01', open: 2600, high: 3250, low: 2500, close: 3075, volume: 240035 },
  { time: '2022-08-01', open: 3075, high: 3345, low: 2709, close: 2753, volume: 164987 },
  { time: '2022-09-01', open: 2752, high: 3130, low: 2620, close: 2792, volume: 182874 },
  { time: '2022-10-01', open: 2792, high: 2950, low: 2640, close: 2878, volume: 117291 },
]
export const FTX_GAME = [
  { time: '2022-11-07', open: 2947, high: 2966, low: 2879, close: 2895, volume: 5212  },
  { time: '2022-11-08', open: 2895, high: 2902, low: 2584, close: 2665, volume: 21680 },
  { time: '2022-11-09', open: 2665, high: 2683, low: 2256, close: 2292, volume: 22297 },
  { time: '2022-11-11', open: 2477, high: 2493, low: 2300, close: 2366, volume: 12736 },
  { time: '2022-11-13', open: 2338, high: 2352, low: 2250, close: 2251, volume: 7170  },
  { time: '2022-11-15', open: 2271, high: 2322, low: 2253, close: 2300, volume: 6064  },
  { time: '2022-11-16', open: 2300, high: 2316, low: 2255, close: 2295, volume: 4821  },
  { time: '2022-11-17', open: 2295, high: 2304, low: 2261, close: 2298, volume: 3193  },
  { time: '2022-11-18', open: 2298, high: 2333, low: 2290, close: 2306, volume: 3546  },
  { time: '2022-11-20', open: 2308, high: 2313, low: 2265, close: 2279, volume: 4008  },
  { time: '2022-11-22', open: 2222, high: 2272, low: 2203, close: 2258, volume: 4830  },
]

// ── Upbit KRW-ETH 실데이터 (만원 단위) — 21년 10월 이더리움 고점 ─────
export const TOP_BG = [
  { time: '2021-01-01', open: 82,  high: 163, low: 79,  close: 144, volume: 13680035 },
  { time: '2021-02-01', open: 144, high: 235, low: 141, close: 163, volume: 5333205  },
  { time: '2021-03-01', open: 163, high: 234, low: 162, close: 233, volume: 2983301  },
  { time: '2021-04-01', open: 233, high: 332, low: 232, close: 327, volume: 3778037  },
  { time: '2021-05-01', open: 327, high: 541, low: 218, close: 317, volume: 10418769 },
  { time: '2021-06-01', open: 317, high: 336, low: 200, close: 264, volume: 5225825  },
  { time: '2021-07-01', open: 264, high: 296, low: 204, close: 292, volume: 3326704  },
  { time: '2021-08-01', open: 293, high: 405, low: 287, close: 401, volume: 3011685  },
  { time: '2021-09-01', open: 401, high: 468, low: 338, close: 366, volume: 2544241  },
]
export const TOP_GAME = [
  { time: '2021-10-01', open: 366, high: 403, low: 365, close: 401, volume: 113116 },
  { time: '2021-10-08', open: 436, high: 447, low: 432, close: 436, volume: 56829  },
  { time: '2021-10-19', open: 463, high: 476, low: 461, close: 474, volume: 44383  },
  { time: '2021-10-21', open: 504, high: 530, low: 495, close: 497, volume: 132665 },
  { time: '2021-10-28', open: 482, high: 517, low: 475, close: 517, volume: 78326  },
  { time: '2021-11-09', open: 581, high: 583, low: 567, close: 571, volume: 41429  },
  { time: '2021-11-22', open: 530, high: 540, low: 508, close: 513, volume: 47879  },
  { time: '2021-11-26', open: 561, high: 565, low: 511, close: 515, volume: 103690 },
  { time: '2021-11-30', open: 555, high: 590, low: 543, close: 574, volume: 92563  },
  { time: '2021-12-04', open: 536, high: 536, low: 438, close: 520, volume: 232043 },
  { time: '2021-12-15', open: 478, high: 514, low: 455, close: 504, volume: 90285  },
]

// ── Upbit KRW-SOL 실데이터 (원 단위) — 25년 하반기 알트코인 급락 ────
export const NOW_BG = [
  { time: '2025-01-01', open: 282350, high: 454500, low: 262000, close: 354300, volume: 29698682 },
  { time: '2025-02-01', open: 354200, high: 358000, low: 186100, close: 218650, volume: 15867529 },
  { time: '2025-03-01', open: 218650, high: 272000, low: 168300, close: 186050, volume: 18503655 },
  { time: '2025-04-01', open: 186200, high: 225800, low: 143050, close: 213100, volume: 15053024 },
  { time: '2025-05-01', open: 213050, high: 259450, low: 201600, close: 221350, volume: 10037946 },
  { time: '2025-06-01', open: 221150, high: 230700, low: 176150, close: 210600, volume: 7685079  },
  { time: '2025-07-01', open: 210650, high: 279650, low: 199000, close: 240000, volume: 19571463 },
  { time: '2025-08-01', open: 240000, high: 304600, low: 218800, close: 279800, volume: 29869990 },
  { time: '2025-09-01', open: 279700, high: 350800, low: 272100, close: 297600, volume: 19458545 },
]
export const NOW_GAME = [
  { time: '2025-10-06', open: 327800, high: 336900, low: 326600, close: 331400, volume: 517956  },
  { time: '2025-10-09', open: 330200, high: 331500, low: 318800, close: 322700, volume: 553538  },
  { time: '2025-10-10', open: 322700, high: 326300, low: 271600, close: 292900, volume: 1471822 },
  { time: '2025-10-14', open: 310700, high: 314900, low: 291000, close: 304100, volume: 1093568 },
  { time: '2025-10-21', open: 284400, high: 293700, low: 275700, close: 279600, volume: 623278  },
  { time: '2025-10-29', open: 289500, high: 297700, low: 284900, close: 290000, volume: 502258  },
  { time: '2025-11-04', open: 247300, high: 252700, low: 218600, close: 233700, volume: 1561673 },
  { time: '2025-11-10', open: 244300, high: 252000, low: 242000, close: 247500, volume: 613521  },
  { time: '2025-11-14', open: 219900, high: 221000, low: 205400, close: 211200, volume: 1026700 },
  { time: '2025-11-18', open: 195800, high: 210700, low: 192500, close: 208400, volume: 949309  },
  { time: '2025-11-21', open: 200400, high: 202600, low: 183000, close: 193400, volume: 1683480 },
]

export const SCENARIO_CHART_DATA = {
  doge: { bg: DOGE_BG, game: DOGE_GAME, coinLabel: 'DOGE/KRW' },
  ftx:  { bg: FTX_BG,  game: FTX_GAME,  coinLabel: 'BTC/KRW' },
  top:  { bg: TOP_BG,  game: TOP_GAME,  coinLabel: 'ETH/KRW' },
  now:  { bg: NOW_BG,  game: NOW_GAME,  coinLabel: 'SOL/KRW' },
}

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

    const cd = SCENARIO_CHART_DATA[scenario] || SCENARIO_CHART_DATA.doge
    const rawBg   = cd.bg
    const rawGame = cd.game

    const bgCandles   = applyInterval(rawBg, interval)
    const allGame     = applyInterval(rawGame, interval)
    const revGame     = allGame.slice(0, revealedCount)

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
