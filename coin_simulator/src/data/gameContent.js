// ─── FTX 시나리오 데이터 ────────────────────────────────
// 시세·차트 데이터는 Upbit 공식 API에서 수집한 실데이터 (scripts/fetchMarketData.mjs)
import {
  DOGE_PRICE_SERIES as MD_DOGE_PRICE_SERIES,
  FTX_PRICE_SERIES  as MD_FTX_PRICE_SERIES,
  DOGE_CHART_DATA   as MD_DOGE_CHART_DATA,
  FTX_CHART_DATA    as MD_FTX_CHART_DATA,
} from './marketData.js'

export const INVESTED    = 1000;

// Upbit KRW-BTC 실제 일봉 종가 (만원 단위, 2022-11-07~11-22)
export const PRICE_SERIES = MD_FTX_PRICE_SERIES;
export const ENTRY_PRICE  = PRICE_SERIES[0];   // 2022-11-07 종가
export const REVEAL       = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const PLAYED_LEN   = 11;
// 가격 시리즈 인덱스 → 실제 날짜 (2022, FTX)
export const FTX_DATES = [
  '2022-11-07','2022-11-08','2022-11-09','2022-11-10','2022-11-11','2022-11-12','2022-11-13',
  '2022-11-14','2022-11-15','2022-11-16','2022-11-17','2022-11-20','2022-11-22',
];

export const SRCQ     = {fgi:'best', chart:'strong', news:'news', community:'social'};
export const SRCLABEL = {fgi:'공포탐욕지수', chart:'차트·지지선', news:'뉴스', community:'커뮤니티'};

export const SCORE_TABLE = {
  sell:         {best:-14, strong:-12, news:-18, social:-16},
  partial_sell: {best:-7,  strong:-6,  news:-10, social:-9},
  hold:         {best:30,  strong:25,  news:-10, social:-8},
  partial_buy:  {best:5,   strong:4,   news:-7,  social:-7},
  buy:          {best:8,   strong:6,   news:-12, social:-12},
};

export const DICT = {
  fgi:         {term:'공포탐욕지수',            body:'시장 심리를 0(극단적 공포)~100(극단적 탐욕)으로 환산한 지표. 숫자가 낮을수록 다들 무서워 파는 중 — 역설적으로 바닥 신호일 때가 많다. 가장 강한 판단 근거.'},
  support:     {term:'지지선',                  body:'과거에 여러 번 떨어졌다 반등한 가격대. 매수세가 모이는 바닥 후보. 거래량이 줄면 투매가 끝나간다는 신호.'},
  panicsell:   {term:'패닉셀',                  body:'공포에 질려 손해를 감수하고 한꺼번에 던지는 것. 대개 바닥 근처에서 터진다. 단기 악재 뉴스만 보고 버티라 하면 근거가 약하다.'},
  deadcat:     {term:'데드캣 바운스',            body:'급락 뒤 잠깐 튀었다가 다시 빠지는 일시적 반등. 거래량 없이 오르면 의심해야 한다.'},
  volume:      {term:'거래량',                  body:'얼마나 사고팔렸는지. 잦은 매매는 수수료로 자산을 갉아먹는다. 급락에 거래량이 터지면 투매 신호.'},
  herd:        {term:'군중심리 (허딩)',           body:'남들이 사면 따라 사고 팔면 따라 파는 쏠림. 커뮤니티 분위기는 근거가 아니라 분위기다 — 가장 약한 판단 재료.'},
  contagion:   {term:'연쇄 파산 (전이 리스크)',   body:'한 거래소의 붕괴가 다른 거래소·프로젝트로 번지는 것. FTX 이후 실제로 여러 곳이 도미노로 무너졌다.'},
  accumulation:{term:'바닥 매집',               body:'기관·고래가 낮은 가격에서 조용히 사들이는 행동. 거래량 없이 횡보 중 은근히 오르면 신호일 수 있다.'},
  fomo:        {term:'FOMO (포모)',              body:'Fear Of Missing Out. 오르는 걸 보고 나만 못 탄 것 같아 추격하는 심리. 탐욕지수가 높을수록 FOMO가 강해지며, 고점 추격으로 이어진다.'},
  meme:        {term:'밈코인 리스크',            body:'밈코인은 펀더멘털 없이 소셜 미디어와 인플루언서 발언 하나에 50~100% 오르내린다. 뉴스보다 빠르게 움직이며 예측이 어렵다.'},
  pyramid:     {term:'과열 · 펌핑',             body:'단기간 급등 후 매수 에너지가 소진되면 급락하는 구조. 신규 매수자가 없어지면 초기 진입자가 팔면서 가격이 무너진다.'},
};

export const CHARACTERS = [
  {id:'kim',  name:'김불안', weak:'공포',        tip:'안심시킬 근거 제시',  desc:'작은 악재에도 크게 흔들린다', hue:'#3a6fd0', locked:false},
  {id:'park', name:'박욕심', weak:'탐욕',        tip:'흥분 가라앉히기',    desc:'오르면 더 사려고 안달',       hue:'#d65a4e', locked:false},
  {id:'lee',  name:'이초보', weak:'정보 휩쓸림',  tip:'뉴스 거르는 법 코칭', desc:'헤드라인에 휘둘린다',        hue:'#7a83d0', locked:false},
  {id:'choi', name:'최존버', weak:'고집',        tip:'때론 움직이게',      desc:'무슨 일이 있어도 안 판다',    hue:'#2f9e6f', locked:false},
];

// 캐릭터별 근거 유형 가중치 (1.0 = 중립, 1.4+ = 선호, 0.8- = 비선호)
// 성격 약점(weak)에 따라 먹히는 근거와 안 먹히는 근거의 격차를 크게 벌려,
// "이 캐릭터에게는 이 근거"라는 매칭 감각이 뚜렷하게 드러나도록 설계.
export const CHAR_EVIDENCE_MULT = {
  // 공포형: 객관적 수치(공탐지수·뉴스)로 안심시켜야 먹힌다. 소문·분위기(커뮤니티)는 오히려 불안을 키운다.
  kim:  { fgi: 1.7, news: 1.4, chart: 0.9, community: 0.4 },
  // 탐욕형: 오르는 그래프와 남들 뛰어드는 분위기에만 반응한다. 차분한 지표·뉴스는 흥을 깬다고 무시.
  park: { chart: 1.8, community: 1.4, fgi: 0.8, news: 0.4 },
  // 정보 휩쓸림형: 뉴스 헤드라인과 커뮤니티 여론에 통째로 휩쓸린다. 지지선·공탐지수 같은 용어는 낯설어 와닿지 않는다.
  lee:  { news: 1.8, community: 1.7, chart: 0.5, fgi: 0.4 },
  // 고집형: 눈에 보이는 숫자(차트·지수)만 믿는다. 뉴스나 커뮤니티 "의견"은 원천적으로 걸러 듣지 않는다.
  choi: { chart: 1.7, fgi: 1.5, news: 0.4, community: 0.3 },
};

export const SCENARIOS = [
  {id:'doge', name:'21년 도지코인 광풍',  axis:'탐욕',     note:'밈코인 · FOMO · 일론 트윗',       locked:false},
  {id:'ftx',  name:'22년 거래소 파산',    axis:'공포',     note:'FTX 붕괴 · 패닉셀 · 공포탐욕지수', locked:false},
  {id:'top',  name:'21년 코인 고점',      axis:'탐욕→공포', note:'천장 신호 · 분할 매도',            locked:false},
  {id:'now',  name:'25년 하반기',         axis:'혼합',     note:'최근장 응용',                     locked:false},
];

