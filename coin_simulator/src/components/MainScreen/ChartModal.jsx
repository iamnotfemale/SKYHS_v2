import { useEffect, useRef, useState } from 'react'
import { buildChart, TOGGLE_BTN } from './PriceChart'

export default function ChartModal({ open, onClose, chartData, revealedCount, playedCount, color }) {
  const containerRef = useRef(null)
  const [chartType, setChartType] = useState('area')

  useEffect(() => {
    if (!open || !containerRef.current || !chartData?.length) return
    const chart = buildChart(containerRef.current, { chartData, revealedCount, playedCount, color, chartType, height: 400 })
    const ro = new ResizeObserver(entries => {
      if (entries[0]) chart.applyOptions({ width: entries[0].contentRect.width })
    })
    ro.observe(containerRef.current)
    return () => { ro.disconnect(); chart.remove() }
  }, [open, chartType, chartData, revealedCount, playedCount, color])

  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(20,30,50,.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: '20px',
          padding: '24px', width: '100%', maxWidth: '740px',
          boxShadow: '0 24px 60px rgba(20,30,50,.22)',
          border: '1px solid #e4e7ec',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e232b', fontFamily: 'Pretendard, system-ui, sans-serif' }}>가격 차트</div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {['area', 'candle'].map(type => (
              <button key={type} onClick={() => setChartType(type)}
                style={{ ...TOGGLE_BTN(chartType === type), padding: '4px 10px', fontSize: '11px', borderRadius: '7px' }}
              >
                {type === 'area' ? '라인' : '봉차트'}
              </button>
            ))}
            <button
              onClick={onClose}
              style={{ marginLeft: '8px', fontSize: '13px', color: '#9099a6', cursor: 'pointer', border: 'none', background: 'none', padding: '4px 8px', fontFamily: 'Pretendard, system-ui, sans-serif' }}
            >
              ✕ 닫기
            </button>
          </div>
        </div>
        <div ref={containerRef} style={{ width: '100%', height: '400px' }} />
      </div>
    </div>
  )
}
