// Tiny fuzzy matcher for the command palette.
// Returns a score (0 = no match, higher = better) so callers can sort.
// Algorithm: subsequence match with bonuses for consecutive runs
// and matches at word boundaries.
export function fuzzyScore(query, target) {
  if (!query) return 1;
  const q = query.toLowerCase();
  const t = target.toLowerCase();

  let qi = 0;
  let score = 0;
  let streak = 0;
  let prevMatchedIdx = -2;

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      streak = (ti === prevMatchedIdx + 1) ? streak + 1 : 1;
      const boundary = ti === 0 || /[\s_\-/]/.test(t[ti - 1]);
      score += 1 + streak + (boundary ? 2 : 0);
      prevMatchedIdx = ti;
      qi++;
    }
  }
  return qi === q.length ? score : 0;
}
