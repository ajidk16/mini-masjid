<script lang="ts">
	import {
		Body,
		Container,
		Head,
		Heading,
		Html,
		Img,
		Preview,
		Section,
		Text,
		Hr,
		Link
	} from 'svelte-email';

	interface Props {
		otp?: string;
		appName?: string;
	}

	let { otp = '123456', appName = 'Yaa Qeen' }: Props = $props();

	const main = {
		backgroundColor: '#f6f9fc',
		fontFamily:
			'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif'
	};

	const container = {
		backgroundColor: '#ffffff',
		margin: '0 auto',
		padding: '24px',
		marginBottom: '64px',
		borderRadius: '12px',
		boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
	};

	const box = {
		padding: '0 48px'
	};

	const hr = {
		borderColor: '#e6ebf1',
		margin: '20px 0'
	};

	const paragraph = {
		color: '#525f7f',
		fontSize: '16px',
		lineHeight: '24px',
		textAlign: 'left' as const
	};

	const anchor = {
		color: '#10B981', // Primary color
		textDecoration: 'none'
	};

	const codeBox = {
		background: '#f4f4f5',
		
		
		textAlign: 'center' as const
	};

	const codeStyle = {
		color: '#18181b',
        background: '#f4f4f5',
        padding: '16px',
        borderRadius: '8px',
        textAlign: 'center',
		fontSize: '32px',
		fontWeight: '700',
		letterSpacing: '8px',
		fontFamily: 'monospace',
	};
	
	const footer = {
		color: '#8898aa',
		fontSize: '12px',
		lineHeight: '16px',
		marginTop: '24px',
		textAlign: 'center' as const
	};
</script>

<Html>
	<Head />
	<Preview preview={`Kode verifikasi masuk ${appName} Anda`}/>
	<Body style={main}>
		<Container style={container}>
			<Section style={box}>
				<Heading as="h2" style={{ color: '#10B981', margin: '0', textAlign: 'center' }}>{appName}</Heading>

				
				<Hr style={hr} />

				<Heading as="h2" style={{ color: '#1f2937', textAlign: 'left', margin: '0 0 16px' }}>
					Kode Verifikasi
				</Heading>
				
				<Text style={paragraph}>
					Assalamualaikum,
				</Text>
				
				<Text style={paragraph}>
					Gunakan kode berikut untuk menyelesaikan proses masuk Anda ke {appName}. Kode ini hanya berlaku selama <strong>5 menit</strong>.
				</Text>

				<Section>
					<Text style={codeStyle}>{otp}</Text>
				</Section>

				<Text style={paragraph}>
					Jika Anda tidak meminta kode ini, mohon abaikan email ini. Akun Anda tetap aman.
				</Text>
				
				<Hr style={hr} />
				
				<Text style={footer}>
					&copy; {new Date().getFullYear()} {appName}. All rights reserved.
					<br />
					<Link href="#" style={anchor}>Privacy Policy</Link> • <Link href="#" style={anchor}>Terms of Service</Link>
				</Text>
			</Section>
		</Container>
	</Body>
</Html>
