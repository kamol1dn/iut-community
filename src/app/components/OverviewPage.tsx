import { ArrowRight, Bell, Calendar, Clock } from 'lucide-react'

export function OverviewPage() {
	const nextClass = {
		name: 'Database Application & Design',
		code: 'DAD',
		time: '15:00 – 16:30',
		room: 'B209',
	}

	const deadlines = [
		{
			id: 1,
			course: 'Internet Programming (IP)',
			task: 'Project Phase 2 Submission',
			due: 'Apr 23, 2026',
			urgent: true,
		},
		{
			id: 2,
			course: 'Computer Networks (CN)',
			task: 'Lab Report 4',
			due: 'Apr 25, 2026',
			urgent: false,
		},
		{
			id: 3,
			course: 'Professional Skills (PS)',
			task: 'Resume Review',
			due: 'Apr 28, 2026',
			urgent: false,
		},
	]

	const announcements = [
		{
			id: 1,
			title: 'Mid-Semester Exam Schedule Released',
			preview: 'Check your timetable for exam dates and venues...',
			time: '2 hours ago',
		},
		{
			id: 2,
			title: 'Library Hours Extended',
			preview: 'Open until 10 PM during exam week...',
			time: '5 hours ago',
		},
		{
			id: 3,
			title: 'Guest Lecture: AI in Industry',
			preview: 'Join us this Friday at 3 PM in Auditorium A...',
			time: '1 day ago',
		},
	]

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-gray-900'>Overview</h1>
				<p className='text-muted-foreground mt-1'>
					Your academic command center
				</p>
			</div>

			{/* Next Class - Hero Card */}
			<div className='bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 lg:p-8 text-white shadow-xl'>
				<div className='flex items-start justify-between'>
					<div className='space-y-1'>
						<p className='text-blue-100'>Next Class</p>
						<h2 className='text-white mt-2'>
							{nextClass.name} ({nextClass.code})
						</h2>
					</div>
					<div className='bg-white/20 backdrop-blur p-3 rounded-xl'>
						<Clock className='w-6 h-6' />
					</div>
				</div>
				<div className='flex flex-wrap gap-4 mt-6'>
					<div className='flex items-center gap-2'>
						<Clock className='w-5 h-5 text-blue-200' />
						<span>{nextClass.time}</span>
					</div>
					<div className='flex items-center gap-2'>
						<Calendar className='w-5 h-5 text-blue-200' />
						<span>Room {nextClass.room}</span>
					</div>
				</div>
			</div>

			<div className='grid lg:grid-cols-2 gap-6'>
				{/* Quick Deadlines */}
				<div className='bg-white rounded-xl border border-gray-200 p-6 shadow-sm'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='text-gray-900'>Upcoming Deadlines</h3>
						<Bell className='w-5 h-5 text-gray-400' />
					</div>
					<div className='space-y-3'>
						{deadlines.map(deadline => (
							<div
								key={deadline.id}
								className='flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition border border-gray-100'
							>
								<div
									className={`w-2 h-2 rounded-full mt-2 ${
										deadline.urgent ? 'bg-red-500' : 'bg-blue-500'
									}`}
								/>
								<div className='flex-1 min-w-0'>
									<p className='text-gray-900'>{deadline.task}</p>
									<p className='text-gray-500 mt-0.5'>{deadline.course}</p>
									<p
										className={`mt-1 ${
											deadline.urgent ? 'text-red-600' : 'text-gray-600'
										}`}
									>
										Due: {deadline.due}
									</p>
								</div>
							</div>
						))}
					</div>
					{deadlines.length === 0 && (
						<div className='text-center py-8 text-gray-500'>
							<Calendar className='w-12 h-12 mx-auto mb-2 text-gray-300' />
							<p>No upcoming deadlines 🎉</p>
						</div>
					)}
				</div>

				{/* Recent Announcements */}
				<div className='bg-white rounded-xl border border-gray-200 p-6 shadow-sm'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='text-gray-900'>Recent Announcements</h3>
						<Bell className='w-5 h-5 text-gray-400' />
					</div>
					<div className='space-y-3'>
						{announcements.map(announcement => (
							<div
								key={announcement.id}
								className='p-3 rounded-lg hover:bg-gray-50 transition border border-gray-100 cursor-pointer group'
							>
								<div className='flex items-start justify-between gap-2'>
									<p className='text-gray-900 group-hover:text-blue-600 transition'>
										{announcement.title}
									</p>
									<ArrowRight className='w-4 h-4 text-gray-400 group-hover:text-blue-600 transition flex-shrink-0' />
								</div>
								<p className='text-gray-500 mt-1 line-clamp-1'>
									{announcement.preview}
								</p>
								<p className='text-gray-400 mt-1'>{announcement.time}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
