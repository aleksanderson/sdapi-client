import * as request from 'request'; //TODO: figure out why 'import request from "request"' does not work
import {
  IConnectionOptions,
  IDSAPIRequest,
  IDSAPIResponse
} from './interfaces';

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

  private buildRequestURL(endpoint: string): string {
    //TODO: fix when resolve URL to avoid concatenations sideeffects like '//'
    return `https://${this._connectionOptions.host}/s/-/dw/debugger/v1_0/${endpoint}`;
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
        } else if(![200, 201, 204].find(e => e == message.statusCode)) {
          return reject(JSON.parse(message.body))
        } else {
          try {
            return resolve(JSON.parse(message.body));
          } catch(err) {
            return resolve({});
          }
        }
      });
    }); 
  }
}