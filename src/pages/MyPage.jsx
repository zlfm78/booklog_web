import { useState } from 'react'
import { api } from '../api'
import { formJson } from '../utils'

// 내 정보: 이름·닉네임·이메일 수정(아이디는 바꿀 수 없음) + 비밀번호 변경 + 회원 탈퇴 링크
export function MyPage({ user, onChange }) {
  const [profileMsg, setProfileMsg] = useState('')
  const [pwMsg, setPwMsg] = useState('')

  const saveProfile = e => {
    e.preventDefault()
    api('/auth/me', { method: 'PATCH', json: formJson(e) })
      .then(u => { onChange(u); setProfileMsg('저장했습니다.') }, err => setProfileMsg(err.message))
  }
  const changePassword = e => {
    e.preventDefault()
    const form = e.currentTarget
    const f = formJson(e)
    if (f.new_password !== f.confirm) { setPwMsg('새 비밀번호가 서로 다릅니다.'); return }
    api('/auth/me/password', { method: 'PUT', json: { current_password: f.current_password, new_password: f.new_password } })
      .then(() => { form.reset(); setPwMsg('비밀번호를 바꿨습니다.') }, err => setPwMsg(err.message))
  }

  return (
    <div className="form-narrow">
      <h1>내 정보</h1>
      <div className="card">
        <form className="form" onSubmit={saveProfile}>
          <label>아이디<input value={user.username} disabled /></label>
          <div className="row">
            <label>이름<input name="name" defaultValue={user.name} required maxLength={50} /></label>
            <label>닉네임<input name="nickname" defaultValue={user.nickname} required minLength={2} maxLength={20} /></label>
          </div>
          <label>이메일<input name="email" type="email" defaultValue={user.email} required /></label>
          {profileMsg && <p className="notice" role="status">{profileMsg}</p>}
          <div><button className="btn-primary">저장</button></div>
        </form>
      </div>

      <div className="card">
        <form className="form" onSubmit={changePassword}>
          <h2>비밀번호 변경</h2>
          <label>현재 비밀번호<input name="current_password" type="password" required autoComplete="current-password" /></label>
          <label>새 비밀번호 (8자 이상)<input name="new_password" type="password" minLength={8} required autoComplete="new-password" /></label>
          <label>새 비밀번호 확인<input name="confirm" type="password" minLength={8} required autoComplete="new-password" /></label>
          {pwMsg && <p className="notice" role="status">{pwMsg}</p>}
          <div className="row">
            <button className="btn-primary">비밀번호 변경</button>
            <a href="#/account" className="btn btn-danger" style={{ textAlign: 'center' }}>회원 탈퇴</a>
          </div>
        </form>
      </div>
    </div>
  )
}
