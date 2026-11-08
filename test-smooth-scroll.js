import { spawn } from 'child_process';

const chromeProcess = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9233',
  '--disable-gpu',
  '--user-data-dir=C:\\Users\\ahmed\\AppData\\Local\\Temp\\chrome-st2-profile',
  'about:blank',
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9233/json');
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

      // Let's expose ScrollTrigger to window so we can inspect it!
      // In Vite, we can evaluate an inspection of all ScrollTrigger instances
      const stDetails = await send('Runtime.evaluate', {
        expression: `(() => {
          const whyUs = document.getElementById('why-us');
          const rowsContainer = document.querySelector('.why-us-rows-container');
          const whyUsTop = whyUs.offsetTop;
          const rowsTop = rowsContainer.offsetTop;

          return {
            whyUsTop,
            whyUsClientTop: whyUs.getBoundingClientRect().top,
            rowsTop,
            rowsClientTop: rowsContainer.getBoundingClientRect().top,
            innerHeight: window.innerHeight,
            documentHeight: document.documentElement.scrollHeight
          };
        })()`,
        returnByValue: true
      });

      console.log('WHY US METRICS:', stDetails.result.value);

      // Now scroll smoothly in increments of 300px from 0 to 14000
      console.log('\n--- SCROLLING STEP BY STEP ---');
      const docHeight = stDetails.result.value.documentHeight;
      for (let y = 0; y <= docHeight; y += 800) {
        await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y});` });
        await new Promise(r => setTimeout(r, 100));

        const check = await send('Runtime.evaluate', {
          expression: `(() => {
            const whyUs = document.getElementById('why-us');
            const rows = Array.from(document.querySelectorAll('.manifesto-row-item'));
            const r0 = rows[0] ? rows[0].getBoundingClientRect() : null;
            const cs0 = rows[0] ? window.getComputedStyle(rows[0]) : null;

            const insights = document.getElementById('insights');
            const art0 = document.querySelector('.article-editorial-block');
            const artR = art0 ? art0.getBoundingClientRect() : null;
            const artCs = art0 ? window.getComputedStyle(art0) : null;

            return {
              scrollY: window.scrollY,
              whyUsClientTop: whyUs ? Math.round(whyUs.getBoundingClientRect().top) : null,
              row0Top: r0 ? Math.round(r0.top) : null,
              row0Opacity: cs0 ? cs0.opacity : null,
              row0Transform: cs0 ? cs0.transform : null,
              insightsClientTop: insights ? Math.round(insights.getBoundingClientRect().top) : null,
              art0Top: artR ? Math.round(artR.top) : null,
              art0Opacity: artCs ? artCs.opacity : null
            };
          })()`,
          returnByValue: true
        });

        const c = check.result.value;
        if (c.row0Top !== null && c.row0Top < 1200 && c.row0Top > -500) {
          console.log(`ScrollY: ${c.scrollY} | Row0 in view (top=${c.row0Top}) -> Opacity: ${c.row0Opacity}, Transform: ${c.row0Transform}`);
        }
        if (c.art0Top !== null && c.art0Top < 1200 && c.art0Top > -500) {
          console.log(`ScrollY: ${c.scrollY} | Art0 in view (top=${c.art0Top}) -> Opacity: ${c.art0Opacity}`);
        }
      }

      ws.close();
      chromeProcess.kill();
      process.exit(0);
    };
  } catch (e) {
    console.error(e);
    chromeProcess.kill();
    process.exit(1);
  }
}, 1500);
