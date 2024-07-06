import { Hono } from 'hono'

const app = new Hono()

app.get(
  '/',
  async (c) => {
    if (c.req.header('Upgrade') !== 'websocket') {
      return c.text(
        `WS Proxy\nUsage: wss://<worker url>/?<target url>`
      )
    }

    // wss://<worker url>/?<target url>
    const url = new URL(c.req.url).search.replace(/^\?/, '').replace(/ws(?=s?\:\/\/)/, 'http')
    console.log(`Target URL: ${url}`)

    const webSocketPair = new WebSocketPair()
    const server = webSocketPair[1]
    server.accept()

    // This is how you connect to websocket servers in a worker, instead of `new WebSocket(url)`.
    // Url should have http(s) protocol.
    let resp = await fetch(url, {
      headers: {
        Upgrade: 'websocket',
      },
    })

    const client = resp.webSocket
    if (!client) {
      throw new Error('Target server doesn\'t accept WS')
    }

    client.accept()

    // User sends message
    server.addEventListener('message', (e) => {
      console.log(`from client: ${e.data}`)
      client.send(e.data)
    })

    // User leaves
    server.addEventListener('close', (e) => {
      server.close() // this line is necessary to avoid `Error: The script will never generate a response.`
      client.close()
    })

    // Receives message from server
    client.addEventListener('message', (e) => {
      console.log(`from server: ${e.data}`)
      server.send(e.data)
    })

    // Connection with server is closed
    client.addEventListener('close', (e) => {
      server.close()
    })

    return new Response(null, {
      status: 101,
      webSocket: webSocketPair[0],
    })
  }
)

export default app
