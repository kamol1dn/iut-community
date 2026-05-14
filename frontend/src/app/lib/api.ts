export const getToken = () => localStorage.getItem('access_token') ?? ''

export function authFetch(url: string, opts: RequestInit = {}) {
	const { headers, ...rest } = opts
	return fetch(url, {
		...rest,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${getToken()}`,
			...(headers ?? {}),
		},
	})
}
