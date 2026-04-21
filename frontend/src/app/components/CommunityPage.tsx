import { Calendar, MessageSquare, Search, Send, Users } from 'lucide-react'
import { useState } from 'react'

type Club = {
	id: string
	name: string
	meeting: string
	members: number
	category: string
}

type Post = {
	id: string
	author: string
	groupId: string
	title: string
	content: string
	timeAgo: string
	replies: number
}

export function CommunityPage() {
	const [activeTab, setActiveTab] = useState<'clubs' | 'board'>('clubs')
	const [searchQuery, setSearchQuery] = useState('')

	const clubs: Club[] = [
		{
			id: '1',
			name: 'Coding Club',
			meeting: 'Fridays, 4:00 PM',
			members: 45,
			category: 'Technology',
		},
		{
			id: '2',
			name: 'Robotics Society',
			meeting: 'Wednesdays, 3:30 PM',
			members: 32,
			category: 'Engineering',
		},
		{
			id: '3',
			name: 'Photography Club',
			meeting: 'Tuesdays, 5:00 PM',
			members: 28,
			category: 'Arts',
		},
		{
			id: '4',
			name: 'Debate Society',
			meeting: 'Thursdays, 6:00 PM',
			members: 38,
			category: 'Arts',
		},
		{
			id: '5',
			name: 'Data Science Club',
			meeting: 'Mondays, 4:30 PM',
			members: 51,
			category: 'Technology',
		},
		{
			id: '6',
			name: 'Sports Committee',
			meeting: 'Saturdays, 10:00 AM',
			members: 67,
			category: 'Sports',
		},
	]

	const posts: Post[] = [
		{
			id: '1',
			author: 'Sarah Kim',
			groupId: 'ICE-23-05',
			title: 'Looking for 2 members for DAD project',
			content:
				'We need 2 more people for our Database project. Topic is E-commerce System. Contact me if interested!',
			timeAgo: '2 hours ago',
			replies: 5,
		},
		{
			id: '2',
			author: 'Mike Johnson',
			groupId: 'ICE-23-08',
			title: 'Found lost keys in A608',
			content:
				'Found a set of keys with a red keychain in room A608 after Professional Skills class. Check with me to claim.',
			timeAgo: '5 hours ago',
			replies: 2,
		},
		{
			id: '3',
			author: 'Emma Chen',
			groupId: 'ICE-23-02',
			title: 'Study group for Computer Networks midterm',
			content:
				'Starting a study group for CN midterm. Meeting this Saturday at 2 PM in library. DM if you want to join!',
			timeAgo: '1 day ago',
			replies: 12,
		},
		{
			id: '4',
			author: 'Alex Rivera',
			groupId: 'ICE-23-11',
			title: 'Selling used textbooks',
			content:
				'Selling Database and Networks textbooks in good condition. Half the original price. Contact for details.',
			timeAgo: '1 day ago',
			replies: 3,
		},
	]

	const filteredClubs = clubs.filter(club =>
		club.name.toLowerCase().includes(searchQuery.toLowerCase()),
	)

	const filteredPosts = posts.filter(
		post =>
			post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.content.toLowerCase().includes(searchQuery.toLowerCase()),
	)

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-gray-900'>Community & Clubs</h1>
				<p className='text-muted-foreground mt-1'>
					Connect with fellow students
				</p>
			</div>

			{/* Tabs */}
			<div className='flex gap-2 border-b border-gray-200'>
				<button
					onClick={() => setActiveTab('clubs')}
					className={`px-4 py-3 border-b-2 transition ${
						activeTab === 'clubs'
							? 'border-blue-600 text-blue-600'
							: 'border-transparent text-gray-600 hover:text-gray-900'
					}`}
				>
					Clubs Directory
				</button>
				<button
					onClick={() => setActiveTab('board')}
					className={`px-4 py-3 border-b-2 transition ${
						activeTab === 'board'
							? 'border-blue-600 text-blue-600'
							: 'border-transparent text-gray-600 hover:text-gray-900'
					}`}
				>
					Notice Board
				</button>
			</div>

			{/* Search */}
			<div className='relative'>
				<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
				<input
					type='text'
					placeholder={
						activeTab === 'clubs' ? 'Search clubs...' : 'Search posts...'
					}
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
					className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white'
				/>
			</div>

			{/* Content */}
			{activeTab === 'clubs' ? (
				<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{filteredClubs.map(club => (
						<div
							key={club.id}
							className='bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition'
						>
							<div className='flex items-start gap-3 mb-3'>
								<div className='p-2 bg-blue-100 rounded-lg'>
									<Users className='w-5 h-5 text-blue-600' />
								</div>
								<div className='flex-1 min-w-0'>
									<h3 className='text-gray-900'>{club.name}</h3>
									<p className='text-gray-500'>{club.category}</p>
								</div>
							</div>

							<div className='space-y-2'>
								<div className='flex items-center gap-2 text-gray-600'>
									<Calendar className='w-4 h-4' />
									<span>{club.meeting}</span>
								</div>
								<div className='flex items-center gap-2 text-gray-600'>
									<Users className='w-4 h-4' />
									<span>{club.members} members</span>
								</div>
							</div>

							<button className='w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'>
								Join Club
							</button>
						</div>
					))}
				</div>
			) : (
				<div className='space-y-4'>
					{/* New Post Button */}
					<button className='w-full bg-white border border-gray-300 rounded-lg p-4 text-left text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition flex items-center gap-2'>
						<Send className='w-5 h-5' />
						<span>Create a new post...</span>
					</button>

					{/* Posts */}
					{filteredPosts.map(post => (
						<div
							key={post.id}
							className='bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition cursor-pointer'
						>
							<div className='flex items-start gap-3 mb-3'>
								<div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0'>
									{post.author.charAt(0)}
								</div>
								<div className='flex-1 min-w-0'>
									<div className='flex items-center gap-2 flex-wrap'>
										<p className='text-gray-900'>{post.author}</p>
										<span className='text-gray-400'>•</span>
										<span className='text-gray-500'>{post.groupId}</span>
										<span className='text-gray-400'>•</span>
										<span className='text-gray-500'>{post.timeAgo}</span>
									</div>
									<h3 className='text-gray-900 mt-1'>{post.title}</h3>
								</div>
							</div>

							<p className='text-gray-600 mb-3'>{post.content}</p>

							<div className='flex items-center gap-2 text-gray-500'>
								<MessageSquare className='w-4 h-4' />
								<span>{post.replies} replies</span>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Empty States */}
			{activeTab === 'clubs' && filteredClubs.length === 0 && (
				<div className='text-center py-12 bg-white rounded-xl border border-gray-200'>
					<Users className='w-12 h-12 mx-auto mb-3 text-gray-300' />
					<p className='text-gray-900'>No clubs found</p>
					<p className='text-muted-foreground mt-1'>
						Try a different search term
					</p>
				</div>
			)}

			{activeTab === 'board' && filteredPosts.length === 0 && (
				<div className='text-center py-12 bg-white rounded-xl border border-gray-200'>
					<MessageSquare className='w-12 h-12 mx-auto mb-3 text-gray-300' />
					<p className='text-gray-900'>No posts found</p>
					<p className='text-muted-foreground mt-1'>
						Try a different search term
					</p>
				</div>
			)}
		</div>
	)
}
