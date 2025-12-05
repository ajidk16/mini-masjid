<script lang="ts">
	import { Search, Filter, MoreVertical, Shield, Trash2, UserCheck, UserX } from 'lucide-svelte';

	let searchQuery = $state('');
	let users = $state([
		{
			id: 1,
			name: 'Abdullah',
			email: 'abdullah@example.com',
			role: 'Admin',
			status: 'Active',
			avatar: 'A'
		},
		{
			id: 2,
			name: 'Fatimah',
			email: 'fatimah@example.com',
			role: 'Editor',
			status: 'Active',
			avatar: 'F'
		},
		{
			id: 3,
			name: 'Umar',
			email: 'umar@example.com',
			role: 'Viewer',
			status: 'Inactive',
			avatar: 'U'
		},
		{
			id: 4,
			name: 'Aisyah',
			email: 'aisyah@example.com',
			role: 'Editor',
			status: 'Active',
			avatar: 'A'
		},
		{
			id: 5,
			name: 'Khalid',
			email: 'khalid@example.com',
			role: 'Viewer',
			status: 'Active',
			avatar: 'K'
		}
	]);

	let filteredUsers = $derived(
		users.filter(
			(u) =>
				u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				u.email.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);
</script>

<div class="space-y-6">
	<div
		class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-base-200 pb-4"
	>
		<div>
			<h2 class="text-2xl font-bold">User Management</h2>
			<p class="text-base-content/60">Manage user access and permissions.</p>
		</div>
		<button class="btn btn-primary btn-sm">Invite User</button>
	</div>

	<!-- Filters & Search -->
	<div class="flex flex-col sm:flex-row gap-4 justify-between">
		<div class="relative w-full sm:w-64">
			<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<Search class="h-4 w-4 text-base-content/50" />
			</div>
			<input
				type="text"
				placeholder="Search users..."
				bind:value={searchQuery}
				class="input input-bordered input-sm w-full pl-10"
			/>
		</div>
		<div class="flex gap-2">
			<select class="select select-bordered select-sm">
				<option disabled selected>Role</option>
				<option>Admin</option>
				<option>Editor</option>
				<option>Viewer</option>
			</select>
			<select class="select select-bordered select-sm">
				<option disabled selected>Status</option>
				<option>Active</option>
				<option>Inactive</option>
			</select>
		</div>
	</div>

	<!-- Users Table -->
	<div class="overflow-x-auto bg-base-100 rounded-lg border border-base-200">
		<table class="table table-zebra w-full">
			<thead>
				<tr>
					<th>User</th>
					<th>Role</th>
					<th>Status</th>
					<th class="text-right">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredUsers as user}
					<tr class="hover">
						<td>
							<div class="flex items-center gap-3">
								<div class="avatar placeholder">
									<div class="bg-neutral text-neutral-content rounded-full w-10">
										<span>{user.avatar}</span>
									</div>
								</div>
								<div>
									<div class="font-bold">{user.name}</div>
									<div class="text-xs opacity-50">{user.email}</div>
								</div>
							</div>
						</td>
						<td>
							<span
								class="badge badge-sm"
								class:badge-primary={user.role === 'Admin'}
								class:badge-ghost={user.role !== 'Admin'}
							>
								{user.role}
							</span>
						</td>
						<td>
							<span
								class="badge badge-xs gap-1"
								class:badge-success={user.status === 'Active'}
								class:badge-error={user.status === 'Inactive'}
							>
								{user.status}
							</span>
						</td>
						<td class="text-right">
							<div class="dropdown dropdown-end">
								<div tabindex="0" role="button" class="btn btn-ghost btn-xs">
									<MoreVertical class="w-4 h-4" />
								</div>
								<ul
									tabindex="0"
									class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
								>
									<li><a><Shield class="w-4 h-4" /> Change Role</a></li>
									<li>
										{#if user.status === 'Active'}
											<a class="text-warning"><UserX class="w-4 h-4" /> Deactivate</a>
										{:else}
											<a class="text-success"><UserCheck class="w-4 h-4" /> Activate</a>
										{/if}
									</li>
									<li><a class="text-error"><Trash2 class="w-4 h-4" /> Delete</a></li>
								</ul>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
