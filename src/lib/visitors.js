// CountAPI client — free, no signup, public visitor counter.
// Namespace + key uniquely identify our portfolio's counter.
const NAMESPACE = 'oxzenon-portfolio';
const KEY       = 'visits';
const BASE      = `https://api.countapi.xyz`;

export async function hitVisitor() {
  const res = await fetch(`${BASE}/hit/${NAMESPACE}/${KEY}`);
  if (!res.ok) throw new Error('countapi hit ' + res.status);
  const data = await res.json();
  return data.value;
}

export async function readVisitorCount() {
  const res = await fetch(`${BASE}/get/${NAMESPACE}/${KEY}`);
  if (!res.ok) throw new Error('countapi get ' + res.status);
  const data = await res.json();
  return data.value;
}
