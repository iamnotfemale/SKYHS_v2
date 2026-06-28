import { useEffect, useRef, useState } from 'react'
import { createChart, ColorType, LineStyle, AreaSeries, LineSeries, CandlestickSeries, createSeriesMarkers } from 'lightweight-charts'

const DOGE_CANDLES = [
  { time: '2021-03-31', open: 62,  high: 68,  low: 60,  close: 65  },
  { time: '2021-04-01', open: 65,  high: 80,  low: 64,  close: 77  },
  { time: '2021-04-06', open: 77,  high: 92,  low: 75,  close: 86  },
  { time: '2021-04-13', open: 86,  high: 135, low: 84,  close: 121 },
  { time: '2021-04-15', open: 121, high: 245, low: 118, close: 228 },
  { time: '2021-04-16', open: 228, high: 510, low: 220, close: 467 },
  { time: '2021-04-19', open: 467, high: 555, low: 450, close: 513 },
  { time: '2021-04-20', open: 513, high: 520, low: 370, close: 395 },
  { time: '2021-04-21', open: 395, high: 415, low: 360, close: 388 },
  { time: '2021-04-23', open: 388, high: 395, low: 270, close: 295 },
  { time: '2021-04-28', open: 295, high: 390, low: 290, close: 376 },
  { time: '2021-05-03', open: 376, high: 560, low: 372, close: 539 },
  { time: '2021-05-08', open: 539, high: 545, low: 400, close: 440 },
  { time: '2021-05-09', open: 440, high: 445, low: 350, close: 380 },
  { time: '2021-05-15', open: 380, high: 385, low: 255, close: 280 },
  { time: '2021-05-31', open: 280, high: 290, low: 185, close: 200 },
]

const FTX_CANDLES = [
  { time: '2022-11-07', open: 2950, high: 2980, low: 2850, close: 2895 },
  { time: '2022-11-08', open: 2895, high: 2900, low: 2500, close: 2665 },
  { time: '2022-11-09', open: 2665, high: 2680, low: 2100, close: 2292 },
  { time: '2022-11-10', open: 2292, high: 2450, low: 2250, close: 2366 },
  { time: '2022-11-11', open: 2366, high: 2380, low: 2150, close: 2251 },
  { time: '2022-11-12', open: 2251, high: 2360, low: 2230, close: 2300 },
  { time: '2022-11-13', open: 2300, high: 2320, low: 2260, close: 2295 },
  { time: '2022-11-14', open: 2295, high: 2340, low: 2270, close: 2298 },
  { time: '2022-11-15', open: 2298, high: 2350, low: 2290, close: 2306 },
  { time: '2022-11-16', open: 2306, high: 2310, low: 2190, close: 2222 },
  { time: '2022-11-17', open: 2222, high: 2290, low: 2210, close: 2258 },
  { time: '2022-11-20', open: 2258, high: 2300, low: 2245, close: 2273 },
  { time: '2022-11-22', open: 2273, high: 2330, low: 2265, close: 2292 },
]

export { DOGE_CANDLES, FTX_CANDLES }

function buildChart(container, { chartData, revealedCount, playedCount, color, chartType, height }) {
  const chart = createChart(container, {
    layout: {
      background: { type: ColorType.Solid, color: 'transparent' },
      textColor: '#9099a6',
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 10,
    },
    grid: {
      vertLines: { color: 'rgba(228,231,236,0.4)' },
      horzLines: { color: 'rgba(228,231,236,0.4)' },
    },
    crosshair: {
      vertLine: { color: '#9099a6', style: LineStyle.Dashed },
      horzLine: { color: '#9099a6', style: LineStyle.Dashed },
    },
    rightPriceScale: { borderVisible: false, scaleMargins: { top: 0.1, bottom: 0.1 } },
    timeScale: { borderVisible: false, timeVisible: false },
    handleScroll: false,
    handleScale: false,
    width: container.clientWidth,
    height,
  })

  if (chartType === 'candle') {
    const candles = color === '#3a6fd0' ? FTX_CANDLES : DOGE_CANDLES
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#d65a4e',
      downColor: '#3a6fd0',
      borderUpColor: '#d65a4e',
      borderDownColor: '#3a6fd0',
      wickUpColor: '#d65a4e',
      wickDownColor: '#3a6fd0',
      priceFormat: { type: 'price', precision: 0, minMove: 1 },
      lastValueVisible: false,
      priceLineVisible: false,
    })
    candleSeries.setData(candles.slice(0, revealedCount))
  } else {
    const revealed = chartData.slice(0, revealedCount)
    const mainSeries = chart.addSeries(AreaSeries, {
      lineColor: color,
      topColor: color + '28',
      bottomColor: color + '04',
      lineWidth: 2,
      priceFormat: { type: 'price', precision: 0, minMove: 1 },
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
      lastValueVisible: false,
      priceLineVisible: false,
    })
    mainSeries.setData(revealed)

    if (revealed.length > 0) {
      createSeriesMarkers(mainSeries, [{
        time: revealed[revealed.length - 1].time,
        position: 'inBar',
        color,
        shape: 'circle',
        size: 1,
      }])
    }
  }

  chart.timeScale().fitContent()
  return chart
}

const TOGGLE_BTN = (active) => ({
  padding: '3px 8px', borderRadius: '6px', fontSize: '10px',
  fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600,
  background: active ? '#1e232b' : '#f4f6f9',
  color: active ? '#fff' : '#9099a6',
  border: `1px solid ${active ? '#1e232b' : '#e4e7ec'}`,
  cursor: 'pointer', transition: 'all .12s',
})

export default function PriceChart({ chartData, revealedCount, playedCount, color = '#FFB800' }) {
  const containerRef = useRef(null)
  const [chartType, setChartType] = useState('area')

  useEffect(() => {
    if (!containerRef.current || !chartData.length) return
    const chart = buildChart(containerRef.current, { chartData, revealedCount, playedCount, color, chartType, height: 180 })
    const ro = new ResizeObserver(entries => {
      if (entries[0]) chart.applyOptions({ width: entries[0].contentRect.width })
    })
    ro.observe(containerRef.current)
    return () => { ro.disconnect(); chart.remove() }
  }, [chartData, revealedCount, playedCount, color, chartType])

  return (
    <div>
      <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end', marginBottom: '6px' }}>
        {['area', 'candle'].map(type => (
          <button key={type} onClick={() => setChartType(type)} style={TOGGLE_BTN(chartType === type)}>
            {type === 'area' ? '라인' : '봉차트'}
          </button>
        ))}
      </div>
      <div ref={containerRef} style={{ width: '100%', height: '180px' }} />
    </div>
  )
}

export { buildChart, TOGGLE_BTN }
