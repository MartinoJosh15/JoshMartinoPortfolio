// Apply the saved preference before the first paint. Storage can be unavailable.
try {
  const saved = localStorage.getItem('jm-theme');
  document.documentElement.dataset.theme = saved === 'dark' ? 'dark' : 'light';
} catch { document.documentElement.dataset.theme = 'light'; }
