// Upbit 공식 시세 API + alternative.me 공포탐욕지수에서 실데이터를 수집해
// src/data/marketData.js (게임에서 import하는 정적 모듈)를 생성한다.
// 실행: node scripts/fetchMarketData.mjs
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const sleep = ms => new Promise(r => setTimeout(r, ms))

async function getJSON(url) {
  const res = await fetch(url, { headers: { accept: 'application/json' } })
  if (!res.ok) throw new Error(`${res.status} ${url} :: ${await res.text()}`)
  await sleep(200)
  return res.json()
}

// ── Upbit 캔들: KST 날짜 → {open,high,low,close,volume} 맵 ──
function toMap(candles, scale = 1, round = v => Math.round(v)) {
  const map = {}
  for (const c of candles) {
    const date = c.candle_date_time_kst.slice(0, 10)
    map[date] = {
      time:   date,
      open:   round(c.opening_price / scale),
      high:   round(c.high_price / scale),
      low:    round(c.low_price / scale),
      close:  round(c.trade_price / scale),
      volume: Math.round(c.candle_acc_trade_volume),
    }
  }
  return map
}

const r2 = v => Math.round(v * 100) / 100

async function main() {
  // 1) DOGE 일봉 — 업비트 KRW-DOGE는 2021-02 상장이라 상장 이후 전체를 받는다
  //    (배경 히스토리도 이 일봉에서 잘라 쓴다)
  const dogeDays = toMap(await getJSON(
    'https://api.upbit.com/v1/candles/days?market=KRW-DOGE&to=2021-06-02T00:00:00Z&count=150'))

  // 3) BTC 일봉 (2022-11, FTX) — 만원 단위
  const btcDays = toMap(await getJSON(
    'https://api.upbit.com/v1/candles/days?market=KRW-BTC&to=2022-11-26T00:00:00Z&count=30'), 10000)

  // 4) BTC 월봉 배경 (2022-06~10) — 만원 단위. 거래량은 일봉과 스케일을 맞추기 위해 일평균으로 환산
  const btcMonths = toMap(await getJSON(
    'https://api.upbit.com/v1/candles/months?market=KRW-BTC&to=2022-11-01T00:00:00Z&count=8'), 10000)
  for (const k of Object.keys(btcMonths)) btcMonths[k].volume = Math.round(btcMonths[k].volume / 30)

  // 5) 공포탐욕지수 전체 시계열 (UTC 일 단위)
  const fngRaw = await getJSON('https://api.alternative.me/fng/?limit=0')
  const fng = {}
  for (const d of fngRaw.data) {
    const date = new Date(Number(d.timestamp) * 1000).toISOString().slice(0, 10)
    fng[date] = Number(d.value)
  }

  const pick = (map, dates, label) => dates.map(d => {
    if (!map[d]) throw new Error(`${label}: ${d} 데이터 없음`)
    return map[d]
  })

  // ── 게임이 쓰는 날짜 격자 (기존 하드코딩과 동일 구조) ──
  const DOGE_GAME_DATES = ['2021-03-31','2021-04-01','2021-04-06','2021-04-13','2021-04-15','2021-04-16','2021-04-19','2021-04-20','2021-04-21','2021-04-23','2021-04-28','2021-05-03']
  const DOGE_SERIES_DATES = ['2021-03-30','2021-03-31','2021-04-01','2021-04-04','2021-04-08','2021-04-13','2021-04-16','2021-04-18','2021-04-21','2021-04-24','2021-04-28','2021-05-03','2021-05-08','2021-05-15']
  const DOGE_FULL_DATES = ['2021-03-31','2021-04-01','2021-04-06','2021-04-13','2021-04-15','2021-04-16','2021-04-19','2021-04-20','2021-04-21','2021-04-23','2021-04-28','2021-05-03','2021-05-08','2021-05-09','2021-05-15','2021-05-31']
  // 배경: 상장일(2021-02-03)부터 게임 시작 전날(2021-03-30)까지의 실제 일봉
  const DOGE_BG_DATES = Object.keys(dogeDays).filter(d => d < '2021-03-31').sort()
  const FTX_GAME_DATES = ['2022-11-07','2022-11-08','2022-11-09','2022-11-10','2022-11-11','2022-11-12','2022-11-13','2022-11-14','2022-11-15','2022-11-16','2022-11-17','2022-11-20']
  const FTX_SERIES_DATES = [...FTX_GAME_DATES, '2022-11-22']
  const FTX_BG_DATES = ['2022-06-01','2022-07-01','2022-08-01','2022-09-01','2022-10-01']

  const DOGE_GAME = pick(dogeDays, DOGE_GAME_DATES, 'DOGE_GAME')
  const DOGE_BG   = pick(dogeDays, DOGE_BG_DATES, 'DOGE_BG')
  const FTX_GAME  = pick(btcDays, FTX_GAME_DATES, 'FTX_GAME')
  const FTX_BG    = pick(btcMonths, FTX_BG_DATES, 'FTX_BG')

  const DOGE_PRICE_SERIES = DOGE_SERIES_DATES.map(d => dogeDays[d].close)
  const FTX_PRICE_SERIES  = FTX_SERIES_DATES.map(d => btcDays[d].close)
  const DOGE_FULL         = DOGE_FULL_DATES.map(d => dogeDays[d].close)
  const DOGE_CHART_DATA   = DOGE_FULL_DATES.map(d => ({ time: d, value: dogeDays[d].close }))
  const FTX_CHART_DATA    = FTX_SERIES_DATES.map(d => ({ time: d, value: btcDays[d].close }))

  const FGI_BY_DATE = {}
  for (const d of Object.keys(fng)) {
    if ((d >= '2021-03-25' && d <= '2021-05-31') || (d >= '2022-11-01' && d <= '2022-11-25')) {
      FGI_BY_DATE[d] = fng[d]
    }
  }

  const header = `// ⚠ 자동 생성 파일 — 손으로 수정하지 마세요.
// 생성: scripts/fetchMarketData.mjs
// 출처: Upbit 공식 시세 API (api.upbit.com), alternative.me Crypto Fear & Greed Index
// DOGE는 원 단위, BTC(FTX 시나리오)는 만원 단위, 날짜는 KST(캔들)/UTC(FGI)`

  const js = `${header}
export const DOGE_BG = ${JSON.stringify(DOGE_BG, null, 2)}
export const DOGE_GAME = ${JSON.stringify(DOGE_GAME, null, 2)}
export const FTX_BG = ${JSON.stringify(FTX_BG, null, 2)}
export const FTX_GAME = ${JSON.stringify(FTX_GAME, null, 2)}
export const DOGE_PRICE_SERIES = ${JSON.stringify(DOGE_PRICE_SERIES)}
export const FTX_PRICE_SERIES = ${JSON.stringify(FTX_PRICE_SERIES)}
export const DOGE_FULL = ${JSON.stringify(DOGE_FULL)}
export const DOGE_FULL_LABELS = ${JSON.stringify(DOGE_FULL_DATES.map(d => `${Number(d.slice(5,7))}/${Number(d.slice(8,10))}`))}
export const DOGE_CHART_DATA = ${JSON.stringify(DOGE_CHART_DATA, null, 2)}
export const FTX_CHART_DATA = ${JSON.stringify(FTX_CHART_DATA, null, 2)}
export const FGI_BY_DATE = ${JSON.stringify(FGI_BY_DATE, null, 2)}
`
  writeFileSync(join(ROOT, 'src/data/marketData.js'), js, 'utf8')

  // 대사 보정용 리포트: 턴별 날짜·종가·FGI
  const TURN_DATES = DOGE_SERIES_DATES.slice(2, 12)
  const report = {
    dogeEntry: { date: '2021-03-31', close: dogeDays['2021-03-31'].close },
    turns: TURN_DATES.map((d, i) => ({
      turn: i, date: d, close: dogeDays[d].close, fgi: fng[d] ?? null,
      pctFromEntry: Math.round((dogeDays[d].close / dogeDays['2021-03-31'].close - 1) * 100),
    })),
    snl: { d0503: dogeDays['2021-05-03'].close, d0508: dogeDays['2021-05-08'].close, d0509: dogeDays['2021-05-09'].close, d0515: dogeDays['2021-05-15'].close, d0531: dogeDays['2021-05-31'].close },
    dogeSeries: DOGE_SERIES_DATES.map(d => [d, dogeDays[d].close, fng[d] ?? null]),
    ftxSeries: FTX_SERIES_DATES.map(d => [d, btcDays[d].close, fng[d] ?? null]),
  }
  writeFileSync(join(ROOT, 'scripts/marketData.report.json'), JSON.stringify(report, null, 2), 'utf8')
  console.log('OK — src/data/marketData.js, scripts/marketData.report.json 생성')
  console.log(JSON.stringify(report.turns, null, 1))
}

main().catch(e => { console.error('FAILED:', e.message); process.exit(1) })
