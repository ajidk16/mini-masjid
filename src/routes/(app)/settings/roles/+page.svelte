<script lang="ts">
	import { Shield, Plus, Edit, Trash2, Check } from 'lucide-svelte';

	let roles = $state([
		{ id: 1, name: 'Administrator', description: 'Full access to all system features.', users: 2 },
		{ id: 2, name: 'Editor', description: 'Can manage content and donations.', users: 5 },
		{ id: 3, name: 'Viewer', description: 'Read-only access to public data.', users: 12 }
	]);

	let permissions = [
		'manage_users',
		'manage_roles',
		'manage_settings',
		'create_content',
		'edit_content',
		'delete_content',
		'view_reports',
		'export_data'
	];
</script>

<div class="space-y-6">
	<div class="flex justify-between items-center border-b border-base-200 pb-4">
		<div>
			<h2 class="text-2xl font-bold">Role Management</h2>
			<p class="text-base-content/60">Define roles and assign permissions.</p>
		</div>
		<button class="btn btn-primary btn-sm">
			<Plus class="w-4 h-4 mr-1" /> Add Role
		</button>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Roles List -->
		<div class="lg:col-span-1 space-y-4">
			{#each roles as role}
				<div
					class="card bg-base-100 border border-base-200 hover:border-primary cursor-pointer transition-colors"
				>
					<div class="card-body p-4">
						<div class="flex justify-between items-start">
							<div>
								<h3 class="font-bold flex items-center gap-2">
									<Shield class="w-4 h-4 text-primary" />
									{role.name}
								</h3>
								<p class="text-xs text-base-content/60 mt-1">{role.description}</p>
							</div>
							<div class="dropdown dropdown-end">
								<button tabindex="0" class="btn btn-ghost btn-xs btn-circle">
									<Edit class="w-3 h-3" />
								</button>
								<ul
									tabindex="0"
									class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
								>
									<li><a>Edit Role</a></li>
									<li><a class="text-error">Delete</a></li>
								</ul>
							</div>
						</div>
						<div class="mt-3 flex items-center justify-between text-xs text-base-content/50">
							<span>{role.users} Users assigned</span>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Permissions Matrix (Placeholder for selected role) -->
		<div class="lg:col-span-2 card bg-base-100 border border-base-200">
			<div class="card-body">
				<h3 class="font-bold text-lg mb-4">Permissions: Administrator</h3>
				<div class="overflow-x-auto">
					<table class="table table-sm">
						<thead>
							<tr>
								<th>Permission</th>
								<th class="text-center">Access</th>
							</tr>
						</thead>
						<tbody>
							{#each permissions as perm}
								<tr class="hover">
									<td class="font-medium capitalize">{perm.replace('_', ' ')}</td>
									<td class="text-center">
										<input type="checkbox" class="checkbox checkbox-primary checkbox-sm" checked />
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				<div class="card-actions justify-end mt-4">
					<button class="btn btn-primary btn-sm">Save Permissions</button>
				</div>
			</div>
		</div>
	</div>
</div>
