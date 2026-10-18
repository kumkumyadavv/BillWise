const API_URL = import.meta.env.VITE_API_URL;

function normalizeBaseUrl(rawValue) {
  if (!rawValue) return DEFAULT_BASE_URL
  return rawValue.replace(/\/+$/, '')
}

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_URL)

function isJsonResponse(contentType) {
  return typeof contentType === 'string' && contentType.toLowerCase().includes('application/json')
}

function getDetailMessage(detail) {
  if (!detail) return 'Request failed.'

  if (typeof detail === 'string') return detail

  if (Array.isArray(detail)) {
    const first = detail[0]
    if (first && typeof first === 'object') {
      return first.msg || first.detail || 'Validation error'
    }
    return detail.join(', ')
  }

  if (typeof detail === 'object') {
    return detail.msg || detail.detail || 'Request failed.'
  }

  return String(detail)
}

export function getAuthToken() {
  return localStorage.getItem('billwise_token')
}

export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, auth = false, headers = {} } = options
  const token = getAuthToken()

  const requestHeaders = { ...headers }
  if (body && !(body instanceof FormData) && !requestHeaders['Content-Type']) {
    requestHeaders['Content-Type'] = 'application/json'
  }
  if (auth && token) {
    requestHeaders.Authorization = `Bearer ${token}`
  }

  const requestOptions = {
    method,
    headers: requestHeaders,
  }

  if (body !== undefined && body !== null) {
    requestOptions.body = body instanceof FormData ? body : JSON.stringify(body)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, requestOptions)
  const contentType = response.headers.get('content-type') || ''
  const payload = contentType && isJsonResponse(contentType)
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null)

  if (!response.ok) {
    const message = getDetailMessage(payload && payload.detail ? payload.detail : payload)
    const error = new Error(message)
    error.status = response.status
    error.payload = payload
    throw error
  }

  return payload
}

export function formatApiError(error) {
  if (!error) return 'Something went wrong.'
  if (error.payload && error.payload.detail) {
    return getDetailMessage(error.payload.detail)
  }
  return error.message || 'Something went wrong.'
}