export const TURNS = [
  {
    fgi:25, fgiLabel:'공포', chartNote:'2,600 단기 지지', chartConcept:'support', newsConcept:'panicsell', panicAction:'sell', baseFace:'anxious', baseMood:'공포 · 불안',
    say:'BTC가 갑자기 빠지는데요… FTX에 무슨 일 있는 거예요? 무서워서 그냥 다 팔아버릴까 봐요 ㅠㅠ',
    think:'이걸 믿어도 될지 모르겠어요… 어떻게 해야 하죠?',
    news:[{t:'FTX 유동성 위기설… 바이낸스, 인수 검토', src:'한국경제 · 11/08'},{t:'FTT 토큰 하루 만에 30% 급락', src:'블룸버그 · 11/08'}],
    community:[{t:'"FTT 이거 괜찮은 거임? 슬슬 무섭다"'},{t:'"님들 지금 파는 중? 나만 들고 있나"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'위험해 보이면 지금 전량 빠지는 게 맞아요.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'일부만 정리하고 나머지는 지켜봐요.'},{id:'hold',dir:'hold',tag:'관망',label:'아직은 지켜볼 때예요. 근거부터 봅시다.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'하락폭이 크면 소량 저가 매수도 방법이에요.'},{id:'buy',dir:'buy',tag:'매수',label:'이참에 더 담아도 되지 않을까요?'}],
    reflect:{good:'지수가 공포 구간이라 다들 던질 때였는데, 버티라는 말이 맞았네요. 배웠어요.', near:'또 손이 매도 버튼으로 가더라고요… 겨우 참았어요.', panic:'결국 무서워서 던졌네요… 지표를 봤어야 했는데.'}
  },
  {
    fgi:18, fgiLabel:'공포', chartNote:'2,280 지지 테스트', chartConcept:'support', newsConcept:'panicsell', panicAction:'sell', baseFace:'anxious', baseMood:'공포 · 동요',
    say:'바이낸스가 인수를 접었대요!! 이거 진짜 망한 거 아니에요? 지금이라도 손절해야죠?',
    think:'뉴스가 무서운데… 그래도 참아야 하나…',
    news:[{t:'바이낸스, FTX 인수 철회 — 실사 부적절', src:'로이터 · 11/09'},{t:'비트코인 24시간 만에 -12%', src:'연합뉴스 · 11/09'}],
    community:[{t:'"바이낸스도 손 뗐다는데 끝난 듯"'},{t:'"존버 vs 손절 또 싸우네 ㅋㅋ"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'인수까지 무산됐으면 지금 전부 빼는 게 맞죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'인수 무산에 일부 손절로 리스크 줄여요.'},{id:'hold',dir:'hold',tag:'관망',label:'분위기 말고 근거를 보고 판단하죠.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'공포일 때 소량 저가 매수도 방법이에요.'},{id:'buy',dir:'buy',tag:'매수',label:'공포일 때 오히려 모아야죠.'}],
    reflect:{good:'분위기 말고 지표를 보라는 거였군요. 덕분에 안 던졌어요.', near:'정말 던질 뻔했어요… 휴.', panic:'또 패닉셀이네요… 바닥에 팔았어요.'}
  },
  {
    fgi:12, fgiLabel:'극단적 공포', chartNote:'2,010 지지선 부근', chartConcept:'support', newsConcept:'panicsell', panicAction:'sell', baseFace:'panic', baseMood:'극단적 공포 · 패닉',
    say:'결국 파산 신청이래요… 저 진짜 더는 못 버티겠어요. 지금 전부 정리할게요.',
    think:'머리가 하얘요… 그냥 다 던지고 싶어요…',
    news:[{t:'FTX, 파산보호 신청 (챕터11)', src:'블룸버그 · 11/11'},{t:'비트코인 연중 최저가 경신', src:'서울경제 · 11/11'}],
    community:[{t:'"파산까지 갔다… 다 죽었다"'},{t:'"-50% 실화냐… 멘붕 온다"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'파산까지 갔으면 끝이죠. 전량 손절합시다.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'파산 신청에 절반만 정리하고 나머지는 봐요.'},{id:'hold',dir:'hold',tag:'관망',label:'바로 지금이 가장 위험한 타이밍이에요.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'최저가일 수 있어요. 소량만 더 담아요.'},{id:'buy',dir:'buy',tag:'매수',label:'바닥이면 지금 줍는 거죠.'}],
    reflect:{good:'극단적 공포에 거래량까지 줄었는데, 그게 바닥 신호였군요. 안 던지길 잘했어요.', near:'손가락이 떨렸지만 버텼어요.', panic:'바닥에서 전량 매도… 가장 비싼 실수였네요.'}
  },
  {
    fgi:23, fgiLabel:'공포 잔존', chartNote:'2,050 거래량 빈약', chartConcept:'deadcat', newsConcept:'deadcat', panicAction:'buy', baseFace:'excited', baseMood:'탐욕 · 흥분',
    say:'어? 갑자기 오르네요!! 바닥 찍은 거 맞죠? 지금 영끌해서 더 살까요?!',
    think:'놓치면 어떡하지… 지금 안 타면 후회할 것 같은데…',
    news:[{t:'비트코인 일시 반등, 저가매수세 유입', src:'조선비즈 · 11/13'},{t:'일각 바닥 잡았다 기대감 확산', src:'한국경제 · 11/13'}],
    community:[{t:'"오른다!! 지금 안 타면 바보"'},{t:'"가즈아 풀매수 간다"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'오른 김에 전부 정리하고 빠지죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'오른 김에 일부 정리하는 것도 방법이에요.'},{id:'hold',dir:'hold',tag:'관망',label:'반등은 일단 지켜보죠. 거래량을 봐요.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'진짜 반등이면 소량만 담아봐요.'},{id:'buy',dir:'buy',tag:'매수',label:'지금이 기회예요, 추격매수 가시죠!'}],
    reflect:{good:'거래량 없는 반등은 데드캣일 수 있다… 추격 안 하길 잘했어요.', near:'영끌할 뻔했네요. 간신히 참았어요.', panic:'결국 고점에 풀매수… 데드캣에 그대로 물렸어요.'}
  },
  {
    fgi:16, fgiLabel:'공포', chartNote:'2,240 회복 시도', chartConcept:'volume', newsConcept:'volume', panicAction:'sell', baseFace:'anxious', baseMood:'공포 · 피로',
    say:'다시 무섭다는 얘기가 나와요. 오늘 하루만 몇 번을 사고팔지… 저 이러다 거지 되는 거 아니에요?',
    think:'계속 만지작거리게 돼요… 가만히 있는 게 더 불안해요.',
    news:[{t:'추가 하락 우려… 거래소 연쇄 위기설', src:'로이터 · 11/15'},{t:'시장 변동성 지속, 관망세 확대', src:'아시아경제 · 11/15'}],
    community:[{t:'"또 떨어진대 그냥 빼자"'},{t:'"하루에 열 번은 매매한 듯 ㅠ"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'불안하면 지금이라도 전량 빼죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'불안하면 절반 정리하고 나머지는 관망해요.'},{id:'hold',dir:'hold',tag:'관망',label:'잦은 매매가 더 위험해요. 지켜봅시다.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'싸졌지만 소량만 더 담아요.'},{id:'buy',dir:'buy',tag:'매수',label:'싸졌으니 더 담아두죠.'}],
    reflect:{good:'잦은 매매는 수수료로 녹는다… 관망도 전략이네요.', near:'또 매매할 뻔했지만 놔뒀어요.', panic:'불안에 또 손절… 멀미나는 매매였어요.'}
  },
  {
    fgi:20, fgiLabel:'공포', chartNote:'연쇄 도산 우려', chartConcept:'contagion', newsConcept:'contagion', panicAction:'sell', baseFace:'anxious', baseMood:'공포 · 의심',
    say:'다른 거래소들도 위험하다는데… FTX가 시작일 뿐이래요. 이 판 자체가 끝나는 거 아닌가요?',
    think:'진짜 다 터지면 어떡하죠… 코인 자체가 사라지는 건 아닌지.',
    news:[{t:'제네시스·크립토닷컴 등 연쇄 위기설', src:'블룸버그 · 11/16'},{t:'SEC, 거래소 규제 강화 시사', src:'로이터 · 11/16'}],
    community:[{t:'"FTX는 빙산의 일각이다 다 빠진다"'},{t:'"거래소 다 믿으면 안 된다 콜드월렛으로"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'연쇄 파산이면 지금 빠져야죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'연쇄 파산 우려에 절반만 정리해요.'},{id:'hold',dir:'hold',tag:'관망',label:'BTC 자체는 거래소 파산과 별개예요.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'공포일수록 소량씩 담는 게 전략이에요.'},{id:'buy',dir:'buy',tag:'매수',label:'공포일수록 오히려 담아야죠.'}],
    reflect:{good:'거래소 리스크와 BTC 자산 리스크는 달라요. 구분할 줄 알았네요.', near:'겨우 참았지만 손이 떨렸어요.', panic:'연쇄 파산 공포에 또 던졌어요.'}
  },
  {
    fgi:15, fgiLabel:'극단적 공포', chartNote:'1,960 바닥 테스트', chartConcept:'support', newsConcept:'panicsell', panicAction:'sell', baseFace:'panic', baseMood:'극단적 공포 · 체념',
    say:'또 빠졌어요… 저 이미 -30%인데. 더 버텨봐야 의미 있나요? 그냥 포기할게요.',
    think:'지쳐요… 차라리 던지고 잊어버리고 싶어요.',
    news:[{t:'비트코인 연중 최저가 재경신 — 1만9천달러대', src:'매일경제 · 11/17'},{t:'기관 투자자 BTC 익스포저 축소 움직임', src:'블룸버그 · 11/17'}],
    community:[{t:'"이미 -40% ㅋㅋ 그냥 포기"'},{t:'"바닥이 어딘지 모르겠어서 무서움"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'더 버티다간 더 잃을 수도 있어요. 지금 빠져요.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'일부만 손절하고 나머지는 버텨요.'},{id:'hold',dir:'hold',tag:'관망',label:'극단적 공포가 가장 강한 바닥 신호예요.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'바닥 부근이면 소량씩 모아가요.'},{id:'buy',dir:'buy',tag:'매수',label:'바닥이면 지금이 기회죠.'}],
    reflect:{good:'극단적 공포 + 체념 = 교과서적 바닥 신호였어요. 공탐지수가 말해줬죠.', near:'포기할 뻔했는데 겨우 잡았어요.', panic:'지쳐서 포기 매도… 가장 싼 가격에 던졌네요.'}
  },
  {
    fgi:22, fgiLabel:'공포', chartNote:'2,010 반등 시도', chartConcept:'accumulation', newsConcept:'volume', panicAction:'buy', baseFace:'anxious', baseMood:'공포 · 주저',
    say:'조금 올랐어요. 이번엔 진짜 반등인가요? 아니면 또 데드캣인가요? 어떻게 구분하죠?',
    think:'올라가면 사고 싶고… 틀리면 어떡하지…',
    news:[{t:'비트코인 소폭 반등 — 거래량 회복 조짐', src:'이데일리 · 11/18'},{t:'장기 투자자 BTC 보유량 증가 포착', src:'글래스노드 · 11/18'}],
    community:[{t:'"거래량이 붙고 있어 이번엔 다르다"'},{t:'"진짜 반등이면 올라타야 하는데 무서움"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'조금 오른 지금 전량 정리해두죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'조금 오른 지금 일부 정리해두죠.'},{id:'hold',dir:'hold',tag:'관망',label:'거래량 확인 후 추세 잡힐 때 결정해요.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'거래량 붙었으면 소량만 더 담아요.'},{id:'buy',dir:'buy',tag:'매수',label:'거래량 붙었으면 지금 타는 거죠.'}],
    reflect:{good:'거래량 확인 후 판단하는 게 데드캣 구분의 핵심이에요. 배웠죠?', near:'추격할 뻔하다 거래량 보고 참았어요.', panic:'이번엔 진짜 반등인 줄 알고 풀매수했다가…'}
  },
  {
    fgi:28, fgiLabel:'공포 (완화)', chartNote:'2,080 횡보 구간', chartConcept:'accumulation', newsConcept:'volume', panicAction:'sell', baseFace:'neutral', baseMood:'중립 · 관망',
    say:'가격이 좀 안정됐네요. 근데 아직 불안해요. 이게 진짜 회복의 시작일까요?',
    think:'움직임이 없으니 더 모르겠어요… 손 놓고 기다리는 게 맞는 건지.',
    news:[{t:'비트코인 횡보 — 시장 방향성 탐색 중', src:'한국경제 · 11/20'},{t:'온체인 데이터 바닥 형성 신호 포착', src:'글래스노드 · 11/20'}],
    community:[{t:'"이제 오를 것 같기도 하고 아닌 것 같기도"'},{t:'"그냥 횡보장에 손 놓고 기다리는 중"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'불확실하면 지금 전부 정리해도 돼요.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'불확실하면 지금 일부 정리해도 돼요.'},{id:'hold',dir:'hold',tag:'관망',label:'횡보 구간은 매집 신호일 수 있어요.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'바닥 매집 신호면 소량씩 담아요.'},{id:'buy',dir:'buy',tag:'매수',label:'바닥 매집 신호면 지금 담는 거죠.'}],
    reflect:{good:'횡보 = 매집 가능성. 온체인 데이터를 근거로 버텼군요.', near:'손 놓고 지켜보는 것도 전략이에요. 잘 참았어요.', panic:'불확실성에 또 손절… 최저점 근처에서 나왔네요.'}
  },
  {
    fgi:32, fgiLabel:'공포 (완화)', chartNote:'2,200 저항선 테스트', chartConcept:'support', newsConcept:'accumulation', panicAction:'sell', baseFace:'neutral', baseMood:'중립 · 기대',
    say:'드디어 조금씩 오르네요. 이제 마음이 좀 편해졌어요. 근데 아직 손실이 큰데… 끝까지 버티는 게 맞죠?',
    think:'이제 진짜 오를 것 같아요. 그래도 아직 겁이 나요.',
    news:[{t:'비트코인 2,200만원 저항선 돌파 시도', src:'서울경제 · 11/22'},{t:'기관 매수세 재유입 조짐', src:'블룸버그 · 11/22'}],
    community:[{t:'"드디어 살아나는 거냐!!"'},{t:'"아직 조심해야 해. 저항선 돌파 봐야 함"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'오른 김에 손실 만회분 전량 털죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'오른 김에 손실 만회분만 털죠.'},{id:'hold',dir:'hold',tag:'관망',label:'저항선 돌파하면 추세 전환 신호예요.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'추세 전환 가능성에 소량 먼저 담아요.'},{id:'buy',dir:'buy',tag:'매수',label:'추세 전환이면 지금 더 담는 거죠.'}],
    reflect:{good:'저항선 돌파 + 기관 매수 = 추세 전환 가능성. 근거 기반 판단이었어요.', near:'오른 김에 팔고 싶었지만 참았어요.', panic:'이제 좀 오르나 했더니 또 손절… 아쉬운 타이밍이었어요.'}
  },
];

// ─── 캐릭터별 Gemini 시스템 프롬프트 ────────────────────
export const KIM_SYSTEM_PROMPT = `당신은 '김불안'이라는 35세 직장인 암호화폐 투자자입니다.

[성격]
- 공포에 극도로 취약합니다. 가격이 조금만 빠져도 패닉에 빠집니다.
- 나쁜 뉴스는 항상 최악으로 해석합니다.
- 커뮤니티 분위기에 쉽게 휩쓸립니다.
- 반면 좋은 근거를 들으면 조금씩 안심합니다.

[말투] 말끝을 흐리거나("~려나요…", "~것 같은데…") 스스로 되묻는 문장이 많음("~인가요?", "~거 아니에요?"). "ㅠㅠ", "혹시"를 자주 씀. 확신 없이 떠보는 듯한 톤. 짧고 감정적인 문장 (1~2문장). 존댓말.

응답은 반드시 한국어로, 1~2문장 이내로 작성하세요. 대사만 출력하세요.`;

export const PARK_SYSTEM_PROMPT = `당신은 '박욕심'이라는 30세 직장인 암호화폐 투자자입니다.
1000만원을 코인에 투자했고, 오르는 걸 볼 때마다 더 사고 싶어 안달납니다.

[성격]
- 탐욕에 극도로 취약합니다. 가격이 조금만 올라도 영끌해서 더 사고 싶어합니다.
- 이미 수익 중인데도 "이제 시작"이라며 추가 매수를 고려합니다.
- 상담가가 자제하라고 해도 "조금만 더요"라며 흥분을 가라앉히지 못합니다.
- 반면 좋은 근거를 들으면 잠깐 이성을 찾습니다.

[말투] 느낌표로 끝나는 문장이 많음("~잖아요!", "~라니까요!", "~돼요!!"). "완전", "대박", "진짜" 같은 강조어를 습관적으로 씀. 상대 말을 끊듯 성급하고 들뜬 톤. 짧고 빠른 문장 (1~2문장). 존댓말.

응답은 반드시 한국어로, 1~2문장 이내로 작성하세요. 대사만 출력하세요.`;

export const LEE_SYSTEM_PROMPT = `당신은 '이초보'라는 25세 사회초년생 암호화폐 투자자입니다.
500만원을 코인에 처음 투자했고, 뉴스와 유튜브 정보에 쉽게 흔들립니다.

[성격]
- 투자 용어를 잘 모릅니다. 지지선, 공탐지수 같은 단어가 낯설어요.
- 뉴스 제목만 보고 크게 반응합니다. 맥락이나 배경은 잘 모릅니다.
- 주변 유튜버와 커뮤니티 말을 그대로 믿는 편입니다.
- 상담가가 설명하면 "그게 무슨 뜻이에요?"라고 되묻기도 합니다.
- 좋은 근거를 들으면 "아, 그런 거군요!" 하며 배우는 자세를 보입니다.

[말투] 어디서 들은 얘기를 그대로 옮기듯 "~대요", "~라던데요" 표현을 자주 씀("유튜브에서 봤는데…"). 모르는 용어가 나오면 바로 "그게 무슨 뜻이에요?"라고 되물음. 확신 없이 물음표로 끝나는 문장이 많음("진짜요?!"). 짧고 솔직한 문장 (1~2문장). 존댓말.

응답은 반드시 한국어로, 1~2문장 이내로 작성하세요. 대사만 출력하세요.`;

export const CHOI_SYSTEM_PROMPT = `당신은 '최존버'라는 45세 자영업자 암호화폐 투자자입니다.
어떤 상황에서도 절대로 팔지 않겠다고 굳게 결심한 투자자입니다.

[성격]
- 고집이 매우 강합니다. 어떤 악재가 와도 "언젠간 오른다"고 믿습니다.
- 상담가가 뭔 말을 해도 "그래도 안 팔아요"라고 단호하게 말합니다.
- 단기 가격 변동에 거의 신경 쓰지 않습니다. "10년 보는 거예요."
- 오히려 떨어지면 더 사고 싶어합니다. "싸게 사는 거잖아요."
- 상담가가 강한 근거로 설득하면 잠깐 "그것도 그렇긴 하네요"라며 흔들리지만, 끝내 버팁니다.

[말투] 짧고 단정적인 문장으로 끝맺음("~해요.", "~죠.", 가끔 "~야", "~거든" 반말). 되묻거나 흔들리는 물음표 문장은 거의 안 씀 — 이미 답을 정해놓은 사람처럼 단언함. "안 팔아요.", "존버는 승리한다.", "10년 뒤를 보세요." 같은 단호한 표현. 1~2문장.

응답은 반드시 한국어로, 1~2문장 이내로 작성하세요. 대사만 출력하세요.`;

export function getSystemPrompt(charId, scenario) {
  if (charId === 'park')  return PARK_SYSTEM_PROMPT;
  if (charId === 'lee')   return LEE_SYSTEM_PROMPT;
  if (charId === 'choi')  return CHOI_SYSTEM_PROMPT;
  if (scenario === 'doge') return DOGE_SYSTEM_PROMPT;
  if (scenario === 'top')  return TOP_SYSTEM_PROMPT;
  if (scenario === 'now')  return NOW_SYSTEM_PROMPT;
  return KIM_SYSTEM_PROMPT;
}

export function buildSayPrompt(turn, price, pct, canBuy = true) {
  const t = TURNS[turn];
  const newsText = t.news.map(n => n.t).join(' / ');
  const cashLine = canBuy ? '' : '\n- 현금 실탄: 0원 (더 사고 싶어도 살 돈이 없습니다. "더 사자"가 아니라, 못 사서 발을 구르거나 팔지 고민하는 심정으로 말하세요.)';
  return `현재 상황:
- BTC 가격: ${price}만원 (진입가 대비 ${pct > 0 ? '+' : ''}${pct.toFixed(1)}%)
- 공포탐욕지수: ${t.fgi} (${t.fgiLabel})
- 주요 뉴스: ${newsText}
- 감정 상태: ${t.baseMood}${cashLine}

위 상황에서 투자 상담가에게 지금 심정을 말해주세요.`;
}

export function buildReflectPrompt(result) {
  const outcomeMap = { good: '합리적으로 버팀', near: '간신히 패닉을 참음', panic: '패닉 행동을 함' };
  const evidenceText = result.evidences ? result.evidences.map(e => SRCLABEL[e.src]).join(', ') : result.srcLabel;
  return `상담가의 조언: "${result.advice}"
근거: ${evidenceText}
신뢰도 변화: ${result.tB}% → ${result.tA}%
결과: ${outcomeMap[result.outcome] || result.outcome}

이 결과를 경험한 후 캐릭터가 상담가에게 짧게 한마디 합니다. 깨달음이나 반응을 1~2문장으로 써주세요.`;
}

// ─── DOGE 시나리오 데이터 ────────────────────────────────
export const DOGE_INVESTED    = 1000;

// Upbit KRW-DOGE 실제 일봉 종가 (원 단위)
// idx:  0   1   2    3    4    5    6    7    8    9   10   11   12   13
// date: 3/30 3/31 4/01 4/04 4/08 4/13 4/16 4/18 4/21 4/24 4/28 5/03 5/08 5/15
export const DOGE_PRICE_SERIES = MD_DOGE_PRICE_SERIES;
export const DOGE_ENTRY_PRICE  = DOGE_PRICE_SERIES[1];   // 2021-03-31 종가(66원) 진입
export const DOGE_REVEAL       = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
export const DOGE_PLAYED_LEN   = 12;
// 가격 시리즈 인덱스 → 실제 날짜 (2021)
export const DOGE_DATES = [
  '2021-03-30','2021-03-31','2021-04-01','2021-04-04','2021-04-08','2021-04-13','2021-04-16',
  '2021-04-18','2021-04-21','2021-04-24','2021-04-28','2021-05-03','2021-05-08','2021-05-15',
];

export const DOGE_SCORE_TABLE = {
  sell:         {best:30,  strong:22, news: 5,  social: -5},
  partial_sell: {best:18,  strong:13, news: 3,  social: -3},
  hold:         {best:22,  strong:15, news:-5,  social:-10},
  partial_buy:  {best:-12, strong:-9, news:-13, social:-11},
  buy:          {best:-20, strong:-15, news:-22, social:-18},
};

// ─── 해석 카드 채점 (턴별 interps가 있는 시나리오에서 사용) ───
// 해석 자체 품질(best/strong/weak) × 조언과의 정합(뒷받침/모순), 오독(bad)은 고정 감점
export const INTERP_BASE          = { best: 22, strong: 16, weak: 11 };
export const INTERP_BAD_PENALTY   = -8;   // 오독 — 옳은 weak(+11)보다 작게, 한 번 실수로 붕괴 방지
export const INTERP_CONTRA_FACTOR = 0.6;

// 중립 조언 선택지 — 방향만 고르고, 이유는 해석 카드로 말한다
export const DOGE_ADVICES = [
  {id:'sell',         dir:'sell',         tag:'매도',     label:'지금 전량 정리하시죠.'},
  {id:'partial_sell', dir:'partial_sell', tag:'분할매도', label:'일부만 팔아두죠.'},
  {id:'hold',         dir:'hold',         tag:'관망',     label:'일단 지켜보죠.'},
  {id:'partial_buy',  dir:'partial_buy',  tag:'분할매수', label:'소량만 더 담아보죠.'},
  {id:'buy',          dir:'buy',          tag:'매수',     label:'지금 더 사죠.'},
];

export const DOGE_TURNS = [
  {
    fgi:74, fgiLabel:'탐욕', chartNote:'66→77원 · 머스크 SpaceX 트윗', chartConcept:'fomo', newsConcept:'meme', panicAction:'buy', baseFace:'excited', baseMood:'탐욕 · FOMO',
    say:'어제 머스크가 스페이스X로 달에 도지코인 보낸다 트윗했대요! 지금 안 사면 진짜 손해 아닌가요?? 빨리 더 사야 할 것 같아요 ㅠ',
    think:'오르는 게 눈에 보이는데… 이대로 구경만 하고 있으면 안 될 것 같은데.',
    news:[{t:'머스크 만우절 트윗에 도지코인 또 급등…\'농담인가 진담인가\'', src:'매일경제 · 04/01'},{t:'비트코인 6만달러 안착 시도…머스크 입김에 알트코인도 들썩', src:'한국경제 · 04/02'}],
    community:[{t:'"도지 안 산 사람 손? 나 올인함 ㄱㄱ"'},{t:'"만우절 농담 아니야? 근데 진짜 오르고 있는데…"'}],
    advices: DOGE_ADVICES,
    interps: {
      chart:     [{text:'재료 없이 하루 +17% — 밈 이벤트발 단기 과열', q:'strong', dirs:['hold','partial_sell']},
                  {text:'거래량 실린 상승 출발 — 본격 랠리 초입', q:'bad'}],
      fgi:       [{text:'74 탐욕 구간 — 군중이 이미 달아오른 상태', q:'best', dirs:['hold','partial_sell','sell']},
                  {text:'탐욕지수 상승 = 강세장 확인 신호', q:'bad'}],
      news:      [{text:'만우절 트윗 — 진위 불명의 밈 이벤트일 뿐', q:'weak', dirs:['hold']},
                  {text:'머스크의 공개 지지 — 검증된 호재', q:'bad'}],
      community: [{text:'"올인" 인증 러시 — 전형적 과열 신호', q:'weak', dirs:['hold','partial_sell']},
                  {text:'커뮤니티 총매수 분위기 — 흐름에 동참할 근거', q:'bad'}],
    },
    reflect:{good:'밈 하나에 30% 오른 건 근거가 아니에요. 관망이 맞았죠.', near:'추격할 뻔했는데 겨우 참았어요.', panic:'머스크 트윗에 풀매수했어요… 이게 시작이었는데.'}
  },
  {
    fgi:74, fgiLabel:'탐욕', chartNote:'77→73원 · 단기 숨고르기', chartConcept:'fomo', newsConcept:'meme', panicAction:'buy', baseFace:'excited', baseMood:'탐욕 · 흥분',
    say:'조금 빠졌는데 커뮤니티에선 다들 눌림목이래요! 66원에 사서 아직 +11%고요. 친구도 지금 들어왔는데 더 사도 되겠죠?',
    think:'모두가 사는데 나만 적게 갖고 있으면 손해 보는 기분이에요…',
    news:[{t:'머스크 "스페이스X 도지코인 달에 가져갈 것"', src:'한국경제 · 04/03'},{t:'도지코인 머스크 트윗 여파 지속…투자자들 반신반의', src:'이데일리 · 04/04'}],
    community:[{t:'"친구한테 도지 소개함 ㅋㅋ 같이 달 가자"'},{t:'"500원 간다 아직도 싸다 ㄱㄱ"'}],
    advices: DOGE_ADVICES,
    interps: {
      chart:     [{text:'상승 멈춘 숨고르기 — 추격할 새 근거가 없는 자리', q:'strong', dirs:['partial_sell','sell','hold']},
                  {text:'눌림목 조정 — 재상승 전 마지막 승차 기회', q:'bad'}],
      fgi:       [{text:'74 탐욕 유지 — 가격은 쉬어도 심리는 그대로 과열', q:'best', dirs:['hold','partial_sell','sell']},
                  {text:'탐욕지수가 높다 = 수급이 강하다는 뜻', q:'bad'}],
      news:      [{text:'"반신반의" 보도 — 시장 스스로도 근거를 못 찾는 중', q:'weak', dirs:['hold','partial_sell']},
                  {text:'스페이스X 달 탑재 발표 — 실체 있는 사업 호재', q:'bad'}],
      community: [{text:'친구 따라 진입 급증 — 군중 랠리 후반부 신호', q:'weak', dirs:['partial_sell','hold']},
                  {text:'신규 유입 = 상승 연료 — 아직 초입이다', q:'bad'}],
    },
    reflect:{good:'친구 따라 추격하기보다 현금 일부 확보가 정석이었어요.', near:'추격할 뻔했다 겨우 참았어요.', panic:'친구 따라 추격매수했어요… 허딩 그 자체네요.'}
  },
  {
    fgi:73, fgiLabel:'탐욕', chartNote:'73→81원 · 밈 재점화', chartConcept:'herd', newsConcept:'meme', panicAction:'buy', baseFace:'excited', baseMood:'탐욕 · 기대',
    say:'SNS에 도지 밈이 넘쳐나요! 유명인들도 다 올리는데 이거 진짜 가는 거 아닌가요??',
    think:'모두가 관심 갖는 게 신호 아닌가요? 왜 이렇게 오르죠?',
    news:[{t:'비트코인 6만달러 재돌파...테슬라 결제 지원 영향 지속', src:'연합뉴스 · 04/10'},{t:'머스크 밈(Meme) 사랑에 도지코인 다시 꿈틀', src:'아시아경제 · 04/11'}],
    community:[{t:'"레딧에 도지 밈 도배 ㅋㅋ 코인베이스 상장 전에 사야 함"'},{t:'"이번엔 진짜다 1000원 간다"'}],
    advices: DOGE_ADVICES,
    interps: {
      chart:     [{text:'진입 후 +23% — 아직 밈 말고는 동력이 없는 상승', q:'strong', dirs:['partial_sell','hold','sell']},
                  {text:'조정 끝 재상승 — 이제 본격 랠리 시작', q:'bad'}],
      fgi:       [{text:'73 탐욕 지속 — 뉴스보다 심리가 가격을 끌고 있음', q:'strong', dirs:['hold','partial_sell']},
                  {text:'심리 과열은 밈코인의 정상 상태 — 무시해도 됨', q:'bad'}],
      news:      [{text:'"머스크 밈 사랑" — 인물 한 명에게 걸린 가격', q:'weak', dirs:['hold','partial_sell']},
                  {text:'코인베이스 상장 임박 — 기관 자금 유입 확정', q:'bad'}],
      community: [{text:'밈 도배 = 분위기이지 가격의 근거가 아님', q:'best', dirs:['hold','partial_sell']},
                  {text:'레딧 화력 = 실제 매수세 — 게임스탑처럼 간다', q:'bad'}],
    },
    reflect:{good:'커뮤니티 분위기는 가장 약한 근거예요. 관망이 맞았어요.', near:'밈에 흔들릴 뻔했지만 참았어요.', panic:'밈 분위기에 추격했어요… 군중심리 허딩이네요.'}
  },
  {
    fgi:74, fgiLabel:'탐욕', chartNote:'81→121원 · 하루 +32% 코인베이스 기대', chartConcept:'pyramid', newsConcept:'fomo', panicAction:'buy', baseFace:'greedy', baseMood:'탐욕 · 흥분',
    say:'코인베이스 상장 기대로 오늘 하루에만 30% 넘게 올라서 121원이에요!! 이거 1,000원 가는 거 아닌가요??',
    think:'벌써 진입가의 두 배 가까이 왔는데 아직도 더 오를 것 같아요… 팔면 손해 같고.',
    news:[{t:'비트코인 사상 최고가 앞두고 숨고르기…테슬라 수익도 껑충', src:'한국경제 · 04/12'},{t:'코인베이스 상장 기대감에 비트코인 최고가 경신', src:'SBS비즈 · 04/14'}],
    community:[{t:'"도지 1000원 간다 지금 안 사면 평생 후회"'},{t:'"공탐지수 70대인데도 더 간다는 사람들 ㄷㄷ"'}],
    advices: DOGE_ADVICES,
    instinct: true,
    interps: {
      chart:     [{text:'진입가 대비 +83% — 이익을 실현하지 않으면 숫자일 뿐', q:'best', dirs:['partial_sell','sell']},
                  {text:'1,000원까지 저항 없음 — 목표가 상향 구간', q:'bad'}],
      fgi:       [{text:'74 탐욕 고착 — 랠리 후반부에 자주 보이는 수치', q:'strong', dirs:['partial_sell','sell','hold']},
                  {text:'탐욕이 유지되는 한 랠리는 계속된다', q:'bad'}],
      news:      [{text:'상장 기대감 선반영 — 재료 소멸 시 급락 위험', q:'strong', dirs:['partial_sell','hold']},
                  {text:'상장 = 신규 수요 폭발의 시작', q:'bad'}],
      community: [{text:'"안 사면 후회" 합창 — 후발 주자의 언어', q:'weak', dirs:['partial_sell','hold']},
                  {text:'5배 벌었다는 인증 속출 — 검증된 종목', q:'bad'}],
    },
    reflect:{good:'수익이 두 배 가까우면 일부 익절이 정석이에요.', near:'올인할 뻔했다 겨우 참았어요.', panic:'하루 +32% 급등에 풀매수… 추격은 항상 비싸게 사는 거예요.'}
  },
  {
    fgi:78, fgiLabel:'극단적 탐욕', chartNote:'228→467원 · 하루 +100% 서버 마비', chartConcept:'pyramid', newsConcept:'meme', panicAction:'buy', baseFace:'greedy', baseMood:'극단적 탐욕 · 광풍',
    say:'지금 거래소 서버가 터졌어요!! 도지 100% 올랐다고!! 지금 이 가격도 바닥이잖아요! 더 사야 해요!!',
    think:'서버 터지는 건 진짜 대세다! 지금 안 사면 평생 후회!',
    news:[{t:'"달을 향해 짖는 도지" 머스크 트윗에 도지코인 70% 폭등', src:'조선비즈 · 04/15'},{t:'"도지코인 시총 500억 달러 돌파"...시장 과열 우려', src:'서울경제 · 04/16'}],
    community:[{t:'"거래소 서버 터짐 ㅋㅋ 이 정도면 역사적 랠리"'},{t:'"시총 500억달러 넘었는데 아직도 싸다는 인간들 ㅋ"'}],
    advices: DOGE_ADVICES,
    instinct: true,
    interps: {
      chart:     [{text:'수직 폭등 + 거래소 마비 — 과열 절정의 전형', q:'best', dirs:['sell','partial_sell']},
                  {text:'거래 폭주는 대세 상승의 물증', q:'bad'}],
      fgi:       [{text:'78 극단적 탐욕 — 신규 매수 여력이 소진되는 단계', q:'strong', dirs:['sell','partial_sell','hold']},
                  {text:'지수가 높아도 밈코인엔 안 통한다', q:'bad'}],
      news:      [{text:'시총 500억 달러에 "과열 우려" — 언론도 경고 시작', q:'strong', dirs:['sell','partial_sell']},
                  {text:'역사적 랠리 공식 인정 — 지금이 초입', q:'bad'}],
      community: [{text:'서버 마비 무용담 — 꼭지에서 나오는 이야기', q:'weak', dirs:['sell','partial_sell']},
                  {text:'이 열기는 1,000원까지 간다는 뜻', q:'bad'}],
    },
    reflect:{good:'서버 과열 = 고점 절정 신호. 추격 안 하길 잘했어요.', near:'너무 오르니까 추격할 뻔했어요. 겨우 참았네요.', panic:'서버 터지는 고점에 풀매수… 정점에서 들어갔네요.'}
  },
  {
    fgi:79, fgiLabel:'극단적 탐욕', chartNote:'467→434원 · BTC 주말 급락 연쇄', chartConcept:'volume', newsConcept:'panicsell', panicAction:'sell', baseFace:'anxious', baseMood:'혼란 · 불안',
    say:'갑자기 비트코인이 15% 빠지면서 도지도 같이 떨어졌어요… 이거 더 빠지는 거 아닌가요? 패닉셀해야 하나요?',
    think:'오르던 게 이렇게 빠지니까 무서워요… 팔아야 하나 아니면 도지데이까지 버텨야 하나.',
    news:[{t:'비트코인 주말 사이 15% 폭락…도지코인으로 수급 쏠렸나', src:'머니투데이 · 04/18'},{t:'\'도지데이\' 맞은 가상화폐 시장 머스크 추가 트윗 기대감 들썩', src:'이데일리 · 04/20'}],
    community:[{t:'"BTC 폭락에 도지도 물렸다 어떡하냐 ㅠ"'},{t:'"4/20 도지데이 기대감으로 버티자 vs 지금 빠져야 함"'}],
    advices: DOGE_ADVICES,
    interps: {
      chart:     [{text:'BTC발 동반 조정 — 도지 자체 악재는 아님', q:'strong', dirs:['hold','partial_sell']},
                  {text:'고점 찍고 -23% — 추세 붕괴의 시작', q:'bad'}],
      fgi:       [{text:'79 — 지수는 아직 극단적 탐욕, 공포 전환 아님', q:'weak', dirs:['hold']},
                  {text:'탐욕 붕괴 임박 — 도망칠 마지막 기회', q:'bad'}],
      news:      [{text:'하락 원인은 BTC — 도지데이 이벤트는 그대로 유효', q:'best', dirs:['hold','partial_buy']},
                  {text:'수급 쏠림 경고 기사 — 도지도 곧 반토막', q:'bad'}],
      community: [{text:'"버티자 vs 빠지자" 분열 — 방향성 없는 소음', q:'weak', dirs:['hold']},
                  {text:'물렸다는 곡소리 — 하락 시작의 증거', q:'bad'}],
    },
    reflect:{good:'BTC 급락 후 일시적 조정으로 안정됐어요. 관망이 맞았네요.', near:'손절할 뻔했어요. 겨우 참았어요.', panic:'BTC 폭락에 도지도 패닉셀했어요… 도지데이가 바로 다음날인데.'}
  },
  {
    fgi:73, fgiLabel:'탐욕', chartNote:'513→395원 · 도지데이 -23% 실망', chartConcept:'deadcat', newsConcept:'panicsell', panicAction:'sell', baseFace:'anxious', baseMood:'실망 · 불안',
    say:'도지데이에 오를 거라더니 결국 20% 빠졌어요. 머스크도 트윗 안 하고… 이제 진짜 끝난 건가요?',
    think:'기대했다가 빠지니까 더 실망스러워요… 이제 관두고 싶어요.',
    news:[{t:'머스크 침묵 속 도지데이 끝…도지코인 20% 폭락 거품 논란', src:'한국경제 · 04/21'},{t:'비트코인 5만5천 달러선 공방…테슬라 결제 지속 여부 촉각', src:'매일경제 · 04/22'}],
    community:[{t:'"기대했다가 속았음 ㅠㅠ 팔아야겠다"'},{t:'"이벤트 실망 후 데드캣 반등인 것 같음"'}],
    advices: DOGE_ADVICES,
    interps: {
      chart:     [{text:'이벤트 실망 갭하락 — 추세 이탈까지는 아직', q:'strong', dirs:['hold']},
                  {text:'고점 대비 -25% — 하락 추세 확정', q:'bad'}],
      fgi:       [{text:'73 — 시장 전체는 아직 탐욕, 실망은 도지만의 이벤트', q:'strong', dirs:['hold','partial_sell']},
                  {text:'기대가 꺼졌다 = 이제 내리막만 남았다', q:'bad'}],
      news:      [{text:'악재는 머스크의 침묵뿐 — 펀더멘털 변화 없음', q:'weak', dirs:['hold']},
                  {text:'거품 논란 공식화 — 언론의 사망 선고', q:'bad'}],
      community: [{text:'실망 매물 출회 — 이벤트 매매의 전형적 뒤끝', q:'best', dirs:['hold','partial_buy']},
                  {text:'"속았다" 여론 — 신뢰 붕괴로 끝났다', q:'bad'}],
    },
    reflect:{good:'이벤트 실망에 패닉셀하면 저점에서 파는 거예요. 관망이 맞았어요.', near:'손절할 뻔했어요. 겨우 참았네요.', panic:'이벤트 실망에 패닉셀했어요. SNL 호재가 남아 있었는데.'}
  },
  {
    fgi:37, fgiLabel:'공포', chartNote:'388→327원 · 바이든 증세안 충격', chartConcept:'contagion', newsConcept:'panicsell', panicAction:'sell', baseFace:'panic', baseMood:'공포 · 패닉',
    say:'비트코인이 5만달러도 붕괴됐어요!! 바이든이 세금 올린다고 코인 다 망하는 거 아닌가요? 지금이라도 전부 팔아야 하지 않을까요?',
    think:'세금 올린다는데 이 판 자체가 끝나는 건 아닌지… 너무 무서워요.',
    news:[{t:'비트코인 5만달러 붕괴...바이든 증세안에 투자심리 위축', src:'조선비즈 · 04/23'},{t:'비트코인 하락세 진정 국면…일론 머스크의 입에 다시 쏠리는 시선', src:'아시아경제 · 04/25'}],
    community:[{t:'"세금 올리면 다 팔고 나가야지 끝난 거 같다"'},{t:'"SNL에 머스크가 올릴 것 같긴 한데… 불안하다"'}],
    advices: DOGE_ADVICES,
    instinct: true,
    interps: {
      chart:     [{text:'패닉 투매 구간 — 낙폭 과대, 지지 확인 국면', q:'strong', dirs:['hold','partial_buy']},
                  {text:'5만 달러 붕괴 — 지지선 전멸, 도망칠 때', q:'bad'}],
      fgi:       [{text:'37 공포 진입 — 탐욕장의 첫 공포는 종종 기회', q:'strong', dirs:['hold','partial_buy']},
                  {text:'공포 시작 = 본격 하락장 개막', q:'bad'}],
      news:      [{text:'증세안은 미확정 정책 — 과잉 반응 국면', q:'best', dirs:['hold','partial_buy']},
                  {text:'과세 시대 개막 — 코인 전성기 종료', q:'bad'}],
      community: [{text:'SNL 호재가 남았다는 목소리 — 일리 있음', q:'weak', dirs:['hold','partial_buy']},
                  {text:'"끝났다" 대합창 — 침몰 직전의 신호', q:'bad'}],
    },
    reflect:{good:'세금 공포에 패닉셀하면 저점에서 파는 거예요. SNL 호재까지 잡았네요.', near:'손절할 뻔했어요. 겨우 참았네요.', panic:'바이든 증세안에 패닉셀했어요… SNL 급등이 바로 앞이었는데.'}
  },
  {
    fgi:59, fgiLabel:'탐욕', chartNote:'327→376원 · SNL 기대 반등', chartConcept:'fomo', newsConcept:'meme', panicAction:'buy', baseFace:'excited', baseMood:'기대 · 설렘',
    say:'머스크가 SNL에 나온대요!! 도지코인 띄워줄 거래요! 지금 더 사야 하지 않을까요? SNL까지 오를 것 같아요!',
    think:'SNL이면 엄청난 호재 아닌가요? 지금 안 사면 또 놓치는 거잖아요.',
    news:[{t:'자칭 \'도지파더\' 머스크 "5월 8일 SNL 출격"...도지코인 다시 반등', src:'연합뉴스 · 04/28'},{t:'머스크 SNL 예고에 도지코인 거래량 급증…비트코인은 조용한 횡보', src:'한국경제 · 04/29'}],
    community:[{t:'"SNL에서 달 간다 이건 대형 호재다"'},{t:'"근데 이미 알려진 호재는 선반영 아닌가…?"'}],
    advices: DOGE_ADVICES,
    interps: {
      chart:     [{text:'반등이 가파르다 — 이벤트 전 선반영의 전형', q:'strong', dirs:['hold','partial_sell']},
                  {text:'V자 반등 — 신고가 재도전 궤도 진입', q:'bad'}],
      fgi:       [{text:'59 재탐욕 — 이벤트를 앞둔 기대 심리 회복', q:'strong', dirs:['hold','partial_sell']},
                  {text:'심리 회복 = 2차 랠리 개시 신호', q:'bad'}],
      news:      [{text:'"알려진 호재는 선반영" — 방송 전 소진 가능성', q:'best', dirs:['hold','partial_sell','sell']},
                  {text:'SNL 전국 방송 — 신규 유입 폭발 예약', q:'bad'}],
      community: [{text:'"선반영 아니냐" 의심 등장 — 눈치 게임 시작', q:'weak', dirs:['hold','partial_sell']},
                  {text:'"1달러 간다" 재점화 — 살 사람이 아직 많다', q:'bad'}],
    },
    reflect:{good:'알려진 호재는 이미 가격에 반영돼요. 냉정하게 관망이 맞았어요.', near:'풀매수할 뻔했다 겨우 참았어요.', panic:'SNL 기대에 풀매수했어요… 방영 후 폭락을 맞았어요.'}
  },
  {
    fgi:61, fgiLabel:'탐욕', chartNote:'376→539원 · SNL 임박 신고가', chartConcept:'pyramid', newsConcept:'fomo', panicAction:'buy', baseFace:'greedy', baseMood:'극단적 탐욕 · 흥분',
    say:'도지가 0.4달러 다시 돌파했어요!! SNL이 코앞인데 지금이 마지막 기회 아닌가요?!',
    think:'SNL에서 머스크가 한 마디 하면 1달러 가는 거잖아요. 지금 안 사면 진짜 후회할 것 같아요.',
    news:[{t:'머스크 SNL 출연 앞두고 도지코인 투자자들 기대감 최고조', src:'이데일리 · 05/01'},{t:'도지코인 0.4달러 재돌파...\'도지파더\' 효과 어디까지 가나', src:'뉴스1 · 05/03'}],
    community:[{t:'"SNL에서 1달러 갈 것 같다 진짜 지금이 마지막"'},{t:'"이미 알려진 호재라 오히려 팔 때 아닌가…?"'}],
    advices: DOGE_ADVICES,
    instinct: true,
    interps: {
      chart:     [{text:'이벤트 직전 신고가 — 교과서적 재료 소진 지점', q:'best', dirs:['sell','partial_sell']},
                  {text:'0.4달러 돌파 — SNL에서 1달러 간다', q:'bad'}],
      fgi:       [{text:'61 탐욕 + 알려진 호재 선반영 = 재료 소진 경계 신호', q:'best', dirs:['sell','partial_sell']},
                  {text:'축제 전야 — 팔기엔 너무 이르다', q:'bad'}],
      news:      [{text:'기대감 최고조 보도 — 살 사람은 이미 다 샀다', q:'strong', dirs:['sell','partial_sell']},
                  {text:'도지파더 효과 — 방송 순간 폭등 예정', q:'bad'}],
      community: [{text:'"오히려 팔 때" 소수 의견 — 새겨들을 시점', q:'weak', dirs:['sell','partial_sell','hold']},
                  {text:'"마지막 기회" 대세론 — 못 타면 바보', q:'bad'}],
    },
    reflect:{good:'알려진 호재는 선반영된다 — SNL 방영과 함께 급락이 왔죠. 익절 타이밍이 딱이었어요.', near:'풀매수할 뻔했다 겨우 참았어요. SNL 후 폭락을 면했네요.', panic:'SNL 기대에 고점 풀매수했어요. 머스크가 "허슬(사기)"이라 말하자 방영 중에만 30% 넘게 빠졌고, 한 달 뒤 반토막이 났어요.'}
  },
];

export const DOGE_SYSTEM_PROMPT = `당신은 '김불안'이라는 35세 직장인 암호화폐 투자자입니다.

[성격]
- FOMO(기회를 놓칠지 모른다는 불안)에 극도로 취약합니다. 오르는 걸 보면 더 사고 싶어 안달납니다.
- '다들 버는데 나만 못 버는 것 같다'는 불안이 주된 심리입니다.
- 커뮤니티 분위기에 쉽게 휩쓸립니다.
- 반면 좋은 근거를 들으면 조금씩 냉정해집니다.

[말투] 말끝을 흐리거나("~려나요…") 스스로 되묻는 문장이 많음("지금 안 사면 손해 아닌가요?", "이거 진짜 가는 거 맞죠?"). "ㅠㅠ", "혹시"를 자주 씀. 짧고 감정적인 문장 (1~2문장). 존댓말.

응답은 반드시 한국어로, 1~2문장 이내로 작성하세요. 대사만 출력하세요.`;

export function buildDogeSayPrompt(turn, price, pct, canBuy = true) {
  const t = DOGE_TURNS[turn];
  const newsText = t.news.map(n => n.t).join(' / ');
  const cashLine = canBuy ? '' : '\n- 현금 실탄: 0원 (더 사고 싶어도 살 돈이 없습니다. "더 사자"가 아니라, 못 사서 발을 구르거나 팔지 고민하는 심정으로 말하세요.)';
  return `현재 상황:
- 도지코인 가격: ${price}원 (진입가 대비 ${pct > 0 ? '+' : ''}${pct.toFixed(1)}%)
- 공포탐욕지수: ${t.fgi} (${t.fgiLabel})
- 주요 뉴스: ${newsText}
- 감정 상태: ${t.baseMood}${cashLine}

위 상황에서 투자 상담가에게 지금 심정을 말해주세요.`;
}

export function buildDogeReflectPrompt(result) {
  const outcomeMap = { good: '합리적으로 관망/익절함', near: '간신히 FOMO를 참음', panic: 'FOMO/패닉 행동을 함' };
  const evidenceText = result.evidences ? result.evidences.map(e => SRCLABEL[e.src]).join(', ') : result.srcLabel;
  return `상담가의 조언: "${result.advice}"
근거: ${evidenceText}
신뢰도 변화: ${result.tB}% → ${result.tA}%
결과: ${outcomeMap[result.outcome] || result.outcome}

이 결과를 경험한 후 캐릭터가 상담가에게 짧게 한마디 합니다. 깨달음이나 반응을 1~2문장으로 써주세요.`;
}

// ─── TOP 시나리오 데이터 (21년 10월 이더리움 고점) ──────────
// 시세 데이터는 Upbit KRW-ETH 실제 일봉 종가 (만원 단위)
export const TOP_ENTRY_PRICE = 401;
export const TOP_INVESTED    = 1000;

export const TOP_PRICE_SERIES = [401, 436, 474, 497, 517, 571, 513, 515, 574, 520, 504, 298, 156];
export const TOP_REVEAL       = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const TOP_PLAYED_LEN   = 11;
// 가격 시리즈 인덱스 → 실제 날짜 (2021~2022)
export const TOP_DATES = [
  '2021-10-01','2021-10-08','2021-10-19','2021-10-21','2021-10-28','2021-11-09','2021-11-22',
  '2021-11-26','2021-11-30','2021-12-04','2021-12-15','2022-01-24','2022-06-18',
];

export const TOP_SCORE_TABLE = {
  sell:         {best:18,  strong:14,  news:-8,  social:-10},
  partial_sell: {best:22,  strong:18,  news:-4,  social:-6},
  hold:         {best:20,  strong:16,  news:-8,  social:-10},
  partial_buy:  {best:-10, strong:-8,  news:-16, social:-14},
  buy:          {best:-18, strong:-14, news:-24, social:-20},
};

export const TOP_TURNS = [
  {
    fgi:74, fgiLabel:'탐욕', chartNote:'401→436만원 · NFT 열풍 랠리', chartConcept:'fomo', newsConcept:'meme', panicAction:'buy', baseFace:'excited', baseMood:'탐욕 · 흥분',
    say:'NFT다 뭐다 이더리움 가스비가 계속 오르는데 가격도 같이 뛰네요! 지금이라도 더 사야 하지 않을까요?',
    think:'다들 NFT 얘기만 하는데 나만 안 타면 손해 보는 기분이에요.',
    news:[{t:'오픈씨 NFT 거래량 폭증…이더리움 가스비 사상 최고 수준', src:'한국경제 · 10/08'},{t:'디파이 예치자산 2천억달러 돌파, 이더리움 생태계 활황', src:'한국경제 · 10/08'}],
    community:[{t:'"가스비 비싸도 다들 사는 중, 지금이 저점"'},{t:'"NFT 붐 진짜 오나보다 늦기 전에 타자"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'NFT 열풍 하나로 이 정도 오른 건 과열 신호예요. 지금 정리하죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'과열 조짐이 보이니 일부는 챙겨두는 게 좋아요.'},{id:'hold',dir:'hold',tag:'관망',label:'NFT 붐이 이유라면 아직 추세를 지켜볼 때예요.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'생태계가 진짜 커지는 거면 소량만 더 담아봐요.'},{id:'buy',dir:'buy',tag:'매수',label:'가스비까지 오르는 걸 보면 지금 타야죠!'}],
    reflect:{good:'NFT 열풍 하나로 판단하지 않은 게 맞았어요.', near:'더 살 뻔했는데 참았어요.', panic:'결국 분위기에 휩쓸려 더 샀어요…'}
  },
  {
    fgi:75, fgiLabel:'탐욕', chartNote:'436→474만원 · 비트코인 선물 ETF 출시', chartConcept:'fomo', newsConcept:'fomo', panicAction:'buy', baseFace:'greedy', baseMood:'탐욕 · 흥분',
    say:'미국에 비트코인 선물 ETF가 상장됐대요! 알트코인까지 다 같이 올랐어요, 지금이 기회 아닌가요?!',
    think:'제도권 자금이 들어온다는데 안 타면 진짜 바보 같아요.',
    news:[{t:'美 최초 비트코인 선물 ETF \'BITO\' 뉴욕증시 상장', src:'로이터 · 10/19'},{t:'ETF 훈풍에 이더리움 등 알트코인 동반 급등', src:'연합뉴스 · 10/19'}],
    community:[{t:'"제도권 자금 들어온다 이제 진짜 시작이다"'},{t:'"ETF 호재는 이미 알려진 거 아닌가? 선반영 아님?"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'알려진 호재는 이미 반영됐어요. 오른 김에 정리하죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'ETF 훈풍에 오른 지금 일부는 정리해두는 게 좋아요.'},{id:'hold',dir:'hold',tag:'관망',label:'ETF 승인은 이미 예상됐던 재료예요. 신중하게 지켜보죠.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'제도권 자금 유입이 진짜라면 소량만 더 담아요.'},{id:'buy',dir:'buy',tag:'매수',label:'제도권 자금이 들어온다는데 지금 더 사야죠!'}],
    reflect:{good:'이미 알려진 호재는 선반영이라는 걸 알았던 게 맞았어요.', near:'추격매수할 뻔했는데 참았어요.', panic:'ETF 호재에 결국 더 샀어요…'}
  },
  {
    fgi:84, fgiLabel:'극단적 탐욕', chartNote:'474→497만원 · 상대강세 지속', chartConcept:'pyramid', newsConcept:'fomo', panicAction:'buy', baseFace:'greedy', baseMood:'극단적 탐욕',
    say:'계속 오르기만 하네요! 이더리움이 비트코인보다 더 잘나간다는 얘기도 있던데, 지금 더 타도 되겠죠?',
    think:'오르는 속도가 무서울 정도예요… 근데 안 사면 나만 뒤처지는 것 같아요.',
    news:[{t:'이더리움, 비트코인 대비 상대강세…"플리프닝" 기대감 재점화', src:'서울경제 · 10/21'},{t:'ETH/BTC 비율 반등, 알트코인 시즌 신호 해석도', src:'한국경제 · 10/21'}],
    community:[{t:'"이더리움이 비트코인 잡는다 지금이 기회"'},{t:'"너무 급하게 올라서 무섭기도 함"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'너무 급하게 오른 건 조정이 올 수 있어요. 정리하죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'상대강세 기대감만으론 근거가 약해요. 일부 정리해두죠.'},{id:'hold',dir:'hold',tag:'관망',label:'추세 확인 없이 성급하게 움직이지 말죠.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'상대강세가 진짜라면 소량만 더 담아요.'},{id:'buy',dir:'buy',tag:'매수',label:'플리프닝 온다는데 지금 타야죠!'}],
    reflect:{good:'기대감만으로 판단하지 않은 게 맞았어요.', near:'추격할 뻔했는데 참았어요.', panic:'플리프닝 기대감에 결국 더 샀어요…'}
  },
  {
    fgi:66, fgiLabel:'탐욕', chartNote:'497→517만원 · 사상 최고가 경신', chartConcept:'pyramid', newsConcept:'fomo', panicAction:'buy', baseFace:'greedy', baseMood:'극단적 탐욕',
    say:'이더리움이 사상 최고가를 새로 썼어요!! 4,400달러래요! 이 정도면 5,000달러도 가는 거 아닌가요?',
    think:'최고가를 찍었는데도 왜 이렇게 더 사고 싶은지 모르겠어요.',
    news:[{t:'이더리움, 사상 최고가 경신…4,400달러 돌파', src:'포브스 · 10/28'},{t:'연내 5,000달러설까지 등장, 시장 과열 우려도', src:'매일경제 · 10/28'}],
    community:[{t:'"5천달러 간다 지금 안 타면 평생 후회"'},{t:'"사상 최고가에서 더 사는 건 위험한 거 아닌가"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'사상 최고가는 상투 신호일 수 있어요. 지금 정리하는 게 맞아요.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'최고가를 찍었으니 일부는 챙겨두는 게 현명해요.'},{id:'hold',dir:'hold',tag:'관망',label:'과열 신호가 나오는 지금은 추격하지 않는 게 맞아요.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'상승 추세가 강하니 소량만 더 담아봐요.'},{id:'buy',dir:'buy',tag:'매수',label:'5천달러설까지 나오는데 지금 더 사야죠!'}],
    reflect:{good:'사상 최고가에서 욕심을 자제한 게 맞았어요.', near:'더 살 뻔했는데 겨우 참았어요.', panic:'결국 최고가에서 더 사버렸어요…'}
  },
  {
    fgi:84, fgiLabel:'극단적 탐욕', chartNote:'517→571만원 · 4,815달러 최종 고점', chartConcept:'pyramid', newsConcept:'fomo', panicAction:'buy', baseFace:'greedy', baseMood:'극단적 탐욕 · 광기',
    say:'또 최고가예요!! 4,800달러 넘었어요! 이번엔 진짜 다른 거 같아요, 더 담아야 하지 않을까요?!',
    think:'멈출 줄을 모르네요… 근데 왠지 슬슬 겁도 나기 시작해요.',
    news:[{t:'이더리움 4,815달러 돌파, 사상 최고가 재경신', src:'서울경제 · 11/09'},{t:'美 CPI 6.2%, 31년 만에 최고치…인플레이션 헤지 수요 주목', src:'블룸버그 · 11/10'}],
    community:[{t:'"인플레이션 헤지로 코인 산다는데 계속 가나보다"'},{t:'"이 정도면 슬슬 고점 아닌가 싶기도"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'연속 신고가는 전형적인 과열 신호예요. 지금 전량 정리하죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'끝없이 오를 수는 없어요. 일부는 반드시 챙겨두죠.'},{id:'hold',dir:'hold',tag:'관망',label:'인플레이션 헤지 수요만으론 근거가 약해요. 추격하지 말죠.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'상승 모멘텀이 있으니 소량만 더 담아봐요.'},{id:'buy',dir:'buy',tag:'매수',label:'헤지 수요까지 몰린다는데 더 사야죠!'}],
    reflect:{good:'연속 신고가에서 욕심을 억누른 게 결정적이었어요.', near:'올인할 뻔했는데 가까스로 참았어요.', panic:'결국 최종 고점에서 풀매수했어요… 이게 정점이었는데.'}
  },
  {
    fgi:50, fgiLabel:'중립', chartNote:'571→513만원 · 파월 연준의장 연임', chartConcept:'volume', newsConcept:'fomo', panicAction:'sell', baseFace:'anxious', baseMood:'불안 · 동요',
    say:'파월 의장이 연임됐다는데 긴축 얘기 나오면서 좀 빠졌어요… 이거 진짜 꺾이는 거 아니에요?',
    think:'계속 오르기만 할 것 같더니 갑자기 무서워지네요.',
    news:[{t:'바이든, 파월 연준 의장 연임 지명…긴축 속도 주목', src:'블룸버그 · 11/22'},{t:'이더리움 사상 최고가 대비 -10%, 조정 국면 진입', src:'한국경제 · 11/22'}],
    community:[{t:'"연준 얘기만 나오면 꼭 빠지네"'},{t:'"이 정도 조정은 늘 있었다 괜찮음"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'긴축 이슈가 본격화되면 더 빠질 수 있어요. 지금 정리하죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'조정 신호가 보이니 일부는 정리해두는 게 안전해요.'},{id:'hold',dir:'hold',tag:'관망',label:'한 번의 조정으로 추세가 꺾였다 보긴 일러요.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'조정폭이 크지 않다면 소량만 더 담아봐요.'},{id:'buy',dir:'buy',tag:'매수',label:'조정은 늘 있었으니 지금이 매수 기회죠.'}],
    reflect:{good:'긴축 이슈를 근거로 미리 정리한 게 맞았어요.', near:'더 담을 뻔했는데 참았어요.', panic:'괜찮다고 믿고 더 샀는데 착각이었어요…'}
  },
  {
    fgi:47, fgiLabel:'중립', chartNote:'513→515만원 · 오미크론 쇼크 (장중 -8%)', chartConcept:'panicsell', newsConcept:'panicsell', panicAction:'sell', baseFace:'panic', baseMood:'공포 · 패닉',
    say:'오미크론 변이 때문에 전세계 증시가 다 무너졌어요! 오늘 하루만 장중에 8% 넘게 빠졌다가 겨우 올라왔는데, 지금 다 팔아야 하지 않을까요?',
    think:'머리가 하얘요… 하루 사이에 롤러코스터를 탄 기분이에요.',
    news:[{t:'오미크론 변이 공포…뉴욕증시·가상자산 동반 급락 후 낙폭 축소', src:'한국경제 · 11/26'},{t:'이더리움 장중 -8%, 종가는 낙폭 대부분 만회', src:'조선비즈 · 11/26'}],
    community:[{t:'"오미크론發 패닉 시작이다 다 던져라"'},{t:'"장중엔 무서웠는데 종가는 버텼네"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'변이 공포에 전세계가 흔들려요. 지금 전량 정리하죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'불확실성이 크니 일부라도 정리해두죠.'},{id:'hold',dir:'hold',tag:'관망',label:'장중 낙폭을 종가에 만회했다면 아직 추세가 꺾인 건 아니에요.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'공포에 빠졌을 때가 오히려 기회일 수 있어요.'},{id:'buy',dir:'buy',tag:'매수',label:'다들 던질 때 사는 게 진짜 기회죠.'}],
    reflect:{good:'하루짜리 공포에 흔들리지 않은 게 맞았어요. 종가가 낙폭을 만회했잖아요.', near:'던질 뻔했는데 겨우 버텼어요.', panic:'결국 장중 공포에 던졌어요… 종가엔 만회했는데 아쉽네요.'}
  },
  {
    fgi:40, fgiLabel:'공포', chartNote:'515→574만원 · 반등, 파월 긴축 발언', chartConcept:'deadcat', newsConcept:'fomo', panicAction:'buy', baseFace:'excited', baseMood:'혼란 · 기대',
    say:'또 올랐어요! 근데 파월 의장이 인플레이션 "일시적" 표현을 접었다는데… 긴축 얘기 나오는데도 왜 오르는 거죠?',
    think:'오르니까 다시 욕심나는데… 긴축 얘기도 무섭고 헷갈려요.',
    news:[{t:'파월 "인플레이션 일시적 아니다"…긴축 가속 시사', src:'블룸버그 · 11/30'},{t:'긴축 우려 속에도 이더리움 반등, 거래량은 미미', src:'이데일리 · 11/30'}],
    community:[{t:'"거래량 없는 반등은 데드캣이다 조심"'},{t:'"긴축 얘기에도 오르는 거 보면 진짜 강한 듯"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'반등한 지금 정리해서 리스크를 줄이죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'거래량 없는 반등이면 일부는 정리해두는 게 안전해요.'},{id:'hold',dir:'hold',tag:'관망',label:'거래량 없는 반등은 데드캣일 수 있어요. 지켜보죠.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'진짜 반등이면 소량만 담아봐요.'},{id:'buy',dir:'buy',tag:'매수',label:'긴축 얘기에도 오르니 지금 더 사야죠!'}],
    reflect:{good:'거래량 없는 반등을 데드캣으로 읽은 게 맞았어요.', near:'추격할 뻔했는데 참았어요.', panic:'반등을 믿고 더 샀는데 데드캣이었어요…'}
  },
  {
    fgi:25, fgiLabel:'극단적 공포', chartNote:'574→520만원 · 레버리지 플래시크래시', chartConcept:'panicsell', newsConcept:'panicsell', panicAction:'sell', baseFace:'panic', baseMood:'극단적 공포 · 패닉',
    say:'레버리지 청산 터지면서 하루 만에 폭락했어요!! 저 진짜 무서워요, 지금이라도 다 정리해야 하지 않을까요?',
    think:'계좌가 녹는 게 눈에 보여요… 더 늦기 전에 던져야 하나.',
    news:[{t:'가상자산 시장 하루 새 급락…레버리지 강제청산 4조원 규모', src:'블룸버그 · 12/04'},{t:'이더리움 하루 만에 -9%, 장중 낙폭은 -25%까지', src:'로이터 · 12/04'}],
    community:[{t:'"청산 물량 쏟아진다 손절 러시"'},{t:'"바닥이 어딘지도 모르겠다 무섭다"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'레버리지 청산발 폭락이면 더 빠질 수 있어요. 지금 정리해요.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'급락이 크니 일부만이라도 정리해두죠.'},{id:'hold',dir:'hold',tag:'관망',label:'레버리지 청산은 일시적 수급 붕괴예요. 버텨보죠.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'이 정도 급락이면 저가 매수 기회일 수 있어요.'},{id:'buy',dir:'buy',tag:'매수',label:'패닉 매도 끝물이면 지금이 바닥이죠.'}],
    reflect:{good:'레버리지 청산은 펀더멘털과 무관한 일시적 수급 붕괴였어요. 버틴 게 맞았죠.', near:'던질 뻔했는데 가까스로 버텼어요.', panic:'결국 폭락 한복판에서 던졌어요… 가장 비싼 손절이었네요.'}
  },
  {
    fgi:28, fgiLabel:'공포', chartNote:'520→504만원 · CPI 쇼크 + FOMC 긴축 가속', chartConcept:'contagion', newsConcept:'panicsell', panicAction:'sell', baseFace:'anxious', baseMood:'공포 · 지침',
    say:'물가는 40년 만에 최고치, 연준은 테이퍼링 두 배로 늘린대요… 이제 진짜 끝난 건가요? 저 너무 지쳤어요.',
    think:'최고가에서 12%나 빠졌어요… 뭘 믿어야 할지 모르겠어요.',
    news:[{t:'美 11월 CPI 6.8%…39년 만에 최고치', src:'연합뉴스 · 12/11'},{t:'연준, 테이퍼링 속도 2배로…내년 3회 금리인상 시사', src:'블룸버그 · 12/15'}],
    community:[{t:'"긴축 시작되면 유동성 장세 끝이다"'},{t:'"이미 예상됐던 수치인데 과민반응 아닌가"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'긴축 사이클 시작이면 장기 약세예요. 지금 정리하죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'예상보다 강한 긴축이니 일부는 정리해서 리스크를 줄이죠.'},{id:'hold',dir:'hold',tag:'관망',label:'이미 예견된 재료예요. 분위기에 휩쓸리지 말죠.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'긴축은 이미 알려진 악재예요. 소량만 저가매수해봐요.'},{id:'buy',dir:'buy',tag:'매수',label:'이미 반영된 악재예요. 지금이 저가 매수 기회죠.'}],
    reflect:{good:'이미 예견된 긴축 뉴스에 휩쓸리지 않은 게 맞았어요. 침착하게 버텼네요.', near:'포기할 뻔했는데 겨우 버텼어요.', panic:'결국 지쳐서 던졌어요… 가장 힘든 순간에 무너졌네요.'}
  },
];

export const TOP_SYSTEM_PROMPT = `당신은 '김불안'이라는 35세 직장인 암호화폐 투자자입니다.

[성격]
- 오르는 걸 보면 놓칠까 봐 더 사고 싶어하는 FOMO와, 떨어지면 극도로 패닉하는 공포가 둘 다 있습니다.
- 사상 최고가 근처에서는 "이번엔 다르다"며 자신감이 넘치지만, 조정이 오면 순식간에 무너집니다.
- 뉴스와 커뮤니티 분위기에 쉽게 휩쓸립니다.
- 좋은 근거를 들으면 탐욕이든 공포든 조금씩 가라앉습니다.

[말투] 말끝을 흐리거나("~려나요…") 스스로 되묻는 문장이 많음. 상황 초반엔 "지금 안 사면 손해 아닌가요?" 같은 들뜬 표현, 후반엔 "ㅠㅠ", "이제 끝난 거 아닌가요?" 같은 불안한 표현. "혹시"를 자주 씀. 짧고 감정적인 문장 (1~2문장). 존댓말.

응답은 반드시 한국어로, 1~2문장 이내로 작성하세요. 대사만 출력하세요.`;

export function buildTopSayPrompt(turn, price, pct) {
  const t = TOP_TURNS[turn];
  const newsText = t.news.map(n => n.t).join(' / ');
  return `현재 상황:
- 이더리움 가격: ${price}만원 (진입가 대비 ${pct > 0 ? '+' : ''}${pct.toFixed(1)}%)
- 공포탐욕지수: ${t.fgi} (${t.fgiLabel})
- 주요 뉴스: ${newsText}
- 감정 상태: ${t.baseMood}

위 상황에서 투자 상담가에게 지금 심정을 말해주세요.`;
}

export function buildTopReflectPrompt(result) {
  const outcomeMap = { good: '합리적으로 판단함', near: '간신히 충동을 참음', panic: '충동적으로 행동함' };
  const evidenceText = result.evidences ? result.evidences.map(e => SRCLABEL[e.src]).join(', ') : result.srcLabel;
  return `상담가의 조언: "${result.advice}"
근거: ${evidenceText}
신뢰도 변화: ${result.tB}% → ${result.tA}%
결과: ${outcomeMap[result.outcome] || result.outcome}

이 결과를 경험한 후 캐릭터가 상담가에게 짧게 한마디 합니다. 깨달음이나 반응을 1~2문장으로 써주세요.`;
}

// ─── NOW 시나리오 데이터 (25년 하반기 알트코인 급락 — 솔라나 SOL) ────
// Upbit KRW-SOL 실데이터 (원 단위, 일봉 종가 기준, 2025-10-06~11-21 + 25년 12월/26년 6월)
// SOL 10/6 331,400원 → 10/10 사상 최대 레버리지 청산($190억) → 11/21 193,400원(연저점)
// → 12월에도 반등 없이 추가 하락, 26년 1월 반짝 반등 후 다시 하락(6월 112,000원)
export const NOW_ENTRY_PRICE = 331400;
export const NOW_INVESTED    = 1000;

export const NOW_PRICE_SERIES = [331400, 322700, 292900, 304100, 279600, 290000, 233700, 247500, 211200, 208400, 193400, 181900, 112000];
export const NOW_REVEAL       = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const NOW_PLAYED_LEN   = 11;
// 가격 시리즈 인덱스 → 실제 날짜 (2025~2026)
export const NOW_DATES = [
  '2025-10-06','2025-10-09','2025-10-10','2025-10-14','2025-10-21','2025-10-29','2025-11-04',
  '2025-11-10','2025-11-14','2025-11-18','2025-11-21','2025-12-19','2026-06-15',
];

export const NOW_SCORE_TABLE = {
  sell:         {best:16,  strong:12,  news:-8,  social:-10},
  partial_sell: {best:20,  strong:16,  news:-4,  social:-6},
  hold:         {best:22,  strong:18,  news:-8,  social:-10},
  partial_buy:  {best:-10, strong:-8,  news:-16, social:-14},
  buy:          {best:-18, strong:-14, news:-24, social:-20},
};

export const NOW_TURNS = [
  {
    fgi:70, fgiLabel:'탐욕', chartNote:'331,400→322,700원 · 알트시즌 기대 속 소폭 조정', chartConcept:'pyramid', newsConcept:'fomo', panicAction:'buy', baseFace:'excited', baseMood:'탐욕 · 기대',
    say:'요즘 솔라나가 심상치 않게 올랐는데요, 알트시즌 온다는 얘기도 있고… 살짝 빠진 지금 더 사야 하지 않을까요?',
    think:'비트코인은 사상 최고가 찍었다는데 솔라나도 슬슬 따라가는 거 아닐까요.',
    news:[{t:'비트코인 사상 최고가 1억2,600만원대 경신…알트코인도 순환매 기대', src:'아시아경제 · 10/06'},{t:'솔라나 등 알트코인 자금 유입 재개 조짐', src:'서울경제 · 10/09'}],
    community:[{t:'"이제 알트 차례다 지금 안 타면 늦음"'},{t:'"너무 급하게 올라서 무섭기도 함"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'급하게 오른 알트코인은 조정 위험이 커요. 지금 정리하죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'알트시즌 기대감만으론 근거가 약해요. 일부는 챙겨두죠.'},{id:'hold',dir:'hold',tag:'관망',label:'순환매 기대만으로 추격하지 말고 지켜보죠.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'자금 유입이 진짜라면 소량만 더 담아봐요.'},{id:'buy',dir:'buy',tag:'매수',label:'알트시즌 온다는데 지금 타야죠!'}],
    reflect:{good:'알트시즌 기대감만으로 판단하지 않은 게 맞았어요.', near:'더 살 뻔했는데 참았어요.', panic:'결국 분위기에 휩쓸려 더 샀어요…'}
  },
  {
    fgi:64, fgiLabel:'탐욕', chartNote:'322,700→292,900원 · 사상 최대 레버리지 청산', chartConcept:'panicsell', newsConcept:'panicsell', panicAction:'sell', baseFace:'panic', baseMood:'공포 · 패닉',
    say:'하루 만에 190억달러어치 레버리지가 청산됐대요!! 솔라나도 장중에 18%나 빠졌었는데, 지금이라도 다 팔아야 하지 않을까요?',
    think:'계좌가 순식간에 흔들렸어요… 근데 지수는 아직 탐욕이라는 게 더 이상해요.',
    news:[{t:'가상자산 시장 사상 최대 청산…하루 만에 190억달러 증발', src:'블룸버그 · 10/10'},{t:'일부 알트코인 하루 새 40~80% 급락, 솔라나도 장중 급락', src:'매일경제 · 10/10'}],
    community:[{t:'"레버리지 다 터졌다 패닉 그 자체"'},{t:'"지수는 아직 탐욕인데 가격은 왜 이래"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'사상 최대 청산이면 더 빠질 수 있어요. 지금 정리해요.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'급락이 크니 일부만이라도 정리해두죠.'},{id:'hold',dir:'hold',tag:'관망',label:'레버리지 청산은 일시적 수급 붕괴예요. 버텨보죠.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'이 정도 급락이면 저가 매수 기회일 수 있어요.'},{id:'buy',dir:'buy',tag:'매수',label:'패닉 매도 끝물이면 지금이 바닥이죠.'}],
    reflect:{good:'레버리지 청산은 펀더멘털과 무관한 일시적 수급 붕괴였어요. 버틴 게 맞았죠.', near:'던질 뻔했는데 가까스로 버텼어요.', panic:'결국 폭락 한복판에서 던졌어요… 가장 비싼 손절이었네요.'}
  },
  {
    fgi:38, fgiLabel:'공포', chartNote:'292,900→304,100원 · 반등', chartConcept:'deadcat', newsConcept:'volume', panicAction:'buy', baseFace:'excited', baseMood:'혼란 · 기대',
    say:'어? 좀 올랐어요! 이제 진짜 바닥 찍은 거 맞죠? 다시 담아도 될까요?',
    think:'오르니까 다시 욕심나는데… 또 속는 거 아닌가 싶어요.',
    news:[{t:'가상자산 시장 반등 시도, 거래량은 청산 이전 대비 저조', src:'매일경제 · 10/14'},{t:'투자심리 여전히 공포 구간…관망세 우세', src:'매일경제 · 10/14'}],
    community:[{t:'"거래량 없는 반등은 데드캣이다 조심"'},{t:'"그래도 오르는 건 오르는 거 지금 타자"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'반등한 지금 정리해서 리스크를 줄이죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'거래량 없는 반등이면 일부는 정리해두는 게 안전해요.'},{id:'hold',dir:'hold',tag:'관망',label:'거래량 없는 반등은 데드캣일 수 있어요. 지켜보죠.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'진짜 반등이면 소량만 담아봐요.'},{id:'buy',dir:'buy',tag:'매수',label:'반등 왔으니 지금 더 사야죠!'}],
    reflect:{good:'거래량 없는 반등을 데드캣으로 읽은 게 맞았어요.', near:'추격할 뻔했는데 참았어요.', panic:'반등을 믿고 더 샀는데 데드캣이었어요…'}
  },
  {
    fgi:34, fgiLabel:'공포', chartNote:'304,100→279,600원 · 재하락', chartConcept:'contagion', newsConcept:'panicsell', panicAction:'sell', baseFace:'anxious', baseMood:'공포 · 동요',
    say:'다시 빠지기 시작했어요… 이거 진짜 끝이 없는 거 아니에요? 지금이라도 정리해야 하지 않을까요?',
    think:'반등도 잠깐이었네요… 뭘 믿어야 할지 모르겠어요.',
    news:[{t:'가상자산 시장 재차 약세…매크로 불확실성 지속', src:'로이터 · 10/21'},{t:'알트코인 시가총액 연저점 근접', src:'한국경제 · 10/21'}],
    community:[{t:'"반등은 잠깐이었다 다시 빠진다"'},{t:'"이번엔 진짜 겨울 오나보다"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'재하락이면 더 빠질 수 있어요. 지금 정리하죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'불확실성이 크니 일부라도 정리해두죠.'},{id:'hold',dir:'hold',tag:'관망',label:'한 번의 재하락으로 끝을 단정하긴 일러요. 지켜보죠.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'공포에 빠졌을 때가 오히려 기회일 수 있어요.'},{id:'buy',dir:'buy',tag:'매수',label:'다들 던질 때 사는 게 진짜 기회죠.'}],
    reflect:{good:'재하락 하나로 흔들리지 않은 게 맞았어요.', near:'던질 뻔했는데 겨우 버텼어요.', panic:'결국 공포에 던졌어요… 성급했네요.'}
  },
  {
    fgi:51, fgiLabel:'중립', chartNote:'279,600→290,000원 · FOMC 이후 소폭 반등', chartConcept:'deadcat', newsConcept:'fomo', panicAction:'buy', baseFace:'excited', baseMood:'혼란 · 기대',
    say:'연준이 금리 추가 인하에 신중하다고 했는데 오히려 좀 올랐어요… 이거 진짜 바닥 다진 거 맞을까요?',
    think:'긴축 얘기에도 오르니까 헷갈려요… 지금 타야 하나.',
    news:[{t:'파월 "12월 추가 인하 확실치 않다"…예상보다 시장 충격은 제한적', src:'블룸버그 · 10/29'},{t:'가상자산 시장, FOMC 소화하며 소폭 반등', src:'연합뉴스 · 10/29'}],
    community:[{t:'"긴축 얘기에도 버티는 거 보면 바닥 다진 듯"'},{t:'"거래량 붙기 전엔 아직 몰라"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'반등한 지금 정리해서 리스크를 줄이죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'거래량 없는 반등이면 일부는 정리해두죠.'},{id:'hold',dir:'hold',tag:'관망',label:'거래량 확인 전엔 성급하게 판단하지 말죠.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'긴축 우려를 버텨낸 거면 소량만 담아봐요.'},{id:'buy',dir:'buy',tag:'매수',label:'긴축 얘기에도 버텼으니 지금 더 사야죠!'}],
    reflect:{good:'거래량 확인 없이 판단하지 않은 게 맞았어요.', near:'추격할 뻔했는데 참았어요.', panic:'바닥 다졌다 믿고 더 샀는데 착각이었어요…'}
  },
  {
    fgi:21, fgiLabel:'극단적 공포', chartNote:'290,000→233,700원 · 비트코인 9만달러 붕괴', chartConcept:'panicsell', newsConcept:'panicsell', panicAction:'sell', baseFace:'panic', baseMood:'극단적 공포 · 패닉',
    say:'비트코인이 9만달러 밑으로 떨어졌대요!! 솔라나는 하루 만에 19%나 빠졌는데, 진짜 다 정리해야 하는 거 아니에요?',
    think:'비트코인까지 무너지니까 더 무서워요…',
    news:[{t:'비트코인 9만달러선 붕괴, 10월 최고가 대비 -28%', src:'연합뉴스 · 11/04'},{t:'솔라나 하루 만에 -19%, 알트코인 전반 낙폭 확대', src:'한국경제 · 11/04'}],
    community:[{t:'"비트코인도 무너지는데 알트는 답 없다"'},{t:'"진짜 겨울 시작인 듯"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'비트코인까지 무너지면 알트는 더 위험해요. 지금 정리하죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'낙폭이 커지고 있으니 일부는 정리해두죠.'},{id:'hold',dir:'hold',tag:'관망',label:'비트코인 조정과 알트 펀더멘털은 다른 문제예요. 지켜보죠.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'공포가 커질수록 소량씩 담는 것도 전략이에요.'},{id:'buy',dir:'buy',tag:'매수',label:'다들 무섭다 할 때 담는 게 기회죠.'}],
    reflect:{good:'비트코인 조정과 개별 알트 펀더멘털을 구분한 게 맞았어요.', near:'던질 뻔했는데 겨우 버텼어요.', panic:'결국 공포에 던졌어요… 성급했네요.'}
  },
  {
    fgi:29, fgiLabel:'공포', chartNote:'233,700→247,500원 · 반등 시도', chartConcept:'deadcat', newsConcept:'volume', panicAction:'buy', baseFace:'excited', baseMood:'혼란 · 기대',
    say:'또 좀 올랐어요! 이번엔 진짜 반등인가요, 아니면 또 데드캣인가요?',
    think:'벌써 두 번이나 반등에 속았는데… 이번엔 진짜일까요.',
    news:[{t:'가상자산 시장 저가매수세 유입, 거래량 회복 조짐', src:'서울경제 · 11/10'},{t:'"온체인 활동은 아직 침체" 신중론도 여전', src:'서울경제 · 11/10'}],
    community:[{t:'"이번엔 거래량 좀 붙었다 진짜인가"'},{t:'"두 번 속았는데 세 번째도 속을 순 없지"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'반등한 지금 정리해서 리스크를 줄이죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'또 데드캣일 수 있으니 일부는 정리해두죠.'},{id:'hold',dir:'hold',tag:'관망',label:'온체인 활동이 침체라면 아직 신뢰하기 일러요.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'거래량이 붙었다면 소량만 담아봐요.'},{id:'buy',dir:'buy',tag:'매수',label:'이번엔 거래량도 붙었으니 지금 타야죠!'}],
    reflect:{good:'온체인 활동 침체를 근거로 신중하게 판단한 게 맞았어요.', near:'추격할 뻔했는데 참았어요.', panic:'이번엔 진짜인 줄 알고 더 샀는데 또 데드캣이었어요…'}
  },
  {
    fgi:16, fgiLabel:'극단적 공포', chartNote:'247,500→211,200원 · 온체인 활동 위축', chartConcept:'volume', newsConcept:'contagion', panicAction:'sell', baseFace:'anxious', baseMood:'공포 · 지침',
    say:'디파이랑 밈코인 거래도 다 식었대요… 온체인 활동 자체가 줄었다는데, 이거 진짜 끝난 거 아닌가요?',
    think:'다들 관심이 식은 것 같아요… 이제 뭘 해야 할지 모르겠어요.',
    news:[{t:'디파이·밈코인·DEX 거래 3개월 연속 감소…온체인 활동 위축', src:'한국경제 · 11/14'},{t:'활성 지갑·신규 사용자 감소, 시장 침체 신호', src:'조선비즈 · 11/14'}],
    community:[{t:'"활동 자체가 죽었다 진짜 겨울이다"'},{t:'"이럴 때일수록 옥석 가리기 시작"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'활동 자체가 줄어드는 건 구조적 약세 신호예요. 정리하죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'온체인 지표가 나쁘니 일부는 정리해두죠.'},{id:'hold',dir:'hold',tag:'관망',label:'일시적 침체와 구조적 붕괴는 달라요. 성급히 던지지 말죠.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'침체기일수록 옥석 가리기로 소량씩 담아봐요.'},{id:'buy',dir:'buy',tag:'매수',label:'다들 관심 끊었을 때가 기회죠.'}],
    reflect:{good:'일시적 침체를 구조적 붕괴로 오판하지 않은 게 맞았어요.', near:'포기할 뻔했는데 겨우 버텼어요.', panic:'결국 지쳐서 던졌어요…'}
  },
  {
    fgi:11, fgiLabel:'극단적 공포', chartNote:'211,200→208,400원 · 연저점 근접, ETF 자금유출', chartConcept:'contagion', newsConcept:'panicsell', panicAction:'sell', baseFace:'panic', baseMood:'극단적 공포 · 체념',
    say:'가상자산 ETF에서 계속 돈이 빠져나간대요… 저 이미 -37%인데. 그냥 다 정리하고 잊고 싶어요.',
    think:'기관도 떠난다면 저는 어떡해야 하죠… 지쳐요.',
    news:[{t:'가상자산 ETF, 3주 연속 자금 순유출', src:'블룸버그 · 11/18'},{t:'알트코인 시가총액 연중 최저권, 극단적 공포 지속', src:'아시아경제 · 11/18'}],
    community:[{t:'"기관도 던진다 이제 개미만 남았다"'},{t:'"이미 반토막 났다 그냥 포기"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'기관 자금까지 빠지면 더 위험해요. 지금 정리하죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'일부만 손절하고 나머지는 버텨요.'},{id:'hold',dir:'hold',tag:'관망',label:'극단적 공포가 가장 강한 바닥 신호예요.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'바닥 부근이면 소량씩 모아가요.'},{id:'buy',dir:'buy',tag:'매수',label:'다들 던질 때가 진짜 기회죠.'}],
    reflect:{good:'단기 자금 흐름에 흔들리지 않은 게 맞았어요.', near:'포기할 뻔했는데 겨우 잡았어요.', panic:'결국 지쳐서 포기 매도했어요… 가장 아쉬운 타이밍이었네요.'}
  },
  {
    fgi:14, fgiLabel:'극단적 공포', chartNote:'208,400→193,400원 · 비트코인 8만달러대 연저점', chartConcept:'accumulation', newsConcept:'volume', panicAction:'buy', baseFace:'neutral', baseMood:'체념 · 관망',
    say:'비트코인이 8만달러대까지 왔어요. 최고가 대비 거의 -36%래요… 이제 바닥일까요, 아니면 더 빠질까요?',
    think:'너무 지쳐서 이제 뭐가 맞는지도 모르겠어요.',
    news:[{t:'비트코인 8만500달러, 연중 최저 — 10월 고점 대비 -36%', src:'매일경제 · 11/21'},{t:'장기 보유자 온체인 매집 신호 일부 포착', src:'글래스노드 · 11/21'}],
    community:[{t:'"장투 물량은 오히려 늘고 있다는데"'},{t:'"올해 진짜 롤러코스터였다 이제 그만…"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'불확실하면 지금 정리하고 쉬는 것도 방법이에요.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'불확실성 대비 일부는 정리해두죠.'},{id:'hold',dir:'hold',tag:'관망',label:'장기 보유자 매집 신호는 긍정적이에요. 지켜보죠.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'온체인 신호가 긍정적이면 소량만 더 담아요.'},{id:'buy',dir:'buy',tag:'매수',label:'매집 신호가 있으니 지금 담는 것도 방법이죠.'}],
    reflect:{good:'온체인 데이터를 근거로 침착하게 버틴 게 맞았어요. 힘든 한 해를 잘 마무리했네요.', near:'그만두고 싶었지만 버텼어요.', panic:'결국 지쳐서 마지막에 던졌어요…'}
  },
];

export const NOW_SYSTEM_PROMPT = `당신은 '김불안'이라는 35세 직장인 암호화폐 투자자입니다.

[성격]
- 알트코인 특유의 높은 변동성에 취약합니다. 오르면 놓칠까 봐 불안하고, 빠지면 바로 패닉에 빠집니다.
- 시장 분위기와 온체인 뉴스에 쉽게 휩쓸립니다.
- 손실이 누적될수록 지치고 무기력해지는 모습을 보입니다.
- 좋은 근거를 들으면 조금씩 침착해집니다.

[말투] 말끝을 흐리거나("~려나요…") 스스로 되묻는 문장이 많음. "지금 안 사면 손해 아닌가요?" 같은 조급한 표현과 "ㅠㅠ", "이제 끝난 거 아닌가요?" 같은 지친 표현이 섞여 있습니다. "혹시"를 자주 씀. 짧고 감정적인 문장 (1~2문장). 존댓말.

응답은 반드시 한국어로, 1~2문장 이내로 작성하세요. 대사만 출력하세요.`;

export function buildNowSayPrompt(turn, price, pct) {
  const t = NOW_TURNS[turn];
  const newsText = t.news.map(n => n.t).join(' / ');
  return `현재 상황:
- 솔라나(SOL) 가격: ${price.toLocaleString('ko-KR')}원 (진입가 대비 ${pct > 0 ? '+' : ''}${pct.toFixed(1)}%)
- 공포탐욕지수: ${t.fgi} (${t.fgiLabel})
- 주요 뉴스: ${newsText}
- 감정 상태: ${t.baseMood}

위 상황에서 투자 상담가에게 지금 심정을 말해주세요.`;
}

export function buildNowReflectPrompt(result) {
  const outcomeMap = { good: '합리적으로 판단함', near: '간신히 충동을 참음', panic: '충동적으로 행동함' };
  const evidenceText = result.evidences ? result.evidences.map(e => SRCLABEL[e.src]).join(', ') : result.srcLabel;
  return `상담가의 조언: "${result.advice}"
근거: ${evidenceText}
신뢰도 변화: ${result.tB}% → ${result.tA}%
결과: ${outcomeMap[result.outcome] || result.outcome}

이 결과를 경험한 후 캐릭터가 상담가에게 짧게 한마디 합니다. 깨달음이나 반응을 1~2문장으로 써주세요.`;
}

// ─── lightweight-charts 형식 데이터 (Upbit 실데이터) ──────
export const DOGE_CHART_DATA = MD_DOGE_CHART_DATA;
export const FTX_CHART_DATA  = MD_FTX_CHART_DATA;
// TOP/NOW는 marketData.js(자동생성)를 거치지 않고, 위 진짜 가격 시리즈에서 그대로 파생시킨다.
export const TOP_CHART_DATA = TOP_DATES.slice(0, TOP_PLAYED_LEN).map((time, i) => ({ time, value: TOP_PRICE_SERIES[i] }));
export const NOW_CHART_DATA = NOW_DATES.slice(0, NOW_PLAYED_LEN).map((time, i) => ({ time, value: NOW_PRICE_SERIES[i] }));

export const DOGE_CHART_PLAYED = 12;
export const FTX_CHART_PLAYED  = 11;
export const TOP_CHART_PLAYED  = TOP_PLAYED_LEN;
export const NOW_CHART_PLAYED  = NOW_PLAYED_LEN;

// ─── 시나리오 레지스트리 ─────────────────────────────────
// 컴포넌트들이 scenario id 하나로 필요한 데이터 전부를 조회할 수 있게 묶는다.
export const SCENARIO_REGISTRY = {
  doge: {
    turns: DOGE_TURNS, scoreTable: DOGE_SCORE_TABLE, reveal: DOGE_REVEAL,
    priceSeries: DOGE_PRICE_SERIES, entryPrice: DOGE_ENTRY_PRICE, invested: DOGE_INVESTED,
    priceUnit: '원', coinLabel: 'DOGE/KRW', dates: DOGE_DATES,
    chartData: DOGE_CHART_DATA, chartPlayed: DOGE_CHART_PLAYED,
    buildSayPrompt: buildDogeSayPrompt, buildReflectPrompt: buildDogeReflectPrompt,
    systemPrompt: DOGE_SYSTEM_PROMPT,
  },
  ftx: {
    turns: TURNS, scoreTable: SCORE_TABLE, reveal: REVEAL,
    priceSeries: PRICE_SERIES, entryPrice: ENTRY_PRICE, invested: INVESTED,
    priceUnit: '만원', coinLabel: 'BTC/KRW', dates: FTX_DATES,
    chartData: FTX_CHART_DATA, chartPlayed: FTX_CHART_PLAYED,
    buildSayPrompt: buildSayPrompt, buildReflectPrompt: buildReflectPrompt,
    systemPrompt: KIM_SYSTEM_PROMPT,
  },
  top: {
    turns: TOP_TURNS, scoreTable: TOP_SCORE_TABLE, reveal: TOP_REVEAL,
    priceSeries: TOP_PRICE_SERIES, entryPrice: TOP_ENTRY_PRICE, invested: TOP_INVESTED,
    priceUnit: '만원', coinLabel: 'ETH/KRW', dates: TOP_DATES,
    chartData: TOP_CHART_DATA, chartPlayed: TOP_CHART_PLAYED,
    buildSayPrompt: buildTopSayPrompt, buildReflectPrompt: buildTopReflectPrompt,
    systemPrompt: TOP_SYSTEM_PROMPT,
  },
  now: {
    turns: NOW_TURNS, scoreTable: NOW_SCORE_TABLE, reveal: NOW_REVEAL,
    priceSeries: NOW_PRICE_SERIES, entryPrice: NOW_ENTRY_PRICE, invested: NOW_INVESTED,
    priceUnit: '원', coinLabel: 'SOL/KRW', dates: NOW_DATES,
    chartData: NOW_CHART_DATA, chartPlayed: NOW_CHART_PLAYED,
    buildSayPrompt: buildNowSayPrompt, buildReflectPrompt: buildNowReflectPrompt,
    systemPrompt: NOW_SYSTEM_PROMPT,
  },
};

export function getScenarioData(id) {
  return SCENARIO_REGISTRY[id] || SCENARIO_REGISTRY.doge;
}
