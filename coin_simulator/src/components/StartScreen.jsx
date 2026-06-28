import { useGameStore } from '../store/gameStore'

const DOGE_PTS = [65, 77, 86, 121, 228, 467, 513, 395, 388, 295]
const D_MIN = Math.min(...DOGE_PTS), D_MAX = Math.max(...DOGE_PTS)
const CW = 160, CH = 70
const D_COORDS = DOGE_PTS.map((v, i) => {
  const x = (i / (DOGE_PTS.length - 1)) * CW
  const y = CH - ((v - D_MIN) / (D_MAX - D_MIN)) * CH
  return `${x.toFixed(1)},${y.toFixed(1)}`
})
const D_LINE = `M${D_COORDS.join('L')}`
const D_AREA = `${D_LINE}L${CW},${CH}L0,${CH}Z`

export default function StartScreen() {
  const receive = useGameStore(s => s.actions.receive)

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      background: 'linear-gradient(135deg, #0d1117 0%, #1a1f2e 60%, #0f1620 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 배경 글로우 */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,184,0,.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '36px', zIndex: 1 }}>

        {/* 상단 레이블 */}
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', letterSpacing: '.2em', color: '#4a5568', textTransform: 'uppercase' }}>
          COIN EMOTION GAME · 투자 감정 시뮬레이터
        </div>

        {/* ── 폰 목업 ── */}
        <div style={{
          position: 'relative',
          width: '220px',
          height: '420px',
          borderRadius: '38px',
          background: 'linear-gradient(180deg, #1c2130 0%, #141822 100%)',
          border: '2px solid #2a3040',
          boxShadow: '0 30px 80px rgba(0,0,0,.7), 0 0 0 1px #0d1117, inset 0 1px 0 rgba(255,255,255,.05)',
          overflow: 'hidden',
        }}>
          {/* 노치 */}
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80px', height: '26px', background: '#0d1117', borderRadius: '0 0 18px 18px', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1e2535' }} />
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#2a3345', marginTop: '1px' }} />
          </div>

          <div style={{ paddingTop: '34px', paddingLeft: '16px', paddingRight: '16px' }}>
            {/* 상태 바 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '9px', color: '#4a5568', letterSpacing: '.06em' }}>
                INCOMING · 2021.04.19
              </div>
              <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end' }}>
                {[5, 7, 9, 5].map((h, i) => (
                  <div key={i} style={{ width: '3px', height: `${h}px`, background: i < 2 ? '#FFB800' : '#2a3345', borderRadius: '1px' }} />
                ))}
              </div>
            </div>

            {/* 발신자 아바타 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ position: 'relative', width: '72px', height: '72px' }}>
                <div className="anim-ringPulse" style={{ position: 'absolute', inset: '-8px', borderRadius: '50%', border: '1.5px solid rgba(255,184,0,.35)' }} />
                <div className="anim-ringPulse" style={{ position: 'absolute', inset: '-18px', borderRadius: '50%', border: '1px solid rgba(255,184,0,.15)', animationDelay: '.7s' }} />
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #2a2010, #3a2d10)', border: '2px solid rgba(255,184,0,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>
                  😰
                </div>
              </div>
              <div style={{ marginTop: '10px', fontSize: '15px', fontWeight: 700, color: '#e8e8e8' }}>김불안</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', animation: 'pulseGrow 1.2s ease-in-out infinite' }} />
                <div style={{ fontSize: '10px', color: '#9099a6', fontFamily: "'IBM Plex Mono',monospace" }}>패닉 중...</div>
              </div>
            </div>

            {/* DOGE 미니 차트 */}
            <div style={{ background: 'rgba(255,184,0,.04)', borderRadius: '12px', border: '1px solid rgba(255,184,0,.12)', padding: '8px 10px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '8px', color: '#FFB800', letterSpacing: '.06em' }}>DOGE/KRW</div>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '9px', color: '#ef4444', fontWeight: 700 }}>-42.5%</div>
              </div>
              <svg viewBox={`0 0 ${CW} ${CH}`} style={{ width: '100%', height: '52px', display: 'block', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="dgGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFB800" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#FFB800" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={D_AREA} fill="url(#dgGrad)" />
                <path d={D_LINE} fill="none" stroke="#FFB800" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={(6 / 9) * CW} cy="0.5" r="2.5" fill="#FFB800" opacity="0.8" />
                <line x1={(6 / 9) * CW} y1="3" x2={(6 / 9) * CW} y2={CH} stroke="rgba(255,184,0,.15)" strokeWidth="1" strokeDasharray="3,3" />
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '7px', color: '#4a5568' }}>Apr 1</div>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '7px', color: '#FFB800', opacity: 0.7 }}>▲ May 8</div>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '7px', color: '#4a5568' }}>May 3</div>
              </div>
            </div>

            {/* 수신 / 거절 버튼 */}
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  📵
                </div>
                <div style={{ fontSize: '9px', color: '#4a5568' }}>거절</div>
              </div>

              <button onClick={receive} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <div style={{ position: 'relative', width: '54px', height: '54px' }}>
                  <div style={{ position: 'absolute', inset: '-8px', borderRadius: '50%', background: 'rgba(34,197,94,.15)', animation: 'pulseGrow 1.4s ease-in-out infinite' }} />
                  <div
                    style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'linear-gradient(135deg, #16a34a, #22c55e)', boxShadow: '0 4px 20px rgba(34,197,94,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', position: 'relative', zIndex: 1, transition: 'transform .15s' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={e => e.currentTarget.style.transform = ''}
                  >
                    📞
                  </div>
                </div>
                <div style={{ fontSize: '9px', color: '#22c55e', fontWeight: 600 }}>수신</div>
              </button>
            </div>
          </div>

          {/* 홈 바 */}
          <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', width: '60px', height: '4px', borderRadius: '2px', background: '#2a3040' }} />
        </div>

        {/* 폰 아래 텍스트 */}
        <div style={{ textAlign: 'center', maxWidth: '320px' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#e8e8e8', lineHeight: 1.4 }}>
            "끝났어요… 지금 다 팔까요?"
          </div>
          <div style={{ fontSize: '13px', color: '#5a6880', marginTop: '8px', lineHeight: 1.7 }}>
            패닉에 빠진 김불안을&nbsp;
            <span style={{ color: '#FFB800' }}>근거 있는 조언</span>으로 진정시켜라.
          </div>
        </div>

        {/* 메인 CTA */}
        <button
          onClick={receive}
          style={{
            padding: '14px 40px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 6px 24px rgba(34,197,94,.4)',
            transition: 'transform .15s, box-shadow .15s',
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(34,197,94,.5)' }}
          onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 24px rgba(34,197,94,.4)' }}
        >
          📞&nbsp;&nbsp;전화 받기
        </button>

        <div style={{ fontSize: '10px', color: '#3a4050', fontFamily: "'IBM Plex Mono',monospace", letterSpacing: '.05em' }}>
          DOGE · 실제 Upbit 2021 데이터 기반 · Gemini AI 반응
        </div>
      </div>
    </div>
  )
}
