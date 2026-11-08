import { spawn } from 'child_process';

const chromeProcess = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9229',
  '--disable-gpu',
  '--user-data-dir=C:\\Users\\ahmed\\AppData\\Local\\Temp\\chrome-st-profile',
  'about:blank',
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9229/json');
    const list = await res.json();
    const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 1;
    const send = (method, params = {}) =>
      new Promise((resolve) => {
        const mid = id++;
        const handler = (e) => {
          const d = JSON.parse(e.data);
          if (d.id === mid) {
            ws.removeEventListener('message', handler);
            resolve(d.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: mid, method, params }));
      });

    ws.onopen = async () => {
      await send('Page.enable');
      await send('Runtime.enable');
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1600,
        height: 1200,
        deviceScaleFactor: 1,
        mobile: false,
      });

      await send('Page.navigate', { url: 'http://127.0.0.1:5173' });
      await new Promise((r) => setTimeout(r, 2000));

      const triggersReport = await send('Runtime.evaluate', {
        expression: `(() => {
          // ScrollTrigger plugin might be in gsap context or window
          // Let's inspect ScrollTrigger.getAll()
          // Or inspect the elements and their inline styles
          const allTriggers = window.ScrollTrigger ? window.ScrollTrigger.getAll().map(st => {
            return {
              trigger: st.trigger ? (st.trigger.id || st.trigger.className) : null,
              start: st.start,
              end: st.end,
              scrollerTop: window.scrollY,
              progress: st.progress,
              isActive: st.isActive
            };
          }) : 'No window.ScrollTrigger';

          // Also check all elements with opacity: 0
          const allOpacityZero = Array.from(document.querySelectorAll('*')).filter(el => {
            const cs = window.getComputedStyle(el);
            return cs.opacity === '0' && cs.display !== 'none' && el.offsetHeight > 0;
          }).map(el => ({
            tag: el.tagName,
            id: el.id,
            className: el.className,
            parent: el.parentElement ? el.parentElement.className : null,
            rect: el.getBoundingClientRect(),
            inlineStyle: el.style.cssText
          }));

          return {
            allTriggers,
            allOpacityZeroCount: allOpacityZero.length,
            allOpacityZero
          };
        })()`,
        returnByValue: true,
      });

      console.log('Triggers & Opacity 0 Elements:', JSON.stringify(triggersReport.result.value, null, 2));

      // Now scroll to 7000 (around WhyUs) and check if whyUs animated
      console.log('\n--- Scrolling to WhyUs section ---');
      await send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.getElementById('why-us');
          if (el) el.scrollIntoView();
        })()`
      });
      await new Promise(r => setTimeout(r, 600));

      const afterScrollWhyUs = await send('Runtime.evaluate', {
        expression: `(() => {
          const rows = Array.from(document.querySelectorAll('.manifesto-row-item'));
          return {
            scrollY: window.scrollY,
            rows: rows.map(r => ({
              top: r.getBoundingClientRect().top,
              opacity: window.getComputedStyle(r).opacity,
              transform: window.getComputedStyle(r).transform,
              style: r.style.cssText
            }))
          };
        })()`,
        returnByValue: true
      });
      console.log('After scrollIntoView why-us:', JSON.stringify(afterScrollWhyUs.result.value, null, 2));

      // Now scroll to Insights
      console.log('\n--- Scrolling to Insights section ---');
      await send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.getElementById('insights');
          if (el) el.scrollIntoView();
        })()`
      });
      await new Promise(r => setTimeout(r, 600));

      const afterScrollInsights = await send('Runtime.evaluate', {
        expression: `(() => {
          const articles = Array.from(document.querySelectorAll('.article-editorial-block'));
          return {
            scrollY: window.scrollY,
            articles: articles.map(a => ({
              top: a.getBoundingClientRect().top,
              opacity: window.getComputedStyle(a).opacity,
              transform: window.getComputedStyle(a).transform,
              style: a.style.cssText
            }))
          };
        })()`,
        returnByValue: true
      });
      console.log('After scrollIntoView insights:', JSON.stringify(afterScrollInsights.result.value, null, 2));

      ws.close();
      chromeProcess.kill();
      process.exit(0);
    };
  } catch (err) {
    console.error('Error:', err);
    chromeProcess.kill();
    process.exit(1);
  }
}, 1500);
