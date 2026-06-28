import { useEffect, useRef } from 'react'
import { createChart, ColorType, LineStyle, AreaSeries, LineSeries, createSeriesMarkers } from 'lightweight-charts'

export default function PriceChart({ chartData, revealedCount, playedCount, color = '#FFB800' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || !chartData.length) return

    const chart = createChart(containerRef.current, {
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
      width: containerRef.current.clientWidth,
      height: 180,
    })

    // 공개 구간 (실선 + 그라디언트 fill)
    const revealed = chartData.slice(0, revealedCount)
    const mainSeries = chart.addSeries(AreaSeries, {
      lineColor: color,
      topColor: color + '30',
      bottomColor: color + '05',
      lineWidth: 2,
      priceFormat: { type: 'price', precision: 0, minMove: 1 },
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
      lastValueVisible: false,
      priceLineVisible: false,
    })
    mainSeries.setData(revealed)

    // 현재 가격 마커
    if (revealed.length > 0) {
      createSeriesMarkers(mainSeries, [{
        time: revealed[revealed.length - 1].time,
        position: 'inBar',
        color,
        shape: 'circle',
        size: 1,
      }])
    }

    // 미공개 게임 구간 (회색 점선)
    if (revealedCount < playedCount) {
      const hidden = chartData.slice(revealedCount - 1, playedCount)
      const hiddenSeries = chart.addSeries(LineSeries, {
        color: '#d0d4db',
        lineWidth: 1.5,
        lineStyle: LineStyle.Dashed,
        crosshairMarkerVisible: false,
        lastValueVisible: false,
        priceLineVisible: false,
      })
      hiddenSeries.setData(hidden)
    }

    // SNL/미래 구간 (빨간 점선)
    if (chartData.length > playedCount) {
      const future = chartData.slice(playedCount - 1)
      const futureSeries = chart.addSeries(LineSeries, {
        color: '#d65a4e',
        lineWidth: 1.5,
        lineStyle: LineStyle.Dashed,
        crosshairMarkerVisible: false,
        lastValueVisible: false,
        priceLineVisible: false,
      })
      futureSeries.setData(future)
    }

    chart.timeScale().fitContent()

    const ro = new ResizeObserver(entries => {
      if (entries[0]) chart.applyOptions({ width: entries[0].contentRect.width })
    })
    ro.observe(containerRef.current)

    return () => {
      ro.disconnect()
      chart.remove()
    }
  }, [chartData, revealedCount, playedCount, color])

  return <div ref={containerRef} style={{ width: '100%', height: '180px' }} />
}
