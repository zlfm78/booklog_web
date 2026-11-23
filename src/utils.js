// 여러 화면에서 쓰는 작은 도우미

export const formJson = e => Object.fromEntries(new FormData(e.currentTarget))
export const numOrNull = v => (v ? Number(v) : null)  // 빈 값 = 없음
export const textOrNull = v => (v ? String(v) : null)
export const today = () => new Date().toLocaleDateString('sv-SE')  // 이 PC 시간대 기준 YYYY-MM-DD
export const when = iso => new Date(iso).toLocaleString('ko-KR')
export const day = iso => new Date(iso).toLocaleDateString('ko-KR')

// 표지 이미지가 없으므로 제목으로 색을 정한다 (같은 제목은 항상 같은 색)
export function coverColor(title) {
  let h = 0
  for (const ch of title) h = (h * 31 + ch.codePointAt(0)) % 360
  return `hsl(${h} 38% 42%)`
}
