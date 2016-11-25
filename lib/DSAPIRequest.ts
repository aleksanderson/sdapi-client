import * as request from 'request'; //TODO: figure out why 'import request from "request"' does not work
import {
  IConnectionOptions,
  IDSAPIRequest,
  IDSAPIResponse
} from './interfaces';

// if(process.env.DEV_MODE) {
//   const requestDebug = require('request-debug'),
//         colors       = require('colors');
  
//   let counter = 0;
  
//   requestDebug(request, (type, data, r) => {
//     console.log(`[${++counter}] ${type} ----------------------------------------`.red);
//     console.log(data);
//     console.log('------------------------------------------------------'.red);
//   });
// }

require('request-debug')(request);


/**
 * HTTP methods which DSAPI supports
 */
export default class DSAPIRequest {
  
  private _connectionOptions: IConnectionOptions;
  
  private _request: any;   //TODO: find out a correct type for Request

  constructor(options: IConnectionOptions) {
    this._connectionOptions = options;
    this._request = request.defaults({
      headers: {
        'x-dw-client-id': 'vscode-debugger',
        'Accept': 'application/json',
        'Authorization': 'Basic ' + 
          new Buffer(`${options.user}:${options.password}`).toString('base64')
      }
    });
  }

  private buildRequestURL(segment: string): string {
    //TODO: fix when resolve URL to avoid concatenations sideeffects like '//'
    return this._connectionOptions.host + segment;
  }

  private parseResponse(unformatedResponse: string): IDSAPIResponse {
    let response: IDSAPIResponse = null;
    
    //TODO: implement formated response

    return response;
  }

  make(requestOptions: IDSAPIRequest): Promise<IDSAPIResponse> {
    return new Promise((resolve, reject) => {

      let opts = Object.assign(requestOptions, 
        { url: this.buildRequestURL(requestOptions.url) },
        requestOptions.body && {
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestOptions.body)
        } || null
      );
  
      this._request(opts, (err, message, body) => {
        if(err) {
          return reject(err);
        }
        return resolve(message.toJSON());
      })
    }); 
  }
}