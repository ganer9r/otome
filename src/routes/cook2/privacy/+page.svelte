<script lang="ts">
	const appName = '흑백의 쉐프';
	const contactEmail = 'hyunbolt@gmail.com';
	const lastUpdated = '2024년 12월 7일';
</script>

<svelte:head>
	<title>개인정보처리방침 - {appName}</title>
</svelte:head>

<div class="privacy-container">
	<h1>개인정보처리방침</h1>
	<p class="updated">최종 수정일: {lastUpdated}</p>

	<section>
		<h2>1. 수집하는 개인정보</h2>
		<p>
			{appName}(이하 "앱")은 서비스 제공을 위해 최소한의 정보만을 수집합니다.
		</p>
		<ul>
			<li>
				<strong>자동 수집 정보:</strong> 기기 정보(기기 모델, OS 버전), 앱 사용 통계, 오류 로그
			</li>
			<li><strong>광고 관련:</strong> 광고 ID (Google Advertising ID)</li>
		</ul>
		<p>본 앱은 이름, 이메일, 전화번호 등 개인을 직접 식별할 수 있는 정보를 수집하지 않습니다.</p>
	</section>

	<section>
		<h2>2. 개인정보의 이용 목적</h2>
		<p>수집된 정보는 다음 목적으로만 사용됩니다:</p>
		<ul>
			<li>앱 서비스 제공 및 개선</li>
			<li>앱 오류 분석 및 안정성 향상</li>
			<li>맞춤형 광고 제공</li>
		</ul>
	</section>

	<section>
		<h2>3. 제3자 서비스</h2>
		<p>본 앱은 다음 제3자 서비스를 사용합니다:</p>
		<ul>
			<li>
				<strong>Google Firebase:</strong> 앱 분석(Analytics) 및 오류 보고(Crashlytics)
				<br />
				<a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener">
					Firebase 개인정보처리방침
				</a>
			</li>
			<li>
				<strong>Google AdMob:</strong> 광고 제공
				<br />
				<a href="https://policies.google.com/privacy" target="_blank" rel="noopener">
					Google 개인정보처리방침
				</a>
			</li>
		</ul>
	</section>

	<section>
		<h2>4. 개인정보의 보관 및 삭제</h2>
		<p>
			수집된 정보는 서비스 제공 기간 동안 보관되며, 사용자가 앱을 삭제하면 기기에 저장된 데이터는
			자동으로 삭제됩니다. 제3자 서비스에 수집된 데이터는 해당 서비스의 정책에 따라 처리됩니다.
		</p>
	</section>

	<section>
		<h2>5. 아동의 개인정보</h2>
		<p>
			본 앱은 만 14세 미만 아동의 개인정보를 의도적으로 수집하지 않습니다. 만약 아동의 정보가 수집된
			것을 발견하면 즉시 삭제 조치하겠습니다.
		</p>
	</section>

	<section>
		<h2>6. 개인정보처리방침의 변경</h2>
		<p>
			본 방침은 법령 변경이나 서비스 변경에 따라 수정될 수 있으며, 변경 시 앱 내 공지 또는 본
			페이지를 통해 안내합니다.
		</p>
	</section>

	<section>
		<h2>7. 문의</h2>
		<p>개인정보 관련 문의사항은 아래로 연락해 주세요:</p>
		<p><a href="mailto:{contactEmail}">{contactEmail}</a></p>
	</section>
</div>

<style lang="postcss">
	.privacy-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		line-height: 1.6;
		color: #333;
	}

	h1 {
		font-size: 1.75rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	.updated {
		color: #666;
		font-size: 0.875rem;
		margin-bottom: 2rem;
	}

	section {
		margin-bottom: 2rem;
	}

	h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		color: #222;
	}

	p {
		margin-bottom: 0.75rem;
	}

	ul {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
	}

	li {
		margin-bottom: 0.5rem;
	}

	a {
		color: #2563eb;
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}
</style>
