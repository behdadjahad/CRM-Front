export function matchPath(pattern: string, pathname: string): boolean {
  // escape regex special chars except for brackets
  const regexPattern = pattern
    .replace(/\//g, "\\/")       // escape slashes
    .replace(/\[.*?\]/g, "[^/]+"); // replace [id], [slug] etc. with wildcard

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(pathname);
}
