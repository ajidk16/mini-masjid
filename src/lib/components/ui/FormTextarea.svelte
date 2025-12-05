<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	interface Props extends HTMLTextareaAttributes {
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

	<textarea
		bind:value
		class="textarea textarea-bordered w-full {error ? 'textarea-error' : ''} {className}"
		{...restProps}
	></textarea>

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
