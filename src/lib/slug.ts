export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80) || 'post'
}

export function uniqueSlug(base: string, existing: string[]): string {
  let slug = slugify(base)
  let counter = 1
  while (existing.includes(slug)) {
    slug = `${slugify(base)}-${counter}`
    counter++
  }
  return slug
}
