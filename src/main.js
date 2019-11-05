import App from './App.svelte'

Sentry.init({
  dsn: 'https://6aa03223337a437ba745426629062602@sentry.io/1779548'
})

const app = new App({
  target: document.body
})

export default app
