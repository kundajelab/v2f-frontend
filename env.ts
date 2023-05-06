
export function getDomain() {
  console.log(process.env)
  console.log(process.env.DOMAIN)
  return process.env.DOMAIN ?? 'localhost';
}