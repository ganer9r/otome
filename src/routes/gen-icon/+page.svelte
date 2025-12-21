<script lang="ts">
	let name = $state('');
	let prompt = $state('');
	let loading = $state(false);
	let result = $state<{ success: boolean; path?: string; error?: string } | null>(null);
	let icons = $state<{ name: string; path: string }[]>([]);

	// 기존 아이콘 목록 로드
	async function loadIcons() {
		const res = await fetch('/api/gen-icon');
		const data = await res.json();
		icons = data.icons;
	}

	// 아이콘 생성
	async function generate() {
		if (!name.trim() || !prompt.trim()) return;

		loading = true;
		result = null;

		try {
			const res = await fetch('/api/gen-icon', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: name.trim(), prompt: prompt.trim() })
			});

			const data = await res.json();

			if (res.ok) {
				result = { success: true, path: data.path + '?t=' + Date.now() };
				await loadIcons();
			} else {
				result = { success: false, error: data.message || 'Generation failed' };
			}
		} catch (e) {
			result = { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
		} finally {
			loading = false;
		}
	}

	// 프리셋
	const presets = [
		{
			name: 'coin',
			prompt: 'single gold coin with shiny metallic surface and simple embossed design'
		},
		{ name: 'coin_stack', prompt: 'stack of three gold coins slightly offset' },
		{ name: 'money_bag', prompt: 'brown money bag tied with rope with gold coins visible' },
		{ name: 'heart', prompt: 'red heart icon with cute rounded shape' },
		{ name: 'timer', prompt: 'simple analog clock or timer icon' },
		{ name: 'fire', prompt: 'cute orange flame icon' }
	];

	function applyPreset(preset: { name: string; prompt: string }) {
		name = preset.name;
		prompt = preset.prompt;
	}

	$effect(() => {
		loadIcons();
	});
</script>

<div class="container">
	<h1>Icon Generator</h1>

	<!-- 프리셋 -->
	<section class="presets">
		<h2>Presets</h2>
		<div class="preset-grid">
			{#each presets as preset}
				<button class="preset-btn" onclick={() => applyPreset(preset)}>
					{preset.name}
				</button>
			{/each}
		</div>
	</section>

	<!-- 입력 폼 -->
	<section class="form">
		<div class="field">
			<label for="name">Name (파일명)</label>
			<input id="name" type="text" bind:value={name} placeholder="coin" />
		</div>

		<div class="field">
			<label for="prompt">Prompt</label>
			<textarea
				id="prompt"
				bind:value={prompt}
				rows="3"
				placeholder="single gold coin with shiny metallic surface"
			></textarea>
		</div>

		<button
			class="generate-btn"
			onclick={generate}
			disabled={loading || !name.trim() || !prompt.trim()}
		>
			{loading ? 'Generating...' : 'Generate'}
		</button>
	</section>

	<!-- 결과 -->
	{#if result}
		<section class="result">
			{#if result.success && result.path}
				<div class="success">
					<img src={result.path} alt="Generated icon" />
					<p>{result.path}</p>
				</div>
			{:else}
				<div class="error">
					{result.error}
				</div>
			{/if}
		</section>
	{/if}

	<!-- 기존 아이콘 목록 -->
	<section class="existing">
		<h2>Existing Icons ({icons.length})</h2>
		<div class="icon-grid">
			{#each icons as icon}
				<div class="icon-item">
					<img src={icon.path} alt={icon.name} />
					<span>{icon.name}</span>
				</div>
			{/each}
		</div>
	</section>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.container {
		@apply mx-auto max-w-4xl p-6;
		@apply min-h-screen;
		background: #f5f5f5;
	}

	h1 {
		@apply mb-6 text-3xl font-bold;
		color: #333;
	}

	h2 {
		@apply mb-3 text-xl font-semibold;
		color: #555;
	}

	section {
		@apply mb-8 rounded-lg p-4;
		background: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	/* 프리셋 */
	.preset-grid {
		@apply flex flex-wrap gap-2;
	}

	.preset-btn {
		@apply rounded-lg px-3 py-1.5 text-sm font-medium;
		background: #e0e0e0;
		border: none;
		cursor: pointer;
		transition: background 0.2s;
	}

	.preset-btn:hover {
		background: #d0d0d0;
	}

	/* 폼 */
	.field {
		@apply mb-4;
	}

	.field label {
		@apply mb-1 block text-sm font-medium;
		color: #666;
	}

	.field input,
	.field textarea {
		@apply w-full rounded-lg border p-3 text-base;
		border-color: #ddd;
	}

	.field input:focus,
	.field textarea:focus {
		outline: none;
		border-color: #f59e0b;
	}

	.generate-btn {
		@apply w-full rounded-lg py-3 text-lg font-bold text-white;
		background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
		border: none;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.generate-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* 결과 */
	.result .success {
		@apply flex flex-col items-center gap-2;
	}

	.result .success img {
		width: 128px;
		height: 128px;
		object-fit: contain;
		border: 1px solid #ddd;
		border-radius: 8px;
	}

	.result .success p {
		@apply text-sm;
		color: #666;
	}

	.result .error {
		@apply rounded-lg p-3 text-center;
		background: #fee2e2;
		color: #dc2626;
	}

	/* 기존 아이콘 */
	.icon-grid {
		@apply grid gap-3;
		grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
	}

	.icon-item {
		@apply flex flex-col items-center gap-1 rounded-lg p-2;
		background: #f9f9f9;
	}

	.icon-item img {
		width: 48px;
		height: 48px;
		object-fit: contain;
	}

	.icon-item span {
		@apply w-full truncate text-center text-xs;
		color: #666;
	}
</style>
