// 앱 뼈대: 로그인 사용자 상태 + 주소(#/...)에 따라 어떤 화면을 보여 줄지 결정
import { useEffect, useState } from 'react'
import { api } from './api'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { useRoute } from './hooks/useRoute'
import { AuthPage } from './pages/AuthPage'
import { BookDetailPage } from './pages/BookDetailPage'
import { BookListPage } from './pages/BookListPage'
import { MyPage } from './pages/MyPage'
import { NewBookPage } from './pages/NewBookPage'
import { WithdrawPage } from './pages/WithdrawPage'

export function App() {
  const route = useRoute()
  const [user, setUser] = useState(null)
  // 쿠키는 JS가 읽을 수 없으므로(HttpOnly) 로그인 여부는 서버에 물어본다. 401이면 api()가 로그인 화면으로 보냄
  useEffect(() => { api('/auth/me').then(setUser).catch(() => setUser(null)) }, [])

  const logout = async () => {
    await api('/auth/logout', { method: 'POST' })
    setUser(null)
    location.hash = '#/login'
  }

  const bookMatch = route.match(/^\/books\/(\d+)$/)
  let page
  if (route === '/login' || route === '/register') page = <AuthPage mode={route.slice(1)} onLogin={setUser} />
  else if (!user) page = <p className="muted">불러오는 중…</p>
  else if (bookMatch) page = <BookDetailPage id={Number(bookMatch[1])} />
  else if (route === '/books/new') page = <NewBookPage />
  else if (route === '/me') page = <MyPage user={user} onChange={setUser} />
  else if (route === '/account') page = <WithdrawPage user={user} onDone={() => { setUser(null); location.hash = '#/login' }} />
  else page = <BookListPage />

  return (
    <>
      <Header user={user} onLogout={logout} />
      <main className="container">{page}</main>
      <Footer />
    </>
  )
}
