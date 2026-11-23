import { formJson, textOrNull, today } from '../utils'

// 날짜별 독서 기록: 저장 폼(같은 날짜면 덮어씀) + 기록 목록(최근 날짜순, 행마다 삭제)
export function ReadingLogSection({ book, send }) {
  const save = e => {
    e.preventDefault()
    const f = formJson(e)
    send(`/books/${book.id}/logs/${f.read_on}`, 'PUT', { page: Number(f.page), note: textOrNull(f.note) },
      `${f.read_on} 기록을 저장했습니다.`)
  }
  const remove = readOn => {
    if (confirm(`${readOn} 기록을 삭제할까요? 책 상태는 바뀌지 않습니다.`))
      send(`/books/${book.id}/logs/${readOn}`, 'DELETE', undefined, `${readOn} 기록을 삭제했습니다.`)
  }

  return (
    <div className="card">
      <h2>독서 기록</h2>
      <form className="row" onSubmit={save} key={book.updated_at}>
        <label style={{ flex: '0 0 150px' }}>날짜<input name="read_on" type="date" defaultValue={today()} required /></label>
        <label style={{ flex: '0 0 100px' }}>읽은 쪽
          <input name="page" type="number" min={0} max={book.total_pages ?? undefined} required placeholder="쪽" />
        </label>
        <label>한 줄 메모<input name="note" placeholder="오늘 읽은 내용" maxLength={10000} /></label>
        <button className="btn-primary">기록</button>
      </form>
      <p className="hint">같은 날짜로 다시 기록하면 덮어씁니다. 처음 기록하면 '읽는 중', 마지막 쪽까지 기록하면 '다 읽음'이 됩니다.</p>

      {book.logs.length === 0
        ? <p className="muted" style={{ marginTop: '1rem' }}>아직 기록이 없습니다.</p>
        : (
          <ul className="timeline">
            {book.logs.map(l => (
              <li key={l.id}>
                <span className="date">{l.read_on}</span>
                <span className="page">{l.page}쪽</span>
                <span>{l.note}</span>
                <button className="btn-link btn-small" onClick={() => remove(l.read_on)} aria-label={`${l.read_on} 기록 삭제`}>삭제</button>
              </li>
            ))}
          </ul>
        )}
    </div>
  )
}
