import { useEffect, useState } from 'react'

// 해시 라우팅(#/books/3): 서버는 index.html 하나만 주면 되므로 Nginx에 SPA용 설정이 따로 필요 없다
export function useRoute() {
  const read = () => location.hash.slice(1) || '/'
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const onChange = () => setRoute(read())
    addEventListener('hashchange', onChange)
    return () => removeEventListener('hashchange', onChange)
  }, [])
  return route
}
