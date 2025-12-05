<script lang="ts">
	import { enhance } from '$app/forms';
	import { Badge, Toast, success as toastSuccess, error as toastError } from '$lib/components/ui';
	import {
		Plus,
		Calendar,
		MapPin,
		Clock,
		Users,
		Eye,
		SquarePen,
		Trash2,
		X,
		Save,
		ChevronLeft,
		ChevronRight,
		Bell,
		ClipboardCheck,
		CheckCircle2,
		XCircle,
		MinusCircle
	} from 'lucide-svelte';
	import { onMount } from 'svelte';

	let { data, form } = $props();

	// View mode
	let viewMode = $state<'list' | 'calendar'>('list');

	// Filter & search
	let searchQuery = $state('');
	let selectedCategory = $state('');
	let selectedStatus = $state('');

	// Calendar
	let currentMonth = $state(new Date().getMonth());
	let currentYear = $state(new Date().getFullYear());

	// Modal states
	let showFormModal = $state(false);
	let showDetailModal = $state(false);
	let showDeleteModal = $state(false);
	let showAbsensiModal = $state(false);
	let isEditMode = $state(false);
	let selectedEvent = $state<(typeof data.events)[0] | null>(null);
	let isSubmitting = $state(false);

	// Attendance state
	let attendanceList = $state([
		{ id: '1', name: 'Ahmad Sudrajat', status: 'present' },
		{ id: '2', name: 'Fatimah Azzahra', status: 'present' },
		{ id: '3', name: 'Muhammad Rizki', status: 'absent' },
		{ id: '4', name: 'Siti Nurhaliza', status: 'permission' },
		{ id: '5', name: 'Abdullah Rahman', status: 'present' }
	]);

	// Form fields
	let formTitle = $state('');
	let formCategory = $state('');
	let formDate = $state('');
	let formTime = $state('');
	let formEndTime = $state('');
	let formLocation = $state('');
	let formDescription = $state('');
	let formCapacity = $state('');

	const categories = ['Pengajian', 'Kajian', 'Sholat Jumat', 'Kegiatan Sosial', 'Rapat', 'Lainnya'];
	const monthNames = [
		'Januari',
		'Februari',
		'Maret',
		'April',
		'Mei',
		'Juni',
		'Juli',
		'Agustus',
		'September',
		'Oktober',
		'November',
		'Desember'
	];

	// Filtered events
	const filteredEvents = $derived(() => {
		let result = data.events || [];
		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			result = result.filter(
				(e) => e.title.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q)
			);
		}
		if (selectedCategory) result = result.filter((e) => e.category === selectedCategory);
		if (selectedStatus) result = result.filter((e) => e.status === selectedStatus);
		return result;
	});

	// Calendar helpers
	const daysInMonth = $derived(new Date(currentYear, currentMonth + 1, 0).getDate());
	const firstDayOfMonth = $derived(new Date(currentYear, currentMonth, 1).getDay());
	const calendarDays = $derived(() => {
		const days: (number | null)[] = [];
		for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
		for (let i = 1; i <= daysInMonth; i++) days.push(i);
		return days;
	});

	function getEventsForDay(day: number) {
		const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		return (data.events || []).filter((e) => e.date.startsWith(dateStr));
	}

	function prevMonth() {
		if (currentMonth === 0) {
			currentMonth = 11;
			currentYear--;
		} else currentMonth--;
	}

	function nextMonth() {
		if (currentMonth === 11) {
			currentMonth = 0;
			currentYear++;
		} else currentMonth++;
	}

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('id-ID', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	function formatTime(time: string) {
		return time ? time.slice(0, 5) : '-';
	}

	function getStatusBadge(status: string) {
		const map: Record<string, string> = {
			upcoming: 'primary',
			ongoing: 'success',
			completed: 'ghost',
			cancelled: 'error'
		};
		return map[status] || 'ghost';
	}

	function getStatusLabel(status: string) {
		const map: Record<string, string> = {
			upcoming: 'Akan Datang',
			ongoing: 'Berlangsung',
			completed: 'Selesai',
			cancelled: 'Dibatalkan'
		};
		return map[status] || status;
	}

	function openAddModal() {
		isEditMode = false;
		selectedEvent = null;
		formTitle = '';
		formCategory = '';
		formDate = new Date().toISOString().split('T')[0];
		formTime = '';
		formEndTime = '';
		formLocation = '';
		formDescription = '';
		formCapacity = '';
		showFormModal = true;
	}

	function openEditModal(event: (typeof data.events)[0]) {
		isEditMode = true;
		selectedEvent = event;
		formTitle = event.title;
		formCategory = event.category;
		formDate = event.date.split('T')[0];
		formTime = event.time || '';
		formEndTime = event.endTime || '';
		formLocation = event.location || '';
		formDescription = event.description || '';
		formCapacity = event.capacity?.toString() || '';
		showFormModal = true;
	}

	function closeFormModal() {
		showFormModal = false;
		selectedEvent = null;
		isSubmitting = false;
	}

	function openDetail(event: (typeof data.events)[0]) {
		selectedEvent = event;
		showDetailModal = true;
	}

	function openDelete(event: (typeof data.events)[0]) {
		selectedEvent = event;
		showDeleteModal = true;
	}

	function handleFormSubmit() {
		return async ({ result, update }: any) => {
			isSubmitting = false;
			if (result.type === 'success') {
				toastSuccess(isEditMode ? 'Kegiatan berhasil diperbarui' : 'Kegiatan berhasil ditambahkan');
				closeFormModal();
				await update();
			} else if (result.type === 'failure') {
				toastError(result.data?.error || 'Gagal menyimpan');
			}
		};
	}

	function handleDelete() {
		return async ({ result, update }: any) => {
			showDeleteModal = false;
			selectedEvent = null;
			if (result.type === 'success') {
				toastSuccess('Kegiatan berhasil dihapus');
				await update();
			} else if (result.type === 'failure') {
				toastError(result.data?.error || 'Gagal menghapus');
			}
		};
	}

	function handleReminder() {
		toastSuccess('Reminder berhasil diset! Anda akan menerima notifikasi 1 jam sebelum acara.');
	}

	function openAbsensi(event: (typeof data.events)[0]) {
		selectedEvent = event;
		showAbsensiModal = true;
	}

	function updateAttendance(id: string, status: string) {
		attendanceList = attendanceList.map((p) => (p.id === id ? { ...p, status } : p));
	}

	function saveAttendance() {
		isSubmitting = true;
		setTimeout(() => {
			isSubmitting = false;
			showAbsensiModal = false;
			toastSuccess('Data absensi berhasil disimpan');
		}, 1000);
	}
</script>

<svelte:head>
	<title>Kegiatan | MiniMasjid</title>
</svelte:head>

<Toast />

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold">📅 Kegiatan</h1>
			<p class="text-base-content/60 mt-1">Kelola jadwal kegiatan masjid</p>
		</div>
		<div class="flex gap-2">
			<div class="join">
				<button
					class="join-item btn btn-sm"
					class:btn-active={viewMode === 'list'}
					onclick={() => (viewMode = 'list')}
				>
					📋 List
				</button>
				<button
					class="join-item btn btn-sm"
					class:btn-active={viewMode === 'calendar'}
					onclick={() => (viewMode = 'calendar')}
				>
					📅 Kalender
				</button>
			</div>
			<button class="btn btn-primary btn-sm" onclick={openAddModal}>
				<Plus class="w-4 h-4" />
				Tambah
			</button>
		</div>
	</div>

	<!-- Stats -->
	<div class="stats stats-vertical sm:stats-horizontal shadow w-full">
		<div class="stat">
			<div class="stat-title">Total Kegiatan</div>
			<div class="stat-value text-xl">{data.totalEvents || 0}</div>
			<div class="stat-desc">Bulan ini</div>
		</div>
		<div class="stat">
			<div class="stat-title">Akan Datang</div>
			<div class="stat-value text-primary text-xl">{data.upcomingCount || 0}</div>
			<div class="stat-desc">kegiatan</div>
		</div>
		<div class="stat">
			<div class="stat-title">Selesai</div>
			<div class="stat-value text-success text-xl">{data.completedCount || 0}</div>
			<div class="stat-desc">kegiatan</div>
		</div>
	</div>

	{#if viewMode === 'list'}
		<!-- Filters -->
		<div class="flex flex-wrap gap-3 items-center">
			<div class="flex-1 min-w-[200px]">
				<input
					type="text"
					placeholder="Cari kegiatan..."
					class="input input-bordered input-sm w-full"
					bind:value={searchQuery}
				/>
			</div>
			<select class="select select-bordered select-sm" bind:value={selectedCategory}>
				<option value="">Semua Kategori</option>
				{#each categories as cat}
					<option value={cat}>{cat}</option>
				{/each}
			</select>
			<select class="select select-bordered select-sm" bind:value={selectedStatus}>
				<option value="">Semua Status</option>
				<option value="upcoming">Akan Datang</option>
				<option value="ongoing">Berlangsung</option>
				<option value="completed">Selesai</option>
				<option value="cancelled">Dibatalkan</option>
			</select>
		</div>

		<!-- Events List -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each filteredEvents() as event (event.id)}
				<div class="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
					<div class="card-body p-4">
						<div class="flex justify-between items-start">
							<Badge variant={getStatusBadge(event.status) as any} size="sm">
								{getStatusLabel(event.status)}
							</Badge>
							<div class="dropdown dropdown-end">
								<button class="btn btn-ghost btn-xs btn-square">⋮</button>
								<ul class="dropdown-content menu bg-base-100 rounded-box shadow z-10 w-40 p-1">
									<li>
										<button onclick={() => openDetail(event)}><Eye class="w-4 h-4" /> Detail</button
										>
									</li>
									<li>
										<button onclick={() => openAbsensi(event)}
											><ClipboardCheck class="w-4 h-4" /> Absensi</button
										>
									</li>
									<li>
										<button onclick={() => openEditModal(event)}
											><SquarePen class="w-4 h-4" /> Edit</button
										>
									</li>
									<li>
										<button class="text-error" onclick={() => openDelete(event)}
											><Trash2 class="w-4 h-4" /> Hapus</button
										>
									</li>
								</ul>
							</div>
						</div>

						<h3 class="font-semibold mt-2">{event.title}</h3>
						<Badge variant="ghost" size="sm">{event.category}</Badge>

						<div class="mt-3 space-y-1 text-sm text-base-content/70">
							<div class="flex items-center gap-2">
								<Calendar class="w-4 h-4" />
								{formatDate(event.date)}
							</div>
							<div class="flex items-center gap-2">
								<Clock class="w-4 h-4" />
								{formatTime(event.time)} - {formatTime(event.endTime)}
							</div>
							{#if event.location}
								<div class="flex items-center gap-2">
									<MapPin class="w-4 h-4" />
									{event.location}
								</div>
							{/if}
							{#if event.capacity}
								<div class="flex items-center gap-2">
									<Users class="w-4 h-4" />
									{event.attendees || 0}/{event.capacity} peserta
								</div>
							{/if}
						</div>
					</div>
				</div>
			{:else}
				<div class="col-span-full text-center py-12 text-base-content/50">
					<p class="text-4xl mb-2">📭</p>
					<p>Tidak ada kegiatan ditemukan</p>
				</div>
			{/each}
		</div>
	{:else}
		<!-- Calendar View -->
		<div class="card bg-base-100 shadow-sm">
			<div class="card-body">
				<div class="flex justify-between items-center mb-4">
					<button class="btn btn-ghost btn-sm" onclick={prevMonth}>
						<ChevronLeft class="w-5 h-5" />
					</button>
					<h2 class="text-lg font-semibold">{monthNames[currentMonth]} {currentYear}</h2>
					<button class="btn btn-ghost btn-sm" onclick={nextMonth}>
						<ChevronRight class="w-5 h-5" />
					</button>
				</div>

				<div class="grid grid-cols-7 gap-1">
					{#each ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'] as day}
						<div class="text-center text-sm font-medium text-base-content/60 py-2">{day}</div>
					{/each}

					{#each calendarDays() as day}
						{@const dayEvents = day ? getEventsForDay(day) : []}
						<div
							class="min-h-20 border border-base-200 rounded-lg p-1 {day
								? 'hover:bg-base-200/50'
								: ''}"
						>
							{#if day}
								<div class="text-sm font-medium mb-1">{day}</div>
								<div class="space-y-1">
									{#each dayEvents.slice(0, 2) as event}
										<button
											class="w-full text-left text-xs p-1 rounded bg-primary/10 text-primary truncate"
											onclick={() => openDetail(event)}
										>
											{event.title}
										</button>
									{/each}
									{#if dayEvents.length > 2}
										<div class="text-xs text-base-content/50">+{dayEvents.length - 2} lainnya</div>
									{/if}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- Add/Edit Modal -->
{#if showFormModal}
	<dialog class="modal modal-open">
		<div class="modal-box max-w-lg">
			<button
				class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
				onclick={closeFormModal}
			>
				<X class="w-4 h-4" />
			</button>

			<h3 class="font-bold text-lg mb-4">
				{isEditMode ? '✏️ Edit Kegiatan' : '➕ Tambah Kegiatan'}
			</h3>

			<form
				method="POST"
				action={isEditMode ? '?/update' : '?/create'}
				use:enhance={() => {
					isSubmitting = true;
					return handleFormSubmit();
				}}
				class="space-y-4"
			>
				{#if isEditMode && selectedEvent}
					<input type="hidden" name="id" value={selectedEvent.id} />
				{/if}

				<div class="form-control">
					<label for="title" class="label"><span class="label-text">Judul Kegiatan *</span></label>
					<input
						type="text"
						name="title"
						class="input input-bordered w-full"
						placeholder="Contoh: Kajian Malam Jumat"
						value={formTitle}
						required
					/>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="form-control">
						<label for="category" class="label"><span class="label-text">Kategori *</span></label>
						<select name="category" class="select select-bordered w-full" required>
							<option value="" disabled selected={!formCategory}>Pilih</option>
							{#each categories as cat}
								<option value={cat} selected={formCategory === cat}>{cat}</option>
							{/each}
						</select>
					</div>
					<div class="form-control">
						<label for="date" class="label"><span class="label-text">Tanggal *</span></label>
						<input
							type="date"
							name="date"
							class="input input-bordered w-full"
							value={formDate}
							required
						/>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="form-control">
						<label for="time" class="label"><span class="label-text">Waktu Mulai *</span></label>
						<input
							type="time"
							name="time"
							class="input input-bordered w-full"
							value={formTime}
							required
						/>
					</div>
					<div class="form-control">
						<label for="endTime" class="label"><span class="label-text">Waktu Selesai</span></label>
						<input
							type="time"
							name="endTime"
							class="input input-bordered w-full"
							value={formEndTime}
						/>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="form-control">
						<label for="location" class="label"><span class="label-text">Lokasi</span></label>
						<input
							type="text"
							name="location"
							class="input input-bordered w-full"
							placeholder="Masjid Al-Ikhlas"
							value={formLocation}
						/>
					</div>
					<div class="form-control">
						<label for="capacity" class="label"><span class="label-text">Kapasitas</span></label>
						<input
							type="number"
							name="capacity"
							class="input input-bordered w-full"
							placeholder="100"
							value={formCapacity}
						/>
					</div>
				</div>

				<div class="form-control">
					<label for="description" class="label"><span class="label-text">Deskripsi</span></label>
					<textarea
						name="description"
						class="textarea textarea-bordered w-full"
						rows="3"
						placeholder="Deskripsi kegiatan..."
						value={formDescription}
					></textarea>
				</div>

				<div class="modal-action">
					<button type="button" class="btn btn-ghost" onclick={closeFormModal}>Batal</button>
					<button type="submit" class="btn btn-primary" disabled={isSubmitting}>
						{#if isSubmitting}<span class="loading loading-spinner loading-sm"></span>{:else}<Save
								class="w-4 h-4"
							/>{/if}
						Simpan
					</button>
				</div>
			</form>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button onclick={closeFormModal}>close</button>
		</form>
	</dialog>
{/if}

<!-- Detail Modal -->
{#if showDetailModal && selectedEvent}
	<dialog class="modal modal-open">
		<div class="modal-box">
			<button
				class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
				onclick={() => {
					showDetailModal = false;
					selectedEvent = null;
				}}
			>
				<X class="w-4 h-4" />
			</button>

			<div class="flex items-center gap-2 mb-4">
				<Badge variant={getStatusBadge(selectedEvent.status) as any}
					>{getStatusLabel(selectedEvent.status)}</Badge
				>
				<Badge variant="ghost">{selectedEvent.category}</Badge>
			</div>

			<h3 class="font-bold text-xl">{selectedEvent.title}</h3>

			<div class="mt-4 space-y-3">
				<div class="flex items-center gap-3">
					<Calendar class="w-5 h-5 text-base-content/50" />
					<span>{formatDate(selectedEvent.date)}</span>
				</div>
				<div class="flex items-center gap-3">
					<Clock class="w-5 h-5 text-base-content/50" />
					<span>{formatTime(selectedEvent.time)} - {formatTime(selectedEvent.endTime)}</span>
				</div>
				{#if selectedEvent.location}
					<div class="flex items-center gap-3">
						<MapPin class="w-5 h-5 text-base-content/50" />
						<span>{selectedEvent.location}</span>
					</div>
				{/if}
				{#if selectedEvent.capacity}
					<div class="flex items-center gap-3">
						<Users class="w-5 h-5 text-base-content/50" />
						<span>{selectedEvent.attendees || 0} / {selectedEvent.capacity} peserta</span>
					</div>
				{/if}
				{#if selectedEvent.description}
					<div class="mt-4 p-3 bg-base-200 rounded-lg">
						<p class="text-sm">{selectedEvent.description}</p>
					</div>
				{/if}
			</div>

			<div class="modal-action justify-between">
				<div class="flex gap-2">
					<button class="btn btn-ghost btn-sm" onclick={handleReminder}>
						<Bell class="w-4 h-4" /> Reminder
					</button>
					<button
						class="btn btn-ghost btn-sm"
						onclick={() => {
							showDetailModal = false;
							openAbsensi(selectedEvent!);
						}}
					>
						<ClipboardCheck class="w-4 h-4" /> Absensi
					</button>
				</div>
				<div class="flex gap-2">
					<button
						class="btn btn-primary btn-sm"
						onclick={() => {
							showDetailModal = false;
							openEditModal(selectedEvent!);
						}}
					>
						<SquarePen class="w-4 h-4" /> Edit
					</button>
					<button
						class="btn btn-ghost btn-sm"
						onclick={() => {
							showDetailModal = false;
							selectedEvent = null;
						}}>Tutup</button
					>
				</div>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button
				onclick={() => {
					showDetailModal = false;
					selectedEvent = null;
				}}>close</button
			>
		</form>
	</dialog>
{/if}

<!-- Delete Modal -->
{#if showDeleteModal && selectedEvent}
	<dialog class="modal modal-open">
		<div class="modal-box">
			<h3 class="font-bold text-lg text-error">⚠️ Hapus Kegiatan</h3>
			<p class="py-4">Apakah Anda yakin ingin menghapus kegiatan ini?</p>
			<div class="bg-base-200 rounded-lg p-4 mb-4">
				<p class="font-medium">{selectedEvent.title}</p>
				<p class="text-sm text-base-content/60">{formatDate(selectedEvent.date)}</p>
			</div>
			<div class="modal-action">
				<button
					class="btn btn-ghost"
					onclick={() => {
						showDeleteModal = false;
						selectedEvent = null;
					}}>Batal</button
				>
				<form method="POST" action="?/delete" use:enhance={() => handleDelete()}>
					<input type="hidden" name="id" value={selectedEvent.id} />
					<button type="submit" class="btn btn-error"><Trash2 class="w-4 h-4" /> Hapus</button>
				</form>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button
				onclick={() => {
					showDeleteModal = false;
					selectedEvent = null;
				}}>close</button
			>
		</form>
	</dialog>
{/if}

<!-- Absensi Modal -->
{#if showAbsensiModal && selectedEvent}
	<dialog class="modal modal-open">
		<div class="modal-box">
			<button
				class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
				onclick={() => {
					showAbsensiModal = false;
					selectedEvent = null;
				}}
			>
				<X class="w-4 h-4" />
			</button>

			<h3 class="font-bold text-lg mb-4">📝 Absensi Kegiatan</h3>
			<div class="bg-base-200 rounded-lg p-3 mb-4">
				<p class="font-medium">{selectedEvent.title}</p>
				<p class="text-sm text-base-content/60">{formatDate(selectedEvent.date)}</p>
			</div>

			<div class="space-y-2 max-h-[300px] overflow-y-auto">
				{#each attendanceList as participant (participant.id)}
					<div
						class="flex items-center justify-between p-2 hover:bg-base-200 rounded-lg border border-base-200"
					>
						<div class="flex items-center gap-3">
							<div class="avatar placeholder">
								<div class="bg-neutral text-neutral-content rounded-full w-8">
									<span class="text-xs">{participant.name.charAt(0)}</span>
								</div>
							</div>
							<span class="font-medium text-sm">{participant.name}</span>
						</div>
						<div class="join">
							<button
								class="join-item btn btn-xs {participant.status === 'present'
									? 'btn-success'
									: 'btn-ghost'}"
								onclick={() => updateAttendance(participant.id, 'present')}
								title="Hadir"
							>
								<CheckCircle2 class="w-4 h-4" />
							</button>
							<button
								class="join-item btn btn-xs {participant.status === 'permission'
									? 'btn-warning'
									: 'btn-ghost'}"
								onclick={() => updateAttendance(participant.id, 'permission')}
								title="Izin"
							>
								<MinusCircle class="w-4 h-4" />
							</button>
							<button
								class="join-item btn btn-xs {participant.status === 'absent'
									? 'btn-error'
									: 'btn-ghost'}"
								onclick={() => updateAttendance(participant.id, 'absent')}
								title="Alpha"
							>
								<XCircle class="w-4 h-4" />
							</button>
						</div>
					</div>
				{/each}
			</div>

			<div class="modal-action">
				<button
					class="btn btn-ghost"
					onclick={() => {
						showAbsensiModal = false;
						selectedEvent = null;
					}}>Batal</button
				>
				<button class="btn btn-primary" onclick={saveAttendance} disabled={isSubmitting}>
					{#if isSubmitting}<span class="loading loading-spinner loading-sm"></span>{:else}<Save
							class="w-4 h-4"
						/>{/if}
					Simpan Absensi
				</button>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button
				onclick={() => {
					showAbsensiModal = false;
					selectedEvent = null;
				}}>close</button
			>
		</form>
	</dialog>
{/if}
