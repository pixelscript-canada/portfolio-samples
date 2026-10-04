const { mulberry32, pick } = require('./_rng');

const FIRST = ['Olivia', 'Liam', 'Emma', 'Noah', 'Ava', 'Elijah', 'Sophia', 'James', 'Isabella', 'Benjamin', 'Mia', 'Lucas', 'Charlotte', 'Henry', 'Amelia', 'Alexander', 'Harper', 'Daniel', 'Evelyn', 'Matthew', 'Abigail', 'Sebastian', 'Ella', 'Jack', 'Scarlett'];
const LAST = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Chen', 'Kim', 'Patel', 'Nguyen', 'Khan', 'Mehta', 'Haddad', 'Novak', 'Rossi', 'Dubois'];
const COMPANY_WORD_A = ['Nimbus', 'Vertex', 'Quanta', 'Pioneer', 'Lumen', 'Atlas', 'Bright', 'Forge', 'Nova', 'Cedar', 'Harbor', 'Orbit', 'Summit', 'Clearwater', 'Ironclad'];
const COMPANY_WORD_B = ['Labs', 'Works', 'Systems', 'Studio', 'Collective', 'Group', 'Technologies', 'Partners', 'Digital', 'Solutions'];
const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Germany', 'Australia', 'Netherlands', 'France', 'Sweden', 'Brazil', 'India'];
const PLANS = [
  { name: 'Starter', mrr: 29 },
  { name: 'Pro', mrr: 99 },
  { name: 'Enterprise', mrr: 349 },
];

function generateCustomers(count = 64) {
  const rng = mulberry32(42);
  const customers = [];

  for (let i = 0; i < count; i++) {
    const first = pick(rng, FIRST);
    const last = pick(rng, LAST);
    const plan = pick(rng, PLANS);
    const statusRoll = rng();
    const status = statusRoll < 0.12 ? 'trial' : statusRoll < 0.2 ? 'churned' : 'active';
    const daysAgo = Math.floor(rng() * 540);
    const joinedAt = new Date(Date.now() - daysAgo * 86400000);
    const mrrJitter = Math.round((rng() * 40 - 20));

    customers.push({
      id: `cus_${(i + 1).toString().padStart(4, '0')}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@${pick(rng, COMPANY_WORD_A).toLowerCase()}.com`,
      company: `${pick(rng, COMPANY_WORD_A)} ${pick(rng, COMPANY_WORD_B)}`,
      plan: plan.name,
      mrr: status === 'active' ? Math.max(9, plan.mrr + mrrJitter) : 0,
      status,
      country: pick(rng, COUNTRIES),
      joinedAt: joinedAt.toISOString().slice(0, 10),
    });
  }

  return customers;
}

module.exports = { generateCustomers };
