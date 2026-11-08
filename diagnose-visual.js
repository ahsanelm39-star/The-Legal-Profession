import { spawn } from 'child_process';

const chromeProcess = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9228',
  '--disable-gpu',
  '--user-data-dir=C:\\Users\\ahmed\\AppData\\Local\\Temp\\chrome-diag-profile',
  'about:blank',
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9228/json');
    const list = await res.json();
    const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
    if (!page) {
      console.error('No page target found');
      chromeProcess.kill();
      process.exit(1);
    }

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

      console.log('=== STEP 1: INITIAL LOAD DIAGNOSIS (BEFORE SCROLLING) ===');
      const initialReport = await send('Runtime.evaluate', {
        expression: `(() => {
          function getInfo(selector) {
            const els = Array.from(document.querySelectorAll(selector));
            return els.map((el, idx) => {
              const r = el.getBoundingClientRect();
              const cs = window.getComputedStyle(el);
              return {
                idx,
                tag: el.tagName,
                className: el.className,
                rect: { top: Math.round(r.top), bottom: Math.round(r.bottom), height: Math.round(r.height), width: Math.round(r.width) },
                opacity: cs.opacity,
                visibility: cs.visibility,
                display: cs.display,
                transform: cs.transform
              };
            });
          }

          return {
            scrollHeight: document.documentElement.scrollHeight,
            whyUsRows: getInfo('.manifesto-row-item'),
            insightsArticles: getInfo('.article-editorial-block'),
            posPillars: getInfo('.pos-pillar-card'),
            posComparison: getInfo('.pos-comparison-wrapper'),
            aboutPrinciples: getInfo('.about-principle-item')
          };
        })()`,
        returnByValue: true,
      });

      console.log('Initial Report:', JSON.stringify(initialReport.result.value, null, 2));

      console.log('\n=== STEP 2: SCROLLING STEP BY STEP AND CHECKING ANIMATIONS ===');
      const scrollSteps = [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000];
      for (const s of scrollSteps) {
        await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${s});` });
        await new Promise((r) => setTimeout(r, 400));

        const scrollReport = await send('Runtime.evaluate', {
          expression: `(() => {
            function getBrief(selector) {
              const els = Array.from(document.querySelectorAll(selector));
              return els.map(el => {
                const r = el.getBoundingClientRect();
                const cs = window.getComputedStyle(el);
                return {
                  top: Math.round(r.top),
                  height: Math.round(r.height),
                  opacity: cs.opacity,
                  visibility: cs.visibility,
                  inView: (r.top < window.innerHeight && r.bottom > 0)
                };
              });
            }

            return {
              scrollY: window.scrollY,
              whyUs: getBrief('.manifesto-row-item'),
              insights: getBrief('.article-editorial-block'),
              posPillars: getBrief('.pos-pillar-card')
            };
          })()`,
          returnByValue: true,
        });

        console.log(`\nAt ScrollY = ${s}:`);
        const v = scrollReport.result.value;
        console.log('  WhyUs rows:', v.whyUs);
        console.log('  Insights articles:', v.insights);
        console.log('  Positioning pillars:', v.posPillars);
      }

      console.log('\n=== STEP 3: CHECK SCROLLTRIGGER AND GSAP REGISTRATIONS ===');
      const gsapInfo = await send('Runtime.evaluate', {
        expression: `(() => {
          return {
            hasScrollTrigger: typeof window.ScrollTrigger !== 'undefined' || !!(window.gsap && window.gsap.plugins && window.gsap.plugins.ScrollTrigger),
            windowGsap: typeof window.gsap !== 'undefined',
            allScrollTriggers: window.ScrollTrigger ? window.ScrollTrigger.getAll().map(st => ({
              id: st.vars.id,
              trigger: st.trigger ? st.trigger.className : null,
              start: st.start,
              end: st.end,
              progress: st.progress,
              isActive: st.isActive
            })) : 'no global ScrollTrigger'
          };
        })()`,
        returnByValue: true,
      });
      console.log('GSAP Info:', JSON.stringify(gsapInfo.result.value, null, 2));

      ws.close();
      chromeProcess.kill();
      process.exit(0);
    };
  } catch (err) {
    console.error('Diagnostic error:', err);
    chromeProcess.kill();
    process.exit(1);
  }
}, 1500);
