<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';

	interface Option {
		value: string;
		label: string;
		disabled?: boolean;
	}

	interface Props extends HTMLSelectAttributes {
		label?: string;
		error?: string;
		hint?: string;
		options: Option[];
		placeholder?: string;
		value?: string;
	}

	let {
		label,
		error,
		hint,
		options,
		placeholder = 'Pilih...',
		value = $bindable(''),
		class: className = '',
		...restProps
	}: Props = $props();
</script>

<div class="form-control w-full">
	{#if label}
		<label for={label} class="label">
			<span class="label-text">{label}</span>
		</label>
	{/if}

	<select
		bind:value
		class="select select-bordered w-full {error ? 'select-error' : ''} {className}"
		{...restProps}
	>
		{#if placeholder}
			<option value="" disabled>{placeholder}</option>
		{/if}
		{#each options as option}
			<option value={option.value} disabled={option.disabled}>
				{option.label}
			</option>
		{/each}
	</select>

	{#if error}
		<label for={label} class="label">
			<span class="label-text-alt text-error">{error}</span>
		</label>
	{:else if hint}
		<label for={label} class="label">
			<span class="label-text-alt text-base-content/60">{hint}</span>
		</label>
	{/if}
</div>
