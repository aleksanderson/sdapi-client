import * as request from 'request'; //TODO: figure out why 'import request from "request"' does not work
import {
  IConnectionOptions,
  IDSAPIRequest
} from './interfaces';

require('request-debug')(request);


export default class DSAPIRequest {
  
  private static _instance: DSAPIRequest;
  public static getInstance(options?: IConnectionOptions): DSAPIRequest {
    if(!this._instance) {
      this._instance = new DSAPIRequest(options);
    }
    return this._instance;
  }

  private _connectionOptions: IConnectionOptions;  
  private _request: any;   //TODO: find out a correct type for Request
  
  constructor(options: IConnectionOptions) {
    if(DSAPIRequest._instance) {
      throw new Error('Error when creating an instance. Use "getInstance()" method to obtain it');
    }

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

  //TODO: think of providing more defined type than "any"
  make(requestOptions: IDSAPIRequest): Promise<any> {
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