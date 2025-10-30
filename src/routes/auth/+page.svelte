<script lang="ts">
	import { goto } from '$app/navigation';
	import { AuthApi } from '$lib/domain/auth/api.client';

	const authApi = new AuthApi(fetch);

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleLogin(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';

		try {
			const result = await authApi.login(email, password);

			if (result.success && result.redirectTo) {
				goto(result.redirectTo);
			} else {
				error = result.message || '로그인에 실패했습니다.';
			}
		} catch (err) {
			error = err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.';
			console.error(err);
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50">
	<div class="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
		<div>
			<h2 class="text-center text-3xl font-bold text-gray-900">로그인</h2>
			<p class="mt-2 text-center text-sm text-gray-600">Otome에 오신 것을 환영합니다</p>
		</div>

		<form onsubmit={handleLogin} class="mt-8 space-y-6">
			{#if error}
				<div class="rounded-md bg-red-50 p-4">
					<p class="text-sm text-red-800">{error}</p>
				</div>
			{/if}

			<div class="space-y-4">
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700"> 이메일 </label>
					<input
						id="email"
						name="email"
						type="email"
						required
						bind:value={email}
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
						placeholder="email@example.com"
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700"> 비밀번호 </label>
					<input
						id="password"
						name="password"
						type="password"
						required
						bind:value={password}
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
						placeholder="••••••••"
					/>
				</div>
			</div>

			<div>
				<button
					type="submit"
					disabled={loading}
					class="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
				>
					{loading ? '로그인 중...' : '로그인'}
				</button>
			</div>
		</form>

		<div class="text-center">
			<p class="text-sm text-gray-600">
				계정이 없으신가요?
				<a href="/auth/signup" class="font-medium text-blue-600 hover:text-blue-500">
					회원가입
				</a>
			</p>
		</div>
	</div>
</div>
