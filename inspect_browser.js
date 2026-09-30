import http from 'node:http';
import fs from 'node:fs';

function httpGetJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function main() {
  const tabs = await httpGetJson('http://127.0.0.1:9222/json/list');
  const pageTab = tabs.find(t => t.type === 'page' && t.url.includes('5173')) || tabs.find(t => t.type === 'page');
  console.log('Connecting to tab:', pageTab.title, pageTab.url);

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

  let idCounter = 1;
  const callbacks = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && callbacks.has(data.id)) {
      const cb = callbacks.get(data.id);
      callbacks.delete(data.id);
      cb(data);
    }
  };

  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = idCounter++;
    callbacks.set(id, (res) => {
      if (res.error) reject(res.error);
      else resolve(res.result);
    });
    ws.send(JSON.stringify({ id, method, params }));
  });

  await new Promise(r => ws.onopen = r);

  await send('Page.enable');
  await send('Runtime.enable');

  const evalRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const header = document.querySelector('header');
        const headerRect = header ? header.getBoundingClientRect() : null;
        const main = document.querySelector('main');
        const mainRect = main ? main.getBoundingClientRect() : null;
        const root = document.getElementById('root');
        const rootRect = root ? root.getBoundingClientRect() : null;
        const pipeline = document.querySelector('main > div:first-child');
        const pipelineRect = pipeline ? pipeline.getBoundingClientRect() : null;
        return JSON.stringify({
          windowScrollY: window.scrollY,
          headerRect,
          mainRect,
          pipelineRect,
          rootRect,
          bodyMargin: window.getComputedStyle(document.body).margin,
          bodyPadding: window.getComputedStyle(document.body).padding,
          rootStyle: {
            display: window.getComputedStyle(root).display,
            justifyContent: window.getComputedStyle(root).justifyContent,
            alignItems: window.getComputedStyle(root).alignItems,
            height: window.getComputedStyle(root).height
          }
        });
      })()
    `
  });
  console.log('Layout diagnostics:\n', JSON.stringify(JSON.parse(evalRes.result.value), null, 2));

  // Capture full screenshot
  const screenshot = await send('Page.captureScreenshot', {
    format: 'png'
  });

  fs.writeFileSync('C:/Users/manas/.gemini/antigravity/brain/b2baa523-f968-4da6-b196-ca103f1ca9df/actual_ui.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Saved actual_ui.png');

  ws.close();
}

main().catch(console.error);
