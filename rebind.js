import { POST2, localStorage, prompt } from './utils.js'

if (!localStorage.token) {
  console.log('run login.js first')
  process.exit(2)
}

// const phone = '+86' + process.env.PHONE
// await POST2('user/rebind-phone/send-message', { phone })
// const code = await prompt('give me your code: ')
// await POST2('user/rebind-phone', { phone, code: +code })
