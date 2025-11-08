<!--
  모달 컨테이너 컴포넌트
  - 여러 모달을 동시에 관리 및 표시
  - 페이지 레이아웃에 포함되어 앱 전체에서 접근 가능
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { modals, modalStore } from '$lib/stores/modal';

	// 최신 모달 계산
	const latestModal = $derived($modals.length > 0 ? $modals[$modals.length - 1] : null);

	function closeModal(id: string) {
		modalStore.close(id, false);
	}

	// 마운트 시 body에 클래스 추가, 언마운트 시 제거
	onMount(() => {
		const updateBodyClass = () => {
			if ($modals.length > 0) {
				document.body.classList.add('modal-open');
			} else {
				document.body.classList.remove('modal-open');
			}
		};

		// 스토어 구독 및 초기 설정
		const unsubscribe = modals.subscribe(updateBodyClass);

		// 컴포넌트 언마운트 시 구독 해제
		return () => {
			unsubscribe();
			document.body.classList.remove('modal-open');
		};
	});
</script>

<!-- 모달 렌더링 영역 -->
{#if latestModal}
	<!-- DaisyUI modal 패턴 -->
	<div class="modal modal-open">
		<div class="modal-box relative">
			<!-- Close 버튼 -->
			{#if !latestModal.config.hideClose}
				<button
					class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
					aria-label="닫기"
					onclick={() => closeModal(latestModal.id)}
				>
					✕
				</button>
			{/if}

			<!-- 모달 컴포넌트 렌더링 -->
			{#if latestModal.component}
				<latestModal.component {...latestModal.props} />
			{/if}
		</div>
		<!-- 배경 오버레이 -->
		<form method="dialog" class="modal-backdrop">
			<button onclick={() => closeModal(latestModal.id)}>close</button>
		</form>
	</div>
{/if}
