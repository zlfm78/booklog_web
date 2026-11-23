import { useState } from 'react'
import { api } from '../api'
import { formJson, numOrNull } from '../utils'

export function NewBookPage() {
  const [error, setError] = useState('')
  const submit = e => {
    e.preventDefault()
    const f = formJson(e)
    api('/books', { method: 'POST', json: { title: f.title, author: f.author, total_pages: numOrNull(f.total_pages) } })
      .then(b => { location.hash = `#/books/${b.id}` }, err => setError(err.message))
  }
  return (
    <div className="card form-narrow">
      <form className="form" onSubmit={submit}>
        <div>
          <h1>책 등록</h1>
          <p className="muted">등록한 뒤 날짜별로 읽은 쪽을 기록할 수 있습니다.</p>
        </div>
        <label>제목<input name="title" required maxLength={200} /></label>
        <label>저자<input name="author" required maxLength={100} /></label>
        <label>전체 쪽수 (선택)<input name="total_pages" type="number" min={1} placeholder="진행률 %를 계산할 때 사용" /></label>
        {error && <p className="error">{error}</p>}
        <div className="row">
          <a href="#/" className="btn">취소</a>
          <button className="btn-primary">등록</button>
        </div>
      </form>
    </div>
  )
}
