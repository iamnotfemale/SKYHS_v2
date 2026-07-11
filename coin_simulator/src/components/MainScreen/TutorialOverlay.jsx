import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useGameStore } from '../../store/gameStore'

const STEPS = [
  {
    target: 'persona',
    title: '페르소나의 현재 상태',
    body: '중앙의 캐릭터는 선택한 페르소나입니다. LLM이 이 인물의 성향과 현재 시장 상황을 바탕으로 생각과 감정을 들려줍니다.',
  },
  {
    target: 'advice',
    title: '조언을 고르세요',
    body: '캐릭터의 말만 믿지 말고, 지금 상황에 가장 적절한 조언을 직접 선택하세요. 다음에는 그 판단을 뒷받침할 증거를 확인합니다.',
  },
  {
    target: 'assets',
    title: '내 자산',
    body: '현재 보유 자산과 수익률입니다. 시장의 움직임과 내 선택이 이 수치에 반영됩니다. 감정이 흔들려도 기준점으로 삼아 보세요.',
  },
  {
    target: 'chart',
    title: '주식 그래프',
    body: '가격 흐름은 가장 직접적인 시장 증거입니다. 추세와 변동 폭을 읽되, 그래프 하나만으로 성급하게 결론내리지는 마세요.',
  },
  {
    target: 'fgi',
    title: '공포·탐욕 지수',
    body: '시장이 얼마나 공포 또는 탐욕에 기울었는지 보여줍니다. 모두가 한쪽으로 쏠릴수록, 군중 심리에 휩쓸리지 않는 판단이 중요합니다.',
  },
  {
    target: 'news-community',
    title: '뉴스와 커뮤니티',
    body: '뉴스는 사건과 맥락을, 커뮤니티는 투자자들의 분위기를 보여줍니다. 둘 다 중요한 단서지만, 과장과 소문도 섞여 있을 수 있습니다.',
  },
  {
    target: 'trust-dice',
    title: '신뢰도와 확률 주사위',
    body: '선택한 증거가 조언과 얼마나 잘 맞는지에 따라 신뢰도가 바뀝니다. 신뢰도가 높을수록 합리적 판단에 성공할 확률이 커집니다.',
  },
]

function useTargetRect(target) {
  const [rect, setRect] = useState(null)

  useLayoutEffect(() => {
    const update = () => {
      const el = document.querySelector(`[data-tutorial="${target}"]`)
      if (!el) return
      const next = el.getBoundingClientRect()
      setRect({ top: next.top, left: next.left, width: next.width, height: next.height })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    const frame = requestAnimationFrame(update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
      cancelAnimationFrame(frame)
    }
  }, [target])

  return rect
}

export default function TutorialOverlay() {
  const tutorialStep = useGameStore(s => s.tutorialStep)
  const actions = useGameStore(s => s.actions)
  const step = STEPS[tutorialStep]
  const rect = useTargetRect(step.target)
  const copyRef = useRef(null)
  const [copyHeight, setCopyHeight] = useState(185)

  useEffect(() => {
    const target = document.querySelector(`[data-tutorial="${step.target}"]`)
    target?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
  }, [step.target])

  useLayoutEffect(() => {
    const updateHeight = () => setCopyHeight(copyRef.current?.getBoundingClientRect().height || 185)
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [tutorialStep])

  const advance = () => {
    if (tutorialStep === STEPS.length - 1) actions.finishTutorial()
    else actions.nextTutorialStep()
  }

  const bubbleWidth = Math.min(460, Math.max(0, window.innerWidth - 40))
  const sideGap = Math.min(20, Math.max(8, (window.innerWidth - bubbleWidth) / 2))
  const minLeft = bubbleWidth / 2 + sideGap
  const maxLeft = window.innerWidth - bubbleWidth / 2 - sideGap
  const desiredLeft = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
  const bubbleLeft = Math.max(minLeft, Math.min(desiredLeft, maxLeft))
  const belowTop = rect ? rect.top + rect.height + 18 : 120
  const aboveTop = rect ? rect.top - copyHeight - 18 : belowTop
  const desiredTop = rect && belowTop + copyHeight > window.innerHeight - 16 && aboveTop >= 16 ? aboveTop : belowTop
  const bubbleTop = Math.max(16, Math.min(desiredTop, window.innerHeight - copyHeight - 16))

  return (
    <div className="tutorial-overlay" onClick={advance} role="button" tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') advance() }} aria-label="다음 튜토리얼 안내 보기">
      {rect && <div className="tutorial-spotlight" style={{ top: rect.top - 8, left: rect.left - 8, width: rect.width + 16, height: rect.height + 16 }} />}
      <div ref={copyRef} className="tutorial-copy" key={tutorialStep} style={{ top: bubbleTop, left: bubbleLeft }}>
        <div className="tutorial-step">TUTORIAL {tutorialStep + 1} / {STEPS.length}</div>
        <div className="tutorial-title">{step.title}</div>
        <p>{step.body}</p>
        <div className="tutorial-next">화면을 클릭해 계속하기</div>
      </div>
    </div>
  )
}
