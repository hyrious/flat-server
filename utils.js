export const sessionID = 'test-session-id'

export const g = {
  FLAT_SERVER_DOMAIN: process.env.DOMAIN || 'flat-api-dev-sg.whiteboard.agora.io',
}
g.FLAT_SERVER_BASE_URL_V1 = `https://${g.FLAT_SERVER_DOMAIN}/v1`
g.FLAT_SERVER_BASE_URL_V2 = `https://${g.FLAT_SERVER_DOMAIN}/v2`
g.GITHUB_CALLBACK = `https://${g.FLAT_SERVER_DOMAIN}/v1/login/github/callback?platform=web`

console.log('DOMAIN =', g.FLAT_SERVER_DOMAIN)

import fs from 'fs'

const file = new URL('./local-storage.json', import.meta.url)

export const localStorage = new Proxy(
  {},
  {
    get(a, p) {
      try {
        return (JSON.parse(fs.readFileSync(file, 'utf8')) || {})[p]
      } catch {
        return void 0
      }
    },
    set(a, p, v) {
      var data = {}
      try {
        data = JSON.parse(fs.readFileSync(file, 'utf8')) || {}
      } catch {}
      data[p] = v
      fs.writeFileSync(file, JSON.stringify(data))
      return v
    },
  },
)

export async function post(action, body = {}, init = {}, token = localStorage.token, v2 = false) {
  const url = `${v2 ? g.FLAT_SERVER_BASE_URL_V2 : g.FLAT_SERVER_BASE_URL_V1}/${action}`
  const headers = new Headers(init?.headers)
  const config = { method: 'POST', ...init, headers }

  headers.set('accept', 'application/json, text/plain, */*, x-session-id, x-request-id')
  headers.set('x-session-id', sessionID)
  if (body) {
    config.body = JSON.stringify(body)
    headers.set('content-type', 'application/json')
  }
  token && headers.set('authorization', 'Bearer ' + token)

  const r = await fetch(url, config)
  if (!r.ok) {
    throw new Error(await r.text())
  }

  const t = await r.json()
  if (t.status !== 0 && t.status !== 2) {
    throw new Error(t.code)
  }

  return t.data
}

export const postV2 = (action, body, config, token) => post(action, body, config, token, true)

const empty = (e) => {
  if (!e) return true
  for (var k in e) return false
  return true
}

const _POST = (api) => async (action, body, config, token) => {
  try {
    const payload = !empty(body) ? ' ' + JSON.stringify(body) : ''
    process.stdout.write(`POST /${api == postV2 ? 'v2' : 'v1'}/${action}${payload} `)
    const res = await api(action, body, config, token)
    console.log('=> ' + JSON.stringify(res, null, 2))

    return res
  } catch (err) {
    let message = err + ''
    if (ErrorCode[err.message]) message += ` (${ErrorCode[err.message]})`
    console.error(message)

    process.exit(1) // panic!
  }
}

export const POST = _POST(post)
export const POST2 = _POST(postV2)

