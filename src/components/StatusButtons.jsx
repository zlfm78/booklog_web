import { STATUS_LABEL, STATUSES } from '../api'

// 독서 상태 수동 변경 (기록을 저장하면 서버가 자동으로도 바꿈)
// send: BookDetailPage가 넘겨주는 함수 (요청 → 갱신된 상세로 화면 교체)
export function StatusButtons({ book, send }) {
  return (
    <div className="segmented" role="group" aria-label="독서 상태">
      {STATUSES.map(s => (
        <button key={s} aria-pressed={book.status === s} disabled={book.status === s}
          onClick={() => send(`/books/${book.id}`, 'PATCH', { status: s }, `상태를 '${STATUS_LABEL[s]}'(으)로 바꿨습니다.`)}>
          {STATUS_LABEL[s]}
        </button>
      ))}
    </div>
  )
}
