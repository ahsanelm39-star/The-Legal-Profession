import { spawn } from 'child_process';

const chromeProcess = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9230',
  '--disable-gpu',
  '--user-data-dir=C:\\Users\\ahmed\\AppData\\Local\\Temp\\chrome-sec-profile',
  'about:blank',
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9230/json');
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

      const sectionsData = await send('Runtime.evaluate', {
        expression: `(() => {
          const sections = Array.from(document.querySelectorAll('main > *'));
          return sections.map(s => {
            const r = s.getBoundingClientRect();
            const cs = window.getComputedStyle(s);
            return {
              id: s.id || s.className,
              top: Math.round(r.top + window.scrollY),
              height: Math.round(r.height),
              minHeight: cs.minHeight,
              paddingTop: cs.paddingTop,
              paddingBottom: cs.paddingBottom,
              marginTop: cs.marginTop,
              marginBottom: cs.marginBottom
            };
          });
        })()`,
        returnByValue: true,
      });

      console.log('SECTIONS HEIGHTS & OFFSETS:');
      console.log(JSON.stringify(sectionsData.result.value, null, 2));

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
