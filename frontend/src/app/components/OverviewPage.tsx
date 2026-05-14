import { ArrowRight, Bell, BookOpen, Calendar, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { authFetch } from '../lib/api'

const CLUBS_API_BASE = '/api/auth'

type CourseOut = { id: string; code: string; name: string }
type AssignmentOut = {
	id: string
	course_code: string
	course_name: string
	title: string
	due_date: string
	status: string
}
type ClubOut = { id: string; name: string; description: string }
type DashboardData = {
	student_id: string
	full_name: string
	group: string
	enrolled_courses: CourseOut[]
	upcoming_assignments: AssignmentOut[]
	my_clubs: ClubOut[]
}

function formatDate(iso: string) {
	return new Date(iso).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	})
}

function isUrgent(iso: string) {
	return Date.now() > new Date(iso).getTime() - 3 * 24 * 60 * 60 * 1000
}

export function OverviewPage() {
	const [data, setData] = useState<DashboardData | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		authFetch(`${CLUBS_API_BASE}/dashboard`)
			.then(r => {
				if (!r.ok) throw new Error(`Failed to load dashboard (${r.status})`)
				return r.json()
			})
			.then(d => {
				setData(d)
				localStorage.setItem('full_name', d.full_name)
				localStorage.setItem('group', d.group)
			})
			.catch(e => setError(e.message))
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
	if (!data) return null

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-gray-900'>Welcome, {data.full_name}</h1>
				<p className='text-muted-foreground mt-1'>Group: {data.group}</p>
			</div>

			{/* Enrolled Courses */}
			<div className='bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 lg:p-8 text-white shadow-xl'>
				<div className='flex items-start justify-between mb-4'>
					<div>
						<p className='text-blue-100'>Enrolled Courses</p>
						<h2 className='text-white mt-1'>
							{data.enrolled_courses.length} course
							{data.enrolled_courses.length !== 1 ? 's' : ''} this semester
						</h2>
					</div>
					<div className='bg-white/20 backdrop-blur p-3 rounded-xl'>
						<BookOpen className='w-6 h-6' />
					</div>
				</div>
				<div className='flex flex-wrap gap-2'>
					{data.enrolled_courses.map(course => (
						<span
							key={course.id}
							className='px-3 py-1 bg-white/20 rounded-lg text-sm'
						>
							{course.code} — {course.name}
						</span>
					))}
					{data.enrolled_courses.length === 0 && (
						<span className='text-blue-200'>No courses enrolled</span>
					)}
				</div>
			</div>

			<div className='grid lg:grid-cols-2 gap-6'>
				{/* Upcoming Assignments */}
				<div className='bg-white rounded-xl border border-gray-200 p-6 shadow-sm'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='text-gray-900'>Upcoming Assignments</h3>
						<Bell className='w-5 h-5 text-gray-400' />
					</div>
					<div className='space-y-3'>
						{data.upcoming_assignments.map(a => (
							<div
								key={a.id}
								className='flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition border border-gray-100'
							>
								<div
									className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${isUrgent(a.due_date) ? 'bg-red-500' : 'bg-blue-500'}`}
								/>
								<div className='flex-1 min-w-0'>
									<p className='text-gray-900'>{a.title}</p>
									<p className='text-gray-500 mt-0.5'>
										{a.course_name} ({a.course_code})
									</p>
									<p
										className={`mt-1 ${isUrgent(a.due_date) ? 'text-red-600' : 'text-gray-600'}`}
									>
										Due: {formatDate(a.due_date)} —{' '}
										<span className='capitalize'>{a.status}</span>
									</p>
								</div>
							</div>
						))}
						{data.upcoming_assignments.length === 0 && (
							<div className='text-center py-8 text-gray-500'>
								<Calendar className='w-12 h-12 mx-auto mb-2 text-gray-300' />
								<p>No upcoming assignments 🎉</p>
							</div>
						)}
					</div>
				</div>

				{/* My Clubs */}
				<div className='bg-white rounded-xl border border-gray-200 p-6 shadow-sm'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='text-gray-900'>My Clubs</h3>
						<Users className='w-5 h-5 text-gray-400' />
					</div>
					<div className='space-y-3'>
						{data.my_clubs.map(club => (
							<div
								key={club.id}
								className='p-3 rounded-lg hover:bg-gray-50 transition border border-gray-100 cursor-pointer group'
							>
								<div className='flex items-start justify-between gap-2'>
									<p className='text-gray-900 group-hover:text-blue-600 transition'>
										{club.name}
									</p>
									<ArrowRight className='w-4 h-4 text-gray-400 group-hover:text-blue-600 transition flex-shrink-0' />
								</div>
								<p className='text-gray-500 mt-1 line-clamp-2'>
									{club.description}
								</p>
							</div>
						))}
						{data.my_clubs.length === 0 && (
							<div className='text-center py-8 text-gray-500'>
								<Users className='w-12 h-12 mx-auto mb-2 text-gray-300' />
								<p>You haven't joined any clubs yet</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
