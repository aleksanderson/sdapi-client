import DSDebugger from './DSDebugger';

/**
 * Remove check for certificates validity in cases when workign with ssandboxes
 * which have broken ceritifates
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

/**
 * Create a debugger session
 */

let dsDebugger = new DSDebugger(require('../dw.config.json'));

dsDebugger.createSession()
  .then(() => dsDebugger.setBreakPoints([
    {
      line_number: 16,
      script_path: '/app_storefront_controllers/cartridge/controllers/Home.js'
    }
  ]))
  .then(() => dsDebugger.getBreakPoints(1)
    .then(resp => console.log(`RESP: ${JSON.stringify(resp)}`))
  )
  .then(() => dsDebugger.removeSession())
  .catch(err => console.log(`ERROR: ${JSON.stringify(err)}`));