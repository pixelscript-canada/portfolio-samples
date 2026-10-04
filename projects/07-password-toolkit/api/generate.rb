require 'json'
require 'securerandom'

LOWER = ('a'..'z').to_a.join
UPPER = ('A'..'Z').to_a.join
NUMBERS = ('0'..'9').to_a.join
SYMBOLS = '!@#$%^&*()-_=+[]{}'

Handler = Proc.new do |request, response|
  q = request.query

  length = (q['length'] || '16').to_i
  length = 16 if length <= 0
  length = [[length, 4].max, 64].min

  use_upper = q['upper'] != '0'
  use_numbers = q['numbers'] != '0'
  use_symbols = q['symbols'] != '0'

  pool = LOWER.dup
  pool += UPPER if use_upper
  pool += NUMBERS if use_numbers
  pool += SYMBOLS if use_symbols

  password = (0...length).map { pool[SecureRandom.random_number(pool.length)] }.join

  response.status = 200
  response['Content-Type'] = 'application/json; charset=utf-8'
  response.body = { password: password, length: length, pool: pool.length }.to_json
end
