import type { PageServerLoad } from './$types';

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

export const load: PageServerLoad = async ({ params }) => {
	const [year, month] = params.bulan.split('-').map(Number);
	const monthName = monthNames[month - 1] || 'Unknown';

	// Mock data - replace with database queries
	const daysInMonth = new Date(year, month, 0).getDate();
	const dailyLabels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
	const dailyIncome = Array.from({ length: daysInMonth }, () => Math.random() * 500000);
	const dailyExpense = Array.from({ length: daysInMonth }, () => Math.random() * 300000);

	const transactions = [
		{
			date: `${year}-${String(month).padStart(2, '0')}-01`,
			description: 'Infaq Jumat Minggu I',
			category: 'Infaq',
			type: 'income',
			amount: 2500000
		},
		{
			date: `${year}-${String(month).padStart(2, '0')}-02`,
			description: 'Pembayaran Listrik',
			category: 'Operasional',
			type: 'expense',
			amount: 850000
		},
		{
			date: `${year}-${String(month).padStart(2, '0')}-05`,
			description: 'Zakat Fitrah',
			category: 'Zakat',
			type: 'income',
			amount: 500000
		},
		{
			date: `${year}-${String(month).padStart(2, '0')}-08`,
			description: 'Infaq Jumat Minggu II',
			category: 'Infaq',
			type: 'income',
			amount: 2800000
		},
		{
			date: `${year}-${String(month).padStart(2, '0')}-10`,
			description: 'Gaji Marbot',
			category: 'Gaji',
			type: 'expense',
			amount: 2000000
		},
		{
			date: `${year}-${String(month).padStart(2, '0')}-12`,
			description: 'Sadaqah Hamba Allah',
			category: 'Sadaqah',
			type: 'income',
			amount: 1000000
		},
		{
			date: `${year}-${String(month).padStart(2, '0')}-15`,
			description: 'Infaq Jumat Minggu III',
			category: 'Infaq',
			type: 'income',
			amount: 2600000
		},
		{
			date: `${year}-${String(month).padStart(2, '0')}-18`,
			description: 'Pembayaran Air PDAM',
			category: 'Operasional',
			type: 'expense',
			amount: 350000
		},
		{
			date: `${year}-${String(month).padStart(2, '0')}-22`,
			description: 'Infaq Jumat Minggu IV',
			category: 'Infaq',
			type: 'income',
			amount: 2700000
		},
		{
			date: `${year}-${String(month).padStart(2, '0')}-25`,
			description: 'Pembelian Sajadah',
			category: 'Proyek',
			type: 'expense',
			amount: 1500000
		}
	];

	const incomeCategories = [
		{ name: 'Infaq', amount: 10600000, percentage: 75 },
		{ name: 'Zakat', amount: 500000, percentage: 4 },
		{ name: 'Sadaqah', amount: 1000000, percentage: 7 },
		{ name: 'Wakaf', amount: 2000000, percentage: 14 }
	];

	const expenseCategories = [
		{ name: 'Operasional', amount: 1200000, percentage: 26 },
		{ name: 'Gaji', amount: 2000000, percentage: 43 },
		{ name: 'Proyek', amount: 1500000, percentage: 31 }
	];

	return {
		year,
		month,
		monthName,
		dailyLabels,
		dailyIncome,
		dailyExpense,
		transactions,
		incomeCategories,
		expenseCategories
	};
};
