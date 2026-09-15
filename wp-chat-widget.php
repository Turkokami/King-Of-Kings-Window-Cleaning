<?php
/**
 * King of Kings — LeadConnector chat widget (WPCode snippet)
 *
 * Location:  WPCode → Add Snippet → Add Your Custom Code → PHP Snippet
 * Insertion: Auto Insert → Site Wide Footer
 * Title:     LeadConnector chat widget (deferred)
 *
 * WHY NOT THE RAW SNIPPET. Pasting the tag as supplied loads a third-party
 * loader on every page before the page has finished painting, which on an
 * Elementor site already carrying 486KB of builder CSS is the difference
 * between a slow page and an unusable one on mobile. This does the same job,
 * after paint, on first interaction — and it excludes the pages where a
 * floating launcher competes with the form.
 *
 * Requested by Cassidy Alber 2026-09-14, ownership confirmed 2026-09-15.
 */
add_action( 'wp_footer', function () {

	// Not on the pages with their own primary action.
	if ( is_page( array( 'contact', 'our-guarantee', 'privacy', 'privacy-policy' ) ) ) {
		return;
	}
	// Never in the editor or on admin screens.
	if ( is_admin() || isset( $_GET['elementor-preview'] ) ) {
		return;
	}
	?>
	<script>
	(function () {
		var loaded = false;
		var events = ['pointerdown', 'keydown', 'touchstart', 'scroll'];
		function load() {
			if (loaded) { return; }
			loaded = true;
			var s = document.createElement('script');
			s.src = 'https://widgets.leadconnectorhq.com/loader.js';
			s.async = true;
			s.setAttribute('data-resources-url', 'https://widgets.leadconnectorhq.com/chat-widget/loader.js');
			s.setAttribute('data-widget-id', '6aa1b2bc95d905edcbb303f4');
			document.body.appendChild(s);
			events.forEach(function (e) { window.removeEventListener(e, load); });
		}
		events.forEach(function (e) {
			window.addEventListener(e, load, { passive: true, once: true });
		});
		if ('requestIdleCallback' in window) {
			requestIdleCallback(load, { timeout: 8000 });
		} else {
			setTimeout(load, 6000);
		}
	})();
	</script>
	<style>
	/* The launcher defaults to bottom-right, where the click-to-call bar sits. */
	@media (max-width: 719px) {
		#lc_text-widget, .lc_text-widget, [id^="lc_"], [class*="leadconnector"] {
			bottom: 72px !important;
		}
	}
	</style>
	<?php
} );
