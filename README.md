# sdapi-client

Promised based client for Salesforce Commerce Cloud Debugger API

## Configuration

### dw.config.json
```json
{
  "host": "addres.demandware.net",
  "user": "user",
  "password": "pass",
  "version": "version_1"
}
```

## Examples

```javascript
let config = require('../dw.config.json');

let dsDebugger = new DSDebugger(config);

dsDebugger.createSession()
  .then(() => dsDebugger.setBreakPoints([
    {
      line_number: 16,
      script_path: '/app_storefront_controllers/cartridge/controllers/Home.js'
    }
  ])
  .then(() => dsDebugger.getBreakPoints(1))
  .then(() => dsDebugger.removeSession());
```