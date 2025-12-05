<script lang="ts">
	import { FileText, Search, Filter, Download } from 'lucide-svelte';

	let logs = $state([
		{
			id: 1,
			user: 'Abdullah',
			action: 'Created Announcement',
			target: 'Ramadhan Prep',
			ip: '192.168.1.1',
			time: '2 mins ago'
		},
		{
			id: 2,
			user: 'System',
			action: 'Backup Completed',
			target: 'Daily Backup',
			ip: 'localhost',
			time: '1 hour ago'
		},
		{
			id: 3,
			user: 'Fatimah',
			action: 'Updated Profile',
			target: 'User #45',
			ip: '192.168.1.15',
			time: '3 hours ago'
		},
		{
			id: 4,
			user: 'Abdullah',
			action: 'Deleted User',
			target: 'Spam User',
			ip: '192.168.1.1',
			time: '5 hours ago'
		},
		{
			id: 5,
			user: 'System',
			action: 'Failed Login',
			target: 'admin@minimasjid.com',
			ip: '203.0.113.42',
			time: '1 day ago'
		}
	]);
</script>

<div class="space-y-6">
	<div
		class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-base-200 pb-4"
	>
		<div>
			<h2 class="text-2xl font-bold">Audit Logs</h2>
			<p class="text-base-content/60">Track system activities and security events.</p>
		</div>
		<button class="btn btn-outline btn-sm">
			<Download class="w-4 h-4 mr-1" /> Export CSV
		</button>
	</div>

	<!-- Filters -->
	<div class="flex gap-4">
		<div class="relative flex-1 max-w-xs">
			<Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
			<input
				type="text"
				placeholder="Search logs..."
				class="input input-bordered input-sm w-full pl-10"
			/>
		</div>
		<select class="select select-bordered select-sm">
			<option disabled selected>Filter by Action</option>
			<option>Create</option>
			<option>Update</option>
			<option>Delete</option>
			<option>Login</option>
		</select>
	</div>

	<!-- Logs Table -->
	<div class="overflow-x-auto bg-base-100 rounded-lg border border-base-200">
		<table class="table table-zebra w-full text-sm">
			<thead>
				<tr>
					<th>User</th>
					<th>Action</th>
					<th>Target</th>
					<th>IP Address</th>
					<th>Time</th>
				</tr>
			</thead>
			<tbody>
				{#each logs as log}
					<tr class="hover">
						<td class="font-medium">{log.user}</td>
						<td>
							<span class="badge badge-ghost badge-sm">{log.action}</span>
						</td>
						<td class="font-mono text-xs">{log.target}</td>
						<td class="font-mono text-xs text-base-content/60">{log.ip}</td>
						<td class="text-base-content/60">{log.time}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
