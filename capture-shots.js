import { spawn } from 'child_process';
import fs from 'fs';

const chromeProcess = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9237',
  '--disable-gpu',
  '--user-data-dir=C:\\Users\\ahmed\\AppData\\Local\\Temp\\chrome-shots-profile',
  'about:blank',
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9237/json');
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
      await new Promise((r) => setTimeout(r, 2500));

      const sections = ['positioning', 'about', 'services', 'why-us', 'methodology', 'team', 'values', 'insights', 'faq'];

      for (const sId of sections) {
        console.log(`Scrolling to section #${sId}...`);
        await send('Runtime.evaluate', {
          expression: `(() => {
            const el = document.getElementById('${sId}');
            if (el) {
              const r = el.getBoundingClientRect();
              window.scrollTo({ top: window.scrollY + r.top - 80, behavior: 'instant' });
            }
          })()`
        });
        await new Promise(r => setTimeout(r, 1200));

        const shot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(`shot-${sId}.png`, Buffer.from(shot.data, 'base64'));
        console.log(`Saved shot-${sId}.png`);
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
