<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { inviteUserSchema, updateUserRoleSchema } from '$lib/schemas';
	import { Plus, MoreVertical, Trash2, Shield, Search } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { Badge, Toast, success as toastSuccess, error as toastError } from '$lib/components/ui';

	let { data } = $props();

	const {
		form: inviteForm,
		errors: inviteErrors,
		enhance: inviteEnhance,
		message: inviteMessage
	} = superForm(data.inviteForm, {
		validators: valibotClient(inviteUserSchema),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				(document.getElementById('invite_modal') as HTMLDialogElement).close();
			}
		}
	});

	const { form: roleForm, enhance: roleEnhance } = superForm(data.roleForm, {
		validators: valibotClient(updateUserRoleSchema),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				(document.getElementById('role_modal') as HTMLDialogElement).close();
			}
		}
	});

	let searchTerm = $state('');
	let selectedUser = $state<any>(null);
	let showDeleteModal = $state(false);

	let filteredUsers = $derived(
		data.users.filter(
			(u) =>
				u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				u.username.toLowerCase().includes(searchTerm.toLowerCase())
		)
	);

	function openRoleModal(user: any) {
		selectedUser = user;
		$roleForm.userId = user.id;
		$roleForm.roleId = user.roleId || 0;
		(document.getElementById('role_modal') as HTMLDialogElement).showModal();
	}

	function handleDelete() {
		return async ({ result, update }: any) => {
			showDeleteModal = false;
			selectedUser = null;
			if (result.type === 'success') {
				toastSuccess('Data user berhasil dihapus');
				await update();
			} else if (result.type === 'failure') {
				toastError(result.data?.error || 'Gagal menghapus');
			}
		};
	}
</script>

