import { Clock, MapPin, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { authFetch } from '../lib/api'

type Session = {
	period: string | number
	subject: string
	professors?: string[]
	professor?: string
	rooms?: string[]
	room?: string
	day?: string
	days?: string[]
	groups?: string[]
}

interface ApiTimetableResponse {
	group: string
	total_sessions: number
	sessions: Array<{
		period: string | number
		subject: string
		professors: string[]
		groups: string[]
		rooms: string[]
		days: string[]
	}>
}

const TIMETABLE_API_BASE = '/api/tt'
const SAMPLE_GROUP = 'ICE-23-04'

const COLORS = [
	'bg-purple-100 text-purple-700 border-purple-200',
	'bg-blue-100 text-blue-700 border-blue-200',
	'bg-green-100 text-green-700 border-green-200',
	'bg-orange-100 text-orange-700 border-orange-200',
	'bg-pink-100 text-pink-700 border-pink-200',
	'bg-yellow-100 text-yellow-700 border-yellow-200',
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

function todayName() {
	const d = new Date().getDay()
	return d >= 1 && d <= 5 ? DAYS[d - 1] : 'Monday'
}

function colorFor(subject: string) {
	let h = 0
	for (const c of subject) h = (h * 31 + c.charCodeAt(0)) & 0xffff
	return COLORS[h % COLORS.length]
}

function str(v: unknown): string {
	if (v == null) return '—'
	if (typeof v === 'string') return v
	if (typeof v === 'number') return String(v)
	return JSON.stringify(v)
}

export function TimetablePage() {
	const [sessions, setSessions] = useState<Session[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('weekly')
	const [selected, setSelected] = useState<Session | null>(null)

	const TODAY = todayName()

	useEffect(() => {
		const url = `${TIMETABLE_API_BASE}/timetable/my/sessions`
		console.log('Fetching timetable from:', url)
		authFetch(url)
			.then(r => {
				if (!r.ok) {
					return r
						.json()
						.then(data => {
							throw new Error(
								`Failed to load timetable (${r.status}): ${data.detail || 'Unknown error'}`,
							)
						})
						.catch(() => {
							throw new Error(`Failed to load timetable (${r.status})`)
						})
				}
				return r.json()
			})
			.then(d => {
				console.log('Timetable data received:', d)
				// Transform API response format to component format
				let sessions: Session[] = []
				if (d && d.sessions && Array.isArray(d.sessions)) {
					// Expand each session by day so we have one session per day
					sessions = d.sessions.flatMap((apiSession: any) => {
						return (apiSession.days || []).map((day: string) => ({
							period: apiSession.period,
							subject: apiSession.subject,
							day: day,
							professor: apiSession.professors?.[0] || undefined,
							professors: apiSession.professors || [],
							room: apiSession.rooms?.[0] || undefined,
							rooms: apiSession.rooms || [],
							groups: apiSession.groups || [],
						}))
					})
				} else if (Array.isArray(d)) {
					// If response is directly an array of sessions
					sessions = d.flatMap((apiSession: any) => {
						return (apiSession.days || []).map((day: string) => ({
							period: apiSession.period,
							subject: apiSession.subject,
							day: day,
							professor: apiSession.professors?.[0] || undefined,
							professors: apiSession.professors || [],
							room: apiSession.rooms?.[0] || undefined,
							rooms: apiSession.rooms || [],
							groups: apiSession.groups || [],
						}))
					})
				}
				console.log('Transformed sessions:', sessions)
				console.log('Sessions count:', sessions.length)
				setSessions(sessions)
			})
			.catch(e => {
				console.error('Timetable error:', e)
				setError(e.message)
			})
			.finally(() => setLoading(false))
	}, [])

	if (loading)
		return (
			<div className='flex items-center justify-center h-64 text-gray-500'>
				Loading…
			</div>
		)
	if (error)
		return (
			<div className='p-6 text-red-600 bg-red-50 rounded-xl border border-red-200'>
				{error}
			</div>
		)

	const byDay: Record<string, Session[]> = {}
	for (const s of sessions) {
		const day = str(s.day)
		;(byDay[day] ??= []).push(s)
	}

	const todaySessions = byDay[TODAY] ?? []

	return (
		<div className='space-y-6'>
			<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
				<div>
					<h1 className='text-gray-900'>Timetable</h1>
					<p className='text-muted-foreground mt-1'>Your weekly schedule</p>
				</div>
				<div className='inline-flex bg-gray-100 rounded-lg p-1'>
					{(['daily', 'weekly'] as const).map(mode => (
						<button
							key={mode}
							onClick={() => setViewMode(mode)}
							className={`px-4 py-2 rounded-md transition capitalize ${
								viewMode === mode
									? 'bg-white text-gray-900 shadow-sm'
									: 'text-gray-600'
							}`}
						>
							{mode} View
						</button>
					))}
				</div>
			</div>

			{sessions.length === 0 && (
				<div className='text-center py-12 bg-white rounded-xl border border-gray-200'>
					<Clock className='w-12 h-12 mx-auto mb-3 text-gray-300' />
					<p className='text-gray-900'>No sessions found</p>
					<p className='text-muted-foreground mt-1'>Your timetable is empty</p>
				</div>
			)}

			{viewMode === 'weekly' && sessions.length > 0 && (
				<div className='bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm'>
					<div className='overflow-x-auto'>
						<div className='min-w-[700px]'>
							<div className='grid grid-cols-6 bg-gray-50 border-b border-gray-200'>
								<div className='p-4 border-r border-gray-200'>
									<p className='text-gray-600'>Period</p>
								</div>
								{DAYS.map(day => (
									<div
										key={day}
										className='p-4 border-r border-gray-200 last:border-r-0'
									>
										<p className='text-gray-900'>{day}</p>
										{day === TODAY && (
											<span className='inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded mt-1'>
												Today
											</span>
										)}
									</div>
								))}
							</div>
							<div className='grid grid-cols-6'>
								<div className='border-r border-gray-200 bg-gray-50'>
									{Array.from({ length: 10 }, (_, i) => i + 1).map(p => (
										<div key={p} className='p-4 border-b border-gray-200 h-20'>
											<p className='text-gray-500'>Period {p}</p>
										</div>
									))}
								</div>
								{DAYS.map(day => (
									<div
										key={day}
										className='border-r border-gray-200 last:border-r-0'
									>
										<div className='p-2 min-h-[480px]'>
											{(byDay[day] ?? []).map((s, i) => (
												<button
													key={i}
													onClick={() => setSelected(s)}
													className={`w-full p-3 mb-2 rounded-lg border text-left hover:shadow-md transition ${colorFor(str(s.subject))}`}
												>
													<p className='font-medium truncate'>
														{str(s.subject)}
													</p>
													<p className='mt-1 opacity-90'>
														Period {str(s.period)}
													</p>
													{s.room != null && (
														<p className='mt-0.5 opacity-75'>{str(s.room)}</p>
													)}
												</button>
											))}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			)}

			{viewMode === 'daily' && (
				<div className='space-y-3'>
					{todaySessions.length === 0 ? (
						<div className='text-center py-12 bg-white rounded-xl border border-gray-200'>
							<Clock className='w-12 h-12 mx-auto mb-3 text-gray-300' />
							<p className='text-gray-900'>No classes today 🎉</p>
							<p className='text-muted-foreground mt-1'>Enjoy your free day!</p>
						</div>
					) : (
						todaySessions.map((s, i) => (
							<button
								key={i}
								onClick={() => setSelected(s)}
								className={`w-full p-4 rounded-xl border text-left hover:shadow-md transition ${colorFor(str(s.subject))}`}
							>
								<div className='flex items-start justify-between'>
									<p className='text-lg'>{str(s.subject)}</p>
									<span className='px-3 py-1 bg-white/50 rounded-lg'>
										Period {str(s.period)}
									</span>
								</div>
								<div className='flex gap-4 mt-3'>
									{s.room != null && (
										<div className='flex items-center gap-1.5'>
											<MapPin className='w-4 h-4' />
											<span>{str(s.room)}</span>
										</div>
									)}
									{s.professor != null && (
										<div className='flex items-center gap-1.5'>
											<User className='w-4 h-4' />
											<span>{str(s.professor)}</span>
										</div>
									)}
								</div>
							</button>
						))
					)}
				</div>
			)}

			{/* Session detail modal */}
			{selected && (
				<div
					className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'
					onClick={() => setSelected(null)}
				>
					<div
						className='bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl'
						onClick={e => e.stopPropagation()}
					>
						<div className='flex items-start justify-between mb-4'>
							<div>
								<p className='text-gray-600'>Session Details</p>
								<h2 className='text-gray-900 mt-1'>{str(selected.subject)}</h2>
							</div>
							<button
								onClick={() => setSelected(null)}
								className='text-gray-400 hover:text-gray-600 p-1'
							>
								<X className='w-5 h-5' />
							</button>
						</div>
						<div className='space-y-3'>
							{Object.entries(selected).map(
								([k, v]) =>
									v != null && (
										<div
											key={k}
											className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'
										>
											<div>
												<p className='text-gray-500 capitalize'>
													{k.replace(/_/g, ' ')}
												</p>
												<p className='text-gray-900'>{str(v)}</p>
											</div>
										</div>
									),
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
