const program = require('commander')
const { run, deleteGroups } = require('./groups')
const { loadUsers, deleteUsers } = require('./users')

program
  .command('load-groups')
  .description('Loading groups from grouper into kuali')
  .action(function() {
    console.log('Loading Groups');
    run()
  })

program
  .command('delete-groups')
  .description('Delete groups added from grouper')
  .action(function() {
    console.log('Deleting Groups');
    deleteGroups()
  })

program
  .command('load-users')
  .description('Loading users from ldap into kuali')
  .action(function() {
    console.log('Loading Users');
    loadUsers()
  })

program
  .command('delete-users')
  .description('Deleting users from ldap into kuali')
  .action(function() {
    console.log('Deleteing Users');
    deleteUsers()
  })



program.parse(process.argv)
