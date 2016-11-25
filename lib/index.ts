import DSDebugger from './DSDebugger';

/**
 * Remove check for certificates validity in cases when workign with ssandboxes
 * which have such ceritifates
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

/**
 * Create a debugger session
 */

let dsDebugger = new DSDebugger(require('../dw.config.json'));

dsDebugger.createSession()
  .then(() => dsDebugger.setBreakPoint([
    {
      line_number: 16,
      script_path: '/app_storefront_controllers/cartridge/controllers/Home.js'
    }
  ])
  .then(() => dsDebugger.getBreakPoints(1))
  .then(() => dsDebugger.removeSession());


