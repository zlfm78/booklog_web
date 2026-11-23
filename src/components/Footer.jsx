import { useEffect, useState } from 'react'
import { api } from '../api'

// 빌드 시 고정되는 web 버전 (②에서 Docker build-arg → VITE_APP_VERSION)
const WEB_VERSION = import.meta.env.VITE_APP_VERSION ?? 'dev'

// 화면 하단: 어느 web·was Pod가 응답했는지와 버전 (롤링 업데이트·롤백·로드밸런싱 확인용)
export function Footer() {
  const [webPod, setWebPod] = useState('-')
  const [info, setInfo] = useState(null)
  useEffect(() => {
    fetch('/', { method: 'HEAD' }).then(r => setWebPod(r.headers.get('X-Served-By') ?? '-')).catch(() => {})
    api('/info').then(setInfo).catch(() => {})
  }, [])
  return (
    <footer className="site-footer">
      web v{WEB_VERSION} ({webPod}) · was {info ? `v${info.version} (${info.pod} @ ${info.node})` : '응답 없음'}
    </footer>
  )
}
