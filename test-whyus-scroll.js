import { spawn } from 'child_process';

const chromeProcess = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9232',
  '--disable-gpu',
  '--user-data-dir=C:\\Users\\ahmed\\AppData\\Local\\Temp\\chrome-whyus-profile',
  'about:blank',
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9232/json');
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

      const diag = await send('Runtime.evaluate', {
        expression: `(() => {
          const whyUs = document.getElementById('why-us');
          const rowsContainer = document.querySelector('.why-us-rows-container');
          const sidebar = document.querySelector('.why-us-sticky-sidebar');
          const rows = Array.from(document.querySelectorAll('.manifesto-row-item'));

          return {
            whyUsRect: whyUs ? whyUs.getBoundingClientRect() : null,
            rowsContainerRect: rowsContainer ? rowsContainer.getBoundingClientRect() : null,
            sidebarRect: sidebar ? sidebar.getBoundingClientRect() : null,
            rowsRects: rows.map(r => r.getBoundingClientRect()),
            windowScrollY: window.scrollY
          };
        })()`,
        returnByValue: true
      });

      console.log('INITIAL STATE AT SCROLL 0:', JSON.stringify(diag.result.value, null, 2));

      // Now scroll directly to where whyUs starts: whyUsRect.top + window.scrollY
      const topOffset = diag.result.value.whyUsRect.top;
      console.log('\nScrolling to topOffset:', topOffset);
      await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${topOffset});` });
      await new Promise(r => setTimeout(r, 1000));

      const afterScroll = await send('Runtime.evaluate', {
        expression: `(() => {
          const whyUs = document.getElementById('why-us');
          const rows = Array.from(document.querySelectorAll('.manifesto-row-item'));
          return {
            windowScrollY: window.scrollY,
            whyUsRect: whyUs.getBoundingClientRect(),
            rows: rows.map(r => ({
              rect: r.getBoundingClientRect(),
              opacity: window.getComputedStyle(r).opacity,
              transform: window.getComputedStyle(r).transform,
              inlineStyle: r.style.cssText
            }))
          };
        })()`,
        returnByValue: true
      });

      console.log('AFTER SCROLL TO TOP OFFSET:', JSON.stringify(afterScroll.result.value, null, 2));

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
