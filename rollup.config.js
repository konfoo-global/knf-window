import merge from 'deepmerge';
import { createBasicConfig } from '@open-wc/building-rollup';

const baseConfig = createBasicConfig({
	// set to true to inject the service worker registration into your index.html
	injectServiceWorker: false,

	outputDir: 'dist',

	// if you need to support older browsers, such as IE11, set the legacyBuild
	// option to generate an additional build just for this browser
	// legacyBuild: true,

	// development mode creates a non-minified build for debugging or development
	developmentMode: process.env.ROLLUP_WATCH === 'true',
});

export default merge(baseConfig, {
	// if you use createSpaConfig, you can use your index.html as entrypoint,
	// any <script type="module"> inside will be bundled by rollup
	// input: './index.html',

	// alternatively, you can use your JS as entrypoint for rollup and
	// optionally set an HTML template manually
	input: './knf-window.js',
});
