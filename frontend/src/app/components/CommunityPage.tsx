import { useEffect, useState } from 'react'
import { MessageSquare, Search, Send, Users } from 'lucide-react'
import { authFetch } from '../lib/api'

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
	const [activeTab, setActiveTab] = useState<'clubs' | 'board'>('clubs')
	const [searchQuery, setSearchQuery] = useState('')

	// Clubs
	const [clubs, setClubs] = useState<ClubOut[]>([])
	const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set())
	const [clubsLoading, setClubsLoading] = useState(true)
	const [clubsError, setClubsError] = useState<string | null>(null)

	// Board
	const [selectedClub, setSelectedClub] = useState<ClubOut | null>(null)
	const [posts, setPosts] = useState<PostOut[]>([])
	const [postsLoading, setPostsLoading] = useState(false)
	const [newPostBody, setNewPostBody] = useState('')
	const [postSubmitting, setPostSubmitting] = useState(false)
	const [postError, setPostError] = useState<string | null>(null)

	useEffect(() => {
		authFetch('/clubs')
			.then(r => (r.ok ? r.json() : []))
			.then(d => setClubs(Array.isArray(d) ? d : []))
			.catch(e => setClubsError(e.message))
			.finally(() => setClubsLoading(false))
	}, [])

	useEffect(() => {
		if (!selectedClub) return
		setPostsLoading(true)
		setPostError(null)
		authFetch(`/clubs/${selectedClub.id}/posts`)
			.then(r => (r.ok ? r.json() : []))
			.then(d => setPosts(Array.isArray(d) ? d : []))
			.catch(e => setPostError(e.message))
			.finally(() => setPostsLoading(false))
	}, [selectedClub])

	const handleJoin = async (club: ClubOut) => {
		const res = await authFetch(`/clubs/${club.id}/join`, { method: 'POST' })
		if (res.ok || res.status === 201)
			setJoinedIds(prev => new Set([...prev, club.id]))
	}

	const handleLeave = async (club: ClubOut) => {
		const res = await authFetch(`/clubs/${club.id}/leave`, { method: 'DELETE' })
		if (res.ok || res.status === 204)
			setJoinedIds(prev => {
				const s = new Set(prev)
				s.delete(club.id)
				return s
			})
	}

	const handlePost = async () => {
		if (!selectedClub || !newPostBody.trim()) return
		setPostSubmitting(true)
		setPostError(null)
		try {
			const res = await authFetch(`/clubs/${selectedClub.id}/posts`, {
				method: 'POST',
				body: JSON.stringify({ body: newPostBody }),
			})
			if (!res.ok) {
				const data = await res.json().catch(() => null)
				throw new Error(data?.detail ?? `Post failed (${res.status})`)
			}
			const post: PostOut = await res.json()
			setPosts(prev => [post, ...prev])
			setNewPostBody('')
		} catch (e) {
			setPostError(e instanceof Error ? e.message : 'Failed to post')
		} finally {
			setPostSubmitting(false)
		}
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
				<p className='text-muted-foreground mt-1'>Connect with fellow students</p>
			</div>

			{/* Tabs */}
			<div className='flex gap-2 border-b border-gray-200'>
				{(
					[
						['clubs', 'Clubs Directory'],
						['board', 'Notice Board'],
					] as const
				).map(([tab, label]) => (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={`px-4 py-3 border-b-2 transition ${
							activeTab === tab
								? 'border-blue-600 text-blue-600'
								: 'border-transparent text-gray-600 hover:text-gray-900'
						}`}
					>
						{label}
					</button>
				))}
			</div>

			{/* Clubs tab */}
			{activeTab === 'clubs' && (
				<>
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
						<div className='text-center py-8 text-gray-500'>
							Loading clubs…
						</div>
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
										<button
											onClick={() => {
												setSelectedClub(club)
												setActiveTab('board')
											}}
											className='px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition'
										>
											Posts
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
				</>
			)}

			{/* Board tab */}
			{activeTab === 'board' && (
				<>
					<select
						value={selectedClub?.id ?? ''}
						onChange={e => {
							setSelectedClub(clubs.find(c => c.id === e.target.value) ?? null)
						}}
						className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none bg-white'
					>
						<option value=''>Select a club…</option>
						{clubs.map(c => (
							<option key={c.id} value={c.id}>
								{c.name}
							</option>
						))}
					</select>

					{selectedClub ? (
						<>
							{/* New post */}
							<div className='bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3'>
								<textarea
									placeholder={`Write a post in ${selectedClub.name}…`}
									value={newPostBody}
									onChange={e => setNewPostBody(e.target.value)}
									maxLength={2000}
									rows={3}
									className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none'
								/>
								{postError && (
									<p className='text-sm text-red-600'>{postError}</p>
								)}
								<div className='flex justify-end'>
									<button
										onClick={handlePost}
										disabled={postSubmitting || !newPostBody.trim()}
										className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60'
									>
										<Send className='w-4 h-4' />
										{postSubmitting ? 'Posting…' : 'Post'}
									</button>
								</div>
							</div>

							{postsLoading && (
								<div className='text-center py-8 text-gray-500'>
									Loading posts…
								</div>
							)}

							<div className='space-y-4'>
								{posts.map(post => (
									<div
										key={post.id}
										className='bg-white rounded-xl border border-gray-200 p-5 shadow-sm'
									>
										<div className='flex items-start gap-3 mb-3'>
											<div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0'>
												{post.author_name.charAt(0)}
											</div>
											<div>
												<div className='flex items-center gap-2 flex-wrap'>
													<p className='text-gray-900'>{post.author_name}</p>
													<span className='text-gray-400'>•</span>
													<span className='text-gray-500'>
														{timeAgo(post.created_at)}
													</span>
												</div>
											</div>
										</div>
										<p className='text-gray-600'>{post.body}</p>
									</div>
								))}

								{posts.length === 0 && !postsLoading && (
									<div className='text-center py-12 bg-white rounded-xl border border-gray-200'>
										<MessageSquare className='w-12 h-12 mx-auto mb-3 text-gray-300' />
										<p className='text-gray-900'>No posts yet</p>
										<p className='text-muted-foreground mt-1'>
											Be the first to post!
										</p>
									</div>
								)}
							</div>
						</>
					) : (
						<div className='text-center py-12 bg-white rounded-xl border border-gray-200'>
							<MessageSquare className='w-12 h-12 mx-auto mb-3 text-gray-300' />
							<p className='text-gray-900'>Select a club to view posts</p>
						</div>
					)}
				</>
			)}
		</div>
	)
}
