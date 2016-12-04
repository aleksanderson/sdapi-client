# sdapi-client

Client for Salesforce Commerce Cloud Debugger API which abstracts away a
RESTful nature of the API and provides promised based way to interact with it

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