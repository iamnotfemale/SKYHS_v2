import { useEffect, useState, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'
import {
  TURNS, DOGE_TURNS, CHARACTERS, PRICE_SERIES, DOGE_PRICE_SERIES,
  ENTRY_PRICE, DOGE_ENTRY_PRICE, REVEAL, DOGE_REVEAL,
  SRCLABEL,
  getSystemPrompt, buildSayPrompt, buildDogeSayPrompt,
} from '../../data/gameContent'
import {
  ADVICE_DIRS, CLASSIFY_SYSTEM_PROMPT, buildClassifyPrompt, classifyLocally,
  buildReflectPromptV2,
} from '../../data/prompts'
import { useClaude } from '../../hooks/useClaude'

const FACE_STYLES = {
  panic:    { eye: { width: '7px', height: '12px', background: '#fff', borderRadius: '50%' },    mouth: { width: '22px', height: '11px', borderTop: '3px solid #fff', borderRadius: '22px 22px 0 0' } },
  anxious:  { eye: { width: '8px', height: '9px',  background: '#fff', borderRadius: '50%' },    mouth: { width: '20px', height: '9px',  borderTop: '3px solid #fff', borderRadius: '20px 20px 0 0' } },
  neutral:  { eye: { width: '8px', height: '8px',  background: '#fff', borderRadius: '50%' },    mouth: { width: '20px', height: '3px',  background: '#fff', borderRadius: '2px' } },
  excited:  { eye: { width: '9px', height: '9px',  background: '#fff', borderRadius: '50%' },    mouth: { width: '22px', height: '10px', borderBottom: '3px solid #fff', borderRadius: '0 0 22px 22px' } },
  relieved: { eye: { width: '10px', height: '6px', background: '#fff', borderRadius: '0 0 10px 10px' }, mouth: { width: '20px', height: '9px', borderBottom: '3px solid #fff', borderRadius: '0 0 20px 20px' } },
  greedy:   { eye: { width: '11px', height: '11px', background: '#fff', borderRadius: '50%' },   mouth: { width: '26px', height: '13px', borderBottom: '4px solid #fff', borderRadius: '0 0 26px 26px' } },
}

function Avatar({ face, color, anim }) {
  const fs = FACE_STYLES[face] || FACE_STYLES.neutral
  return (
    <div style={{ width: '100px', height: '100px', borderRadius: '30px', background: color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '11px', boxShadow: '0 10px 30px rgba(20,30,50,.14)', transition: 'background .5s', animation: anim !== 'none' ? anim : undefined }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={fs.eye} /><div style={fs.eye} />
      </div>
      <div style={fs.mouth} />
    </div>
  )
}

function TypingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: '4px', alignItems: 'center', height: '20px' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7a8395', animation: `floatUp .9s ease ${i * 0.2}s infinite` }} />
      ))}
    </span>
  )
}

const DIR_TAG = { sell:'매도', partial_sell:'분할매도', hold:'관망', partial_buy:'분할매수', buy:'매수' }
const WEIGHT_COLORS = ['#2f9e6f', '#3a6fd0', '#dd8a4a']
const WEIGHT_PCT    = ['100%', '50%', '25%']