<svelte:head>
	<title>User Management | Minimasjid</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<div>
			<h1 class="text-2xl font-bold">Users</h1>
			<p class="text-base-content/70">Manage system access and permissions</p>
		</div>
		<button
			class="btn btn-primary"
			onclick={() => (document.getElementById('invite_modal') as HTMLDialogElement).showModal()}
		>
			<Plus size={20} />
			Invite User
		</button>
	</div>

	<div class="card bg-base-100 shadow-sm border border-base-200">
		<div class="card-body p-0">
			<!-- Toolbar -->
			<div class="p-4 border-b border-base-200 flex gap-4">
				<label class="input input-bordered flex items-center gap-2 w-full max-w-xs">
					<Search size={16} class="opacity-70" />
					<input type="text" class="grow" placeholder="Search users..." bind:value={searchTerm} />
				</label>
			</div>

			<!-- Table -->
			<div class="overflow-x-auto">
				<table class="table table-zebra">
					<thead>
						<tr>
							<th>User</th>
							<th>Role</th>
							<th>Status</th>
							<th class="text-right">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredUsers as user (user.id)}
							<tr>
								<td>
									<div class="flex items-center gap-3">
										<div class="avatar placeholder">
											<div
												class="bg-neutral text-neutral-content rounded-full w-10 flex items-center justify-center"
											>
												{#if user.avatarUrl}
													<img src={user.avatarUrl} alt={user.fullName} />
												{:else}
													<span class="text-xs"
														>{user.fullName?.slice(0, 2).toUpperCase() || 'U'}</span
													>
												{/if}
											</div>
										</div>
										<div>
											<div class="font-bold">{user.fullName || 'Unknown'}</div>
											<div class="text-xs opacity-50">{user.username}</div>
										</div>
									</div>
								</td>
								<td>
									<span
										class="badge badge-sm"
										class:badge-primary={user.roleName === 'admin' ||
											user.roleName === 'super_admin'}
										class:badge-ghost={user.roleName !== 'admin' && user.roleName !== 'super_admin'}
									>
										{user.roleName || 'No Role'}
									</span>
								</td>
								<td>
									{#if user.emailVerified}
										<span class="badge badge-success badge-xs gap-1">Active</span>
									{:else}
										<span class="badge badge-warning badge-xs gap-1">Pending</span>
									{/if}
								</td>
								<td class="text-right">
									<div class="dropdown dropdown-end w-full">
										<div tabindex="0" role="button" class="btn btn-ghost btn-xs">
											<MoreVertical class="w-4 h-4" />
										</div>
										<ul
											class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow border border-base-200 space-y-2"
										>
											<li>
												<button
													onclick={() => openRoleModal(user)}
													class="btn btn-outline btn-secondary w-full text-left"
												>
													<Shield class="w-4 h-4" /> Change Role
												</button>
											</li>
											<li>
												<button
													type="button"
													class="btn btn-warning btn-outline"
													onclick={() => {
														showDeleteModal = true;
														console.log('selectedUser', user);
														selectedUser = user;
													}}
												>
													<Trash2 class="w-4 h-4" /> Delete
												</button>
											</li>
										</ul>
									</div>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="4" class="text-center py-8 text-base-content/50">
									No users found matching "{searchTerm}"
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>

<!-- Invite Modal -->
<dialog id="invite_modal" class="modal">
	<div class="modal-box">
		<h3 class="font-bold text-lg mb-4">Invite New User</h3>
		<form method="POST" action="?/invite" use:inviteEnhance class="space-y-4">
			<div class="form-control w-full">
				<label class="label" for="name">
					<span class="label-text">Full Name</span>
				</label>
				<input
					type="text"
					name="name"
					bind:value={$inviteForm.name}
					class="input input-bordered w-full"
					placeholder="John Doe"
				/>
				{#if $inviteErrors.name}<span class="text-error text-sm">{$inviteErrors.name}</span>{/if}
			</div>

			<div class="form-control w-full">
				<label class="label" for="email">
					<span class="label-text">Email Address</span>
				</label>
				<input
					type="email"
					name="email"
					bind:value={$inviteForm.email}
					class="input input-bordered w-full"
					placeholder="john@example.com"
				/>
				{#if $inviteErrors.email}<span class="text-error text-sm">{$inviteErrors.email}</span>{/if}
			</div>

			<div class="form-control w-full">
				<label class="label" for="roleId">
					<span class="label-text">Role</span>
				</label>
				<select name="roleId" bind:value={$inviteForm.roleId} class="select select-bordered w-full">
					<option value="" disabled selected>Select a role</option>
					{#each data.roles as role}
						<option value={role.id}>{role.name}</option>
					{/each}
				</select>
				{#if $inviteErrors.roleId}<span class="text-error text-sm">{$inviteErrors.roleId}</span
					>{/if}
			</div>

			<div class="modal-action">
				<button
					type="button"
					class="btn"
					onclick={() => (document.getElementById('invite_modal') as HTMLDialogElement).close()}
					>Cancel</button
				>
				<button type="submit" class="btn btn-primary">Send Invite</button>
			</div>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<!-- Change Role Modal -->
<dialog id="role_modal" class="modal">
	<div class="modal-box">
		<h3 class="font-bold text-lg mb-4">Change Role</h3>
		{#if selectedUser}
			<p class="text-sm mb-4">Updating role for <strong>{selectedUser.fullName}</strong></p>
		{/if}
		<form method="POST" action="?/updateRole" use:roleEnhance class="space-y-4">
			<input type="hidden" name="userId" bind:value={$roleForm.userId} />

			<div class="form-control w-full">
				<label class="label" for="new_role">
					<span class="label-text">Select New Role</span>
				</label>
				<select name="roleId" bind:value={$roleForm.roleId} class="select select-bordered w-full">
					{#each data.roles as role}
						<option value={role.id}>{role.name}</option>
					{/each}
				</select>
			</div>

			<div class="modal-action">
				<button
					type="button"
					class="btn"
					onclick={() => (document.getElementById('role_modal') as HTMLDialogElement).close()}
					>Cancel</button
				>
				<button type="submit" class="btn btn-primary">Update Role</button>
			</div>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<!-- Delete Modal -->
{#if showDeleteModal && selectedUser}
	<dialog class="modal modal-open">
		<div class="modal-box">
			<h3 class="font-bold text-lg text-error">⚠️ Hapus User</h3>
			<p class="py-4">Apakah Anda yakin ingin menghapus data user ini?</p>
			<div class="bg-base-200 rounded-lg p-4 mb-4">
				<p class="font-medium">{selectedUser.fullName}</p>
				{#if selectedUser.phone}<p class="text-sm text-base-content/60">
						{selectedUser.phone}
					</p>{/if}
			</div>
			<div class="modal-action">
				<button
					class="btn btn-ghost"
					onclick={() => {
						showDeleteModal = false;
						selectedUser = null;
					}}>Batal</button
				>
				<form method="POST" action="?/delete" use:enhance={() => handleDelete()}>
					<input type="hidden" name="id" value={selectedUser.id} />
					<button type="submit" class="btn btn-error"><Trash2 class="w-4 h-4" /> Hapus</button>
				</form>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button
				onclick={() => {
					showDeleteModal = false;
					selectedUser = null;
				}}>close</button
			>
		</form>
	</dialog>
{/if}
