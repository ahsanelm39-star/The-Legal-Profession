import { spawn } from 'child_process';

const chromeProcess = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9234',
  '--disable-gpu',
  '--user-data-dir=C:\\Users\\ahmed\\AppData\\Local\\Temp\\chrome-st3-profile',
  'about:blank',
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9234/json');
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

      const logScroll = async (targetY) => {
        await send('Runtime.evaluate', {
          expression: `window.scrollTo({ top: ${targetY}, behavior: 'instant' }); window.dispatchEvent(new Event('scroll'));`
        });
        await new Promise(r => setTimeout(r, 300));

        const res = await send('Runtime.evaluate', {
          expression: `(() => {
            const whyUs = document.getElementById('why-us');
            const row0 = document.querySelector('.manifesto-row-item');
            const insights = document.getElementById('insights');
            const art0 = document.querySelector('.article-editorial-block');

            return {
              targetY: ${targetY},
              scrollY: window.scrollY,
              whyUsTop: whyUs ? Math.round(whyUs.getBoundingClientRect().top) : null,
              row0Top: row0 ? Math.round(row0.getBoundingClientRect().top) : null,
              row0Opacity: row0 ? window.getComputedStyle(row0).opacity : null,
              insightsTop: insights ? Math.round(insights.getBoundingClientRect().top) : null,
              art0Top: art0 ? Math.round(art0.getBoundingClientRect().top) : null,
              art0Opacity: art0 ? window.getComputedStyle(art0).opacity : null
            };
          })()`,
          returnByValue: true
        });

        console.log(res.result.value);
      };

      await logScroll(0);
      await logScroll(3000);
      await logScroll(6000);
      await logScroll(7000);
      await logScroll(12000);
      await logScroll(13000);

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
