import { session } from 'electron'

const HTTP_URL_RE = /^https?:\/\//
const REQUESTED_HEADERS_KEY = 'access-control-request-headers'

/**
 * Allow the renderer to read cross-origin http(s) responses.
 *
 * Electron keeps Chromium's CORS enforcement, so remote images / fonts / APIs
 * that do not send CORS headers are blocked in the renderer. These webRequest
 * hooks make requests behave like a non-browser client:
 * - `Origin` is stripped from requests (avoids server-side origin checks).
 * - Missing CORS response headers are filled with a permissive set.
 *
 * Only http(s) traffic is touched — the app's own custom protocols and
 * devtools are left alone.
 */
export function setupCors() {
  const { webRequest } = session.defaultSession
  console.log('CORS hooks registered')
  // `onHeadersReceived` cannot read request headers, so remember what each
  // preflight asked for (keyed by request id) to echo it back
  const preflightHeaders = new Map<number, string>()

  webRequest.onBeforeSendHeaders((details, callback) => {
    delete details.requestHeaders.Origin
    const requested = Object.entries(details.requestHeaders)
      .find(([k]) => k.toLowerCase() === REQUESTED_HEADERS_KEY)?.[1]
    if (requested) {
      preflightHeaders.set(details.id, requested)
    }
    callback({ requestHeaders: details.requestHeaders })
  })

  webRequest.onHeadersReceived((details, callback) => {
    if (!HTTP_URL_RE.test(details.url)) {
      callback({})
      return
    }

    const responseHeaders = { ...details.responseHeaders }
    responseHeaders['Access-Control-Allow-Origin'] = ['*']
    responseHeaders['Access-Control-Allow-Methods'] = ['*']
    // `*` does not cover `Authorization`, so echo the preflight request explicitly
    responseHeaders['Access-Control-Allow-Headers'] = [preflightHeaders.get(details.id) || '*']
    preflightHeaders.delete(details.id)
    callback({ responseHeaders })
  })
}
