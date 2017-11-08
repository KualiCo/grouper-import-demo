var ldap = require('ldapjs')
var axios = require('axios')
const Bluebird = require('bluebird')

const { kualiToken, kualiBase, ldapUrl } = require('config')

const SCHOOL_ID = '3j33134HH'

var client = ldap.createClient({
  url: ldapUrl
})

const headers = {
  Authorization: `Bearer ${kualiToken}`,
  'Content-Type': 'application/json'
}

module.exports.loadUsers = function () {
  client.search(
    'ou=people,dc=example,dc=edu',
    { filter: '(objectclass=person)', scope: 'sub' },
    function (err, res) {
      console.log('search ERROR:', err)

      let users = []

      res.on('searchEntry', function (entry) {
        const user = {
          name: entry.object.cn,
          username: entry.object.uid,
          email: entry.object.mail,
          role: 'user',
          firstName: entry.object.givenName,
          lastName: entry.object.sn,
          password: 'password',
          passwordConfirmation: 'password',
          schoolId: SCHOOL_ID,
          approved: true,
          active: true
        }

        users.push(user)
      })

      res.on('error', function (err) {
        console.error('error: ' + err.message)
      })

      res.on('end', async function (result) {
        await Bluebird.map(users, async user => {
          const response = await axios.post(`${kualiBase}/api/v1/users`, user, {
            headers
          })
          console.log('SAVE RESPONSE STATUS ', response.status)
        }, { concurrency: 100 })
        console.log('Search ended with status: ' + result.status)
      })
    }
  )
}

module.exports.deleteUsers = async function () {
  console.log('FETCHING ALL USERS')
  const response = await axios.get(`${kualiBase}/api/v1/users?limit=500&schoolId=${SCHOOL_ID}`, { headers })
  const users = response.data

  await Bluebird.map(users, async user => {
    console.log('GONNA DELETE ', user.username)
    const res = await axios.delete(`${kualiBase}/api/v1/users/${user.id}`, { headers })
    console.log('respose from delete', res.status)
  }, { concurrency: 100 })

  return 'done'
}
