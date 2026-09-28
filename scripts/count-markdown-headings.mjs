export function countLevelTwoHeadings(raw) {
  let fenced = false
  let count = 0
  for (const line of raw.split(/\r?\n/)) {
    if (line.trim().startsWith('```')) {
      fenced = !fenced
      continue
    }
    if (!fenced && /^## /.test(line)) count += 1
  }
  return count
}
