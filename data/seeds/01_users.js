
exports.seed = function(knex, Promise) {
  return knex('users').insert([   
    { username: 'emilyr027', password: '12345' },
    { username: 'eliseaddison', password: 'zombies' },
    { username: 'mikayla', password: 'ilovecookies' },
  ])
}