<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import ModalContainer from '$lib/components/modal/ModalContainer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

<!-- 모달 컨테이너 -->
<ModalContainer />
