addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const hostname = url.hostname;

  // 检查主机名是否以 "duckduckgo.com" 结尾
  if (hostname.endsWith('.duckduckgo.com')) {
    const targetUrl = 'https://' + hostname + url.pathname + url.search;

    // 修改请求头,模拟浏览器访问
    const headers = new Headers(request.headers)
    headers.set('Host', hostname) // 设置目标主机名
    headers.set('Referer', 'https://duckduckgo.com/')
    headers.set('User-Agent', request.headers.get('User-Agent'))

    // 转发请求到 DuckDuckGo 对应的子域名
    const response = await fetch(targetUrl, {
      headers: headers,
      method: request.method,
      body: request.body
    })

    // 修改响应头,隐藏 DuckDuckGo 的原始信息
    const modifiedResponse = new Response(response.body, response)
    modifiedResponse.headers.set('Server', 'Cloudflare Workers')
    modifiedResponse.headers.delete('Content-Security-Policy')
    modifiedResponse.headers.delete('X-Frame-Options')

    return modifiedResponse;
  } else {
    // 如果不是 duckduckgo.com 或其子域名，则直接返回
    return fetch(request);
  }
}
