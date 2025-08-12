/** @jest-environment jsdom */
'use strict';
const path = require('path');

describe('run_prettify.js 第5段解析（真实文件）ReDoS 检测', () => {
  const LENGTH = 100_000;
  const THRESHOLD = 2000;
  const MOD_PATH = path.join(__dirname, '..', 'st', 'prettify', 'run_prettify.js');

  jest.setTimeout(THRESHOLD * 10);

  function runWithQuery(query) {
    document.documentElement.innerHTML = '<head></head><body></body>';
    const s = document.createElement('script');
    s.src = 'http://example.com/assets/run_prettify.js?' + query;
    document.head.appendChild(s);
    delete require.cache[require.resolve(MOD_PATH)];
    const t0 = Date.now();
    require(MOD_PATH);
    return Date.now() - t0;
  }

  test(`坏串("?".repeat(${LENGTH}) + "=") 必须 < ${THRESHOLD}ms`, () => {
    const bad = '?'.repeat(LENGTH) + '=';
    const dt = runWithQuery(bad);
    console.log('[BAD] %dms', dt);
    expect(dt).toBeLessThan(THRESHOLD);
  });
});


//npx jest --version
//npm i -D jest-environment-jsdom@<version>
//npx jest tests/prettify-redos.test.js --runInBand
