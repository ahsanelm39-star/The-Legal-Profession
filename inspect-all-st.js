import { spawn } from 'child_process';

const chromeProcess = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9235',
  '--disable-gpu',
  '--user-data-dir=C:\\Users\\ahmed\\AppData\\Local\\Temp\\chrome-st4-profile',
  'about:blank',
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9235/json');
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

      const triggers = await send('Runtime.evaluate', {
        expression: `(() => {
          if (!window.ScrollTrigger) return 'no ScrollTrigger on window';
          const all = window.ScrollTrigger.getAll();
          return all.map((st, i) => {
            const tr = st.trigger;
            return {
              i,
              triggerTag: tr ? tr.tagName : null,
              triggerId: tr ? tr.id : null,
              triggerClass: tr ? tr.className : null,
              start: st.start,
              end: st.end,
              vars: {
                start: st.vars.start,
                end: st.vars.end,
                trigger: typeof st.vars.trigger === 'string' ? st.vars.trigger : (st.vars.trigger ? st.vars.trigger.className || st.vars.trigger.id : null),
                toggleActions: st.vars.toggleActions,
                once: st.vars.once
              },
              progress: st.progress,
              isActive: st.isActive
            };
          });
        })()`,
        returnByValue: true
      });

      console.log('ALL SCROLLTRIGGERS:');
      console.log(JSON.stringify(triggers.result.value, null, 2));

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
