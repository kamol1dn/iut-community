import {
	Calendar,
	ChevronDown,
	DoorOpen,
	Home,
	LogOut,
	Menu,
	Users,
	X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { authFetch } from '../lib/api'

const CLUBS_API_BASE = 'http://46.101.98.64:8088'

export function DashboardLayout() {
	const navigate = useNavigate()
	const location = useLocation()
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [communityExpanded, setCommunityExpanded] = useState(false)
	const [fullName, setFullName] = useState(
		localStorage.getItem('full_name') ?? '',
	)
	const [group, setGroup] = useState(localStorage.getItem('group') ?? '')

	useEffect(() => {
		authFetch(`${CLUBS_API_BASE}/dashboard`)
			.then(r => (r.ok ? r.json() : null))
			.then(d => {
				if (!d) return
				setFullName(d.full_name)
				setGroup(d.group)
				localStorage.setItem('full_name', d.full_name)
				localStorage.setItem('group', d.group)
			})
			.catch(() => {})
	}, [])

	const navItems = [
		{ path: '/dashboard', label: 'Overview', icon: Home },
		{ path: '/dashboard/timetable', label: 'Timetable', icon: Calendar },
		{ path: '/dashboard/rooms', label: 'Rooms & Facilities', icon: DoorOpen },
	]

	const handleLogout = () => {
		localStorage.clear()
		navigate('/')
	}

	const isActive = (path: string) => {
		if (path === '/dashboard') {
			return location.pathname === path
		}
		return location.pathname.startsWith(path)
	}

	return (
		<div className='flex h-screen bg-gray-50'>
			{/* Mobile Overlay */}
			{mobileMenuOpen && (
				<div
					className='fixed inset-0 bg-black/50 z-40 lg:hidden'
					onClick={() => setMobileMenuOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
					mobileMenuOpen
						? 'translate-x-0'
						: '-translate-x-full lg:translate-x-0'
				}`}
			>
				<div className='flex flex-col h-full'>
					{/* Logo */}
					<div className='p-6 border-b border-gray-200 flex items-center justify-between'>
						<div className='flex-1 flex justify-center'>
							<img
								src='/assest/logo/logo_dark.png'
								alt='IUT Core'
								className='h-16 w-auto object-contain'
							/>
						</div>
						<button
							onClick={() => setMobileMenuOpen(false)}
							className='lg:hidden text-gray-500 hover:text-gray-700'
						>
							<X className='w-5 h-5' />
						</button>
					</div>

					{/* Navigation */}
					<nav className='flex-1 p-4 space-y-1'>
						{navItems.map(item => {
							const Icon = item.icon
							const active = isActive(item.path)
							return (
								<button
									key={item.path}
									onClick={() => {
										navigate(item.path)
										setMobileMenuOpen(false)
									}}
									className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
										active
											? 'bg-blue-50 text-blue-600'
											: 'text-gray-700 hover:bg-gray-100'
									}`}
								>
									<Icon className='w-5 h-5' />
									<span>{item.label}</span>
								</button>
							)
						})}

						{/* Community with submenu */}
						<div>
							<button
								onClick={() => setCommunityExpanded(!communityExpanded)}
								className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
									location.pathname.startsWith('/dashboard/community')
										? 'bg-blue-50 text-blue-600'
										: 'text-gray-700 hover:bg-gray-100'
								}`}
							>
								<Users className='w-5 h-5' />
								<span className='flex-1 text-left'>Community & Clubs</span>
								<ChevronDown
									className={`w-4 h-4 transition-transform ${
										communityExpanded ? 'rotate-180' : ''
									}`}
								/>
							</button>
							{communityExpanded && (
								<div className='ml-12 mt-1 space-y-1'>
									<button
										onClick={() => {
											navigate('/dashboard/community')
											setMobileMenuOpen(false)
										}}
										className='w-full text-left px-4 py-2 text-gray-600 hover:text-blue-600 transition'
									>
										Clubs Directory
									</button>
								</div>
							)}
						</div>
					</nav>

					{/* User Profile & Actions */}
					<div className='border-t border-gray-200 p-4 space-y-2'>
						<div className='px-4 py-3 bg-gray-50 rounded-lg'>
							<p className='text-gray-900'>{fullName || '—'}</p>
							<p className='text-gray-500 mt-0.5'>{group || '—'}</p>
						</div>
						<button
							onClick={handleLogout}
							className='w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition'
						>
							<LogOut className='w-5 h-5' />
							<span>Logout</span>
						</button>
					</div>
				</div>
			</aside>

			{/* Main Content */}
			<main className='flex-1 overflow-auto'>
				{/* Mobile Header */}
				<div className='lg:hidden bg-white border-b border-gray-200 p-4 flex items-center gap-3'>
					<button
						onClick={() => setMobileMenuOpen(true)}
						className='text-gray-700'
					>
						<Menu className='w-6 h-6' />
					</button>
					<div className='flex items-center gap-2'>
						<img
							src='/assest/logo/logo_dark.png'
							alt='IUT Core'
							className='h-8 w-auto object-contain'
						/>
					</div>
				</div>

				<div className='p-6 lg:p-8'>
					<Outlet />
				</div>
			</main>
		</div>
	)
}
