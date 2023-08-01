var token = process.env.GITLAB_TOKEN
if (!token) {
  console.log('run set-env.sh with GITLAB_TOKEN first')
  process.exit(1)
}

var config = {
  headers: { 'PRIVATE-TOKEN': token },
}
var base = `https://gitlab.com/api/v4/projects/${encodeURIComponent('flat-bot/flat-server')}`

var variables = await fetch(`${base}/variables?per_page=100`, config).then((r) => r.json())
var v = variables.find((v) => v.key == 'PROJECT_CONFIG_CHINA' && v.environment_scope == 'development')
var yaml = v.value

yaml = yaml.replace(
  /redis:.*jwt:/s, // s = dotAll = match \n by .
  `redis:
  host: 10.6.0.40
  port: 7528
  username:
  password: flat-server-test
  db: 0
  queueDB: 1

mysql:
  host: 10.6.0.40
  port: 7519
  username: root
  password: flat-server-test
  db: flat_server
  salt: test

jwt:`,
)

var i = yaml.indexOf('censorship:')
yaml = yaml.slice(0, i) + yaml.slice(i).replace(/enable: true/g, 'enable: false')

import fs from 'node:fs'
fs.writeFileSync('development.local.yaml', yaml)
