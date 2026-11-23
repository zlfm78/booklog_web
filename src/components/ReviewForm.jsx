import { stars } from '../api'
import { formJson, numOrNull, textOrNull } from '../utils'

// 평점·전체 쪽수·독후감 수정 (빈 값을 보내면 서버에서 지움)
export function ReviewForm({ book, send }) {
  const save = e => {
    e.preventDefault()
    const f = formJson(e)
    send(`/books/${book.id}`, 'PATCH',
      { rating: numOrNull(f.rating), review: textOrNull(f.review), total_pages: numOrNull(f.total_pages) },
      '평점·독후감을 저장했습니다.')
  }
  return (
    <div className="card">
      <h2>독후감</h2>
      <form className="form" onSubmit={save} key={book.updated_at}>
        <div className="row">
          <label>평점
            <select name="rating" defaultValue={book.rating ?? ''}>
              <option value="">평점 없음</option>
              {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{stars(n)}</option>)}
            </select>
          </label>
          <label>전체 쪽수<input name="total_pages" type="number" min={1} defaultValue={book.total_pages ?? ''} /></label>
        </div>
        <label>내용
          <textarea name="review" rows={8} maxLength={10000} defaultValue={book.review ?? ''}
            placeholder="책을 읽고 느낀 점을 남겨 보세요." />
        </label>
        <div><button className="btn-primary">저장</button></div>
      </form>
    </div>
  )
}
