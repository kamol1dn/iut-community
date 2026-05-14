import { useState } from 'react'
import { useNavigate } from 'react-router'

const INPUT_CLASS =
	'w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/60 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10 backdrop-blur-sm'

const LABEL_CLASS = 'block mb-2 text-white/90'

export function LoginPage() {
	const navigate = useNavigate()
	const [tab, setTab] = useState<'login' | 'register'>('login')

	// login fields
	const [loginStudentId, setLoginStudentId] = useState('')
	const [loginPassword, setLoginPassword] = useState('')

	// register fields
	const [regStudentId, setRegStudentId] = useState('')
	const [regPassword, setRegPassword] = useState('')
	const [regFullName, setRegFullName] = useState('')
	const [regGroup, setRegGroup] = useState('')
	const [regRole, setRegRole] = useState('student')

	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [regSuccess, setRegSuccess] = useState(false)

	const [backgroundImage] = useState(() => {
		const backgrounds = [
			'/assest/bg1.webp',
			'/assest/bg2.webp',
			'/assest/bg3.webp',
		]
		return backgrounds[Math.floor(Math.random() * backgrounds.length)]
	})

	const adminTelegramUsername = (
		import.meta as ImportMeta & {
			env: { VITE_ADMIN_TELEGRAM_USERNAME?: string }
		}
	).env.VITE_ADMIN_TELEGRAM_USERNAME
	const adminTelegramLink = adminTelegramUsername
		? `https://t.me/${adminTelegramUsername}`
		: 'https://t.me/'

	const handleLogin = async (e: { preventDefault(): void }) => {
		e.preventDefault()
		setError(null)
		setLoading(true)
		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					student_id: loginStudentId,
					password: loginPassword,
				}),
			})
			if (!res.ok) {
				const data = await res.json().catch(() => null)
				throw new Error(data?.detail ?? `Login failed (${res.status})`)
			}
			const data = await res.json()
			localStorage.setItem('access_token', data.access_token)
			localStorage.setItem('token_type', data.token_type)
			navigate('/dashboard')
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Login failed')
		} finally {
			setLoading(false)
		}
	}

	const handleRegister = async (e: { preventDefault(): void }) => {
		e.preventDefault()
		setError(null)
		setLoading(true)
		try {
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					student_id: regStudentId,
					password: regPassword,
					full_name: regFullName,
					group: regGroup,
					role: regRole,
				}),
			})
			if (!res.ok) {
				const data = await res.json().catch(() => null)
				throw new Error(data?.detail ?? `Registration failed (${res.status})`)
			}
			setRegSuccess(true)
			setRegStudentId('')
			setRegPassword('')
			setRegFullName('')
			setRegGroup('')
			setRegRole('student')
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Registration failed')
		} finally {
			setLoading(false)
		}
	}

	const switchTab = (next: 'login' | 'register') => {
		setTab(next)
		setError(null)
		setRegSuccess(false)
	}

	return (
		<div
			className='min-h-screen flex flex-col bg-cover bg-center bg-no-repeat'
			style={{
				backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${backgroundImage})`,
			}}
		>
			<div className='flex-1 flex items-center justify-center p-4'>
				<div className='w-full max-w-md'>
					<div className='rounded-2xl border border-white/15 bg-blue-950/60 p-8 shadow-xl backdrop-blur-sm'>
						<div className='flex flex-col items-center mb-8'>
							<img
								src='/assest/logo/logo_white.png'
								alt='IUT Core Logo'
								className='h-auto w-70 object-fill'
								onError={e => {
									e.currentTarget.src = '/assest/logo/logo_white.png'
								}}
							/>
						</div>

						{/* Tabs */}
						<div className='flex rounded-lg border border-white/15 overflow-hidden mb-6'>
							<button
								type='button'
								onClick={() => switchTab('login')}
								className={`flex-1 py-2 text-sm font-medium transition ${
									tab === 'login'
										? 'bg-blue-700 text-white'
										: 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
								}`}
							>
								Login
							</button>
							<button
								type='button'
								onClick={() => switchTab('register')}
								className={`flex-1 py-2 text-sm font-medium transition ${
									tab === 'register'
										? 'bg-blue-700 text-white'
										: 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
								}`}
							>
								Register
							</button>
						</div>

						{error && (
							<p className='mb-4 rounded-lg bg-red-500/20 border border-red-400/30 px-4 py-3 text-sm text-red-200'>
								{error}
							</p>
						)}

						{regSuccess && tab === 'register' && (
							<p className='mb-4 rounded-lg bg-green-500/20 border border-green-400/30 px-4 py-3 text-sm text-green-200'>
								Account created! You can now{' '}
								<button
									type='button'
									className='underline'
									onClick={() => switchTab('login')}
								>
									log in
								</button>
								.
							</p>
						)}

						{tab === 'login' ? (
							<form onSubmit={handleLogin} className='space-y-5'>
								<div>
									<label htmlFor='studentId' className={LABEL_CLASS}>
										Student ID
									</label>
									<input
										id='studentId'
										type='text'
										placeholder='U1234567'
										value={loginStudentId}
										onChange={e => setLoginStudentId(e.target.value)}
										required
										className={INPUT_CLASS}
									/>
								</div>

								<div>
									<label htmlFor='password' className={LABEL_CLASS}>
										Password
									</label>
									<input
										id='password'
										type='password'
										placeholder='Enter your password'
										value={loginPassword}
										onChange={e => setLoginPassword(e.target.value)}
										required
										className={INPUT_CLASS}
									/>
								</div>

								<button
									type='submit'
									disabled={loading}
									className='w-full rounded-lg border border-white/15 bg-blue-700 py-3 text-white transition hover:bg-blue-800 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed'
								>
									{loading ? 'Logging in…' : 'Login'}
								</button>
							</form>
						) : (
							<form onSubmit={handleRegister} className='space-y-5'>
								<div>
									<label htmlFor='regStudentId' className={LABEL_CLASS}>
										Student ID
									</label>
									<input
										id='regStudentId'
										type='text'
										placeholder='U1234567'
										value={regStudentId}
										onChange={e => setRegStudentId(e.target.value)}
										required
										className={INPUT_CLASS}
									/>
								</div>

								<div>
									<label htmlFor='regFullName' className={LABEL_CLASS}>
										Full Name
									</label>
									<input
										id='regFullName'
										type='text'
										placeholder='John Doe'
										value={regFullName}
										onChange={e => setRegFullName(e.target.value)}
										required
										className={INPUT_CLASS}
									/>
								</div>

								<div>
									<label htmlFor='regGroup' className={LABEL_CLASS}>
										Group
									</label>
									<input
										id='regGroup'
										type='text'
										placeholder='CS-101'
										value={regGroup}
										onChange={e => setRegGroup(e.target.value)}
										required
										className={INPUT_CLASS}
									/>
								</div>

								<div>
									<label htmlFor='regRole' className={LABEL_CLASS}>
										Role
									</label>
									<select
										id='regRole'
										value={regRole}
										onChange={e => setRegRole(e.target.value)}
										required
										className={INPUT_CLASS}
									>
										<option value='student' className='bg-blue-950 text-white'>
											Student
										</option>
										<option value='teacher' className='bg-blue-950 text-white'>
											Teacher
										</option>
										<option value='admin' className='bg-blue-950 text-white'>
											Admin
										</option>
									</select>
								</div>

								<div>
									<label htmlFor='regPassword' className={LABEL_CLASS}>
										Password
									</label>
									<input
										id='regPassword'
										type='password'
										placeholder='Choose a password'
										value={regPassword}
										onChange={e => setRegPassword(e.target.value)}
										required
										className={INPUT_CLASS}
									/>
								</div>

								<button
									type='submit'
									disabled={loading}
									className='w-full rounded-lg border border-white/15 bg-blue-700 py-3 text-white transition hover:bg-blue-800 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed'
								>
									{loading ? 'Registering…' : 'Register'}
								</button>
							</form>
						)}
					</div>
				</div>
			</div>

			<p className='pb-4 text-center text-white/90'>
				&copy; 2026 IUT Core. All rights reserved.
			</p>
		</div>
	)
}
