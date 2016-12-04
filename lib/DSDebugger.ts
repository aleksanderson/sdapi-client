  //TODO: think about using DSDubugger class as an EventEmitter
  //for example createSession(listen: boolean)
  // in this case to do something like
  // dsDebugger.on('debug.breakpoint.hit', () => { })
  // dsDebugger.on('debug.session.terminated', () => { })
  // dsDebugger.on('debug.session.terminated', () => { })

import {
  IConnectionOptions,
  IDSDebugConfiguration,
  IBreakpoint,
  IDSThread
} from './interfaces';
import DSAPIRequest from './DSAPIRequest';
import DSThread from './DSThread';

//TODO: fix to be import { EventEmitter } from 'events' 
import events = require('events');
const EventEmitter = events.EventEmitter;


export default class DSDebugger extends EventEmitter {
  
  private _request: DSAPIRequest;
  private _config: IDSDebugConfiguration;
  
  //TODO: think to remove a direct dependency to DSAPIRequest
  constructor(connection: IConnectionOptions, configuration: IDSDebugConfiguration) {
    super();

    this._config = configuration;
    this._request = DSAPIRequest.getInstance(connection);
  }

  /**
   * Session methods
   */

  createSession(): Promise<void> {
    return this._request.make({ url: '/client', method: 'POST' })
      .then(() => {
        if(this._config.listen) {
          this.listenForHaltedTread();
        }
      });
  }

  removeSession(): Promise<void> {
    return this._request.make({ url: '/client', method: 'DELETE' });
  }

  /**
   * Breakpoints methods
   */

  //TOCHECK: if there is a typesuggestions when <typed> promise return is declared
  getBreakpoints(id?: number): Promise<Array<IBreakpoint>> {
    return this._request.make({ 
      url: '/breakpoints' + (typeof id != 'undefined' ? `/${id}` : ''), 
      method: 'GET'
    }).then(resp => resp.breakpoints);
  }

  setBreakpoints(breakpoints: Array<IBreakpoint>): Promise<Array<IBreakpoint>> {
    return this._request.make({ 
      url: '/breakpoints', 
      method: 'POST', 
      body: { breakpoints }  
    }).then(resp => resp.breakpoints);
  }

  removeBreakpoints(id?: number): Promise<void> {
    return this._request.make({
      url: '/breakpoints' + (typeof id != 'undefined' ? `/${id}` : ''),
      method: 'DELETE'
    });
  }

  /**
   * private methods
   */

  private getThreads(id?: number): Promise<Array<IDSThread>> {
    return this._request.make({ 
      url: '/threads' + (typeof id != 'undefined' ? `/${id}` : ''), 
      method: 'GET' 
    }).then(resp => resp.script_threads);
  }

  private listenForHaltedTread(): void {
    let tick = () => {
      setTimeout(() => {
        this.getThreads().then(threads => {
          //console.log('Listen for breakpoint hit...');
          if(threads && threads[0].status === 'halted') {
            /**
             * Create a thread instance and pass it as a data of the event
             */
            this.emit('debug.breakpoints.hit', new DSThread(threads[0]));
          }
          tick();
        });
      }, this._config.interval);
    };
    tick();
  }
}