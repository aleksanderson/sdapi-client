import DSDebugger from './DSDebugger';

let dsDebugger = new DSDebugger(require('../dw.config.json'), { listen: true, interval: 1000 });

dsDebugger.on('debug.breakpoints.hit', (thread) => {
  console.log('HIT BREAKPOINT');
})

dsDebugger.createSession()
  .then(() => dsDebugger.setBreakpoints([
    {
      line_number: 16,
      script_path: '/app_storefront_controllers/cartridge/controllers/Home.js'
    },
    {
      line_number: 17,
      script_path: '/app_storefront_controllers/cartridge/controllers/Home.js'
    }
  ]))
  .then(() => dsDebugger.getBreakpoints()
    .then(resp => console.log(`BREAKPOINTS: ${JSON.stringify(resp)}`))
  )
  .then(() => dsDebugger.removeBreakpoints(1))
  .then(() => dsDebugger.getBreakpoints()
    .then(resp => console.log(`BREAKPOINTS: ${JSON.stringify(resp)}`))
  )
  //.then(() => dsDebugger.removeSession())
  .catch(err => console.log(`ERROR: ${JSON.stringify(err)}`));