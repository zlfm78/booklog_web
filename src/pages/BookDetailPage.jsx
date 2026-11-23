import { useEffect, useState } from 'react'
import { api, stars } from '../api'
import { BookCover } from '../components/BookCover'
import { ProgressView } from '../components/ProgressView'
import { ReadingLogSection } from '../components/ReadingLogSection'
import { ReviewForm } from '../components/ReviewForm'
import { StatusButtons } from '../components/StatusButtons'
import { when } from '../utils'

// 책 상세: 왼쪽(표지·상태·진행률·삭제) + 오른쪽(날짜별 기록, 평점·독후감)
export function BookDetailPage({ id }) {
  const [book, setBook] = useState(null)   // 책 + progress + logs
  const [message, setMessage] = useState('')
  useEffect(() => { api(`/books/${id}`).then(setBook).catch(e => setMessage(e.message)) }, [id])

  // 수정 요청을 보내고, 서버가 돌려준 갱신된 상세(진행률·기록 포함)로 화면을 바꾼다. 아래 구역들이 공유
  const send = (path, method, json, done) =>
    api(path, { method, json }).then(b => { setBook(b); setMessage(done) }, e => setMessage(e.message))

  const deleteBook = () => {
    if (!confirm(`'${book?.title}'을(를) 삭제할까요? 독서 기록도 모두 삭제되며 되돌릴 수 없습니다.`)) return
    api(`/books/${id}`, { method: 'DELETE' }).then(() => { location.hash = '#/' }, e => setMessage(e.message))
  }

  if (!book) return <p className="muted">{message || '불러오는 중…'}</p>
  return (
    <>
      <a href="#/" className="back">← 내 서재</a>
      <div className="detail">
        <aside className="detail-aside">
          <div className="card">
            <BookCover title={book.title} author={book.author} />
            <h1 style={{ marginTop: '1rem' }}>{book.title}</h1>
            <p className="muted">{book.author}</p>
            {book.rating && <p className="stars" aria-label={`평점 ${book.rating}`}>{stars(book.rating)}</p>}
          </div>
          <div className="card">
            <StatusButtons book={book} send={send} />
            <div style={{ marginTop: '1.25rem' }}><ProgressView book={book} /></div>
          </div>
          <div className="meta-list">
            <span>등록 {when(book.created_at)}</span>
            <span>수정 {when(book.updated_at)}</span>
          </div>
          <button className="btn-danger" onClick={deleteBook}>책 삭제</button>
        </aside>

        <section>
          {message && <p className="notice" role="status">{message}</p>}
          <ReadingLogSection book={book} send={send} />
          <ReviewForm book={book} send={send} />
        </section>
      </div>
    </>
  )
}
