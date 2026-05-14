import { Search, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { authFetch } from '../lib/api'

const CLUBS_API_BASE = '/api/auth'

type ClubOut = {
	id: string
	name: string
	description: string
	image_url?: string | null
}

type PostOut = {
	id: string
	club_id: string
	author_id: string
	author_name: string
	body: string
	created_at: string
}

function timeAgo(iso: string) {
	const diff = Date.now() - new Date(iso).getTime()
	const mins = Math.floor(diff / 60000)
	if (mins < 60) return `${mins}m ago`
	const hrs = Math.floor(mins / 60)
	if (hrs < 24) return `${hrs}h ago`
	return `${Math.floor(hrs / 24)}d ago`
}

export function CommunityPage() {
	const [searchQuery, setSearchQuery] = useState('')

	// Clubs
	const [clubs, setClubs] = useState<ClubOut[]>([])
	const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set())
	const [clubsLoading, setClubsLoading] = useState(true)
	const [clubsError, setClubsError] = useState<string | null>(null)
	useEffect(() => {
		authFetch(`${CLUBS_API_BASE}/clubs`)
			.then(r => (r.ok ? r.json() : []))
			.then(d => setClubs(Array.isArray(d) ? d : []))
			.catch(e => setClubsError(e.message))
			.finally(() => setClubsLoading(false))
	}, [])

	const handleJoin = async (club: ClubOut) => {
		const res = await authFetch(`${CLUBS_API_BASE}/clubs/${club.id}/join`, {
			method: 'POST',
		})
		if (res.ok || res.status === 201)
			setJoinedIds(prev => new Set([...prev, club.id]))
	}

	const handleLeave = async (club: ClubOut) => {
		const res = await authFetch(`${CLUBS_API_BASE}/clubs/${club.id}/leave`, {
			method: 'DELETE',
		})
		if (res.ok || res.status === 204)
			setJoinedIds(prev => {
				const s = new Set(prev)
				s.delete(club.id)
				return s
			})
	}

	const filteredClubs = clubs.filter(
		c =>
			c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			c.description.toLowerCase().includes(searchQuery.toLowerCase()),
	)

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-gray-900'>Community & Clubs</h1>
				<p className='text-muted-foreground mt-1'>
					Connect with fellow students
				</p>
			</div>

			{/* Clubs */}
			<div className='relative'>
				<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
				<input
					type='text'
					placeholder='Search clubs…'
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
					className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white'
				/>
			</div>

			{clubsLoading && (
				<div className='text-center py-8 text-gray-500'>Loading clubs…</div>
			)}
			{clubsError && (
				<div className='p-4 text-red-600 bg-red-50 rounded-xl border border-red-200'>
					{clubsError}
				</div>
			)}

			<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{filteredClubs.map(club => {
					const joined = joinedIds.has(club.id)
					return (
						<div
							key={club.id}
							className='bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition'
						>
							{club.image_url ? (
								<img
									src={club.image_url}
									alt={club.name}
									className='w-12 h-12 rounded-lg object-cover mb-3'
								/>
							) : (
								<div className='p-2 bg-blue-100 rounded-lg w-fit mb-3'>
									<Users className='w-5 h-5 text-blue-600' />
								</div>
							)}
							<h3 className='text-gray-900'>{club.name}</h3>
							<p className='text-gray-500 mt-1 line-clamp-2'>
								{club.description}
							</p>
							<div className='flex gap-2 mt-4'>
								<button
									onClick={() =>
										joined ? handleLeave(club) : handleJoin(club)
									}
									className={`flex-1 px-4 py-2 rounded-lg transition ${
										joined
											? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
											: 'bg-blue-600 text-white hover:bg-blue-700'
									}`}
								>
									{joined ? 'Leave' : 'Join'}
								</button>
							</div>
						</div>
					)
				})}

				{filteredClubs.length === 0 && !clubsLoading && (
					<div className='col-span-3 text-center py-12 bg-white rounded-xl border border-gray-200'>
						<Users className='w-12 h-12 mx-auto mb-3 text-gray-300' />
						<p className='text-gray-900'>No clubs found</p>
					</div>
				)}
			</div>
		</div>
	)
}
