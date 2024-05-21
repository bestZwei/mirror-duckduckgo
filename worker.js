addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const targetUrl = 'https://duckduckgo.com'

  // 修改请求头,模拟浏览器访问
  const headers = new Headers(request.headers)
  headers.set('Host', 'duckduckgo.com')
  headers.set('Referer', 'https://duckduckgo.com/')
  headers.set('User-Agent', request.headers.get('User-Agent'))

  // 转发请求到 DuckDuckGo
  const response = await fetch(targetUrl + url.pathname + url.search, {
    headers,
    method: request.method,
    body: request.body
  })

  // 修改响应头,隐藏 DuckDuckGo 的原始信息
  const modifiedResponse = new Response(response.body, response)
  modifiedResponse.headers.set('Server', 'Cloudflare Workers')
  modifiedResponse.headers.delete('Content-Security-Policy')
  modifiedResponse.headers.delete('X-Frame-Options')

  return modifiedResponse
}
