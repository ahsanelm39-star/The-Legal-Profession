import { spawn } from 'child_process';

const chromeProcess = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9231',
  '--disable-gpu',
  '--user-data-dir=C:\\Users\\ahmed\\AppData\\Local\\Temp\\chrome-vercel-profile',
  'about:blank',
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9231/json');
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

      console.log('Navigating to live deployed site: https://the-legal-profession.vercel.app/ ...');
      await send('Page.navigate', { url: 'https://the-legal-profession.vercel.app/' });
      await new Promise((r) => setTimeout(r, 4000));

      const vercelAudit = await send('Runtime.evaluate', {
        expression: `(() => {
          const sections = Array.from(document.querySelectorAll('main > *'));
          const secList = sections.map(s => {
            const h = s.querySelector('h1, h2, h3');
            return {
              id: s.id || s.className,
              heading: h ? h.innerText.replace(/\\n/g, ' ') : null,
              childrenCount: s.children.length,
              textLength: s.innerText.length
            };
          });

          // Check WhyUs on Vercel
          const whyUs = document.getElementById('why-us');
          const whyUsHtml = whyUs ? whyUs.outerHTML.slice(0, 500) : 'not found';

          // Check Insights on Vercel
          const insights = document.getElementById('insights');
          const insightsHtml = insights ? insights.outerHTML.slice(0, 500) : 'not found';

          // Check Positioning on Vercel
          const pos = document.getElementById('positioning');
          const posHtml = pos ? pos.outerHTML.slice(0, 500) : 'not found';

          return {
            secList,
            whyUsSummary: whyUs ? {
              text: whyUs.innerText,
              children: Array.from(whyUs.children).map(c => c.className),
              innerHtml: whyUs.innerHTML
            } : null,
            insightsSummary: insights ? {
              text: insights.innerText,
              children: Array.from(insights.children).map(c => c.className),
              innerHtml: insights.innerHTML
            } : null,
            positioningSummary: pos ? {
              text: pos.innerText,
              children: Array.from(pos.children).map(c => c.className),
              innerHtml: pos.innerHTML
            } : null
          };
        })()`,
        returnByValue: true,
      });

      console.log('VERCEL AUDIT:');
      console.log('Sections on Vercel:', JSON.stringify(vercelAudit.result.value.secList, null, 2));
      console.log('\nWhyUs on Vercel:', JSON.stringify(vercelAudit.result.value.whyUsSummary, null, 2));
      console.log('\nInsights on Vercel:', JSON.stringify(vercelAudit.result.value.insightsSummary, null, 2));
      console.log('\nPositioning on Vercel:', JSON.stringify(vercelAudit.result.value.positioningSummary, null, 2));

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
