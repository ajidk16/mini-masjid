<script lang="ts">
	import { User, Mail, Phone, MapPin, Calendar, Edit, Shield, LogOut } from 'lucide-svelte';

	let user = {
		name: 'Abdullah Al-Fatih',
		role: 'Administrator',
		email: 'abdullah@minimasjid.com',
		phone: '+62 812-3456-7890',
		location: 'Jakarta Selatan, Indonesia',
		joined: 'January 2024',
		bio: 'Khidmat untuk umat. Managing operational activities of Masjid Al-Ikhlas.',
		avatar: 'A'
	};
</script>

<div class="max-w-4xl mx-auto space-y-6 p-4 md:p-6">
	<!-- Profile Header -->
	<div class="card bg-base-100 shadow-sm border border-base-200 overflow-hidden">
		<div class="h-32 bg-gradient-to-r from-primary to-secondary"></div>
		<div class="card-body pt-0 relative">
			<div
				class="flex flex-col md:flex-row justify-between items-start md:items-end -mt-12 mb-4 gap-4"
			>
				<div class="flex items-end gap-4">
					<div class="avatar placeholder ring ring-base-100 ring-offset-2 rounded-full">
						<div class="bg-neutral text-neutral-content rounded-full w-24 text-3xl">
							<span>{user.avatar}</span>
						</div>
					</div>
					<div class="mb-1">
						<h1 class="text-2xl font-bold">{user.name}</h1>
						<span class="badge badge-primary badge-outline">{user.role}</span>
					</div>
				</div>
				<div class="flex gap-2 w-full md:w-auto">
					<a href="/profile/edit" class="btn btn-outline btn-sm flex-1 md:flex-none">
						<Edit class="w-4 h-4 mr-1" /> Edit Profile
					</a>
					<a href="/profile/security" class="btn btn-outline btn-sm flex-1 md:flex-none">
						<Shield class="w-4 h-4 mr-1" /> Security
					</a>
				</div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
				<div class="space-y-3">
					<h3 class="font-semibold text-lg">About</h3>
					<p class="text-base-content/70">{user.bio}</p>

					<div class="flex flex-col gap-2 mt-4">
						<div class="flex items-center gap-3 text-sm text-base-content/70">
							<Mail class="w-4 h-4" />
							{user.email}
						</div>
						<div class="flex items-center gap-3 text-sm text-base-content/70">
							<Phone class="w-4 h-4" />
							{user.phone}
						</div>
						<div class="flex items-center gap-3 text-sm text-base-content/70">
							<MapPin class="w-4 h-4" />
							{user.location}
						</div>
						<div class="flex items-center gap-3 text-sm text-base-content/70">
							<Calendar class="w-4 h-4" /> Joined {user.joined}
						</div>
					</div>
				</div>

				<div class="space-y-3">
					<h3 class="font-semibold text-lg">Activity Summary</h3>
					<div
						class="stats stats-vertical lg:stats-horizontal shadow w-full border border-base-200"
					>
						<div class="stat">
							<div class="stat-title">Donations</div>
							<div class="stat-value text-primary">12</div>
							<div class="stat-desc">Last month</div>
						</div>
						<div class="stat">
							<div class="stat-title">Events</div>
							<div class="stat-value text-secondary">5</div>
							<div class="stat-desc">Attended</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Recent Activity (Placeholder) -->
	<div class="card bg-base-100 shadow-sm border border-base-200">
		<div class="card-body">
			<h3 class="font-semibold text-lg mb-4">Recent Login Activity</h3>
			<div class="overflow-x-auto">
				<table class="table table-zebra">
					<thead>
						<tr>
							<th>Device</th>
							<th>Location</th>
							<th>Time</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Chrome on macOS</td>
							<td>Jakarta, ID</td>
							<td>Just now</td>
							<td><span class="badge badge-success badge-xs gap-1">Active</span></td>
						</tr>
						<tr>
							<td>Safari on iPhone</td>
							<td>Jakarta, ID</td>
							<td>2 hours ago</td>
							<td><span class="badge badge-ghost badge-xs">Signed out</span></td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<div class="flex justify-center">
		<button class="btn btn-error btn-outline btn-wide">
			<LogOut class="w-4 h-4 mr-2" /> Sign Out
		</button>
	</div>
</div>