export default function ChatPanel() {
  const turn              = useGameStore(s => s.turn)
  const phase             = useGameStore(s => s.phase)
  const stage             = useGameStore(s => s.stage)
  const advice            = useGameStore(s => s.advice)
  const result            = useGameStore(s => s.result)
  const blew              = useGameStore(s => s.blew)
  const char              = useGameStore(s => s.char)
  const scenario          = useGameStore(s => s.scenario)
  const selectedEvidences = useGameStore(s => s.selectedEvidences)
  const cash              = useGameStore(s => s.cash)
  const units             = useGameStore(s => s.units)
  const customAdvice      = useGameStore(s => s.customAdvice)
  const interventionOptions = useGameStore(s => s.interventionOptions)
  const pending           = useGameStore(s => s.pending)
  const strikes           = useGameStore(s => s.strikes)
  const actions           = useGameStore(s => s.actions)

  const { generate, loading } = useClaude()
  // 분류용 별도 인스턴스 — 말풍선 로딩 상태와 분리
  const { generate: classify, loading: classifying } = useClaude()

  const [geminiSay,     setGeminiSay]     = useState('')
  const [geminiReflect, setGeminiReflect] = useState('')
  const [reflectReady,  setReflectReady]  = useState(false)
  const [freeText,      setFreeText]      = useState('')
  const [classifyFail,  setClassifyFail]  = useState(false)

  const prevTurnRef   = useRef(-1)
  const prevResultRef = useRef(null)

  const isDoge      = scenario === 'doge'
  const turns       = isDoge ? DOGE_TURNS  : TURNS
  const priceSeries = isDoge ? DOGE_PRICE_SERIES : PRICE_SERIES
  const entryPrice  = isDoge ? DOGE_ENTRY_PRICE  : ENTRY_PRICE
  const reveal      = isDoge ? DOGE_REVEAL : REVEAL

  const t        = turns[turn]
  const charData = CHARACTERS.find(c => c.id === char)
  const charName = charData?.name || ''

  // Turn 시작 → Gemini say 생성
  useEffect(() => {
    if (prevTurnRef.current === turn) return
    prevTurnRef.current = turn
    setGeminiSay('')
    setGeminiReflect('')
    setReflectReady(false)
    setFreeText('')
    setClassifyFail(false)

    const price  = priceSeries[reveal[turn]]
    const pct    = (price / entryPrice - 1) * 100
    const canBuyNow = useGameStore.getState().cash > 0
    const prompt = isDoge ? buildDogeSayPrompt(turn, price, pct, canBuyNow) : buildSayPrompt(turn, price, pct, canBuyNow)
    const sys    = getSystemPrompt(char, scenario)
    generate(prompt, sys).then(text => { if (text) setGeminiSay(text) })
  }, [turn, generate, isDoge, char, scenario])

  // stage 3 도달 → Gemini reflect 생성
  useEffect(() => {
    if (!result || stage < 3 || reflectReady) return
    if (prevResultRef.current === result) return
    prevResultRef.current = result
    setReflectReady(true)

    const prompt = buildReflectPromptV2(result, charName)
    const sys    = getSystemPrompt(char, scenario)
    generate(prompt, sys).then(text => { if (text) setGeminiReflect(text) })
  }, [result, stage, reflectReady, generate, char, scenario, charName])

  const inResult       = phase === 'result'
  const inIntervention = phase === 'intervention'

  const charHue = charData?.hue || '#3a6fd0'

  // Avatar 상태
  let face, color, anim = 'none', moodLabel
  if (inIntervention) {
    if (pending?.result?.panicAction === 'buy') {
      color = '#d65a4e'; face = 'greedy'; moodLabel = 'FOMO 폭주 직전'; anim = 'pulseGrow 1.2s infinite'
    } else {
      color = '#2f64c8'; face = 'panic'; moodLabel = '패닉 직전'; anim = 'tremble .35s infinite'
    }
  } else if (inResult && stage >= 2) {
    const o = result?.outcome
    if (o === 'good')                        { color = '#2f9e6f'; face = 'relieved'; moodLabel = '합리적 판단 · 안도' }
    else if (o === 'near')                   { color = '#dd8a4a'; face = 'anxious';  moodLabel = '간신히 버팀' }
    else if (result?.panicAction === 'buy')  { color = '#d65a4e'; face = 'greedy';   moodLabel = 'FOMO 폭주'; anim = 'pulseGrow 1.2s infinite' }
    else                                     { color = '#2f64c8'; face = 'panic';    moodLabel = '패닉 · 투매'; anim = 'tremble .35s infinite' }
  } else if (inResult) {
    color = charHue
    face  = t.baseFace === 'panic' ? 'panic' : 'anxious'
    moodLabel = '판단 중…'
    if (t.baseFace === 'panic') anim = 'tremble .35s infinite'
  } else {
    color = charHue
    face  = t.baseFace
    moodLabel = t.baseMood
    if (t.baseFace === 'panic')   anim = 'tremble .35s infinite'
    if (t.baseFace === 'excited' || t.baseFace === 'greedy') anim = 'pulseGrow 1.2s infinite'
  }

  // 대사 결정 (Gemini 우선, 실패 시 하드코딩 폴백)
  let dialogue, isLoading = false
  if (inIntervention) {
    dialogue = pending?.result?.panicAction === 'buy'
      ? '아니에요, 지금 안 사면 진짜 늦어요!! 저 매수 버튼 누를 거예요!!'
      : '더는 못 버티겠어요!! 지금 전부 팔아버릴 거예요!!'
  } else if (inResult) {
    if (stage >= 3) {
      dialogue  = geminiReflect || result?.reflect || '…'
      isLoading = stage >= 3 && !geminiReflect && loading
    } else {
      isLoading = true
    }
  } else {
    // 실탄(현금)이 없는데 탐욕 턴이면 "더 사자" 스크립트 대신 못 사서 애타는 폴백
    const scriptedSay = (cash <= 0 && t.panicAction === 'buy')
      ? '더 사고 싶은데… 현금이 하나도 없어요 ㅠㅠ 지금이라도 좀 팔아야 하나요?'
      : t.say
    dialogue  = geminiSay || scriptedSay || '…'
    isLoading = !geminiSay && loading
  }

  // 행동 배너 — rational: 사용자 조언 따름, irrational: 페르소나 충동
  const DIR_ACTION = {
    sell:         { text: '전량 매도',   color: '#2f64c8', bg: '#e9eefb' },
    partial_sell: { text: '분할 매도',   color: '#3a6fd0', bg: '#edf0fb' },
    hold:         { text: '관망 유지',   color: '#27865e', bg: '#eaf6f0' },
    partial_buy:  { text: '분할 매수',   color: '#b05a1a', bg: '#fbf0e3' },
    buy:          { text: '추격 매수',   color: '#c0473d', bg: '#fbeceb' },
  }
  let actionText = '', actionColor = '', actionBg = ''
  if (inResult && result) {
    const pa = result.panicAction
    if (result.rational) {
      // 사용자 조언 방향으로 행동
      const d = DIR_ACTION[result.dir] || DIR_ACTION.hold
      actionText = `${d.text} — 조언 따름`
      actionColor = d.color; actionBg = d.bg
    } else if (result.outcome === 'near') {
      actionText = pa === 'buy' ? '추격매수 참음 (동요)' : '던질 뻔하다 보유 (동요)'
      actionColor = '#b67e1f'; actionBg = '#fbf3e3'
    } else {
      if (pa === 'buy') {
        // FOMO 매수 — 게임오버 아님, 과다 노출. 인과만 표시.
        const cause = result.dir === 'partial_buy' ? '분할만 권했지만 흥분을 못 이기고'
                    : result.dir === 'buy'         ? '매수 권유가 FOMO에 불을 질러'
                    :                                 '못 말리고'
        actionText = `추격 매수 — ${cause}`
        actionColor = '#c0473d'; actionBg = '#fbeceb'
      } else {
        // 패닉셀 — 스트라이크
        const strikeTag = result.strikeAction === 'partial' ? ' ⚡스트라이크 1/2' : ''
        const word  = result.strikeAction === 'partial' ? '절반 매도' : '전량 매도'
        const cause = result.dir === 'partial_sell' ? '분할만 권했지만 공포를 못 이기고'
                    : result.dir === 'sell'         ? '매도 권유가 공포에 불을 질러'
                    :                                  '못 말리고'
        actionText = `${word} — ${cause}${strikeTag}`
        actionColor = '#2f64c8'; actionBg = '#e9eefb'
      }
    }
  }

  // 이번 턴 실제 체결 금액 (만원) — 캐릭터가 얼마 사고 팔았나
  const tradeNote = (inResult && result?.traded)
    ? `${charName} · ${result.traded.side === 'buy' ? '매수' : '매도'} ${Math.round(result.traded.krw).toLocaleString('ko-KR')}만원${result.traded.capped ? ' · 남은 실탄 전액' : ''}`
    : ''

  const chosenAdvice = customAdvice || (advice ? t.advices.find(a => a.id === advice)?.label || '' : '')
  const nextLabel    = (blew || turn >= turns.length - 1) ? '결과 보기 →' : '다음 턴 →'

  // 자유 입력 조언 — LLM이 방향만 분류(통역), 실패 시 키워드 폴백, 채점은 스토어 코드
  const submitFree = async () => {
    const text = freeText.trim()
    if (!text || classifying || phase !== 'advice') return
    setClassifyFail(false)

    let dir = null
    const raw = await classify(buildClassifyPrompt(text), CLASSIFY_SYSTEM_PROMPT, { json: true })
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (ADVICE_DIRS.includes(parsed?.dir)) dir = parsed.dir
      } catch { /* 폴백으로 */ }
    }
    if (!dir) dir = classifyLocally(text)
    if (!dir) { setClassifyFail(true); return }

    // 실탄·보유량 제약 — 살 돈/팔 코인이 없으면 그 방향은 막는다
    if ((dir === 'sell' || dir === 'partial_sell') && units <= 0) { setClassifyFail('sell'); return }
    if ((dir === 'buy'  || dir === 'partial_buy')  && cash  <= 0) { setClassifyFail('buy');  return }

    setFreeText('')
    actions.pickAdviceFree(dir, text)
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
      <div data-tutorial="persona" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ margin: '14px 0 6px' }}>
        <Avatar face={face} color={color} anim={anim} />
      </div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#4e5a6e' }}>{charName}</div>

      {/* 말풍선 */}
      <div key={`${turn}-${inResult}-${stage}`} className="anim-fadeIn" style={{ position: 'relative', background: '#f4f6f9', borderRadius: '16px', padding: '17px 19px', marginTop: '18px', width: '100%', maxWidth: '470px', minHeight: '64px' }}>
        <div style={{ position: 'absolute', top: '-8px', left: '36px', width: '16px', height: '16px', background: '#f4f6f9', transform: 'rotate(45deg)' }} />
        {isLoading
          ? <TypingDots />
          : <div style={{ fontSize: '15.5px', lineHeight: 1.6, color: '#1e232b', wordBreak: 'keep-all', overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{dialogue}</div>
        }
      </div>
      </div>

      <div style={{ flex: 1, minHeight: '14px' }} />

      {/* 본능 체크 — 점수 무관, 엔딩 '거울'의 재료 */}
      {phase === 'instinct' && (
        <div className="anim-fadeIn" style={{ width: '100%', maxWidth: '470px' }}>
          <div style={{ padding: '15px 17px', borderRadius: '13px', background: '#1e232b', color: '#fff' }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', letterSpacing: '.1em', color: '#9099a6', marginBottom: '6px' }}>INSTINCT CHECK</div>
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>상담 전에, 솔직하게 — 당신 계좌라면 지금?</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { pick: 'buy',    label: '사고 싶다',  hue: '#e07d72' },
                { pick: 'sell',   label: '팔고 싶다',  hue: '#6d95e4' },
                { pick: 'unsure', label: '모르겠다',   hue: '#8b95a3' },
              ].map(o => (
                <button key={o.pick} onClick={() => actions.pickInstinct(o.pick)}
                  style={{ flex: 1, padding: '11px 0', borderRadius: '10px', background: 'rgba(255,255,255,.08)', border: `1.5px solid ${o.hue}55`, color: o.hue, fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background .15s' }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,.16)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,.08)'}
                >{o.label}</button>
              ))}
            </div>
            <div style={{ fontSize: '11px', color: '#7a8395', marginTop: '10px' }}>점수와 무관합니다. 이 대답은 엔딩에서 다시 만나게 됩니다.</div>
          </div>
        </div>
      )}

      {/* 긴급개입 — 임계 돌파, 마지막 설득 기회 (게임당 1회) */}
      {phase === 'intervention' && (
        <div className="anim-pop" style={{ width: '100%', maxWidth: '470px' }}>
          <div style={{ padding: '15px 17px', borderRadius: '13px', background: '#fbeceb', border: '1.5px solid #d65a4e' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#c0473d', marginBottom: '4px' }}>
              🚨 {charName}이(가) {pending?.result?.panicAction === 'buy' ? '풀매수' : '전량 매도'} 버튼에 손을 올렸어요!
            </div>
            <div style={{ fontSize: '12px', color: '#8a4a43', marginBottom: '11px' }}>
              마지막 한마디 — 아직 꺼내지 않은 근거 중 <b>정확한 해석 하나</b>로 설득하세요. 틀린 해석이면 막지 못합니다.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {interventionOptions.map((o, i) => (
                <button key={i} onClick={() => actions.attemptIntervention(o.src, o.idx)}
                  style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 11px', borderRadius: '9px', background: '#fff', border: '1.5px solid #e4c5c2', cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color .15s' }}
                  onMouseOver={e => e.currentTarget.style.borderColor = '#c0473d'}
                  onMouseOut={e => e.currentTarget.style.borderColor = '#e4c5c2'}
                >
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '9.5px', fontWeight: 700, color: '#8a4a43', background: '#fbeceb', borderRadius: '4px', padding: '2px 6px', flexShrink: 0 }}>{SRCLABEL[o.src]}</span>
                  <span style={{ fontSize: '12px', lineHeight: 1.45, color: '#2c333f' }}>{o.text}</span>
                </button>
              ))}
            </div>
            <button onClick={actions.skipIntervention}
              style={{ width: '100%', marginTop: '9px', padding: '9px', borderRadius: '9px', background: 'none', border: '1px dashed #d1a5a0', color: '#8a4a43', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}
            >…말릴 수 없다. 지켜본다</button>
          </div>
        </div>
      )}

      {/* 조언 선택 */}
      {phase === 'advice' && (
        <div data-tutorial="advice" className="anim-fadeIn" style={{ width: '100%', maxWidth: '470px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#606c7e', marginBottom: '9px' }}>① 어떤 조언을 건넬까요?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {t.advices.map(a => {
              const isSell = a.dir === 'sell' || a.dir === 'partial_sell'
              const isBuy  = a.dir === 'buy'  || a.dir === 'partial_buy'
              const disabled = (isSell && units <= 0) || (isBuy && cash <= 0)
              const reason = disabled ? (isSell ? '보유 코인 없음' : '현금 없음') : ''
              return (
              <button key={a.id} disabled={disabled} onClick={() => !disabled && actions.pickAdvice(a.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left', padding: '9px 13px', borderRadius: '11px', background: disabled ? '#f4f5f7' : '#fff', border: '1.5px solid #e4e7ec', transition: 'border-color .15s,background .15s,transform .12s', cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: disabled ? 0.55 : 1 }}
                onMouseOver={e => { if (disabled) return; e.currentTarget.style.borderColor='#1e232b'; e.currentTarget.style.background='#fafbfc'; e.currentTarget.style.transform='translateY(-1px)' }}
                onMouseOut={e => { e.currentTarget.style.borderColor='#e4e7ec'; e.currentTarget.style.background=disabled?'#f4f5f7':'#fff'; e.currentTarget.style.transform='' }}
              >
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', fontWeight: 600, color: '#fff', background: disabled ? '#b0b7c1' : '#1e232b', padding: '2px 8px', borderRadius: '6px', flexShrink: 0 }}>{DIR_TAG[a.dir] || a.tag}</span>
                <span style={{ fontSize: '13px', lineHeight: 1.45, color: disabled ? '#9099a6' : '#2c333f' }}>{a.label}</span>
                {disabled && <span style={{ marginLeft: 'auto', fontSize: '10.5px', color: '#b0b7c1', whiteSpace: 'nowrap', flexShrink: 0 }}>{reason}</span>}
              </button>
              )
            })}
          </div>

          {/* 자유 입력 — 내 말로 조언하기 */}
          <div style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', gap: '7px' }}>
              <input
                value={freeText}
                onChange={e => { setFreeText(e.target.value); if (classifyFail) setClassifyFail(false) }}
                onKeyDown={e => { if (e.key === 'Enter') submitFree() }}
                placeholder="또는, 직접 조언을 건네보세요…"
                maxLength={80}
                disabled={classifying}
                style={{ flex: 1, padding: '10px 13px', borderRadius: '11px', border: '1.5px solid #e4e7ec', fontSize: '13px', fontFamily: 'inherit', outline: 'none', background: '#fff', color: '#1e232b', transition: 'border-color .15s' }}
                onFocus={e => e.currentTarget.style.borderColor = '#1e232b'}
                onBlur={e => e.currentTarget.style.borderColor = '#e4e7ec'}
              />
              <button
                onClick={submitFree}
                disabled={classifying || !freeText.trim()}
                style={{ padding: '10px 16px', borderRadius: '11px', background: classifying || !freeText.trim() ? '#b0b7c1' : '#1e232b', color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: classifying || !freeText.trim() ? 'default' : 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'background .15s' }}
              >{classifying ? '해석 중…' : '전달 →'}</button>
            </div>
            {classifyFail && (
              <div className="anim-fadeIn" style={{ fontSize: '11.5px', color: '#c0473d', marginTop: '6px' }}>
                {classifyFail === 'sell' ? '팔 코인이 없어요 — 매도 조언은 지금 불가능해요.'
                 : classifyFail === 'buy' ? '살 현금이 없어요 — 매수 조언은 지금 불가능해요.'
                 : '무슨 뜻인지 파악하지 못했어요 — 위 버튼으로 골라주세요.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 근거 선택 + 제출 */}
      {phase === 'evidence' && (
        <div className="anim-fadeIn" style={{ width: '100%', maxWidth: '470px' }}>
          {/* 선택된 조언 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '11px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#606c7e' }}>내 조언</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e232b', background: '#eef2fb', border: '1px solid #cdd9f2', borderRadius: '20px', padding: '4px 12px' }}>"{chosenAdvice}"</span>
            <button onClick={actions.resetAdvice} style={{ fontSize: '11px', color: '#606c7e', marginLeft: 'auto', cursor: 'pointer', border: 'none', background: 'none' }}>조언 바꾸기</button>
          </div>

          {/* 선택된 근거 칩 */}
          {selectedEvidences.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px 16px', borderRadius: '13px', background: '#f7faf8', border: '1.5px dashed #bfe3d0' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: '#eaf6f0', color: '#2f9e6f', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>＋</div>
              <div style={{ fontSize: '13px', color: '#5b6470', lineHeight: 1.5 }}>
                ② 왼쪽 패널에서 {t.interps
                  ? <>각 카드의 <b style={{ color: '#27865e' }}>해석</b> 중 옳다고 판단한 것을 고르세요. (최대 3개)</>
                  : <><b style={{ color: '#27865e' }}>＋ 근거</b> 버튼으로 근거를 선택하세요. (최대 3개)</>}
              </div>
            </div>
          ) : (
            <div style={{ padding: '13px 14px', borderRadius: '13px', background: '#f7faf8', border: '1.5px solid #bfe3d0' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#27865e', marginBottom: '9px' }}>② 선택된 근거 (가중 합산)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {selectedEvidences.map((sel, i) => (
                  <div key={sel.src} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', fontWeight: 700, color: '#fff', background: WEIGHT_COLORS[i], borderRadius: '5px', padding: '2px 6px', flexShrink: 0, marginTop: '1px' }}>{WEIGHT_PCT[i]}</span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1e232b' }}>{SRCLABEL[sel.src]}</span>
                      {t.interps && sel.idx != null && (
                        <span style={{ display: 'block', fontSize: '11.5px', color: '#5b6470', lineHeight: 1.4, marginTop: '1px' }}>{t.interps[sel.src][sel.idx].text}</span>
                      )}
                    </span>
                    <button onClick={() => actions.toggleEvidence(sel.src, sel.idx)} style={{ marginLeft: 'auto', fontSize: '11px', color: '#7a8395', cursor: 'pointer', border: 'none', background: 'none', flexShrink: 0 }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 제출 버튼 */}
          {selectedEvidences.length > 0 && (
            <button
              className="anim-fadeIn"
              onClick={actions.submitEvidence}
              style={{ width: '100%', marginTop: '10px', padding: '14px', borderRadius: '13px', background: '#1e232b', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: 'inherit', transition: 'background .15s' }}
              onMouseOver={e => e.currentTarget.style.background = '#2c333f'}
              onMouseOut={e => e.currentTarget.style.background = '#1e232b'}
            >
              근거 제출하기 →
            </button>
          )}
        </div>
      )}

      {/* 긴급개입 결과 노트 */}
      {inResult && stage >= 2 && result?.intervention?.attempted && (
        <div className="anim-fadeIn" style={{ width: '100%', maxWidth: '470px', marginBottom: '8px', padding: '10px 14px', borderRadius: '11px', fontSize: '12.5px', lineHeight: 1.5,
          background: result.intervention.success ? '#eaf6f0' : '#fbf3e3',
          color: result.intervention.success ? '#27865e' : '#8a6a1f' }}>
          {result.intervention.success
            ? <>🆘 마지막 한마디가 통했습니다 — <b>{result.intervention.srcLabel}</b> · "{result.intervention.text}"</>
            : <>🆘 마지막 설득이 통하지 않았습니다 — 근거가 약하거나 틀린 해석이었어요.</>}
        </div>
      )}

      {/* 행동 배너 */}
      {inResult && stage >= 2 && (
        <div className="anim-pop" style={{ width: '100%', maxWidth: '470px', display: 'flex', alignItems: 'center', gap: '11px', padding: '14px 16px', borderRadius: '13px', background: actionBg }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', fontWeight: 600, color: actionColor, background: '#fff', borderRadius: '7px', padding: '4px 8px', flexShrink: 0 }}>행동</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: actionColor }}>{actionText}</div>
            {tradeNote
              ? <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11.5px', color: actionColor, opacity: .85, marginTop: '2px' }}>{tradeNote}</div>
              : (inResult && result && !result.traded && <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11.5px', color: actionColor, opacity: .7, marginTop: '2px' }}>{result.buyFizzled ? `${charName} · 실탄 소진 — 추격 불발` : `${charName} · 매매 없음 (보유 유지)`}</div>)
            }
          </div>
        </div>
      )}

      {/* 다음 버튼 */}
      {inResult && stage >= 3 && (
        <button className="anim-fadeIn" onClick={actions.next}
          style={{ width: '100%', maxWidth: '470px', marginTop: '10px', padding: '15px', borderRadius: '13px', background: '#1e232b', color: '#fff', fontSize: '15px', fontWeight: 600, transition: 'background .15s', cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}
          onMouseOver={e => e.currentTarget.style.background = '#2c333f'}
          onMouseOut={e => e.currentTarget.style.background = '#1e232b'}
        >
          {nextLabel}
        </button>
      )}
    </div>
  )
}
