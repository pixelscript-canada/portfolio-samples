require 'json'

Handler = Proc.new do |request, response|
  password = (request.query['password'] || '').to_s

  pool = 0
  pool += 26 if password =~ /[a-z]/
  pool += 26 if password =~ /[A-Z]/
  pool += 10 if password =~ /[0-9]/
  pool += 33 if password =~ /[^a-zA-Z0-9]/
  bits = pool > 0 ? (password.length * Math.log2(pool)).round : 0

  score = 0
  score = 1 if bits >= 28
  score = 2 if bits >= 36
  score = 3 if bits >= 60
  score = 4 if bits >= 90

  labels = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong']

  issues = []
  issues << 'Shorter than 8 characters' if password.length < 8
  issues << 'No uppercase letters' unless password =~ /[A-Z]/
  issues << 'No numbers' unless password =~ /[0-9]/
  issues << 'No symbols' unless password =~ /[^a-zA-Z0-9]/

  response.status = 200
  response['Content-Type'] = 'application/json; charset=utf-8'
  response.body = { bits: bits, score: score, label: labels[score], issues: issues }.to_json
end
