import {
	CheckCircle,
	Clock,
	MapPin,
	Plus,
	Search,
	X,
	XCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { authFetch } from '../lib/api'

type RoomEntry = {
	room_name: string
	period: string | number
	subject: string
	professors: string[]
	groups: string[]
	_status: 'available' | 'occupied'
}
type Booking = Record<string, unknown>

const TIMETABLE_API_BASE = 'http://46.101.98.64:8001'
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const
type Day = (typeof DAYS)[number]

function todayDay(): Day {
	const d = new Date().getDay()
	return d >= 1 && d <= 5 ? DAYS[d - 1] : 'Monday'
}

function str(v: unknown): string {
	if (v == null) return '—'
	if (typeof v === 'string') return v
	if (typeof v === 'number') return String(v)
	return JSON.stringify(v)
}

export function RoomsPage() {
	const [day, setDay] = useState<Day>(todayDay())
	const [rooms, setRooms] = useState<RoomEntry[]>([])
	const [bookings, setBookings] = useState<Booking[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState('')

	// Booking form state
	const [showForm, setShowForm] = useState(false)
	const [bookRoom, setBookRoom] = useState('')
	const [bookDay, setBookDay] = useState<Day>(todayDay())
	const [bookStart, setBookStart] = useState(1)
	const [bookEnd, setBookEnd] = useState(2)
	const [bookingError, setBookingError] = useState<string | null>(null)
	const [bookingLoading, setBookingLoading] = useState(false)

	const fetchData = (selectedDay: Day) => {
		setLoading(true)
		setError(null)
		Promise.all([
			authFetch(
				`${TIMETABLE_API_BASE}/timetable/available_rooms?day=${selectedDay}`,
			).then(r => (r.ok ? r.json() : { rooms: [] })),
			authFetch(
				`${TIMETABLE_API_BASE}/timetable/occupied_rooms?day=${selectedDay}`,
			).then(r => (r.ok ? r.json() : { rooms: [] })),
			authFetch(`${TIMETABLE_API_BASE}/bookings`).then(r =>
				r.ok ? r.json() : [],
			),
		])
			.then(([avail, occ, bkgs]) => {
				// Handle available rooms (could be array or object with rooms property)
				const availArr = Array.isArray(avail) ? avail : avail?.rooms || []

				// Handle occupied rooms (comes as object with rooms array)
				const occArr = Array.isArray(occ) ? occ : occ?.rooms || []

				// Merge rooms with status
				const mergedRooms: RoomEntry[] = [
					...availArr.map((r: any) => ({
						...r,
						_status: 'available' as const,
						period: r.period || '—',
						professors: r.professors || [],
						groups: r.groups || [],
					})),
					...occArr.map((r: any) => ({
						...r,
						_status: 'occupied' as const,
						professors: r.professors || [],
						groups: r.groups || [],
					})),
				]

				setRooms(mergedRooms)
				setBookings(Array.isArray(bkgs) ? bkgs : [])
			})
			.catch(e => setError(e.message))
			.finally(() => setLoading(false))
	}

	useEffect(() => {
		fetchData(day)
	}, [day])

	const handleBook = async () => {
		setBookingError(null)
		setBookingLoading(true)
		try {
			const res = await authFetch(`${TIMETABLE_API_BASE}/bookings`, {
				method: 'POST',
				body: JSON.stringify({
					room_name: bookRoom,
					day: bookDay,
					start_period: bookStart,
					end_period: bookEnd,
				}),
			})
			if (!res.ok) {
				const data = await res.json().catch(() => null)
				throw new Error(data?.detail ?? `Booking failed (${res.status})`)
			}
			setShowForm(false)
			setBookRoom('')
			fetchData(day)
		} catch (e) {
			setBookingError(e instanceof Error ? e.message : 'Booking failed')
		} finally {
			setBookingLoading(false)
		}
	}

	const handleCancel = async (bookingId: string) => {
		await authFetch(`${TIMETABLE_API_BASE}/bookings/${bookingId}`, {
			method: 'DELETE',
		})
		fetchData(day)
	}

	const filtered = rooms.filter(r =>
		str(r.room_name).toLowerCase().includes(searchQuery.toLowerCase()),
	)

	return (
		<div className='space-y-6'>
			<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
				<div>
					<h1 className='text-gray-900'>Rooms & Facilities</h1>
					<p className='text-muted-foreground mt-1'>
						Find available spaces and book rooms
					</p>
				</div>
				<button
					onClick={() => setShowForm(true)}
					className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
				>
					<Plus className='w-4 h-4' />
					Book a Room
				</button>
			</div>

			{/* Day tabs */}
			<div className='flex gap-2 overflow-x-auto pb-1'>
				{DAYS.map(d => (
					<button
						key={d}
						onClick={() => setDay(d)}
						className={`px-4 py-2 rounded-lg border whitespace-nowrap transition ${
							day === d
								? 'bg-blue-600 text-white border-blue-600'
								: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
						}`}
					>
						{d}
					</button>
				))}
			</div>

			{/* Search */}
			<div className='bg-white rounded-xl border border-gray-200 p-4 shadow-sm'>
				<div className='relative'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
					<input
						type='text'
						placeholder='Search rooms…'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition'
					/>
				</div>
			</div>

			{error && (
				<div className='p-4 text-red-600 bg-red-50 rounded-xl border border-red-200'>
					{error}
				</div>
			)}
			{loading && (
				<div className='text-center py-8 text-gray-500'>Loading rooms…</div>
			)}

			{/* Room grid */}
			{!loading && (
				<div className='grid md:grid-cols-2 gap-4'>
					{filtered.map((room, i) => (
						<div
							key={i}
							className={`bg-white rounded-xl border p-5 shadow-sm transition hover:shadow-md ${
								room._status === 'available'
									? 'border-green-200'
									: 'border-red-200'
							}`}
						>
							<div className='flex items-start justify-between mb-3'>
								<div className='flex items-center gap-3'>
									<div
										className={`p-2 rounded-lg ${room._status === 'available' ? 'bg-green-100' : 'bg-red-100'}`}
									>
										<MapPin
											className={`w-5 h-5 ${room._status === 'available' ? 'text-green-600' : 'text-red-600'}`}
										/>
									</div>
									<h3 className='text-gray-900'>Room {str(room.room_name)}</h3>
								</div>
								{room._status === 'available' ? (
									<CheckCircle className='w-6 h-6 text-green-600' />
								) : (
									<XCircle className='w-6 h-6 text-red-600' />
								)}
							</div>

							<div className='space-y-2'>
								{room._status === 'available' ? (
									<div className='flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded-lg'>
										<CheckCircle className='w-4 h-4' />
										<span>Available</span>
									</div>
								) : (
									<>
										<div className='flex items-center gap-2 text-red-700 bg-red-50 px-3 py-2 rounded-lg'>
											<XCircle className='w-4 h-4' />
											<span>
												Occupied
												{room.subject ? `: ${room.subject}` : ''}
											</span>
										</div>
										{room.period != null && (
											<div className='flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-lg'>
												<Clock className='w-4 h-4' />
												<span>Period {str(room.period)}</span>
											</div>
										)}
										{room.professors && room.professors.length > 0 && (
											<div className='text-sm text-gray-600'>
												<span className='font-semibold'>Professor(s):</span>{' '}
												{room.professors.join(', ')}
											</div>
										)}
										{room.groups && room.groups.length > 0 && (
											<div className='text-sm text-gray-600'>
												<span className='font-semibold'>Group(s):</span>{' '}
												{room.groups.join(', ')}
											</div>
										)}
									</>
								)}
							</div>
						</div>
					))}

					{filtered.length === 0 && !loading && (
						<div className='col-span-2 text-center py-12 bg-white rounded-xl border border-gray-200'>
							<MapPin className='w-12 h-12 mx-auto mb-3 text-gray-300' />
							<p className='text-gray-900'>No rooms found</p>
						</div>
					)}
				</div>
			)}

			{/* My bookings */}
			{bookings.length > 0 && (
				<div className='bg-white rounded-xl border border-gray-200 p-6 shadow-sm'>
					<h3 className='text-gray-900 mb-4'>My Bookings</h3>
					<div className='space-y-3'>
						{bookings.map((b, i) => (
							<div
								key={i}
								className='flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200'
							>
								<div>
									<p className='text-gray-900'>
										Room {str(b.room_name)} — {str(b.day)}
									</p>
									<p className='text-gray-500'>
										Periods {str(b.start_period)} – {str(b.end_period)}
									</p>
								</div>
								<button
									onClick={() => handleCancel(str(b.id))}
									className='p-1.5 text-red-600 hover:bg-red-100 rounded transition'
								>
									<X className='w-4 h-4' />
								</button>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Booking modal */}
			{showForm && (
				<div
					className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'
					onClick={() => setShowForm(false)}
				>
					<div
						className='bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl'
						onClick={e => e.stopPropagation()}
					>
						<div className='flex items-center justify-between mb-6'>
							<h2 className='text-gray-900'>Book a Room</h2>
							<button
								onClick={() => setShowForm(false)}
								className='text-gray-400 hover:text-gray-600'
							>
								<X className='w-5 h-5' />
							</button>
						</div>

						{bookingError && (
							<p className='mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3'>
								{bookingError}
							</p>
						)}

						<div className='space-y-4'>
							<div>
								<label className='block mb-1.5 text-gray-700'>Room Name</label>
								<input
									type='text'
									placeholder='e.g. B209'
									value={bookRoom}
									onChange={e => setBookRoom(e.target.value)}
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none'
								/>
							</div>

							<div>
								<label className='block mb-1.5 text-gray-700'>Day</label>
								<select
									value={bookDay}
									onChange={e => setBookDay(e.target.value as Day)}
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none'
								>
									{DAYS.map(d => (
										<option key={d}>{d}</option>
									))}
								</select>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div>
									<label className='block mb-1.5 text-gray-700'>
										Start Period
									</label>
									<input
										type='number'
										min={1}
										max={10}
										value={bookStart}
										onChange={e => setBookStart(Number(e.target.value))}
										className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none'
									/>
								</div>
								<div>
									<label className='block mb-1.5 text-gray-700'>
										End Period
									</label>
									<input
										type='number'
										min={1}
										max={10}
										value={bookEnd}
										onChange={e => setBookEnd(Number(e.target.value))}
										className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none'
									/>
								</div>
							</div>

							<button
								onClick={handleBook}
								disabled={bookingLoading || !bookRoom.trim()}
								className='w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed'
							>
								{bookingLoading ? 'Booking…' : 'Confirm Booking'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
