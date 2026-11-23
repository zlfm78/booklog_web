import { useState } from 'react'
import { api } from '../api'

// 회원 탈퇴: 비밀번호를 다시 입력하고 확인을 한 번 더 받는다. 책·기록은 서버(DB CASCADE)가 함께 지운다
export function WithdrawPage({ user, onDone }) {
  const [error, setError] = useState('')
  const submit = async e => {
    e.preventDefault()
    const { password } = Object.fromEntries(new FormData(e.currentTarget))
    if (!confirm(`${user.username} 계정과 모든 책·독서 기록을 삭제합니다. 되돌릴 수 없습니다. 계속할까요?`)) return
    try {
      await api('/auth/me', { method: 'DELETE', json: { password } })
      onDone()
    } catch (err) { setError(err.message) }
  }
  return (
    <div className="card form-narrow">
      <form className="form" onSubmit={submit}>
        <div>
          <h1>회원 탈퇴</h1>
          <p className="muted"><strong>{user.username}</strong> 계정과 이 계정의 모든 책·독서 기록·독후감이 삭제되며 되돌릴 수 없습니다.</p>
        </div>
        <label>비밀번호 다시 입력<input name="password" type="password" required autoComplete="current-password" /></label>
        {error && <p className="error">{error}</p>}
        <div className="row">
          <a href="#/me" className="btn">취소</a>
          <button className="btn-danger">탈퇴</button>
        </div>
      </form>
    </div>
  )
}