export var ErrorCode = ((i) => (
  (i[(i.ParamsCheckFailed = 1e5)] = 'ParamsCheckFailed'),
  (i[(i.ServerFail = 100001)] = 'ServerFail'),
  (i[(i.CurrentProcessFailed = 100002)] = 'CurrentProcessFailed'),
  (i[(i.NotPermission = 100003)] = 'NotPermission'),
  (i[(i.NeedLoginAgain = 100004)] = 'NeedLoginAgain'),
  (i[(i.UnsupportedPlatform = 100005)] = 'UnsupportedPlatform'),
  (i[(i.JWTSignFailed = 100006)] = 'JWTSignFailed'),
  (i[(i.ExhaustiveAttack = 100007)] = 'ExhaustiveAttack'),
  (i[(i.RequestSignatureIncorrect = 100008)] = 'RequestSignatureIncorrect'),
  (i[(i.NonCompliant = 100009)] = 'NonCompliant'),
  (i[(i.UnsupportedOperation = 100010)] = 'UnsupportedOperation'),
  (i[(i.RoomNotFound = 2e5)] = 'RoomNotFound'),
  (i[(i.RoomIsEnded = 200001)] = 'RoomIsEnded'),
  (i[(i.RoomIsRunning = 200002)] = 'RoomIsRunning'),
  (i[(i.RoomNotIsRunning = 200003)] = 'RoomNotIsRunning'),
  (i[(i.RoomNotIsEnded = 200004)] = 'RoomNotIsEnded'),
  (i[(i.RoomNotIsIdle = 200005)] = 'RoomNotIsIdle'),
  (i[(i.PeriodicNotFound = 3e5)] = 'PeriodicNotFound'),
  (i[(i.PeriodicIsEnded = 300001)] = 'PeriodicIsEnded'),
  (i[(i.PeriodicSubRoomHasRunning = 300002)] = 'PeriodicSubRoomHasRunning'),
  (i[(i.UserNotFound = 4e5)] = 'UserNotFound'),
  (i[(i.UserRoomListNotEmpty = 400001)] = 'UserRoomListNotEmpty'),
  (i[(i.UserAlreadyBinding = 400002)] = 'UserAlreadyBinding'),
  (i[(i.RecordNotFound = 5e5)] = 'RecordNotFound'),
  (i[(i.UploadConcurrentLimit = 7e5)] = 'UploadConcurrentLimit'),
  (i[(i.NotEnoughTotalUsage = 700001)] = 'NotEnoughTotalUsage'),
  (i[(i.FileSizeTooBig = 700002)] = 'FileSizeTooBig'),
  (i[(i.FileNotFound = 700003)] = 'FileNotFound'),
  (i[(i.FileExists = 700004)] = 'FileExists'),
  (i[(i.DirectoryNotExists = 700005)] = 'DirectoryNotExists'),
  (i[(i.DirectoryAlreadyExists = 700006)] = 'DirectoryAlreadyExists'),
  (i[(i.FileIsConverted = 8e5)] = 'FileIsConverted'),
  (i[(i.FileConvertFailed = 800001)] = 'FileConvertFailed'),
  (i[(i.FileIsConverting = 800002)] = 'FileIsConverting'),
  (i[(i.FileIsConvertWaiting = 800003)] = 'FileIsConvertWaiting'),
  (i[(i.FileNotIsConvertNone = 800004)] = 'FileNotIsConvertNone'),
  (i[(i.FileNotIsConverting = 800005)] = 'FileNotIsConverting'),
  (i[(i.LoginGithubSuspended = 9e5)] = 'LoginGithubSuspended'),
  (i[(i.LoginGithubURLMismatch = 900001)] = 'LoginGithubURLMismatch'),
  (i[(i.LoginGithubAccessDenied = 900002)] = 'LoginGithubAccessDenied'),
  (i[(i.SMSVerificationCodeInvalid = 11e4)] = 'SMSVerificationCodeInvalid'),
  (i[(i.SMSAlreadyExist = 110001)] = 'SMSAlreadyExist'),
  (i[(i.SMSAlreadyBinding = 110002)] = 'SMSAlreadyBinding'),
  (i[(i.CensorshipFailed = 12e4)] = 'CensorshipFailed'),
  (i[(i.OAuthUUIDNotFound = 13e4)] = 'OAuthUUIDNotFound'),
  (i[(i.OAuthClientIDNotFound = 130001)] = 'OAuthClientIDNotFound'),
  (i[(i.OAuthSecretUUIDNotFound = 130002)] = 'OAuthSecretUUIDNotFound'),
  i
))(ErrorCode || {})

import readline from 'readline'

let repl

export const prompt = (message) => {
  repl ||
    (() => {
      repl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '',
      })
      repl.on('SIGINT', () => {
        repl && repl.close()
        process.exit(0)
      })
    })()

  return new Promise((resolve) => {
    repl.question(message, resolve)
  })
}
