import uuid from 'node-uuid';
import config from './config';

function Api(){
  let running = {}
  let currently_running
  let max_retries = 2

  function check_error(e){
    throw(e);
  };

  function send_request(url, data, opts) {
    opts = opts || {};
    opts.isJson = (opts.isJson === false) ? false : true;
    if (data && opts.isJson === true) {
      data = JSON.stringify(data);
    }
    opts.method = opts.method || 'GET';
    var retry = 0;
    function dispatch_req(rid, url, opts, resolve, reject){
      var request = new XMLHttpRequest();
      running[rid] = {url: url, request: request};
      request.timeout = opts.timeout || 30000; // 30s
      request.open(opts.method, url);
      request.responseType = opts.responseType || 'json';
      request.setRequestHeader('Content-Type', opts.contentType || 'application/json;charset=UTF-8');
      request.ontimeout = function(){
        delete running[rid];
        if (retry < max_retries){
          retry += 1;
          dispatch_req(rid, url, opts, resolve, reject);
        } else {
          retry = 0;
          reject({status: request.status, error: 'timed_out'});
        }
      };
      request.onload = function(){
        delete running[rid];
        if (request.status >= 200 && request.status < 300){
          var data = request.response;
          try {
            resolve(data);
          } catch (e) {
            reject(e);
          }
        } else {
          var r = request.response || {};
          if ((request.status == 502 || request.status == 404) && retry < max_retries){
            retry += 1;
            dispatch_req(rid, url, opts, resolve, reject);
            return;
          } else {
            r.status = request.status;
            reject({status: request.status, error: r});
          }
        }
        retry = 0;
      };
      request.onerror = function(){
        // network error
        delete running[rid];
        if (retry < max_retries){
          retry += 1;
          dispatch_req(rid, url, opts, resolve, reject);
        } else {
          console.debug(request);
          retry = 0;
          reject({status: request.status, error: 'network_error'});
        }
      };
      request.onabort = function(){
        if (running[rid]){
          running.delete(rid);
        }
        retry = 0;
        reject({status: 0, error: 'aborted'});
      };
      if (data){
        request.send(data);
      } else {
        request.send();
      }
      currently_running = {rid: rid, request: request, url: url};
      return request;
    }
    return new Promise(function(resolve, reject){
      try {
        var rid = uuid.v4();
        dispatch_req(rid, url, opts, resolve, reject);
      } catch(e) {
        check_error(e);
      }
    });
  }

  // abort existing running xhr request
  function _kill(rid){
    var _id, request;
    if (!rid){
      request = currently_running.request;
      _id = currently_running.rid;
    } else {
      request = running[rid].request;
      _id = rid;
    }
    try {
      request.abort();
    } catch (e) {
      console.error(e);
    } finally {
      delete running[_id];
    }
  }

  function queryify(obj){
    if(!obj){
      return '';
    }
    var params = [];
    function params_from_keys(item){
      var keys = Object.keys(item);
      keys.forEach(function(k){
        if (item[k] && item[k].constructor.prototype == Array.prototype){
          item[k].forEach(function(v){
            if(v != undefined){
              params.push(k + '=' + encodeURIComponent(v));
            }
          });
        }else{
          if(item[k] != undefined){
            params.push(k + '=' + encodeURIComponent(item[k]));
          }
        }
      });
    }
    if(obj.constructor.prototype == Array.prototype){
      obj.forEach(params_from_keys);
    }else{
      params_from_keys(obj);
    }
    return params.join('&');
  }
  function car_status(){
    //temp
    return new Promise(function(resolve, reject){
      resolve(Math.floor(Math.random() * 10) > 5);
    })
    

    // let url = config.status_api;
    // return send_request(url).then(res => res).catch(err => { throw(err) })
  }


  this.running = running;
  this.kill = _kill;
  this.car_status = car_status;
  return this;
}

export default new Api();
