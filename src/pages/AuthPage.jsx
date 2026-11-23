import { useState } from 'react'
import { api } from '../api'

// 로그인(아이디·비밀번호)과 가입(아이디·비밀번호·이름·닉네임·이메일). mode: 'login' | 'register'
export function AuthPage({ mode, onLogin }) {
  const [error, setError] = useState('')
  const isLogin = mode === 'login'

  const submit = async e => {
    e.preventDefault()
    const form = Object.fromEntries(new FormData(e.currentTarget))
    try {
      if (!isLogin) await api('/auth/register', { method: 'POST', json: form })
      const creds = { username: form.username, password: form.password }
      onLogin(await api('/auth/login', { method: 'POST', json: creds }))  // 가입 후 바로 로그인
      location.hash = '#/'
    } catch (err) { setError(err.message) }
  }

  return (
    <div className="card form-narrow">
      <form className="form" onSubmit={submit} key={mode}>
        <div>
          <h1>{isLogin ? '다시 오신 걸 환영해요' : '나만의 서재 만들기'}</h1>
          <p className="muted">{isLogin ? '읽던 책을 이어서 기록하세요.' : '읽은 날짜와 쪽수, 독후감을 한곳에.'}</p>
        </div>
        <label>아이디
          <input name="username" required autoComplete="username" pattern="[a-z0-9_]{4,20}"
            title="영문 소문자·숫자·_ 4~20자" placeholder={isLogin ? '' : '영문 소문자·숫자·_ 4~20자'} />
        </label>
        <label>비밀번호 (8자 이상)
          <input name="password" type="password" minLength={8} required
            autoComplete={isLogin ? 'current-password' : 'new-password'} />
        </label>
        {!isLogin && (
          <>
            <div className="row">
              <label>이름<input name="name" required maxLength={50} autoComplete="name" /></label>
              <label>닉네임<input name="nickname" required minLength={2} maxLength={20} placeholder="화면에 표시" /></label>
            </div>
            <label>이메일<input name="email" type="email" required autoComplete="email" placeholder="you@example.com" /></label>
          </>
        )}
        {error && <p className="error">{error}</p>}
        <button className="btn-primary">{isLogin ? '로그인' : '가입하고 시작하기'}</button>
        <p className="muted" style={{ textAlign: 'center' }}>
          {isLogin ? <>처음이신가요? <a href="#/register">회원 가입</a></> : <>이미 계정이 있나요? <a href="#/login">로그인</a></>}
        </p>
      </form>
    </div>
  )
}
