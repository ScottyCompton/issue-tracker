export { default } from 'next-auth/middleware'

export const config = {
    matcher: ['/issues/new', '/issues/list', '/issues/edit/:id+'],
}
