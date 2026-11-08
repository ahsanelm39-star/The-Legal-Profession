import { spawn } from 'child_process';

const chromeProcess = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9238',
  '--disable-gpu',
  '--user-data-dir=C:\\Users\\ahmed\\AppData\\Local\\Temp\\chrome-whyus-debug-profile',
  'about:blank',
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9238/json');
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

      // Scroll to why-us exactly like in capture-shots:
      await send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.getElementById('why-us');
          const r = el.getBoundingClientRect();
          window.scrollTo({ top: window.scrollY + r.top - 80, behavior: 'instant' });
        })()`
      });
      await new Promise(r => setTimeout(r, 1200));

      const debugInfo = await send('Runtime.evaluate', {
        expression: `(() => {
          const rows = Array.from(document.querySelectorAll('.manifesto-row-item'));
          const all = window.ScrollTrigger.getAll();
          const st = all.find(s => s.trigger && s.trigger.className.includes('why-us'));

          return {
            windowScrollY: window.scrollY,
            rowsStyles: rows.map(r => ({
              top: r.getBoundingClientRect().top,
              opacity: window.getComputedStyle(r).opacity,
              inlineStyle: r.style.cssText
            })),
            stDetails: st ? {
              start: st.start,
              end: st.end,
              scrollerTop: st.scroll(),
              progress: st.progress,
              isActive: st.isActive,
              animation: st.animation ? {
                progress: st.animation.progress(),
                duration: st.animation.duration(),
                paused: st.animation.paused()
              } : null
            } : 'ST not found'
          };
        })()`,
        returnByValue: true
      });

      console.log('DEBUG INFO FOR WHY-US AT SCROLL:');
      console.log(JSON.stringify(debugInfo.result.value, null, 2));

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
