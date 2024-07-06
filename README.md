# WSProxy-Workers

This is a proxy for WebSockets built with CloudFlare Workers.

Note: for the time being, it doesn't support headers.

## Usage

```txt
wss://<worker url>/?<target url>
```

## Development

```txt
$ pnpm install
```

```txt
$ pnpm wrangler dev
```

```txt
$ pnpm wrangler deploy
```
