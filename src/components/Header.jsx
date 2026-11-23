import { useRoute } from '../hooks/useRoute'

export function Header({ user, onLogout }) {
  const route = useRoute()
  return (
    <header className="site-header">
      <div className="container">
        <a href="#/" className="brand">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          booklog
        </a>
        {user && (
          <nav className="site-nav">
            <a href="#/" className={route === '/' ? 'active' : ''}>내 서재</a>
            <a href="#/books/new" className={route === '/books/new' ? 'active' : ''}>책 등록</a>
          </nav>
        )}
        <div className="user-menu">
          {user ? (
            <>
              <span className="email"><strong>{user.nickname}</strong>님</span>
              <a href="#/me" className={route === '/me' ? 'muted active' : 'muted'}>내 정보</a>
              <button className="btn-small" onClick={onLogout}>로그아웃</button>
            </>
          ) : <a href="#/login">로그인</a>}
        </div>
      </div>
    </header>
  )
}
