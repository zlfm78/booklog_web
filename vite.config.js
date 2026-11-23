import { hostname } from 'node:os'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    // server.* 설정은 `npm run preview`(vite preview, 4173)도 그대로 물려받는다 (①은 빌드본을 preview로 실행)
    // ②부터는 Nginx가 붙이는 헤더. ①에서는 preview가 같은 역할을 해서 화면 하단 표시가 같은 방식으로 동작
    headers: { 'X-Served-By': hostname() },
    // ①에서만: 브라우저는 4173(web)에만 요청하고 /api는 preview가 was(8000)로 넘긴다
    // → 같은 출처(same-origin)라 CORS 설정이 필요 없고 쿠키도 그대로 동작. ②부터는 Nginx가 이 역할
    proxy: { '/api': 'http://127.0.0.1:8000' },
  },
})
