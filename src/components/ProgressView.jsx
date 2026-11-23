// 진행률: 가장 최근 날짜 기록의 쪽 기준 (서버가 계산해서 progress로 줌)
export function ProgressView({ book }) {
  const p = book.progress
  return (
    <>
      <div className="progress-label">
        <strong>진행률</strong>
        <span className="muted">
          {!p ? '기록 없음' : book.total_pages ? `${p.page} / ${book.total_pages}쪽 · ${p.percent}%` : `${p.page}쪽까지`}
        </span>
      </div>
      <div className="progress" role="progressbar" aria-label="진행률" aria-valuemin={0} aria-valuemax={100}
        aria-valuenow={p?.percent ?? 0}>
        <div style={{ width: `${p?.percent ?? 0}%` }} />
      </div>
      {p && !book.total_pages && <p className="hint">전체 쪽수를 입력하면 %로 보여 줍니다.</p>}
    </>
  )
}
