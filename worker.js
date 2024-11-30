addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const hostname = url.hostname;

  // 检查主机名是否包含 "duckduckgo.com"
  if (hostname.includes('duckduckgo.com')) {
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
      body: request.body,
      redirect: 'follow' // 确保重定向被正确处理
    })

    // 修改响应头,隐藏 DuckDuckGo 的原始信息
    const modifiedResponse = new Response(response.body, response)
    modifiedResponse.headers.set('Server', 'Cloudflare Workers')
    modifiedResponse.headers.delete('Content-Security-Policy')
    modifiedResponse.headers.delete('X-Frame-Options')

    // 确保 Cookies 被正确传递
    const setCookie = response.headers.get('Set-Cookie')
    if (setCookie) {
      modifiedResponse.headers.set('Set-Cookie', setCookie)
    }

    return modifiedResponse;
  } else {
    // 如果不是 duckduckgo.com 或其子域名，则直接返回
    return fetch(request);
  }
}
