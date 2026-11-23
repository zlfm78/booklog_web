import { useEffect, useState } from 'react'
import { api, stars, STATUS_LABEL, STATUSES } from '../api'
import { BookCover } from '../components/BookCover'
import { StatusBadge } from '../components/StatusBadge'

const PAGE_SIZE = 12

// 내 서재: 검색(제목·저자), 상태 필터, 페이징. 최근 수정순 카드 목록
export function BookListPage() {
  const [q, setQ] = useState('')            // 입력 중인 검색어
  const [search, setSearch] = useState('')  // 실제로 검색한 단어 (검색 버튼을 눌렀을 때만 바뀜)
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState(null)    // { items, total, page, size }
  const [error, setError] = useState('')

  // 검색어·필터·페이지가 바뀔 때마다 목록을 다시 불러옴
  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), size: String(PAGE_SIZE) })
    if (search) params.set('q', search)
    if (status) params.set('status', status)
    api(`/books?${params}`).then(setData).catch(e => setError(e.message))
  }, [search, status, page])

  const submit = e => { e.preventDefault(); setPage(1); setSearch(q) }
  const pages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

  return (
    <>
      <div className="page-head">
        <div>
          <h1>내 서재</h1>
          <p className="muted">{data ? `책 ${data.total}권 · 최근에 기록한 순서` : '불러오는 중…'}</p>
        </div>
        <a href="#/books/new" className="btn btn-primary">+ 책 등록</a>
      </div>

      <form className="toolbar" onSubmit={submit} role="search">
        <input placeholder="제목이나 저자로 검색" value={q} onChange={e => setQ(e.target.value)} aria-label="검색어" />
        <select value={status} onChange={e => { setPage(1); setStatus(e.target.value) }} aria-label="독서 상태">
          <option value="">모든 상태</option>
          {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
        <button>검색</button>
      </form>
      {error && <p className="error">{error}</p>}

      {data && data.total === 0 ? (
        <div className="card empty">
          <p>{search || status ? '조건에 맞는 책이 없습니다.' : '아직 등록한 책이 없습니다.'}</p>
          <a href="#/books/new" className="btn btn-primary">첫 책 등록하기</a>
        </div>
      ) : (
        <div className="book-grid">
          {data?.items.map(b => (
            <a key={b.id} href={`#/books/${b.id}`} className="book-card">
              <BookCover title={b.title} author={b.author} />
              <span className="title">{b.title}</span>
              <span className="muted">{b.author}</span>
              <span className="meta">
                <StatusBadge status={b.status} />
                {b.rating && <span className="stars" aria-label={`평점 ${b.rating}`}>{stars(b.rating)}</span>}
              </span>
            </a>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="pager">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>← 이전</button>
          <span>{page} / {pages}</span>
          <button disabled={page >= pages} onClick={() => setPage(page + 1)}>다음 →</button>
        </div>
      )}
    </>
  )
}
