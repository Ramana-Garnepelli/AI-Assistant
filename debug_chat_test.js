const url = 'http://127.0.0.1:3001/api/chat';

(async () => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Hello' }] }),
    });
    console.log('status', res.status);
    const text = await res.text();
    console.log('body', text);
  } catch (err) {
    console.error(err);
  }
})();