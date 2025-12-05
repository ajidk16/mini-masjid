<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		label?: string;
		error?: string;
		hint?: string;
		value?: string;
	}

	let {
		label,
		error,
		hint,
		value = $bindable(''),
		type = 'text',
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

	<input
		{type}
		bind:value
		class="input input-bordered w-full {error ? 'input-error' : ''} {className}"
		{...restProps}
	/>

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
