// Runtime environment overrides. You can modify this file without rebuilding the app.
window.__env = window.__env || {};
// Default API URL (change to https://... in production)
// En desarrollo, el proxy en angular.json redirige /api a http://localhost:5078
window.__env.API_URL = window.__env.API_URL || '/api';
