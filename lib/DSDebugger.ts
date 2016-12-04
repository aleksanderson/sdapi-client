import {
  IDSDebugger,
  IConnectionOptions,
  IDSDebugConfiguration,
  IBreakpoint//,
  //ITrhead
} from './interfaces';
import DSAPIRequest from './DSAPIRequest';

//TODO: fix to be import { EventEmitter } from 'events' 
import events = require('events');
const EventEmitter = events.EventEmitter;



export default class DSDebugger extends EventEmitter implements IDSDebugger {
  
  private _request: DSAPIRequest;
  private _config: IDSDebugConfiguration;
  
  
  //TODO: check if DS API supports only one thread and there is an actual need to have _activeThread variable as an Array
  // private _activeThread: ITrhead;
  // //private _activeBreakPoints: Array<IBreakpoint> = [];
  // public get activeThread(): ITrhead {
  //   return this._activeThread;
  // }
  // // public get activeBreakPoints(): Array<IBreakpoint> {
  // //   return this._activeBreakPoints;
  // // }



  //TODO: think to remove a direct dependency to DSAPIRequest
  constructor(connection: IConnectionOptions, configuration: IDSDebugConfiguration) {
    super();

    this._config = configuration;
    this._request = new DSAPIRequest(connection);
  }

  /**
   * Session methods
   */

  //TODO: think about using DSDubugger class as an EventEmitter
  //for example createSession(listen: boolean)
  // in this case to do something like
  // dsDebugger.on('debug.breakpoint.hit', () => { })
  // dsDebugger.on('debug.session.terminated', () => { })
  // dsDebugger.on('debug.session.terminated', () => { })




  createSession(): Promise<void> {
    return this._request.make({ url: '/client', method: 'POST' })
      .then(() => {
        if(this._config.listen) {
          this.listenForBreakpointHit();
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
   * Threads methods
   */

  //TODO: change to private
  public getThreads(id?: number): Promise<Array<ITrhead>> {
    return this._request.make({ 
      url: '/threads' + (typeof id != 'undefined' ? `/${id}` : ''), 
      method: 'GET' 
    }).then(resp => resp.script_threads);
  }

  //TODO: figure out when to refresh threads
  //NOTE: most likely to be the same implementation approach as with listenForBreakpointHit()
  private resetThreatTimeout(): Promise<void> {
    return this._request.make({ url: '/threads', method: 'POST' });
  }

  private listenForBreakpointHit(): void {
    let tick = () => {
      setTimeout(() => {
        this.getThreads().then(threads => {
          console.log('Listen for breakpoint hit...');
          if(threads) {
            this.emit('debug.breakpoints.hit', threads);
          }
          tick();
        })
      }, this._config.interval);
    };
    tick();
  }

  //as alternative API for listening evetns 
  // public listen(interval: number): IDSDebugger {
  //   return this;
  // }
}