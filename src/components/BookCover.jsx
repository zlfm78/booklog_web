import { coverColor } from '../utils'

// 표지 자리: 제목으로 정한 색 위에 제목·저자를 얹은 책 모양
export function BookCover({ title, author }) {
  return (
    <div className="cover" style={{ background: coverColor(title) }} aria-hidden="true">
      <span className="cover-title">{title}</span>
      <span className="cover-author">{author}</span>
    </div>
  )
}
