<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { ApexOptions } from 'apexcharts';

	interface Props {
		type: 'line' | 'area' | 'bar' | 'donut' | 'pie' | 'radialBar';
		series: ApexAxisChartSeries | ApexNonAxisChartSeries;
		options?: ApexOptions;
		height?: number | string;
		class?: string;
	}

	let { type, series, options = {}, height = 350, class: className = '' }: Props = $props();

	let chartElement: HTMLDivElement;
	let chartInstance: ApexCharts | null = null;
	let isLoading = $state(true);

	// Merge default options with provided options
	const getDefaultOptions = (): ApexOptions => ({
		chart: {
			type,
			height,
			fontFamily: 'inherit',
			toolbar: { show: false },
			background: 'transparent',
			animations: {
				enabled: true,
				speed: 500
			}
		},
		theme: {
			mode: 'light'
		},
		stroke: {
			curve: 'smooth',
			width: 2
		},
		grid: {
			borderColor: 'oklch(0.7 0 0 / 0.2)',
			strokeDashArray: 4
		},
		legend: {
			position: 'bottom',
			horizontalAlign: 'center'
		},
		responsive: [
			{
				breakpoint: 640,
				options: {
					chart: { height: 280 },
					legend: { position: 'bottom' }
				}
			}
		]
	});

	onMount(async () => {
		// Dynamic import for code splitting
		const ApexCharts = (await import('apexcharts')).default;

		// Detect dark mode
		const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
		const defaultOpts = getDefaultOptions();
		const mergedOptions: ApexOptions = {
			...defaultOpts,
			...options,
			chart: {
				...defaultOpts.chart,
				...options.chart
			},
			theme: {
				mode: isDark ? 'dark' : 'light'
			},
			series
		};

		chartInstance = new ApexCharts(chartElement, mergedOptions);
		await chartInstance.render();
		isLoading = false;

		// Listen for theme changes
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.attributeName === 'data-theme') {
					const newTheme = document.documentElement.getAttribute('data-theme');
					chartInstance?.updateOptions({
						theme: { mode: newTheme === 'dark' ? 'dark' : 'light' }
					});
				}
			});
		});

		observer.observe(document.documentElement, { attributes: true });
	});

	onDestroy(() => {
		chartInstance?.destroy();
	});

	// Update chart when series changes
	onMount(() => {
		if (chartInstance && series) {
			chartInstance.updateSeries(series);
		}
	});
</script>

<div class="relative {className}">
	{#if isLoading}
		<div class="flex items-center justify-center" style="height: {height}px">
			<span class="loading loading-spinner loading-lg text-primary"></span>
		</div>
	{/if}
	<div
		bind:this={chartElement}
		class:opacity-0={isLoading}
		class="transition-opacity duration-300"
	></div>
</div>
