// 모든 요청은 같은 출처의 /api로 보낸다 (①: Vite 프록시, ②~: Nginx 프록시) → CORS 설정 불필요.
// 같은 출처라 로그인 쿠키(HttpOnly)를 브라우저가 자동으로 실어 보낸다. JS는 토큰을 직접 다루지 않는다.
//
// 서버가 돌려주는 주요 데이터 모양 (참고용)
//   User      { id, username, name, nickname, email }
//   Book      { id, title, author, total_pages, status, rating, review, created_at, updated_at }
//   BookDetail  Book + { progress: { page, percent } | null, logs: [{ id, read_on, page, note, updated_at }] }
//   BookPage  { items: Book[], total, page, size }
//   Info      { pod, node, version }

export const STATUS_LABEL = { unread: '읽지 않음', reading: '읽는 중', done: '다 읽음' }
export const STATUSES = Object.keys(STATUS_LABEL)

// api('/books', { method: 'POST', json: {...} }) → 응답 JSON. 실패하면 서버의 detail 메시지로 Error를 던진다
export async function api(path, init = {}) {
  const { json, ...rest } = init
  if (json !== undefined) {
    rest.body = JSON.stringify(json)
    rest.headers = { 'Content-Type': 'application/json' }
  }
  const res = await fetch(`/api${path}`, rest)
  // 로그인 안 됨·만료(401) → 로그인 화면으로. 단, 비밀번호를 보낸 요청(로그인, 비밀번호 변경, 탈퇴)의 401은
  // "비밀번호 틀림"이라 그 화면에서 오류로 보여 준다
  const sentPassword = typeof json === 'object' && json !== null && Object.keys(json).some(k => k.includes('password'))
  if (res.status === 401 && !sentPassword) location.hash = '#/login'
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const detail = Array.isArray(body.detail) ? body.detail[0]?.msg : body.detail
    throw new Error(detail ?? `요청 실패 (${res.status})`)
  }
  return res.status === 204 ? undefined : res.json()
}

export const stars = rating => (rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) : '-')
