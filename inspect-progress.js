import { spawn } from 'child_process';

const chromeProcess = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9236',
  '--disable-gpu',
  '--user-data-dir=C:\\Users\\ahmed\\AppData\\Local\\Temp\\chrome-st5-profile',
  'about:blank',
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9236/json');
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

      const inspectWhyUsST = async (scrollY) => {
        await send('Runtime.evaluate', {
          expression: `window.scrollTo(0, ${scrollY}); window.ScrollTrigger.update();`
        });
        await new Promise(r => setTimeout(r, 300));

        const res = await send('Runtime.evaluate', {
          expression: `(() => {
            const all = window.ScrollTrigger.getAll();
            const stWhyUs = all.find(st => st.vars.trigger && (st.vars.trigger.className === 'why-us-rows-container' || st.vars.trigger === 'why-us-rows-container'));
            const stInsights = all.find(st => st.trigger && st.trigger.id === 'insights');
            const row0 = document.querySelector('.manifesto-row-item');
            const art0 = document.querySelector('.article-editorial-block');

            return {
              scrollY: window.scrollY,
              stWhyUs: stWhyUs ? {
                start: stWhyUs.start,
                end: stWhyUs.end,
                progress: stWhyUs.progress,
                isActive: stWhyUs.isActive,
                animProgress: stWhyUs.animation ? stWhyUs.animation.progress() : 'no anim'
              } : null,
              row0Opacity: row0 ? window.getComputedStyle(row0).opacity : null,
              stInsights: stInsights ? {
                start: stInsights.start,
                end: stInsights.end,
                progress: stInsights.progress,
                isActive: stInsights.isActive,
                animProgress: stInsights.animation ? stInsights.animation.progress() : 'no anim'
              } : null,
              art0Opacity: art0 ? window.getComputedStyle(art0).opacity : null
            };
          })()`,
          returnByValue: true
        });

        console.log(`Scroll ${scrollY}:`, JSON.stringify(res.result.value, null, 2));
      };

      await inspectWhyUsST(0);
      await inspectWhyUsST(5000);
      await inspectWhyUsST(5700);
      await inspectWhyUsST(6000);
      await inspectWhyUsST(6500);
      await inspectWhyUsST(12500);

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
