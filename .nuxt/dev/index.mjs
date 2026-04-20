import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { tmpdir } from 'node:os';
import { Server } from 'node:http';
import { resolve, dirname, join } from 'node:path';
import nodeCrypto from 'node:crypto';
import { parentPort, threadId } from 'node:worker_threads';
import { defineEventHandler, handleCacheHeaders, splitCookiesString, createEvent, fetchWithEvent, isEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, setResponseHeaders, setResponseStatus, send, getRequestHeaders, setResponseHeader, appendResponseHeader, getRequestURL, getResponseHeader, removeResponseHeader, createError, getQuery as getQuery$1, readBody, createApp, createRouter as createRouter$1, toNodeListener, lazyEventHandler, getResponseStatus, getRouterParam, getHeader, readMultipartFormData, getMethod, getResponseStatusText } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/h3/dist/index.mjs';
import { escapeHtml } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/@vue/shared/dist/shared.cjs.js';
import Anthropic from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/@anthropic-ai/sdk/index.mjs';
import { createClient } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/@supabase/supabase-js/dist/index.mjs';
import { createRenderer, getRequestDependencies, getPreloadLinks, getPrefetchLinks } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withTrailingSlash, decodePath, withLeadingSlash, withoutTrailingSlash, joinRelativeURL } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/ufo/dist/index.mjs';
import { renderToString } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/vue/server-renderer/index.mjs';
import { klona } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/klona/dist/index.mjs';
import defu, { defuFn } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/defu/dist/defu.mjs';
import destr, { destr as destr$1 } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/destr/dist/index.mjs';
import { snakeCase } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/scule/dist/index.mjs';
import { createHead as createHead$1, propsToString, renderSSRHead } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/unhead/dist/server.mjs';
import { stringify, uneval } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/devalue/index.js';
import { isVNode, isRef, toValue } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/vue/index.mjs';
import { DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/unhead/dist/plugins.mjs';
import { createHooks } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/nitropack/node_modules/hookable/dist/index.mjs';
import { createFetch, Headers as Headers$1 } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/ofetch/dist/node.mjs';
import { fetchNodeRequestHandler, callNodeRequestHandler } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/node-mock-http/dist/index.mjs';
import { createStorage, prefixStorage } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/unstorage/drivers/fs.mjs';
import { digest } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/ohash/dist/index.mjs';
import { toRouteMatcher, createRouter } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/radix3/dist/index.mjs';
import { readFile } from 'node:fs/promises';
import consola, { consola as consola$1 } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/consola/dist/index.mjs';
import { ErrorParser } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/youch-core/build/index.js';
import { Youch } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/nitropack/node_modules/youch/build/index.js';
import { SourceMapConsumer } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/source-map/source-map.js';
import { AsyncLocalStorage } from 'node:async_hooks';
import { getContext } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/unctx/dist/index.mjs';
import { captureRawStackTrace, parseRawStackTrace } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/errx/dist/index.js';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname as dirname$1, resolve as resolve$1 } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/pathe/dist/index.mjs';
import { walkResolver } from 'file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/unhead/dist/utils.mjs';

const serverAssets = [{"baseName":"server","dir":"C:/Users/Lenovo/Downloads/atlantir-bot-fixed/server/assets"}];

const assets$1 = createStorage();

for (const asset of serverAssets) {
  assets$1.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir, ignore: (asset?.ignore || []) }));
}

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"C:/Users/Lenovo/Downloads/atlantir-bot-fixed","watchOptions":{"ignored":[null]}}));
storage.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"C:/Users/Lenovo/Downloads/atlantir-bot-fixed/server","watchOptions":{"ignored":[null]}}));
storage.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"C:/Users/Lenovo/Downloads/atlantir-bot-fixed/.nuxt"}));
storage.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"C:/Users/Lenovo/Downloads/atlantir-bot-fixed/.nuxt/cache"}));
storage.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"C:/Users/Lenovo/Downloads/atlantir-bot-fixed/.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const inlineAppConfig = {
  "nuxt": {}
};



const appConfig = defuFn(inlineAppConfig);

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "dev",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/auth/callback": {
        "ssr": false
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      }
    }
  },
  "public": {
    "supabaseUrl": "https://juknnfsvglxewrgdwmyd.supabase.co",
    "supabaseKey": "sb_publishable_AHfQv6RxM8MM9PLo3CwXYw_zQicLWbT",
    "deepgramApiKey": "df560c66c0df04bf687670f314b1bfca53f2f879",
    "supabase": {
      "url": "https://juknnfsvglxewrgdwmyd.supabase.co",
      "key": "sb_publishable_AHfQv6RxM8MM9PLo3CwXYw_zQicLWbT",
      "redirect": true,
      "redirectOptions": {
        "login": "/login",
        "callback": "/auth/callback",
        "exclude": [
          "/",
          "/login",
          "/register",
          "/reset-password",
          "/join/**"
        ],
        "cookieRedirect": false,
        "saveRedirectToCookie": false
      },
      "cookieName": "sb",
      "cookiePrefix": "sb-juknnfsvglxewrgdwmyd-auth-token",
      "useSsrCookies": true,
      "cookieOptions": {
        "maxAge": 28800,
        "sameSite": "lax",
        "secure": true
      },
      "clientOptions": {}
    }
  },
  "openrouterApiKey": "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",
  "elevenLabsApiKey": "sk_2c2cb645807605926b603534a816363a3fcb0b0c46b6814c",
  "elevenLabsVoiceId": "CwhRBWXzGAHq8TQ4Fs17",
  "supabase": {
    "serviceKey": "sb_secret_XKNnF_37MmZBU_fWFZ9QxQ_Bxvnc26Q"
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function isJsonRequest(event) {
  if (hasReqHeader(event, "accept", "text/html")) {
    return false;
  }
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
  if (event.handled || isJsonRequest(event)) {
    return;
  }
  const defaultRes = await defaultHandler(error, event, { json: true });
  const statusCode = error.statusCode || 500;
  if (statusCode === 404 && defaultRes.status === 302) {
    setResponseHeaders(event, defaultRes.headers);
    setResponseStatus(event, defaultRes.status, defaultRes.statusText);
    return send(event, JSON.stringify(defaultRes.body, null, 2));
  }
  if (typeof defaultRes.body !== "string" && Array.isArray(defaultRes.body.stack)) {
    defaultRes.body.stack = defaultRes.body.stack.join("\n");
  }
  const errorObject = defaultRes.body;
  const url = new URL(errorObject.url);
  errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
  errorObject.message ||= "Server Error";
  errorObject.data ||= error.data;
  errorObject.statusMessage ||= error.statusMessage;
  delete defaultRes.headers["content-type"];
  delete defaultRes.headers["content-security-policy"];
  setResponseHeaders(event, defaultRes.headers);
  const reqHeaders = getRequestHeaders(event);
  const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
  const res = isRenderingError ? null : await useNitroApp().localFetch(
    withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject),
    {
      headers: { ...reqHeaders, "x-nuxt-error": "true" },
      redirect: "manual"
    }
  ).catch(() => null);
  if (event.handled) {
    return;
  }
  if (!res) {
    const { template } = await Promise.resolve().then(function () { return errorDev; }) ;
    {
      errorObject.description = errorObject.message;
    }
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    return send(event, template(errorObject));
  }
  const html = await res.text();
  for (const [header, value] of res.headers.entries()) {
    if (header === "set-cookie") {
      appendResponseHeader(event, header, value);
      continue;
    }
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
  return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  async function defaultNitroErrorHandler(error, event) {
    const res = await defaultHandler(error, event);
    if (!event.node?.res.headersSent) {
      setResponseHeaders(event, res.headers);
    }
    setResponseStatus(event, res.status, res.statusText);
    return send(
      event,
      typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2)
    );
  }
);
async function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  await loadStackTrace(error).catch(consola.error);
  const youch = new Youch();
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    const ansiError = await (await youch.toANSI(error)).replaceAll(process.cwd(), ".");
    consola.error(
      `[request error] ${tags} [${event.method}] ${url}

`,
      ansiError
    );
  }
  const useJSON = opts?.json || !getRequestHeader(event, "accept")?.includes("text/html");
  const headers = {
    "content-type": useJSON ? "application/json" : "text/html",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
  };
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = useJSON ? {
    error: true,
    url,
    statusCode,
    statusMessage,
    message: error.message,
    data: error.data,
    stack: error.stack?.split("\n").map((line) => line.trim())
  } : await youch.toHTML(error, {
    request: {
      url: url.href,
      method: event.method,
      headers: getRequestHeaders(event)
    }
  });
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}
async function loadStackTrace(error) {
  if (!(error instanceof Error)) {
    return;
  }
  const parsed = await new ErrorParser().defineSourceLoader(sourceLoader).parse(error);
  const stack = error.message + "\n" + parsed.frames.map((frame) => fmtFrame(frame)).join("\n");
  Object.defineProperty(error, "stack", { value: stack });
  if (error.cause) {
    await loadStackTrace(error.cause).catch(consola.error);
  }
}
async function sourceLoader(frame) {
  if (!frame.fileName || frame.fileType !== "fs" || frame.type === "native") {
    return;
  }
  if (frame.type === "app") {
    const rawSourceMap = await readFile(`${frame.fileName}.map`, "utf8").catch(() => {
    });
    if (rawSourceMap) {
      const consumer = await new SourceMapConsumer(rawSourceMap);
      const originalPosition = consumer.originalPositionFor({ line: frame.lineNumber, column: frame.columnNumber });
      if (originalPosition.source && originalPosition.line) {
        frame.fileName = resolve(dirname(frame.fileName), originalPosition.source);
        frame.lineNumber = originalPosition.line;
        frame.columnNumber = originalPosition.column || 0;
      }
    }
  }
  const contents = await readFile(frame.fileName, "utf8").catch(() => {
  });
  return contents ? { contents } : void 0;
}
function fmtFrame(frame) {
  if (frame.type === "native") {
    return frame.raw;
  }
  const src = `${frame.fileName || ""}:${frame.lineNumber}:${frame.columnNumber})`;
  return frame.functionName ? `at ${frame.functionName} (${src}` : `at ${src}`;
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const rootDir = "C:/Users/Lenovo/Downloads/atlantir-bot-fixed";

const appHead = {"meta":[{"name":"viewport","content":"width=device-width, initial-scale=1"},{"charset":"utf-8"}],"link":[],"style":[],"script":[],"noscript":[]};

const appRootTag = "div";

const appRootAttrs = {"id":"__nuxt"};

const appTeleportTag = "div";

const appTeleportAttrs = {"id":"teleports"};

const appId = "nuxt-app";

const devReducers = {
  VNode: (data) => isVNode(data) ? { type: data.type, props: data.props } : void 0,
  URL: (data) => data instanceof URL ? data.toString() : void 0
};
const asyncContext = getContext("nuxt-dev", { asyncContext: true, AsyncLocalStorage });
const _3DO1bECzh1zKA24bP5wetMqCZEhx00XJCt5DKzr48 = (nitroApp) => {
  const handler = nitroApp.h3App.handler;
  nitroApp.h3App.handler = (event) => {
    return asyncContext.callAsync({ logs: [], event }, () => handler(event));
  };
  onConsoleLog((_log) => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    const rawStack = captureRawStackTrace();
    if (!rawStack || rawStack.includes("runtime/vite-node.mjs")) {
      return;
    }
    const trace = [];
    let filename = "";
    for (const entry of parseRawStackTrace(rawStack)) {
      if (entry.source === import.meta.url) {
        continue;
      }
      if (EXCLUDE_TRACE_RE.test(entry.source)) {
        continue;
      }
      filename ||= entry.source.replace(withTrailingSlash(rootDir), "");
      trace.push({
        ...entry,
        source: entry.source.startsWith("file://") ? entry.source.replace("file://", "") : entry.source
      });
    }
    const log = {
      ..._log,
      // Pass along filename to allow the client to display more info about where log comes from
      filename,
      // Clean up file names in stack trace
      stack: trace
    };
    ctx.logs.push(log);
  });
  nitroApp.hooks.hook("afterResponse", () => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    return nitroApp.hooks.callHook("dev:ssr-logs", { logs: ctx.logs, path: ctx.event.path });
  });
  nitroApp.hooks.hook("render:html", (htmlContext) => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    try {
      const reducers = Object.assign(/* @__PURE__ */ Object.create(null), devReducers, ctx.event.context._payloadReducers);
      htmlContext.bodyAppend.unshift(`<script type="application/json" data-nuxt-logs="${appId}">${stringify(ctx.logs, reducers)}<\/script>`);
    } catch (e) {
      const shortError = e instanceof Error && "toString" in e ? ` Received \`${e.toString()}\`.` : "";
      console.warn(`[nuxt] Failed to stringify dev server logs.${shortError} You can define your own reducer/reviver for rich types following the instructions in https://nuxt.com/docs/api/composables/use-nuxt-app#payload.`);
    }
  });
};
const EXCLUDE_TRACE_RE = /\/node_modules\/(?:.*\/)?(?:nuxt|nuxt-nightly|nuxt-edge|nuxt3|consola|@vue)\/|core\/runtime\/nitro/;
function onConsoleLog(callback) {
  consola$1.addReporter({
    log(logObj) {
      callback(logObj);
    }
  });
  consola$1.wrapConsole();
}

const plugins = [
  _3DO1bECzh1zKA24bP5wetMqCZEhx00XJCt5DKzr48
];

const assets = {};

function readAsset (id) {
  const serverDir = dirname$1(fileURLToPath(import.meta.url));
  return promises.readFile(resolve$1(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _umLBqG = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError({ statusCode: 404 });
    }
    return;
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const VueResolver = (_, value) => {
  return isRef(value) ? toValue(value) : value;
};

const headSymbol = "usehead";
// @__NO_SIDE_EFFECTS__
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}

// @__NO_SIDE_EFFECTS__
function resolveUnrefHeadInput(input) {
  return walkResolver(input, VueResolver);
}

// @__NO_SIDE_EFFECTS__
function createHead(options = {}) {
  const head = createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = vueInstall(head);
  return head;
}

const unheadOptions = {
  disableDefaults: true,
  disableCapoSorting: false,
  plugins: [DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin],
};

function createSSRContext(event) {
  const ssrContext = {
    url: event.path,
    event,
    runtimeConfig: useRuntimeConfig(event),
    noSSR: event.context.nuxt?.noSSR || (false),
    head: createHead(unheadOptions),
    error: false,
    nuxt: void 0,
    /* NuxtApp */
    payload: {},
    _payloadReducers: /* @__PURE__ */ Object.create(null),
    modules: /* @__PURE__ */ new Set()
  };
  return ssrContext;
}
function setSSRError(ssrContext, error) {
  ssrContext.error = true;
  ssrContext.payload = { error };
  ssrContext.url = error.url;
}

function buildAssetsDir() {
  return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
  return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
  const app = useRuntimeConfig().app;
  const publicBase = app.cdnURL || app.baseURL;
  return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

const APP_ROOT_OPEN_TAG = `<${appRootTag}${propsToString(appRootAttrs)}>`;
const APP_ROOT_CLOSE_TAG = `</${appRootTag}>`;
const getServerEntry = () => import('file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/.nuxt/dist/server/server.mjs').then((r) => r.default || r);
const getClientManifest = () => import('file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/.nuxt/dist/server/client.manifest.mjs').then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);
const getSSRRenderer = lazyCachedFunction(async () => {
  const manifest = await getClientManifest();
  if (!manifest) {
    throw new Error("client.manifest is not available");
  }
  const createSSRApp = await getServerEntry();
  if (!createSSRApp) {
    throw new Error("Server bundle is not available");
  }
  const options = {
    manifest,
    renderToString: renderToString$1,
    buildAssetsURL
  };
  const renderer = createRenderer(createSSRApp, options);
  async function renderToString$1(input, context) {
    const html = await renderToString(input, context);
    if (process.env.NUXT_VITE_NODE_OPTIONS) {
      renderer.rendererContext.updateManifest(await getClientManifest());
    }
    return APP_ROOT_OPEN_TAG + html + APP_ROOT_CLOSE_TAG;
  }
  return renderer;
});
const getSPARenderer = lazyCachedFunction(async () => {
  const manifest = await getClientManifest();
  const spaTemplate = await Promise.resolve().then(function () { return _virtual__spaTemplate; }).then((r) => r.template).catch(() => "").then((r) => {
    {
      return APP_ROOT_OPEN_TAG + r + APP_ROOT_CLOSE_TAG;
    }
  });
  const options = {
    manifest,
    renderToString: () => spaTemplate,
    buildAssetsURL
  };
  const renderer = createRenderer(() => () => {
  }, options);
  const result = await renderer.renderToString({});
  const renderToString = (ssrContext) => {
    const config = useRuntimeConfig(ssrContext.event);
    ssrContext.modules ||= /* @__PURE__ */ new Set();
    ssrContext.payload.serverRendered = false;
    ssrContext.config = {
      public: config.public,
      app: config.app
    };
    return Promise.resolve(result);
  };
  return {
    rendererContext: renderer.rendererContext,
    renderToString
  };
});
function lazyCachedFunction(fn) {
  let res = null;
  return () => {
    if (res === null) {
      res = fn().catch((err) => {
        res = null;
        throw err;
      });
    }
    return res;
  };
}
function getRenderer(ssrContext) {
  return ssrContext.noSSR ? getSPARenderer() : getSSRRenderer();
}
const getSSRStyles = lazyCachedFunction(() => Promise.resolve().then(function () { return styles$1; }).then((r) => r.default || r));

async function renderInlineStyles(usedModules) {
  const styleMap = await getSSRStyles();
  const inlinedStyles = /* @__PURE__ */ new Set();
  for (const mod of usedModules) {
    if (mod in styleMap && styleMap[mod]) {
      for (const style of await styleMap[mod]()) {
        inlinedStyles.add(style);
      }
    }
  }
  return Array.from(inlinedStyles).map((style) => ({ innerHTML: style }));
}

const ROOT_NODE_REGEX = new RegExp(`^<${appRootTag}[^>]*>([\\s\\S]*)<\\/${appRootTag}>$`);
function getServerComponentHTML(body) {
  const match = body.match(ROOT_NODE_REGEX);
  return match?.[1] || body;
}
const SSR_SLOT_TELEPORT_MARKER = /^uid=([^;]*);slot=(.*)$/;
const SSR_CLIENT_TELEPORT_MARKER = /^uid=([^;]*);client=(.*)$/;
const SSR_CLIENT_SLOT_MARKER = /^island-slot=([^;]*);(.*)$/;
function getSlotIslandResponse(ssrContext) {
  if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.slots).length) {
    return void 0;
  }
  const response = {};
  for (const [name, slot] of Object.entries(ssrContext.islandContext.slots)) {
    response[name] = {
      ...slot,
      fallback: ssrContext.teleports?.[`island-fallback=${name}`]
    };
  }
  return response;
}
function getClientIslandResponse(ssrContext) {
  if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.components).length) {
    return void 0;
  }
  const response = {};
  for (const [clientUid, component] of Object.entries(ssrContext.islandContext.components)) {
    const html = ssrContext.teleports?.[clientUid]?.replaceAll("<!--teleport start anchor-->", "") || "";
    response[clientUid] = {
      ...component,
      html,
      slots: getComponentSlotTeleport(clientUid, ssrContext.teleports ?? {})
    };
  }
  return response;
}
function getComponentSlotTeleport(clientUid, teleports) {
  const entries = Object.entries(teleports);
  const slots = {};
  for (const [key, value] of entries) {
    const match = key.match(SSR_CLIENT_SLOT_MARKER);
    if (match) {
      const [, id, slot] = match;
      if (!slot || clientUid !== id) {
        continue;
      }
      slots[slot] = value;
    }
  }
  return slots;
}
function replaceIslandTeleports(ssrContext, html) {
  const { teleports, islandContext } = ssrContext;
  if (islandContext || !teleports) {
    return html;
  }
  for (const key in teleports) {
    const matchClientComp = key.match(SSR_CLIENT_TELEPORT_MARKER);
    if (matchClientComp) {
      const [, uid, clientId] = matchClientComp;
      if (!uid || !clientId) {
        continue;
      }
      html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-component="${clientId}"[^>]*>`), (full) => {
        return full + teleports[key];
      });
      continue;
    }
    const matchSlot = key.match(SSR_SLOT_TELEPORT_MARKER);
    if (matchSlot) {
      const [, uid, slot] = matchSlot;
      if (!uid || !slot) {
        continue;
      }
      html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-slot="${slot}"[^>]*>`), (full) => {
        return full + teleports[key];
      });
    }
  }
  return html;
}

const ISLAND_SUFFIX_RE = /\.json(\?.*)?$/;
const _SxA8c9 = defineEventHandler(async (event) => {
  const nitroApp = useNitroApp();
  setResponseHeaders(event, {
    "content-type": "application/json;charset=utf-8",
    "x-powered-by": "Nuxt"
  });
  const islandContext = await getIslandContext(event);
  const ssrContext = {
    ...createSSRContext(event),
    islandContext,
    noSSR: false,
    url: islandContext.url
  };
  const renderer = await getSSRRenderer();
  const renderResult = await renderer.renderToString(ssrContext).catch(async (error) => {
    await ssrContext.nuxt?.hooks.callHook("app:error", error);
    throw error;
  });
  const inlinedStyles = await renderInlineStyles(ssrContext.modules ?? []);
  await ssrContext.nuxt?.hooks.callHook("app:rendered", { ssrContext, renderResult });
  if (inlinedStyles.length) {
    ssrContext.head.push({ style: inlinedStyles });
  }
  {
    const { styles } = getRequestDependencies(ssrContext, renderer.rendererContext);
    const link = [];
    for (const resource of Object.values(styles)) {
      if ("inline" in getQuery(resource.file)) {
        continue;
      }
      if (resource.file.includes("scoped") && !resource.file.includes("pages/")) {
        link.push({ rel: "stylesheet", href: renderer.rendererContext.buildAssetsURL(resource.file), crossorigin: "" });
      }
    }
    if (link.length) {
      ssrContext.head.push({ link }, { mode: "server" });
    }
  }
  const islandHead = {};
  for (const entry of ssrContext.head.entries.values()) {
    for (const [key, value] of Object.entries(resolveUnrefHeadInput(entry.input))) {
      const currentValue = islandHead[key];
      if (Array.isArray(currentValue)) {
        currentValue.push(...value);
      }
      islandHead[key] = value;
    }
  }
  islandHead.link ||= [];
  islandHead.style ||= [];
  const islandResponse = {
    id: islandContext.id,
    head: islandHead,
    html: getServerComponentHTML(renderResult.html),
    components: getClientIslandResponse(ssrContext),
    slots: getSlotIslandResponse(ssrContext)
  };
  await nitroApp.hooks.callHook("render:island", islandResponse, { event, islandContext });
  return islandResponse;
});
async function getIslandContext(event) {
  let url = event.path || "";
  const componentParts = url.substring("/__nuxt_island".length + 1).replace(ISLAND_SUFFIX_RE, "").split("_");
  const hashId = componentParts.length > 1 ? componentParts.pop() : void 0;
  const componentName = componentParts.join("_");
  const context = event.method === "GET" ? getQuery$1(event) : await readBody(event);
  const ctx = {
    url: "/",
    ...context,
    id: hashId,
    name: componentName,
    props: destr$1(context.props) || {},
    slots: {},
    components: {}
  };
  return ctx;
}

const _lazy_7uoEp_ = () => Promise.resolve().then(function () { return run_post$3; });
const _lazy_YbyrET = () => Promise.resolve().then(function () { return chatClear_post$1; });
const _lazy_D1iUtV = () => Promise.resolve().then(function () { return chatHistory_get$1; });
const _lazy_xhoqpP = () => Promise.resolve().then(function () { return chatSave_post$1; });
const _lazy_ggBf09 = () => Promise.resolve().then(function () { return chat_post$1; });
const _lazy_0goYd2 = () => Promise.resolve().then(function () { return dbConnect_post$1; });
const _lazy_kfxtyM = () => Promise.resolve().then(function () { return dbDelete_post$1; });
const _lazy_e_5Kx8 = () => Promise.resolve().then(function () { return dbIntrospect$1; });
const _lazy__nW_Qz = () => Promise.resolve().then(function () { return dbList_get$1; });
const _lazy_XeQKK2 = () => Promise.resolve().then(function () { return dbQuery_post$1; });
const _lazy_TipQxP = () => Promise.resolve().then(function () { return dbTest_post$1; });
const _lazy_1DfatJ = () => Promise.resolve().then(function () { return query_post$1; });
const _lazy_KGEtbu = () => Promise.resolve().then(function () { return sqlGen_post$1; });
const _lazy_9wVj1x = () => Promise.resolve().then(function () { return summary_post$1; });
const _lazy_umMnoi = () => Promise.resolve().then(function () { return index_get$7; });
const _lazy_zT69OI = () => Promise.resolve().then(function () { return cron_post$1; });
const _lazy_RnlzWM = () => Promise.resolve().then(function () { return join_post$3; });
const _lazy_Xrcega = () => Promise.resolve().then(function () { return leave_post$1; });
const _lazy_AUHCYn = () => Promise.resolve().then(function () { return respond_post$3; });
const _lazy_NsrLAs = () => Promise.resolve().then(function () { return scheduleDelete_post$1; });
const _lazy_fSdkyC = () => Promise.resolve().then(function () { return schedule_post$3; });
const _lazy_1H4E86 = () => Promise.resolve().then(function () { return schedules_get$1; });
const _lazy_1ws3aT = () => Promise.resolve().then(function () { return status_get$1; });
const _lazy_cJP4lK = () => Promise.resolve().then(function () { return delete_post$3; });
const _lazy_4X0ruv = () => Promise.resolve().then(function () { return index_get$5; });
const _lazy_uwwFih = () => Promise.resolve().then(function () { return upload_post$1; });
const _lazy_477_X3 = () => Promise.resolve().then(function () { return disconnect_post$1; });
const _lazy_FGaEox = () => Promise.resolve().then(function () { return index_get$3; });
const _lazy_PHCR7H = () => Promise.resolve().then(function () { return save_post$1; });
const _lazy_kGExvi = () => Promise.resolve().then(function () { return test_post$1; });
const _lazy_IHRKkM = () => Promise.resolve().then(function () { return analyze_post$1; });
const _lazy_5DufXF = () => Promise.resolve().then(function () { return clearTranscript_post$1; });
const _lazy_ZFB2vv = () => Promise.resolve().then(function () { return create_post$3; });
const _lazy_ANxpz6 = () => Promise.resolve().then(function () { return delete_post$1; });
const _lazy_3UWwnQ = () => Promise.resolve().then(function () { return end_post$1; });
const _lazy_9F6U7k = () => Promise.resolve().then(function () { return index_get$1; });
const _lazy_nsOTNm = () => Promise.resolve().then(function () { return process_post$1; });
const _lazy_TIK6Fc = () => Promise.resolve().then(function () { return rename_post$1; });
const _lazy_r8hODW = () => Promise.resolve().then(function () { return transcribe_post$1; });
const _lazy_F_lH5m = () => Promise.resolve().then(function () { return index_post$1; });
const _lazy_fRHUYw = () => Promise.resolve().then(function () { return approve_post$1; });
const _lazy_eSkTI0 = () => Promise.resolve().then(function () { return respond_post$1; });
const _lazy_GT2KQv = () => Promise.resolve().then(function () { return synthesize_post$1; });
const _lazy_J3aVtm = () => Promise.resolve().then(function () { return index$1; });
const _lazy_1FW8NL = () => Promise.resolve().then(function () { return run_post$1; });
const _lazy_JtGszg = () => Promise.resolve().then(function () { return create_post$1; });
const _lazy_O0jvaW = () => Promise.resolve().then(function () { return inviteInfo_get$1; });
const _lazy_Txmvk7 = () => Promise.resolve().then(function () { return inviteManage_post$1; });
const _lazy_QCVXJ1 = () => Promise.resolve().then(function () { return invite_post$1; });
const _lazy_qX_d8q = () => Promise.resolve().then(function () { return join_post$1; });
const _lazy_jb9CA5 = () => Promise.resolve().then(function () { return members_get$1; });
const _lazy_zf5Rp_ = () => Promise.resolve().then(function () { return removeMember_post$1; });
const _lazy_ysC2at = () => Promise.resolve().then(function () { return runs_get$1; });
const _lazy_osKeXS = () => Promise.resolve().then(function () { return schedule_post$1; });
const _lazy_gGizpL = () => Promise.resolve().then(function () { return renderer$1; });

const handlers = [
  { route: '', handler: _umLBqG, lazy: false, middleware: true, method: undefined },
  { route: '/api/agents/run', handler: _lazy_7uoEp_, lazy: true, middleware: false, method: "post" },
  { route: '/api/analyst/chat-clear', handler: _lazy_YbyrET, lazy: true, middleware: false, method: "post" },
  { route: '/api/analyst/chat-history', handler: _lazy_D1iUtV, lazy: true, middleware: false, method: "get" },
  { route: '/api/analyst/chat-save', handler: _lazy_xhoqpP, lazy: true, middleware: false, method: "post" },
  { route: '/api/analyst/chat', handler: _lazy_ggBf09, lazy: true, middleware: false, method: "post" },
  { route: '/api/analyst/db-connect', handler: _lazy_0goYd2, lazy: true, middleware: false, method: "post" },
  { route: '/api/analyst/db-delete', handler: _lazy_kfxtyM, lazy: true, middleware: false, method: "post" },
  { route: '/api/analyst/db-introspect', handler: _lazy_e_5Kx8, lazy: true, middleware: false, method: undefined },
  { route: '/api/analyst/db-list', handler: _lazy__nW_Qz, lazy: true, middleware: false, method: "get" },
  { route: '/api/analyst/db-query', handler: _lazy_XeQKK2, lazy: true, middleware: false, method: "post" },
  { route: '/api/analyst/db-test', handler: _lazy_TipQxP, lazy: true, middleware: false, method: "post" },
  { route: '/api/analyst/query', handler: _lazy_1DfatJ, lazy: true, middleware: false, method: "post" },
  { route: '/api/analyst/sql-gen', handler: _lazy_KGEtbu, lazy: true, middleware: false, method: "post" },
  { route: '/api/analyst/summary', handler: _lazy_9wVj1x, lazy: true, middleware: false, method: "post" },
  { route: '/api/analytics', handler: _lazy_umMnoi, lazy: true, middleware: false, method: "get" },
  { route: '/api/bot/cron', handler: _lazy_zT69OI, lazy: true, middleware: false, method: "post" },
  { route: '/api/bot/join', handler: _lazy_RnlzWM, lazy: true, middleware: false, method: "post" },
  { route: '/api/bot/leave', handler: _lazy_Xrcega, lazy: true, middleware: false, method: "post" },
  { route: '/api/bot/respond', handler: _lazy_AUHCYn, lazy: true, middleware: false, method: "post" },
  { route: '/api/bot/schedule-delete', handler: _lazy_NsrLAs, lazy: true, middleware: false, method: "post" },
  { route: '/api/bot/schedule', handler: _lazy_fSdkyC, lazy: true, middleware: false, method: "post" },
  { route: '/api/bot/schedules', handler: _lazy_1H4E86, lazy: true, middleware: false, method: "get" },
  { route: '/api/bot/status', handler: _lazy_1ws3aT, lazy: true, middleware: false, method: "get" },
  { route: '/api/files/delete', handler: _lazy_cJP4lK, lazy: true, middleware: false, method: "post" },
  { route: '/api/files', handler: _lazy_4X0ruv, lazy: true, middleware: false, method: "get" },
  { route: '/api/files/upload', handler: _lazy_uwwFih, lazy: true, middleware: false, method: "post" },
  { route: '/api/integrations/disconnect', handler: _lazy_477_X3, lazy: true, middleware: false, method: "post" },
  { route: '/api/integrations', handler: _lazy_FGaEox, lazy: true, middleware: false, method: "get" },
  { route: '/api/integrations/save', handler: _lazy_PHCR7H, lazy: true, middleware: false, method: "post" },
  { route: '/api/integrations/test', handler: _lazy_kGExvi, lazy: true, middleware: false, method: "post" },
  { route: '/api/meetings/analyze', handler: _lazy_IHRKkM, lazy: true, middleware: false, method: "post" },
  { route: '/api/meetings/clear-transcript', handler: _lazy_5DufXF, lazy: true, middleware: false, method: "post" },
  { route: '/api/meetings/create', handler: _lazy_ZFB2vv, lazy: true, middleware: false, method: "post" },
  { route: '/api/meetings/delete', handler: _lazy_ANxpz6, lazy: true, middleware: false, method: "post" },
  { route: '/api/meetings/end', handler: _lazy_3UWwnQ, lazy: true, middleware: false, method: "post" },
  { route: '/api/meetings', handler: _lazy_9F6U7k, lazy: true, middleware: false, method: "get" },
  { route: '/api/meetings/process', handler: _lazy_nsOTNm, lazy: true, middleware: false, method: "post" },
  { route: '/api/meetings/rename', handler: _lazy_TIK6Fc, lazy: true, middleware: false, method: "post" },
  { route: '/api/meetings/transcribe', handler: _lazy_r8hODW, lazy: true, middleware: false, method: "post" },
  { route: '/api/messages', handler: _lazy_F_lH5m, lazy: true, middleware: false, method: "post" },
  { route: '/api/tasks/approve', handler: _lazy_fRHUYw, lazy: true, middleware: false, method: "post" },
  { route: '/api/voice/respond', handler: _lazy_eSkTI0, lazy: true, middleware: false, method: "post" },
  { route: '/api/voice/synthesize', handler: _lazy_GT2KQv, lazy: true, middleware: false, method: "post" },
  { route: '/api/workflows', handler: _lazy_J3aVtm, lazy: true, middleware: false, method: undefined },
  { route: '/api/workflows/run', handler: _lazy_1FW8NL, lazy: true, middleware: false, method: "post" },
  { route: '/api/workspace/create', handler: _lazy_JtGszg, lazy: true, middleware: false, method: "post" },
  { route: '/api/workspace/invite-info', handler: _lazy_O0jvaW, lazy: true, middleware: false, method: "get" },
  { route: '/api/workspace/invite-manage', handler: _lazy_Txmvk7, lazy: true, middleware: false, method: "post" },
  { route: '/api/workspace/invite', handler: _lazy_QCVXJ1, lazy: true, middleware: false, method: "post" },
  { route: '/api/workspace/join', handler: _lazy_qX_d8q, lazy: true, middleware: false, method: "post" },
  { route: '/api/workspace/members', handler: _lazy_jb9CA5, lazy: true, middleware: false, method: "get" },
  { route: '/api/workspace/remove-member', handler: _lazy_zf5Rp_, lazy: true, middleware: false, method: "post" },
  { route: '/api/workspace/runs', handler: _lazy_ysC2at, lazy: true, middleware: false, method: "get" },
  { route: '/api/workspace/schedule', handler: _lazy_osKeXS, lazy: true, middleware: false, method: "post" },
  { route: '/__nuxt_error', handler: _lazy_gGizpL, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_gGizpL, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(true),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter$1({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => callNodeRequestHandler(nodeHandler, aRequest);
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return fetchNodeRequestHandler(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const scheduledTasks = false;

const tasks = {
  
};

const __runningTasks__ = {};
async function runTask(name, {
  payload = {},
  context = {}
} = {}) {
  if (__runningTasks__[name]) {
    return __runningTasks__[name];
  }
  if (!(name in tasks)) {
    throw createError({
      message: `Task \`${name}\` is not available!`,
      statusCode: 404
    });
  }
  if (!tasks[name].resolve) {
    throw createError({
      message: `Task \`${name}\` is not implemented!`,
      statusCode: 501
    });
  }
  const handler = await tasks[name].resolve();
  const taskEvent = { name, payload, context };
  __runningTasks__[name] = handler.run(taskEvent);
  try {
    const res = await __runningTasks__[name];
    return res;
  } finally {
    delete __runningTasks__[name];
  }
}

if (!globalThis.crypto) {
  globalThis.crypto = nodeCrypto;
}
const { NITRO_NO_UNIX_SOCKET, NITRO_DEV_WORKER_ID } = process.env;
trapUnhandledNodeErrors();
parentPort?.on("message", (msg) => {
  if (msg && msg.event === "shutdown") {
    shutdown();
  }
});
const nitroApp = useNitroApp();
const server = new Server(toNodeListener(nitroApp.h3App));
let listener;
listen().catch(() => listen(
  true
  /* use random port */
)).catch((error) => {
  console.error("Dev worker failed to listen:", error);
  return shutdown();
});
nitroApp.router.get(
  "/_nitro/tasks",
  defineEventHandler(async (event) => {
    const _tasks = await Promise.all(
      Object.entries(tasks).map(async ([name, task]) => {
        const _task = await task.resolve?.();
        return [name, { description: _task?.meta?.description }];
      })
    );
    return {
      tasks: Object.fromEntries(_tasks),
      scheduledTasks
    };
  })
);
nitroApp.router.use(
  "/_nitro/tasks/:name",
  defineEventHandler(async (event) => {
    const name = getRouterParam(event, "name");
    const payload = {
      ...getQuery$1(event),
      ...await readBody(event).then((r) => r?.payload).catch(() => ({}))
    };
    return await runTask(name, { payload });
  })
);
function listen(useRandomPort = Boolean(
  NITRO_NO_UNIX_SOCKET || process.versions.webcontainer || "Bun" in globalThis && process.platform === "win32"
)) {
  return new Promise((resolve, reject) => {
    try {
      listener = server.listen(useRandomPort ? 0 : getSocketAddress(), () => {
        const address = server.address();
        parentPort?.postMessage({
          event: "listen",
          address: typeof address === "string" ? { socketPath: address } : { host: "localhost", port: address?.port }
        });
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
function getSocketAddress() {
  const socketName = `nitro-worker-${process.pid}-${threadId}-${NITRO_DEV_WORKER_ID}-${Math.round(Math.random() * 1e4)}.sock`;
  if (process.platform === "win32") {
    return join(String.raw`\\.\pipe`, socketName);
  }
  if (process.platform === "linux") {
    const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);
    if (nodeMajor >= 20) {
      return `\0${socketName}`;
    }
  }
  return join(tmpdir(), socketName);
}
async function shutdown() {
  server.closeAllConnections?.();
  await Promise.all([
    new Promise((resolve) => listener?.close(resolve)),
    nitroApp.hooks.callHook("close").catch(console.error)
  ]);
  parentPort?.postMessage({ event: "exit" });
}

const _messages = { "appName": "Nuxt", "version": "", "statusCode": 500, "statusMessage": "Server error", "description": "An error occurred in the application and the page could not be served. If you are the application owner, check your server logs for details.", "stack": "" };
const template$1 = (messages) => {
  messages = { ..._messages, ...messages };
  return '<!DOCTYPE html><html lang="en"><head><title>' + escapeHtml(messages.statusCode) + " - " + escapeHtml(messages.statusMessage || "Internal Server Error") + `</title><meta charset="utf-8"><meta content="width=device-width,initial-scale=1.0,minimum-scale=1.0" name="viewport"><style>.spotlight{background:linear-gradient(45deg,#00dc82,#36e4da 50%,#0047e1);bottom:-40vh;filter:blur(30vh);height:60vh;opacity:.8}*,:after,:before{border-color:var(--un-default-border-color,#e5e7eb);border-style:solid;border-width:0;box-sizing:border-box}:after,:before{--un-content:""}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-moz-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}body{line-height:inherit;margin:0}h1{font-size:inherit;font-weight:inherit}h1,p{margin:0}*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.pointer-events-none{pointer-events:none}.fixed{position:fixed}.left-0{left:0}.right-0{right:0}.z-10{z-index:10}.mb-6{margin-bottom:1.5rem}.mb-8{margin-bottom:2rem}.h-auto{height:auto}.min-h-screen{min-height:100vh}.flex{display:flex}.flex-1{flex:1 1 0%}.flex-col{flex-direction:column}.overflow-y-auto{overflow-y:auto}.rounded-t-md{border-top-left-radius:.375rem;border-top-right-radius:.375rem}.bg-black\\/5{background-color:#0000000d}.bg-white{--un-bg-opacity:1;background-color:rgb(255 255 255/var(--un-bg-opacity))}.p-8{padding:2rem}.px-10{padding-left:2.5rem;padding-right:2.5rem}.pt-14{padding-top:3.5rem}.text-6xl{font-size:3.75rem;line-height:1}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-black{--un-text-opacity:1;color:rgb(0 0 0/var(--un-text-opacity))}.font-light{font-weight:300}.font-medium{font-weight:500}.leading-tight{line-height:1.25}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}@media (prefers-color-scheme:dark){.dark\\:bg-black{--un-bg-opacity:1;background-color:rgb(0 0 0/var(--un-bg-opacity))}.dark\\:bg-white\\/10{background-color:#ffffff1a}.dark\\:text-white{--un-text-opacity:1;color:rgb(255 255 255/var(--un-text-opacity))}}@media (min-width:640px){.sm\\:text-2xl{font-size:1.5rem;line-height:2rem}.sm\\:text-8xl{font-size:6rem;line-height:1}}</style><script>!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver((e=>{for(const o of e)if("childList"===o.type)for(const e of o.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&r(e)})).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?r.credentials="include":"anonymous"===e.crossOrigin?r.credentials="omit":r.credentials="same-origin",r}(e);fetch(e.href,r)}}();<\/script></head><body class="antialiased bg-white dark:bg-black dark:text-white flex flex-col font-sans min-h-screen pt-14 px-10 text-black"><div class="fixed left-0 pointer-events-none right-0 spotlight"></div><h1 class="font-medium mb-6 sm:text-8xl text-6xl">` + escapeHtml(messages.statusCode) + '</h1><p class="font-light leading-tight mb-8 sm:text-2xl text-xl">' + escapeHtml(messages.description) + '</p><div class="bg-black/5 bg-white dark:bg-white/10 flex-1 h-auto overflow-y-auto rounded-t-md"><div class="font-light leading-tight p-8 text-xl z-10">' + escapeHtml(messages.stack) + "</div></div></body></html>";
};

const errorDev = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template$1
}, Symbol.toStringTag, { value: 'Module' }));

const template = "";

const _virtual__spaTemplate = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template
}, Symbol.toStringTag, { value: 'Module' }));

const styles = {};

const styles$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: styles
}, Symbol.toStringTag, { value: 'Module' }));

let _client = null;
function useAnthropic() {
  if (!_client) {
    _client = new Anthropic({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api",
      defaultHeaders: {
        "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
        "X-Title": "Atlantir"
      }
    });
  }
  return _client;
}
const ORCHESTRATOR_MODEL = "google/gemini-2.5-flash-lite";
const AGENT_MODEL = "google/gemini-2.5-flash-lite";
const EXECUTOR_MODEL = process.env.EXECUTOR_MODEL || "anthropic/claude-3.5-haiku";
const MAX_TOKENS = 4096;

function useSupabaseAdmin() {
  useRuntimeConfig();
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
}

const supabase = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  useSupabaseAdmin: useSupabaseAdmin
}, Symbol.toStringTag, { value: 'Module' }));

const PETS = {
  scout: {
    name: "scout",
    displayName: "Scout",
    role: "Researcher",
    agentType: "research",
    color: "#3b82f6",
    systemPrompt: `You are Scout, a precise research agent inside Atlantir.

Your job: find accurate, current information and synthesize it clearly.

Rules:
- Cite sources inline when verifiable facts come from specific places
- Mark anything estimated or unverified as [estimated] or [unverified]
- Be thorough but ruthlessly concise \u2014 no padding
- Use markdown headings and bullet points for clarity
- If company knowledge is provided in context, prioritise it and reference it explicitly
- Output ONLY the research findings \u2014 no meta-commentary about your process
- Never output raw JSON or raw data structures \u2014 always present findings in clear prose or structured markdown
- Use the web_search tool to find current information when your training knowledge may be outdated`
  },
  bolt: {
    name: "bolt",
    displayName: "Bolt",
    role: "Executor",
    agentType: "executor",
    color: "#f59e0b",
    systemPrompt: `You are Bolt, an execution agent inside Atlantir. Your job is to carry out every action the task requires by calling the appropriate tools.

You have access to tools for every connected integration. Use them directly \u2014 do NOT write out action plans in text, just call the tools.

Rules:
- Call all necessary tools to complete the task
- Use the exact tool for each action (e.g. slack_post_message for Slack, gmail_send for email)
- Chain tools when needed \u2014 e.g. list GitHub repos first, then create an issue
- If a tool fails, report the error clearly and try alternative approaches where possible
- Only use tools that are listed in your connected integrations context
- After all tools have been called, write a clear, readable summary of what was accomplished \u2014 never output raw JSON or code blocks as the final result
- Present tool results in plain language: "The repository contains 3 files: README.md, index.ts, and package.json"
- If a required integration is not connected, explain clearly what the user needs to set up`
  },
  sage: {
    name: "sage",
    displayName: "Sage",
    role: "Analyst",
    agentType: "analyst",
    color: "#8b5cf6",
    systemPrompt: `You are Sage, a strategic analyst inside Atlantir.

Your job: produce sharp, structured analysis that leads to clear decisions.

Rules:
- Use frameworks where helpful (SWOT, pros/cons, weighted criteria, etc.)
- Lead with the key insight, not the process
- Back every conclusion with specific reasoning from the data or context provided
- If company knowledge is in context, weave it into your analysis explicitly
- Output ONLY the analysis \u2014 no meta-commentary, no "here is my analysis" preamble`
  },
  quill: {
    name: "quill",
    displayName: "Quill",
    role: "Writer",
    agentType: "writer",
    color: "#10b981",
    systemPrompt: `You are Quill, a skilled writer inside Atlantir.

Your job: produce polished, ready-to-use written content.

Rules:
- Match tone precisely to context (formal for reports, warm for onboarding, punchy for Slack)
- Use markdown formatting where appropriate (headings, bold, bullet points)
- If company knowledge is provided, use specific details to personalise the content
- The output must be immediately usable \u2014 no "here is your draft" preamble
- No notes about what you wrote, no "feel free to adjust" footers
- Output ONLY the final content`
  },
  link: {
    name: "link",
    displayName: "Link",
    role: "Synthesizer",
    agentType: "orchestrator",
    color: "#ec4899",
    systemPrompt: `You are Link, a synthesis agent inside Atlantir.

Your job: take the output of previous agents and produce one final, clean, human-readable deliverable.

Rules:
- Synthesize everything into a single coherent output written in clear, professional prose
- NEVER output raw JSON, raw arrays, or code blocks as the final answer \u2014 always convert structured data into readable text
- If previous agents returned JSON with table names, column names, or any structured data, describe it in plain language: "The database contains the following tables: users (columns: id, name, email), orders (columns: id, user_id, total)..."
- If previous agents returned a list, format it as a readable bullet list with context, not a raw array
- Remove ALL meta-commentary: no "previous agent said", no "next steps", no pipeline notes
- The output is the final product \u2014 exactly what the user asked for, written as a human would write it
- Preserve all specific facts, data, names, and URLs from previous work
- Do NOT mention previous agents, the pipeline, or what needs to happen next
- Output ONLY the finished, human-readable work`
  }
};
const DEFAULT_PIPELINES = {
  research: ["scout", "link"],
  writer: ["quill", "link"],
  analyst: ["scout", "sage", "link"],
  executor: ["bolt"],
  default: ["scout", "link"]
};
function getPipelineForTask(agentType) {
  return DEFAULT_PIPELINES[agentType] || DEFAULT_PIPELINES.default;
}

const TOOL_REGISTRY = [
  // ── Slack ──────────────────────────────────────────────────────────────────
  {
    id: "slack_post_message",
    integration: "slack",
    name: "Post Slack message",
    description: "Post a message to a Slack channel. Use for team updates, notifications, summaries, and alerts.",
    inputSchema: {
      type: "object",
      properties: {
        message: { type: "string", description: "The message text to post. Supports Slack markdown (*bold*, _italic_, `code`)." },
        channel: { type: "string", description: "Channel name including #, e.g. #general. Leave blank to use the configured default channel." }
      },
      required: ["message"]
    }
  },
  // ── Gmail ──────────────────────────────────────────────────────────────────
  {
    id: "gmail_send",
    integration: "gmail",
    name: "Send email via Gmail",
    description: "Send an email from the configured Gmail account. Use for outreach, notifications, and follow-ups.",
    inputSchema: {
      type: "object",
      properties: {
        to: { type: "string", description: "Recipient email address." },
        subject: { type: "string", description: "Email subject line." },
        body: { type: "string", description: "Full email body text. Plain text or simple HTML." },
        cc: { type: "string", description: "Optional CC email address." }
      },
      required: ["to", "subject", "body"]
    }
  },
  // ── Google Calendar ────────────────────────────────────────────────────────
  {
    id: "calendar_create_event",
    integration: "google_calendar",
    name: "Create calendar event",
    description: "Create a Google Calendar event via the configured Make.com/Zapier webhook.",
    inputSchema: {
      type: "object",
      properties: {
        summary: { type: "string", description: "Event title." },
        description: { type: "string", description: "Event description or agenda." },
        startTime: { type: "string", description: 'Start time as ISO 8601 string or "tomorrow". Examples: "2024-06-15T14:00:00", "tomorrow".' },
        endTime: { type: "string", description: "End time as ISO 8601 string. If omitted, defaults to 1 hour after start." },
        attendees: { type: "string", description: "Comma-separated email addresses of attendees." }
      },
      required: ["summary"]
    }
  },
  // ── GitHub ─────────────────────────────────────────────────────────────────
  {
    id: "github_list_repos",
    integration: "github",
    name: "List GitHub repositories",
    description: "List all GitHub repositories accessible with the configured token, sorted by most recently pushed.",
    inputSchema: { type: "object", properties: {}, required: [] }
  },
  {
    id: "github_list_files",
    integration: "github",
    name: "List files in GitHub repo",
    description: "List files and directories in a GitHub repository at a given path.",
    inputSchema: {
      type: "object",
      properties: {
        repo: { type: "string", description: 'Repository in "owner/repo" format. Leave blank to auto-detect from connected account.' },
        path: { type: "string", description: 'Path within the repo, e.g. "src/components". Leave blank for root.' }
      }
    }
  },
  {
    id: "github_create_issue",
    integration: "github",
    name: "Create GitHub issue",
    description: "Create a new issue in a GitHub repository.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Issue title." },
        body: { type: "string", description: "Issue body \u2014 use markdown for formatting." },
        labels: { type: "string", description: 'Comma-separated label names, e.g. "bug,enhancement".' },
        repo: { type: "string", description: 'Repository in "owner/repo" format. Leave blank to use default.' }
      },
      required: ["title", "body"]
    }
  },
  {
    id: "github_commit_file",
    integration: "github",
    name: "Commit file to GitHub",
    description: "Create or update a file in a GitHub repository with a commit.",
    inputSchema: {
      type: "object",
      properties: {
        filePath: { type: "string", description: 'File path within the repo, e.g. "docs/README.md".' },
        content: { type: "string", description: "Full file content." },
        commitMessage: { type: "string", description: "Git commit message." },
        repo: { type: "string", description: 'Repository in "owner/repo" format. Leave blank to use default.' }
      },
      required: ["filePath", "content", "commitMessage"]
    }
  },
  {
    id: "github_create_pr",
    integration: "github",
    name: "Create GitHub pull request",
    description: "Create a pull request in a GitHub repository.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "PR title." },
        body: { type: "string", description: "PR description \u2014 use markdown." },
        head: { type: "string", description: "Head branch name (source)." },
        base: { type: "string", description: 'Base branch name (target), defaults to "main".' },
        repo: { type: "string", description: 'Repository in "owner/repo" format. Leave blank to use default.' }
      },
      required: ["title", "body", "head"]
    }
  },
  // ── Notion ─────────────────────────────────────────────────────────────────
  {
    id: "notion_create_page",
    integration: "notion",
    name: "Create Notion page",
    description: "Create a new page in the connected Notion database.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Page title." },
        content: { type: "string", description: "Page content in plain text or markdown." }
      },
      required: ["title", "content"]
    }
  },
  {
    id: "notion_append_block",
    integration: "notion",
    name: "Append to Notion page",
    description: "Append content blocks to an existing Notion page by its ID.",
    inputSchema: {
      type: "object",
      properties: {
        pageId: { type: "string", description: "Notion page ID." },
        content: { type: "string", description: "Text content to append." }
      },
      required: ["pageId", "content"]
    }
  },
  // ── Zapier ─────────────────────────────────────────────────────────────────
  {
    id: "zapier_trigger",
    integration: "zapier",
    name: "Trigger Zapier webhook",
    description: "Send a payload to the connected Zapier webhook, triggering any connected automation.",
    inputSchema: {
      type: "object",
      properties: {
        event: { type: "string", description: "Event name describing what happened." },
        data: { type: "string", description: "JSON string or plain text payload to send with the event." }
      },
      required: ["event"]
    }
  },
  // ── Excel ──────────────────────────────────────────────────────────────────
  {
    id: "excel_create_file",
    integration: "excel",
    name: "Create Excel spreadsheet",
    description: "Generate a formatted .xlsx file and upload it. Always available \u2014 no external connection needed.",
    inputSchema: {
      type: "object",
      properties: {
        filename: { type: "string", description: 'Filename without extension, e.g. "Q2_Report".' },
        sheetName: { type: "string", description: 'Sheet tab name. Defaults to "Sheet1".' },
        data: { type: "string", description: "CSV-formatted data. First line = column headers. Remaining lines = data rows. Use comma as delimiter." }
      },
      required: ["filename", "data"]
    }
  },
  // ── Jira ───────────────────────────────────────────────────────────────────
  {
    id: "jira_create_issue",
    integration: "jira",
    name: "Create Jira issue",
    description: "Create a new issue (story, bug, task) in Jira.",
    inputSchema: {
      type: "object",
      properties: {
        summary: { type: "string", description: "Issue summary/title." },
        description: { type: "string", description: "Detailed issue description." },
        issueType: { type: "string", description: "Issue type: Story, Bug, Task, or Epic.", enum: ["Story", "Bug", "Task", "Epic"] },
        priority: { type: "string", description: "Priority: Highest, High, Medium, Low, Lowest.", enum: ["Highest", "High", "Medium", "Low", "Lowest"] },
        labels: { type: "string", description: "Comma-separated label names." }
      },
      required: ["summary", "description"]
    }
  },
  {
    id: "jira_list_issues",
    integration: "jira",
    name: "List Jira issues",
    description: "Search and list Jira issues using a JQL query.",
    inputSchema: {
      type: "object",
      properties: {
        jql: { type: "string", description: 'JQL query, e.g. "project = PROJ AND status = Open".' },
        maxResults: { type: "string", description: "Maximum number of results, defaults to 20." }
      },
      required: ["jql"]
    }
  },
  // ── Linear ─────────────────────────────────────────────────────────────────
  {
    id: "linear_create_issue",
    integration: "linear",
    name: "Create Linear issue",
    description: "Create a new issue in a Linear team.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Issue title." },
        description: { type: "string", description: "Issue description in markdown." },
        priority: { type: "string", description: "Priority: urgent, high, medium, low, no_priority.", enum: ["urgent", "high", "medium", "low", "no_priority"] },
        teamId: { type: "string", description: "Linear team ID or name. Leave blank to use default." }
      },
      required: ["title"]
    }
  },
  {
    id: "linear_list_issues",
    integration: "linear",
    name: "List Linear issues",
    description: "List open issues in a Linear team.",
    inputSchema: {
      type: "object",
      properties: {
        teamId: { type: "string", description: "Team ID or name. Leave blank for all teams." },
        state: { type: "string", description: "Filter by state: Todo, In Progress, Done, Cancelled." }
      }
    }
  },
  // ── HubSpot ────────────────────────────────────────────────────────────────
  {
    id: "hubspot_create_contact",
    integration: "hubspot",
    name: "Create HubSpot contact",
    description: "Create a new contact record in HubSpot CRM.",
    inputSchema: {
      type: "object",
      properties: {
        email: { type: "string", description: "Contact email address." },
        firstName: { type: "string", description: "First name." },
        lastName: { type: "string", description: "Last name." },
        company: { type: "string", description: "Company name." },
        phone: { type: "string", description: "Phone number." },
        notes: { type: "string", description: "Notes about this contact." }
      },
      required: ["email"]
    }
  },
  {
    id: "hubspot_create_deal",
    integration: "hubspot",
    name: "Create HubSpot deal",
    description: "Create a new deal in HubSpot CRM pipeline.",
    inputSchema: {
      type: "object",
      properties: {
        dealName: { type: "string", description: "Deal name." },
        amount: { type: "string", description: "Deal value as a number." },
        stage: { type: "string", description: 'Deal stage, e.g. "appointmentscheduled", "qualifiedtobuy".' },
        closeDate: { type: "string", description: "Expected close date as ISO 8601." },
        contactEmail: { type: "string", description: "Email of associated contact." }
      },
      required: ["dealName"]
    }
  },
  {
    id: "hubspot_search_contacts",
    integration: "hubspot",
    name: "Search HubSpot contacts",
    description: "Search for contacts in HubSpot by email, name, or company.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query \u2014 email, name, or company." }
      },
      required: ["query"]
    }
  },
  // ── Twilio ─────────────────────────────────────────────────────────────────
  {
    id: "twilio_send_sms",
    integration: "twilio",
    name: "Send SMS via Twilio",
    description: "Send an SMS message to a phone number using Twilio.",
    inputSchema: {
      type: "object",
      properties: {
        to: { type: "string", description: "Recipient phone number in E.164 format, e.g. +1234567890." },
        message: { type: "string", description: "SMS message body (max 160 characters for single segment)." }
      },
      required: ["to", "message"]
    }
  },
  // ── Stripe ─────────────────────────────────────────────────────────────────
  {
    id: "stripe_list_customers",
    integration: "stripe",
    name: "List Stripe customers",
    description: "List recent Stripe customers with their payment info.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "string", description: "Number of customers to return (default 10, max 100)." },
        email: { type: "string", description: "Filter by email address." }
      }
    }
  },
  {
    id: "stripe_get_revenue",
    integration: "stripe",
    name: "Get Stripe revenue summary",
    description: "Get a revenue summary from Stripe including recent charges and subscriptions.",
    inputSchema: {
      type: "object",
      properties: {
        days: { type: "string", description: "Number of past days to summarize (default 30)." }
      }
    }
  },
  // ── Airtable ───────────────────────────────────────────────────────────────
  {
    id: "airtable_create_record",
    integration: "airtable",
    name: "Create Airtable record",
    description: "Create a new record in an Airtable base and table.",
    inputSchema: {
      type: "object",
      properties: {
        baseId: { type: "string", description: "Airtable base ID (from base URL)." },
        tableName: { type: "string", description: "Table name." },
        fields: { type: "string", description: 'JSON object of field names and values, e.g. {"Name": "Alice", "Status": "Active"}.' }
      },
      required: ["baseId", "tableName", "fields"]
    }
  },
  {
    id: "airtable_list_records",
    integration: "airtable",
    name: "List Airtable records",
    description: "List records from an Airtable table with optional filtering.",
    inputSchema: {
      type: "object",
      properties: {
        baseId: { type: "string", description: "Airtable base ID." },
        tableName: { type: "string", description: "Table name." },
        filterFormula: { type: "string", description: `Airtable filter formula, e.g. "{Status}='Active'".` },
        maxRecords: { type: "string", description: "Max records to return (default 20)." }
      },
      required: ["baseId", "tableName"]
    }
  },
  // ── Asana ──────────────────────────────────────────────────────────────────
  {
    id: "asana_create_task",
    integration: "asana",
    name: "Create Asana task",
    description: "Create a new task in an Asana project.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Task name." },
        notes: { type: "string", description: "Task description/notes." },
        projectId: { type: "string", description: "Asana project ID. Leave blank to use default." },
        dueDate: { type: "string", description: "Due date as YYYY-MM-DD." },
        assignee: { type: "string", description: "Assignee email or user GID." }
      },
      required: ["name"]
    }
  },
  // ── Trello ─────────────────────────────────────────────────────────────────
  {
    id: "trello_create_card",
    integration: "trello",
    name: "Create Trello card",
    description: "Create a new card in a Trello list.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Card name/title." },
        desc: { type: "string", description: "Card description." },
        listId: { type: "string", description: "Trello list ID to add the card to." },
        due: { type: "string", description: "Due date as ISO 8601." },
        labels: { type: "string", description: "Comma-separated label colors: red, orange, yellow, green, blue, purple." }
      },
      required: ["name", "listId"]
    }
  },
  // ── Intercom ───────────────────────────────────────────────────────────────
  {
    id: "intercom_send_message",
    integration: "intercom",
    name: "Send Intercom message",
    description: "Send a message to a user via Intercom.",
    inputSchema: {
      type: "object",
      properties: {
        userId: { type: "string", description: "Intercom user ID or email." },
        message: { type: "string", description: "Message to send." },
        subject: { type: "string", description: "Subject line (for email messages)." }
      },
      required: ["userId", "message"]
    }
  },
  // ── Zendesk ────────────────────────────────────────────────────────────────
  {
    id: "zendesk_create_ticket",
    integration: "zendesk",
    name: "Create Zendesk ticket",
    description: "Create a support ticket in Zendesk.",
    inputSchema: {
      type: "object",
      properties: {
        subject: { type: "string", description: "Ticket subject." },
        description: { type: "string", description: "Ticket description/body." },
        priority: { type: "string", description: "Ticket priority: urgent, high, normal, low.", enum: ["urgent", "high", "normal", "low"] },
        requesterEmail: { type: "string", description: "Requester email address." },
        tags: { type: "string", description: "Comma-separated tags." }
      },
      required: ["subject", "description"]
    }
  },
  // ── Vercel ─────────────────────────────────────────────────────────────────
  {
    id: "vercel_list_deployments",
    integration: "vercel",
    name: "List Vercel deployments",
    description: "List recent Vercel deployments for a project.",
    inputSchema: {
      type: "object",
      properties: {
        projectName: { type: "string", description: "Project name. Leave blank for all projects." },
        limit: { type: "string", description: "Number of deployments to return (default 10)." }
      }
    }
  },
  {
    id: "vercel_get_project",
    integration: "vercel",
    name: "Get Vercel project info",
    description: "Get details about a Vercel project including latest deployment status.",
    inputSchema: {
      type: "object",
      properties: {
        projectName: { type: "string", description: "Vercel project name or ID." }
      },
      required: ["projectName"]
    }
  },
  // ── PagerDuty ──────────────────────────────────────────────────────────────
  {
    id: "pagerduty_create_incident",
    integration: "pagerduty",
    name: "Create PagerDuty incident",
    description: "Trigger a new incident in PagerDuty.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Incident title." },
        description: { type: "string", description: "Incident details." },
        severity: { type: "string", description: "Severity: critical, error, warning, info.", enum: ["critical", "error", "warning", "info"] },
        serviceKey: { type: "string", description: "PagerDuty service integration key. Leave blank to use default." }
      },
      required: ["title"]
    }
  },
  // ── Sentry ─────────────────────────────────────────────────────────────────
  {
    id: "sentry_list_issues",
    integration: "sentry",
    name: "List Sentry issues",
    description: "List recent error issues from Sentry.",
    inputSchema: {
      type: "object",
      properties: {
        project: { type: "string", description: "Sentry project slug. Leave blank for all projects." },
        query: { type: "string", description: 'Search query, e.g. "is:unresolved level:error".' },
        limit: { type: "string", description: "Number of issues (default 10)." }
      }
    }
  },
  // ── Cloudflare ─────────────────────────────────────────────────────────────
  {
    id: "cloudflare_list_zones",
    integration: "cloudflare",
    name: "List Cloudflare zones",
    description: "List Cloudflare zones (domains) in the account.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    id: "cloudflare_purge_cache",
    integration: "cloudflare",
    name: "Purge Cloudflare cache",
    description: "Purge cached content for a Cloudflare zone.",
    inputSchema: {
      type: "object",
      properties: {
        zoneId: { type: "string", description: "Cloudflare zone ID." },
        urls: { type: "string", description: "Comma-separated URLs to purge. Leave blank to purge everything." }
      },
      required: ["zoneId"]
    }
  },
  // ── Web search (always available) ─────────────────────────────────────────
  {
    id: "web_search",
    integration: "web_search",
    name: "Search the web",
    description: "Search the internet for current information, news, and facts. Always available \u2014 no connection needed.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query." },
        numResults: { type: "string", description: "Number of results (default 5)." }
      },
      required: ["query"]
    }
  }
];
async function getConnectedTools(workspaceId) {
  const { useSupabaseAdmin } = await Promise.resolve().then(function () { return supabase; });
  const sb = useSupabaseAdmin();
  const { data } = await sb.from("integrations").select("type").eq("workspace_id", workspaceId).eq("status", "connected");
  const connectedTypes = /* @__PURE__ */ new Set([
    "web_search",
    "excel",
    ...(data || []).map((i) => i.type)
  ]);
  return TOOL_REGISTRY.filter((t) => connectedTypes.has(t.integration));
}
function toAnthropicTool(tool) {
  return {
    name: tool.id,
    description: tool.description,
    input_schema: tool.inputSchema
  };
}

async function getIntegration(workspaceId, type) {
  const sb = useSupabaseAdmin();
  const { data } = await sb.from("integrations").select("config").eq("workspace_id", workspaceId).eq("type", type).eq("status", "connected").single();
  return (data == null ? void 0 : data.config) || null;
}
async function sendSlack(workspaceId, message, channel) {
  const config = await getIntegration(workspaceId, "slack");
  if (!(config == null ? void 0 : config.webhook_url)) return false;
  const res = await fetch(config.webhook_url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channel: channel || config.channel || "#general", text: message, username: "Atlantir", icon_emoji: ":robot_face:" })
  });
  return res.ok;
}
async function resolveGitHubRepo(token, preferredRepo) {
  var _a;
  if (preferredRepo && preferredRepo.includes("/")) {
    const check = await fetch(`https://api.github.com/repos/${preferredRepo}`, {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/vnd.github+json" }
    });
    if (check.ok) return preferredRepo;
  }
  const res = await fetch("https://api.github.com/user/repos?per_page=1&sort=pushed", {
    headers: { "Authorization": `Bearer ${token}`, "Accept": "application/vnd.github+json" }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return ((_a = data[0]) == null ? void 0 : _a.full_name) || null;
}
async function ghFetch(token, path, opts = {}) {
  return fetch(`https://api.github.com${path}`, {
    ...opts,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json",
      ...opts.headers || {}
    }
  });
}
async function listGitHubUserRepos(workspaceId) {
  const cfg = await getIntegration(workspaceId, "github");
  if (!(cfg == null ? void 0 : cfg.token)) return null;
  const res = await ghFetch(cfg.token, "/user/repos?per_page=50&sort=pushed");
  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data) ? data.map((r) => ({ name: r.name, full_name: r.full_name, private: r.private, description: r.description || "", language: r.language || "", stars: r.stargazers_count || 0, pushed_at: r.pushed_at, default_branch: r.default_branch })) : null;
}
async function getGitHubRepoInfo(workspaceId, repo) {
  const cfg = await getIntegration(workspaceId, "github");
  if (!(cfg == null ? void 0 : cfg.token)) return null;
  const resolvedRepo = await resolveGitHubRepo(cfg.token, repo || cfg.repo);
  if (!resolvedRepo) return null;
  const [repoRes, langRes] = await Promise.all([
    ghFetch(cfg.token, `/repos/${resolvedRepo}`),
    ghFetch(cfg.token, `/repos/${resolvedRepo}/languages`)
  ]);
  if (!repoRes.ok) return null;
  const r = await repoRes.json();
  const langs = langRes.ok ? Object.keys(await langRes.json()).slice(0, 5) : [];
  return { name: r.name, full_name: r.full_name, description: r.description, private: r.private, stars: r.stargazers_count, forks: r.forks_count, open_issues: r.open_issues_count, default_branch: r.default_branch, languages: langs, url: r.html_url, pushed_at: r.pushed_at, topics: r.topics || [] };
}
async function listGitHubFiles(workspaceId, path = "", repo, ref) {
  const cfg = await getIntegration(workspaceId, "github");
  if (!(cfg == null ? void 0 : cfg.token)) return null;
  const resolvedRepo = await resolveGitHubRepo(cfg.token, repo || cfg.repo);
  if (!resolvedRepo) return null;
  const query = ref ? `?ref=${encodeURIComponent(ref)}` : "";
  const res = await ghFetch(cfg.token, `/repos/${resolvedRepo}/contents/${path}${query}`);
  if (!res.ok) return null;
  const data = await res.json();
  if (!Array.isArray(data)) return null;
  return { repo: resolvedRepo, files: data.map((f) => ({ name: f.name, type: f.type, path: f.path, size: f.size, sha: f.sha })) };
}
async function readGitHubFile(workspaceId, filePath, repo, ref) {
  const cfg = await getIntegration(workspaceId, "github");
  if (!(cfg == null ? void 0 : cfg.token)) return null;
  const resolvedRepo = await resolveGitHubRepo(cfg.token, repo || cfg.repo);
  if (!resolvedRepo) return null;
  const query = ref ? `?ref=${encodeURIComponent(ref)}` : "";
  const res = await ghFetch(cfg.token, `/repos/${resolvedRepo}/contents/${filePath}${query}`);
  if (!res.ok) return null;
  const data = await res.json();
  if (data.type !== "file" || !data.content) return null;
  const decoded = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf-8");
  return { content: decoded, sha: data.sha, repo: resolvedRepo, url: data.html_url };
}
async function getGitHubCommits(workspaceId, repo, branch, limit = 20) {
  const cfg = await getIntegration(workspaceId, "github");
  if (!(cfg == null ? void 0 : cfg.token)) return null;
  const resolvedRepo = await resolveGitHubRepo(cfg.token, repo || cfg.repo);
  if (!resolvedRepo) return null;
  const params = new URLSearchParams({ per_page: String(limit) });
  if (branch) params.set("sha", branch);
  const res = await ghFetch(cfg.token, `/repos/${resolvedRepo}/commits?${params}`);
  if (!res.ok) return null;
  const data = await res.json();
  if (!Array.isArray(data)) return null;
  return data.map((c) => {
    var _a, _b, _c, _d, _e, _f, _g;
    return {
      sha: (_a = c.sha) == null ? void 0 : _a.slice(0, 7),
      full_sha: c.sha,
      message: ((_b = c.commit) == null ? void 0 : _b.message) || "",
      author: ((_d = (_c = c.commit) == null ? void 0 : _c.author) == null ? void 0 : _d.name) || ((_e = c.author) == null ? void 0 : _e.login) || "unknown",
      date: ((_g = (_f = c.commit) == null ? void 0 : _f.author) == null ? void 0 : _g.date) || "",
      url: c.html_url
    };
  });
}
async function getGitHubCommitDetail(workspaceId, sha, repo) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const cfg = await getIntegration(workspaceId, "github");
  if (!(cfg == null ? void 0 : cfg.token)) return null;
  const resolvedRepo = await resolveGitHubRepo(cfg.token, repo || cfg.repo);
  if (!resolvedRepo) return null;
  const res = await ghFetch(cfg.token, `/repos/${resolvedRepo}/commits/${sha}`);
  if (!res.ok) return null;
  const data = await res.json();
  return {
    sha: (_a = data.sha) == null ? void 0 : _a.slice(0, 7),
    message: ((_b = data.commit) == null ? void 0 : _b.message) || "",
    author: ((_d = (_c = data.commit) == null ? void 0 : _c.author) == null ? void 0 : _d.name) || "",
    date: ((_f = (_e = data.commit) == null ? void 0 : _e.author) == null ? void 0 : _f.date) || "",
    url: data.html_url,
    additions: (_g = data.stats) == null ? void 0 : _g.additions,
    deletions: (_h = data.stats) == null ? void 0 : _h.deletions,
    files: (data.files || []).map((f) => {
      var _a2;
      return { filename: f.filename, status: f.status, additions: f.additions, deletions: f.deletions, patch: (_a2 = f.patch) == null ? void 0 : _a2.slice(0, 800) };
    })
  };
}
async function listGitHubBranches(workspaceId, repo) {
  const cfg = await getIntegration(workspaceId, "github");
  if (!(cfg == null ? void 0 : cfg.token)) return null;
  const resolvedRepo = await resolveGitHubRepo(cfg.token, repo || cfg.repo);
  if (!resolvedRepo) return null;
  const res = await ghFetch(cfg.token, `/repos/${resolvedRepo}/branches?per_page=30`);
  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data) ? data.map((b) => {
    var _a, _b;
    return { name: b.name, protected: b.protected, sha: (_b = (_a = b.commit) == null ? void 0 : _a.sha) == null ? void 0 : _b.slice(0, 7) };
  }) : null;
}
async function listGitHubIssues(workspaceId, repo, state = "open", limit = 20) {
  const cfg = await getIntegration(workspaceId, "github");
  if (!(cfg == null ? void 0 : cfg.token)) return null;
  const resolvedRepo = await resolveGitHubRepo(cfg.token, repo || cfg.repo);
  if (!resolvedRepo) return null;
  const res = await ghFetch(cfg.token, `/repos/${resolvedRepo}/issues?state=${state}&per_page=${limit}`);
  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data) ? data.filter((i) => !i.pull_request).map((i) => {
    var _a, _b;
    return {
      number: i.number,
      title: i.title,
      state: i.state,
      labels: (i.labels || []).map((l) => l.name),
      author: ((_a = i.user) == null ? void 0 : _a.login) || "",
      created_at: i.created_at,
      url: i.html_url,
      body: (_b = i.body) == null ? void 0 : _b.slice(0, 400)
    };
  }) : null;
}
async function listGitHubPRs(workspaceId, repo, state = "open", limit = 20) {
  const cfg = await getIntegration(workspaceId, "github");
  if (!(cfg == null ? void 0 : cfg.token)) return null;
  const resolvedRepo = await resolveGitHubRepo(cfg.token, repo || cfg.repo);
  if (!resolvedRepo) return null;
  const res = await ghFetch(cfg.token, `/repos/${resolvedRepo}/pulls?state=${state}&per_page=${limit}`);
  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data) ? data.map((p) => {
    var _a, _b, _c;
    return { number: p.number, title: p.title, state: p.state, author: ((_a = p.user) == null ? void 0 : _a.login) || "", base: (_b = p.base) == null ? void 0 : _b.ref, head: (_c = p.head) == null ? void 0 : _c.ref, created_at: p.created_at, url: p.html_url, draft: p.draft, merged_at: p.merged_at };
  }) : null;
}
async function searchGitHubCode(workspaceId, query, repo) {
  const cfg = await getIntegration(workspaceId, "github");
  if (!(cfg == null ? void 0 : cfg.token)) return null;
  const resolvedRepo = repo ? await resolveGitHubRepo(cfg.token, repo) : null;
  const q = resolvedRepo ? `${query} repo:${resolvedRepo}` : query;
  const res = await ghFetch(cfg.token, `/search/code?q=${encodeURIComponent(q)}&per_page=10`);
  if (!res.ok) return null;
  const data = await res.json();
  return (data.items || []).map((i) => {
    var _a, _b, _c, _d;
    return { path: i.path, repo: (_a = i.repository) == null ? void 0 : _a.full_name, url: i.html_url, snippet: (_d = (_c = (_b = i.text_matches) == null ? void 0 : _b[0]) == null ? void 0 : _c.fragment) == null ? void 0 : _d.slice(0, 300) };
  });
}
async function createGitHubIssue(workspaceId, title, body, labels, repo) {
  const cfg = await getIntegration(workspaceId, "github");
  if (!(cfg == null ? void 0 : cfg.token)) return null;
  const resolvedRepo = await resolveGitHubRepo(cfg.token, repo || cfg.repo);
  if (!resolvedRepo) return null;
  const res = await ghFetch(cfg.token, `/repos/${resolvedRepo}/issues`, {
    method: "POST",
    body: JSON.stringify({ title, body, labels: labels || [] })
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.html_url;
}
async function updateGitHubIssue(workspaceId, issueNumber, updates, repo) {
  const cfg = await getIntegration(workspaceId, "github");
  if (!(cfg == null ? void 0 : cfg.token)) return null;
  const resolvedRepo = await resolveGitHubRepo(cfg.token, repo || cfg.repo);
  if (!resolvedRepo) return null;
  const res = await ghFetch(cfg.token, `/repos/${resolvedRepo}/issues/${issueNumber}`, {
    method: "PATCH",
    body: JSON.stringify(updates)
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.html_url;
}
async function createOrUpdateGitHubFile(workspaceId, filePath, content, commitMessage, repo) {
  var _a, _b;
  const cfg = await getIntegration(workspaceId, "github");
  if (!(cfg == null ? void 0 : cfg.token)) return null;
  const resolvedRepo = await resolveGitHubRepo(cfg.token, repo || cfg.repo);
  if (!resolvedRepo) return null;
  const checkRes = await ghFetch(cfg.token, `/repos/${resolvedRepo}/contents/${filePath}`);
  const existingData = checkRes.ok ? await checkRes.json() : null;
  const sha = existingData == null ? void 0 : existingData.sha;
  const res = await ghFetch(cfg.token, `/repos/${resolvedRepo}/contents/${filePath}`, {
    method: "PUT",
    body: JSON.stringify({ message: commitMessage, content: Buffer.from(content).toString("base64"), ...sha ? { sha } : {} })
  });
  if (!res.ok) return null;
  const data = await res.json();
  return ((_a = data.content) == null ? void 0 : _a.html_url) || ((_b = data.commit) == null ? void 0 : _b.html_url) || null;
}
async function deleteGitHubFile(workspaceId, filePath, commitMessage, repo) {
  const cfg = await getIntegration(workspaceId, "github");
  if (!(cfg == null ? void 0 : cfg.token)) return false;
  const resolvedRepo = await resolveGitHubRepo(cfg.token, repo || cfg.repo);
  if (!resolvedRepo) return false;
  const fileRes = await ghFetch(cfg.token, `/repos/${resolvedRepo}/contents/${filePath}`);
  if (!fileRes.ok) return false;
  const fileData = await fileRes.json();
  const res = await ghFetch(cfg.token, `/repos/${resolvedRepo}/contents/${filePath}`, {
    method: "DELETE",
    body: JSON.stringify({ message: commitMessage, sha: fileData.sha })
  });
  return res.ok;
}
async function createGitHubPR(workspaceId, title, body, head, base = "main", repo) {
  const cfg = await getIntegration(workspaceId, "github");
  if (!(cfg == null ? void 0 : cfg.token)) return null;
  const resolvedRepo = await resolveGitHubRepo(cfg.token, repo || cfg.repo);
  if (!resolvedRepo) return null;
  const res = await ghFetch(cfg.token, `/repos/${resolvedRepo}/pulls`, {
    method: "POST",
    body: JSON.stringify({ title, body, head, base })
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.html_url;
}
async function sendGmail(workspaceId, to, subject, body) {
  const config = await getIntegration(workspaceId, "gmail");
  if (!(config == null ? void 0 : config.sender_email) || !(config == null ? void 0 : config.app_password)) return false;
  try {
    const nodemailer = await import('file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/nodemailer/lib/nodemailer.js');
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: config.sender_email, pass: config.app_password.replace(/\s/g, "") }
    });
    await transporter.sendMail({ from: config.sender_email, to, subject, text: body });
    return true;
  } catch {
    return false;
  }
}
async function createCalendarEvent(workspaceId, summary, description, startTime) {
  const config = await getIntegration(workspaceId, "google_calendar");
  if (!(config == null ? void 0 : config.webhook_url)) return null;
  let resolvedStart;
  if (!startTime || startTime.trim() === "") {
    resolvedStart = new Date(Date.now() + 864e5);
  } else if (/^tomorrow$/i.test(startTime.trim())) {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
    resolvedStart = d;
  } else {
    const parsed = new Date(startTime);
    resolvedStart = isNaN(parsed.getTime()) ? new Date(Date.now() + 864e5) : parsed;
  }
  const end = new Date(resolvedStart.getTime() + 36e5);
  const res = await fetch(config.webhook_url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source: "agentspace", summary, description: description || "", start: resolvedStart.toISOString(), end: end.toISOString() })
  });
  return res.ok ? "created" : null;
}
async function triggerZapier(workspaceId, payload) {
  const config = await getIntegration(workspaceId, "zapier");
  if (!(config == null ? void 0 : config.webhook_url)) return false;
  const res = await fetch(config.webhook_url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source: "agentspace", ...payload })
  });
  return res.ok;
}
async function createExcelFile(workspaceId, filename, csvData, sheetName) {
  try {
    const ExcelJS = await import('file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/exceljs/excel.js');
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(sheetName || "Sheet1");
    const delimiter = csvData.includes("|") ? "|" : ",";
    const lines = csvData.trim().split("\n").filter((l) => l.trim());
    if (lines.length === 0) return null;
    const headers = lines[0].split(delimiter).map((h) => h.trim());
    sheet.addRow(headers);
    const headerRow = sheet.getRow(1);
    headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4F46E5" } };
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headers.forEach((_, i) => {
      sheet.getColumn(i + 1).width = Math.max(headers[i].length + 4, ...lines.slice(1).map((l) => (l.split(delimiter)[i] || "").trim().length + 2));
    });
    for (const line of lines.slice(1)) sheet.addRow(line.split(delimiter).map((v) => v.trim()));
    const buffer = await workbook.xlsx.writeBuffer();
    const { useSupabaseAdmin: useSupabaseAdmin2 } = await Promise.resolve().then(function () { return supabase; });
    const sb = useSupabaseAdmin2();
    const safeFilename = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;
    const storagePath = `${workspaceId}/${Date.now()}_${safeFilename}`;
    await sb.storage.from("files").upload(storagePath, buffer, {
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      upsert: false
    });
    await sb.from("files").insert({
      workspace_id: workspaceId,
      filename: safeFilename,
      storage_path: storagePath,
      mime_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      size_bytes: buffer.length,
      embedding_meta: { status: "no_index", type: "excel" }
    });
    const { data: urlData } = await sb.storage.from("files").createSignedUrl(storagePath, 3600);
    return (urlData == null ? void 0 : urlData.signedUrl) || storagePath;
  } catch {
    return null;
  }
}
async function writeNotionPage(workspaceId, title, content) {
  const config = await getIntegration(workspaceId, "notion");
  if (!(config == null ? void 0 : config.api_key) || !(config == null ? void 0 : config.database_id)) return null;
  try {
    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: { "Authorization": `Bearer ${config.api_key}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
      body: JSON.stringify({
        parent: { database_id: config.database_id },
        properties: { Name: { title: [{ text: { content: title } }] } },
        children: [{ object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: content.slice(0, 2e3) } }] } }]
      })
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.url || data.id || "created";
  } catch {
    return null;
  }
}
async function appendNotionBlock(workspaceId, pageId, content) {
  const config = await getIntegration(workspaceId, "notion");
  if (!(config == null ? void 0 : config.api_key)) return false;
  try {
    const res = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${config.api_key}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
      body: JSON.stringify({ children: [{ object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: content.slice(0, 2e3) } }] } }] })
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function executeTools(calls, workspaceId) {
  const results = [];
  for (const call of calls) {
    let content = "";
    let isError = false;
    try {
      content = await dispatch(call.name, call.input, workspaceId);
    } catch (err) {
      content = `Error executing ${call.name}: ${err.message || String(err)}`;
      isError = true;
    }
    results.push({ toolUseId: call.id, toolName: call.name, content, isError });
  }
  return results;
}
async function dispatch(toolId, input, workspaceId) {
  switch (toolId) {
    // ── Slack ────────────────────────────────────────────────────────────────
    case "slack_post_message": {
      const ok = await sendSlack(workspaceId, input.message, input.channel);
      return ok ? ` Slack message posted to ${input.channel || "default channel"}` : ` Failed to post Slack message. Check that the Slack webhook URL is correctly configured in Integrations.`;
    }
    // ── Gmail ────────────────────────────────────────────────────────────────
    case "gmail_send": {
      const ok = await sendGmail(workspaceId, input.to, input.subject, input.body);
      return ok ? ` Email sent to ${input.to} (subject: "${input.subject}")` : ` Failed to send email. Check Gmail address and app password in Integrations.`;
    }
    // ── Google Calendar ───────────────────────────────────────────────────────
    case "calendar_create_event": {
      const uid = await createCalendarEvent(workspaceId, input.summary, input.description, input.startTime);
      return uid ? ` Calendar event created: "${input.summary}"${input.startTime ? ` at ${input.startTime}` : ""}` : ` Failed to create calendar event. Verify the Make.com/Zapier webhook is active in Integrations.`;
    }
    // ── GitHub READ ──────────────────────────────────────────────────────────
    case "github_list_repos": {
      const repos = await listGitHubUserRepos(workspaceId);
      if (!repos) return ` Could not list GitHub repos. Check the token scope.`;
      const list = repos.slice(0, 30).map(
        (r) => `- **${r.full_name}**${r.private ? " " : ""} \u2014 ${r.language || "unknown lang"}, \u2B50${r.stars}${r.description ? ` \u2014 ${r.description}` : ""}`
      ).join("\n");
      return `\u{1F4E6} Found ${repos.length} GitHub repositories:

${list}`;
    }
    case "github_repo_info": {
      const info = await getGitHubRepoInfo(workspaceId, input.repo);
      if (!info) return ` Could not get repo info. Check repo name and token.`;
      return `\u{1F4E6} **${info.full_name}**
${info.description || "No description"}

- Stars: ${info.stars} | Forks: ${info.forks} | Open issues: ${info.open_issues}
- Default branch: \`${info.default_branch}\`
- Languages: ${info.languages.join(", ") || "unknown"}
- Topics: ${info.topics.join(", ") || "none"}
- Last push: ${info.pushed_at}
- URL: ${info.url}`;
    }
    case "github_list_files": {
      const result = await listGitHubFiles(workspaceId, input.path || "", input.repo, input.ref);
      if (!result) return ` Could not list files. Check the repo name, path, and token.`;
      const list = result.files.map(
        (f) => `${f.type === "dir" ? "\u{1F4C1}" : ""} ${f.name}${f.size ? ` (${f.size}b)` : ""}`
      ).join("\n");
      const pathLabel = input.path ? `/${input.path}` : "/ (root)";
      const refLabel = input.ref ? ` @ ${input.ref}` : "";
      return `\u{1F4C2} \`${result.repo}\`${pathLabel}${refLabel}:

${list}`;
    }
    case "github_read_file": {
      const result = await readGitHubFile(workspaceId, input.filePath, input.repo, input.ref);
      if (!result) return ` Could not read file \`${input.filePath}\`. Check the path and token.`;
      const preview = result.content.slice(0, 4e3);
      const truncated = result.content.length > 4e3 ? `

_...truncated (${result.content.length} chars total)_` : "";
      return ` **${input.filePath}** from \`${result.repo}\`:

\`\`\`
${preview}
\`\`\`${truncated}

[View on GitHub](${result.url})`;
    }
    case "github_get_commits": {
      const commits = await getGitHubCommits(workspaceId, input.repo, input.branch, parseInt(input.limit || "20"));
      if (!commits) return ` Could not get commits. Check repo name and token.`;
      if (commits.length === 0) return `No commits found.`;
      const list = commits.map(
        (c) => `- [\`${c.sha}\`](${c.url}) **${c.message.split("\n")[0].slice(0, 80)}** \u2014 ${c.author}, ${new Date(c.date).toLocaleDateString()}`
      ).join("\n");
      const branchLabel = input.branch ? ` (branch: ${input.branch})` : "";
      return `\u{1F4DC} Last ${commits.length} commits${branchLabel}:

${list}`;
    }
    case "github_get_commit_detail": {
      const detail = await getGitHubCommitDetail(workspaceId, input.sha, input.repo);
      if (!detail) return ` Could not get commit details for SHA: ${input.sha}`;
      const fileList = detail.files.slice(0, 15).map(
        (f) => `- **${f.filename}** (${f.status}) +${f.additions}/-${f.deletions}${f.patch ? "\n  ```\n  " + f.patch.slice(0, 300) + "\n  ```" : ""}`
      ).join("\n");
      return `\u{1F50D} Commit \`${detail.sha}\`: **${detail.message.split("\n")[0]}**
${detail.author} \u2014 ${new Date(detail.date).toLocaleDateString()}
+${detail.additions}/-${detail.deletions} total

**Files changed:**
${fileList}

[View on GitHub](${detail.url})`;
    }
    case "github_list_branches": {
      const branches = await listGitHubBranches(workspaceId, input.repo);
      if (!branches) return ` Could not list branches.`;
      const list = branches.map((b) => `- \`${b.name}\`${b.protected ? "  protected" : ""} (SHA: ${b.sha})`).join("\n");
      return `\u{1F33F} ${branches.length} branches:

${list}`;
    }
    case "github_list_issues": {
      const issues = await listGitHubIssues(workspaceId, input.repo, input.state || "open", parseInt(input.limit || "20"));
      if (!issues) return ` Could not list issues. Check repo and token.`;
      if (issues.length === 0) return `No ${input.state || "open"} issues found.`;
      const list = issues.map(
        (i) => `- **#${i.number} [${i.title}](${i.url})** (${i.state}) \u2014 @${i.author}${i.labels.length ? ` [${i.labels.join(", ")}]` : ""}`
      ).join("\n");
      return `\u{1F41B} ${issues.length} ${input.state || "open"} issues:

${list}`;
    }
    case "github_list_prs": {
      const prs = await listGitHubPRs(workspaceId, input.repo, input.state || "open", parseInt(input.limit || "20"));
      if (!prs) return ` Could not list pull requests. Check repo and token.`;
      if (prs.length === 0) return `No ${input.state || "open"} pull requests found.`;
      const list = prs.map(
        (p) => `- **#${p.number} [${p.title}](${p.url})** (${p.state}${p.draft ? ", draft" : ""}) \`${p.head}\` \u2192 \`${p.base}\` \u2014 @${p.author}`
      ).join("\n");
      return `\u{1F500} ${prs.length} ${input.state || "open"} pull requests:

${list}`;
    }
    case "github_search_code": {
      const results = await searchGitHubCode(workspaceId, input.query, input.repo);
      if (!results) return ` Code search failed. Check token has search scope.`;
      if (results.length === 0) return `No code found matching: ${input.query}`;
      const list = results.map((r) => `- **${r.path}** in \`${r.repo}\` \u2014 [view](${r.url})${r.snippet ? "\n  > " + r.snippet.replace(/\n/g, " ") : ""}`).join("\n");
      return `\u{1F50D} Code search results for "${input.query}":

${list}`;
    }
    // ── GitHub WRITE ─────────────────────────────────────────────────────────
    case "github_create_issue": {
      const labels = input.labels ? input.labels.split(",").map((l) => l.trim()) : [];
      const url = await createGitHubIssue(workspaceId, input.title, input.body, labels, input.repo);
      return url ? ` GitHub issue created: [${input.title}](${url})` : ` Failed to create GitHub issue. Check token has Issues:write permission.`;
    }
    case "github_update_issue": {
      const updates = {};
      if (input.title) updates.title = input.title;
      if (input.body) updates.body = input.body;
      if (input.state) updates.state = input.state;
      if (input.labels) updates.labels = input.labels.split(",").map((l) => l.trim());
      const url = await updateGitHubIssue(workspaceId, parseInt(input.issueNumber), updates, input.repo);
      return url ? ` Issue #${input.issueNumber} updated: [view](${url})` : ` Failed to update issue #${input.issueNumber}.`;
    }
    case "github_commit_file": {
      const url = await createOrUpdateGitHubFile(workspaceId, input.filePath, input.content, input.commitMessage, input.repo);
      return url ? ` File committed to GitHub: \`${input.filePath}\` \u2014 [view commit](${url})` : ` Failed to commit file. Check token has Contents:write permission.`;
    }
    case "github_delete_file": {
      const ok = await deleteGitHubFile(workspaceId, input.filePath, input.commitMessage, input.repo);
      return ok ? ` File deleted from GitHub: \`${input.filePath}\`` : ` Failed to delete file. Check path and token permissions.`;
    }
    case "github_create_pr": {
      const url = await createGitHubPR(workspaceId, input.title, input.body, input.head, input.base || "main", input.repo);
      return url ? ` Pull request created: [${input.title}](${url})` : ` Failed to create pull request. Ensure both branches exist and token has PR:write permission.`;
    }
    // ── Notion ───────────────────────────────────────────────────────────────
    case "notion_create_page": {
      const url = await writeNotionPage(workspaceId, input.title, input.content);
      return url ? ` Notion page created: "${input.title}"` : ` Failed to create Notion page. Check API key and database_id in Integrations.`;
    }
    case "notion_append_block": {
      const ok = await appendNotionBlock(workspaceId, input.pageId, input.content);
      return ok ? ` Content appended to Notion page ${input.pageId}` : ` Failed to append to Notion page.`;
    }
    // ── Zapier ───────────────────────────────────────────────────────────────
    case "zapier_trigger": {
      const ok = await triggerZapier(workspaceId, { event: input.event, data: input.data });
      return ok ? ` Zapier webhook triggered: event="${input.event}"` : ` Zapier webhook failed. Check the URL in Integrations.`;
    }
    // ── Excel ────────────────────────────────────────────────────────────────
    case "excel_create_file": {
      const url = await createExcelFile(workspaceId, input.filename || "report", input.data || "", input.sheetName);
      return url ? ` Excel file created: [${input.filename || "report"}.xlsx](${url})` : ` Failed to generate Excel file. Check the data format.`;
    }
    // ── Jira ─────────────────────────────────────────────────────────────────
    case "jira_create_issue": {
      const url = await jiraCreateIssue(workspaceId, input);
      return url ? ` Jira issue created: [${input.summary}](${url})` : ` Failed to create Jira issue. Check credentials in Integrations.`;
    }
    case "jira_list_issues": {
      const issues = await jiraListIssues(workspaceId, input.jql, parseInt(input.maxResults || "20"));
      if (!issues) return ` Failed to list Jira issues. Check credentials.`;
      if (issues.length === 0) return ` No Jira issues found matching: ${input.jql}`;
      const list = issues.map((i) => `- **[${i.key}](${i.url})** ${i.summary} (${i.status})`).join("\n");
      return ` Found ${issues.length} Jira issues:

${list}`;
    }
    // ── Linear ───────────────────────────────────────────────────────────────
    case "linear_create_issue": {
      const url = await linearCreateIssue(workspaceId, input);
      return url ? ` Linear issue created: [${input.title}](${url})` : ` Failed to create Linear issue. Check API key in Integrations.`;
    }
    case "linear_list_issues": {
      const issues = await linearListIssues(workspaceId, input.teamId, input.state);
      if (!issues) return ` Failed to list Linear issues.`;
      if (issues.length === 0) return ` No Linear issues found.`;
      const list = issues.slice(0, 15).map((i) => `- **[${i.identifier}]** ${i.title} (${i.state}) \u2014 ${i.assignee || "Unassigned"}`).join("\n");
      return ` Linear issues:

${list}`;
    }
    // ── HubSpot ───────────────────────────────────────────────────────────────
    case "hubspot_create_contact": {
      const id = await hubspotCreateContact(workspaceId, input);
      return id ? ` HubSpot contact created: ${input.email} (ID: ${id})` : ` Failed to create HubSpot contact. Check access token.`;
    }
    case "hubspot_create_deal": {
      const id = await hubspotCreateDeal(workspaceId, input);
      return id ? ` HubSpot deal created: "${input.dealName}" (ID: ${id})` : ` Failed to create HubSpot deal.`;
    }
    case "hubspot_search_contacts": {
      const contacts = await hubspotSearchContacts(workspaceId, input.query);
      if (!contacts) return ` Failed to search HubSpot contacts.`;
      if (contacts.length === 0) return ` No HubSpot contacts found matching: ${input.query}`;
      const list = contacts.slice(0, 10).map((c) => `- ${c.firstname || ""} ${c.lastname || ""} <${c.email}>${c.company ? ` \u2014 ${c.company}` : ""}`).join("\n");
      return ` Found ${contacts.length} HubSpot contacts:

${list}`;
    }
    // ── Twilio ────────────────────────────────────────────────────────────────
    case "twilio_send_sms": {
      const ok = await twilioSendSMS(workspaceId, input.to, input.message);
      return ok ? ` SMS sent to ${input.to}` : ` Failed to send SMS. Check Twilio credentials.`;
    }
    // ── Stripe ────────────────────────────────────────────────────────────────
    case "stripe_list_customers": {
      const customers = await stripeListCustomers(workspaceId, input.limit ? parseInt(input.limit) : 10, input.email);
      if (!customers) return ` Failed to list Stripe customers. Check secret key.`;
      if (customers.length === 0) return ` No Stripe customers found.`;
      const list = customers.map((c) => {
        var _a;
        return `- **${c.name || c.email}** <${c.email}> \u2014 ${((_a = c.currency) == null ? void 0 : _a.toUpperCase()) || "USD"}`;
      }).join("\n");
      return ` ${customers.length} Stripe customers:

${list}`;
    }
    case "stripe_get_revenue": {
      const summary = await stripeGetRevenue(workspaceId, parseInt(input.days || "30"));
      if (!summary) return ` Failed to get Stripe revenue. Check secret key.`;
      return ` Stripe revenue (last ${input.days || 30} days):

${summary}`;
    }
    // ── Airtable ──────────────────────────────────────────────────────────────
    case "airtable_create_record": {
      const id = await airtableCreateRecord(workspaceId, input.baseId, input.tableName, input.fields);
      return id ? ` Airtable record created in ${input.tableName} (ID: ${id})` : ` Failed to create Airtable record.`;
    }
    case "airtable_list_records": {
      const records = await airtableListRecords(workspaceId, input.baseId, input.tableName, input.filterFormula, parseInt(input.maxRecords || "20"));
      if (!records) return ` Failed to list Airtable records.`;
      if (records.length === 0) return ` No records found in ${input.tableName}.`;
      const list = records.slice(0, 15).map(
        (r) => `- [${r.id}] ${JSON.stringify(r.fields).slice(0, 120)}`
      ).join("\n");
      return ` ${records.length} records from ${input.tableName}:

${list}`;
    }
    // ── Asana ─────────────────────────────────────────────────────────────────
    case "asana_create_task": {
      const url = await asanaCreateTask(workspaceId, input);
      return url ? ` Asana task created: [${input.name}](${url})` : ` Failed to create Asana task.`;
    }
    // ── Trello ────────────────────────────────────────────────────────────────
    case "trello_create_card": {
      const url = await trelloCreateCard(workspaceId, input);
      return url ? ` Trello card created: [${input.name}](${url})` : ` Failed to create Trello card.`;
    }
    // ── Intercom ──────────────────────────────────────────────────────────────
    case "intercom_send_message": {
      const ok = await intercomSendMessage(workspaceId, input.userId, input.message, input.subject);
      return ok ? ` Intercom message sent to ${input.userId}` : ` Failed to send Intercom message.`;
    }
    // ── Zendesk ───────────────────────────────────────────────────────────────
    case "zendesk_create_ticket": {
      const url = await zendeskCreateTicket(workspaceId, input);
      return url ? ` Zendesk ticket created: [${input.subject}](${url})` : ` Failed to create Zendesk ticket.`;
    }
    // ── Vercel ────────────────────────────────────────────────────────────────
    case "vercel_list_deployments": {
      const deployments = await vercelListDeployments(workspaceId, input.projectName, parseInt(input.limit || "10"));
      if (!deployments) return ` Failed to list Vercel deployments.`;
      if (deployments.length === 0) return ` No Vercel deployments found.`;
      const list = deployments.map((d) => `- **${d.name}** (${d.state}) ${d.url ? `\u2192 ${d.url}` : ""} \u2014 ${new Date(d.createdAt).toLocaleDateString()}`).join("\n");
      return ` Vercel deployments:

${list}`;
    }
    case "vercel_get_project": {
      const info = await vercelGetProject(workspaceId, input.projectName);
      if (!info) return ` Failed to get Vercel project info.`;
      return ` Vercel project **${info.name}**:
- Framework: ${info.framework || "unknown"}
- Latest deployment: ${info.latestDeployment || "none"}
- URL: ${info.url || "N/A"}`;
    }
    // ── PagerDuty ─────────────────────────────────────────────────────────────
    case "pagerduty_create_incident": {
      const id = await pagerdutyCreateIncident(workspaceId, input);
      return id ? ` PagerDuty incident triggered: ${input.title} (ID: ${id})` : ` Failed to trigger PagerDuty incident.`;
    }
    // ── Sentry ────────────────────────────────────────────────────────────────
    case "sentry_list_issues": {
      const issues = await sentryListIssues(workspaceId, input.project, input.query, parseInt(input.limit || "10"));
      if (!issues) return ` Failed to list Sentry issues.`;
      if (issues.length === 0) return ` No Sentry issues found.`;
      const list = issues.map((i) => `- **${i.title}** (${i.level}) \u2014 ${i.culprit || ""} \u2014 ${i.count} events`).join("\n");
      return ` Sentry issues:

${list}`;
    }
    // ── Cloudflare ────────────────────────────────────────────────────────────
    case "cloudflare_list_zones": {
      const zones = await cloudflareListZones(workspaceId);
      if (!zones) return ` Failed to list Cloudflare zones.`;
      if (zones.length === 0) return ` No Cloudflare zones found.`;
      const list = zones.map((z) => `- **${z.name}** (${z.status}) \u2014 ID: ${z.id}`).join("\n");
      return ` Cloudflare zones:

${list}`;
    }
    case "cloudflare_purge_cache": {
      const ok = await cloudflarePurgeCache(workspaceId, input.zoneId, input.urls);
      return ok ? ` Cloudflare cache purged for zone ${input.zoneId}` : ` Failed to purge Cloudflare cache.`;
    }
    // ── Web search ────────────────────────────────────────────────────────────
    case "web_search": {
      return await webSearch(input.query, parseInt(input.numResults || "5"));
    }
    default:
      return ` Unknown tool: ${toolId}`;
  }
}
async function getConfig(workspaceId, type) {
  const sb = useSupabaseAdmin();
  const { data } = await sb.from("integrations").select("config").eq("workspace_id", workspaceId).eq("type", type).eq("status", "connected").single();
  return (data == null ? void 0 : data.config) || null;
}
async function jiraCreateIssue(workspaceId, input) {
  const cfg = await getConfig(workspaceId, "jira");
  if (!(cfg == null ? void 0 : cfg.host) || !(cfg == null ? void 0 : cfg.email) || !(cfg == null ? void 0 : cfg.api_token)) return null;
  const auth = Buffer.from(`${cfg.email}:${cfg.api_token}`).toString("base64");
  const res = await fetch(`${cfg.host}/rest/api/3/issue`, {
    method: "POST",
    headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      fields: {
        project: { key: cfg.project_key || "PROJ" },
        summary: input.summary,
        description: { type: "doc", version: 1, content: [{ type: "paragraph", content: [{ type: "text", text: input.description || "" }] }] },
        issuetype: { name: input.issueType || "Task" },
        priority: input.priority ? { name: input.priority } : void 0,
        labels: input.labels ? input.labels.split(",").map((l) => l.trim()) : void 0
      }
    })
  });
  if (!res.ok) return null;
  const data = await res.json();
  return `${cfg.host}/browse/${data.key}`;
}
async function jiraListIssues(workspaceId, jql, maxResults = 20) {
  const cfg = await getConfig(workspaceId, "jira");
  if (!(cfg == null ? void 0 : cfg.host) || !(cfg == null ? void 0 : cfg.email) || !(cfg == null ? void 0 : cfg.api_token)) return null;
  const auth = Buffer.from(`${cfg.email}:${cfg.api_token}`).toString("base64");
  const res = await fetch(`${cfg.host}/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=${maxResults}`, {
    headers: { "Authorization": `Basic ${auth}`, "Accept": "application/json" }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return (data.issues || []).map((i) => {
    var _a;
    return {
      key: i.key,
      summary: i.fields.summary,
      status: (_a = i.fields.status) == null ? void 0 : _a.name,
      url: `${cfg.host}/browse/${i.key}`
    };
  });
}
async function linearCreateIssue(workspaceId, input) {
  var _a, _b, _c, _d;
  const cfg = await getConfig(workspaceId, "linear");
  if (!(cfg == null ? void 0 : cfg.api_key)) return null;
  const priorityMap = { urgent: 1, high: 2, medium: 3, low: 4, no_priority: 0 };
  const res = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: { "Authorization": cfg.api_key, "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `mutation IssueCreate($input: IssueCreateInput!) { issueCreate(input: $input) { success issue { id url identifier } } }`,
      variables: {
        input: {
          title: input.title,
          description: input.description || "",
          priority: (_a = priorityMap[input.priority || "medium"]) != null ? _a : 3,
          teamId: input.teamId || cfg.team_id
        }
      }
    })
  });
  if (!res.ok) return null;
  const data = await res.json();
  return ((_d = (_c = (_b = data == null ? void 0 : data.data) == null ? void 0 : _b.issueCreate) == null ? void 0 : _c.issue) == null ? void 0 : _d.url) || null;
}
async function linearListIssues(workspaceId, teamId, state) {
  var _a, _b;
  const cfg = await getConfig(workspaceId, "linear");
  if (!(cfg == null ? void 0 : cfg.api_key)) return null;
  const filter = teamId || cfg.team_id ? `team: { id: { eq: "${teamId || cfg.team_id}" } }` : "";
  const res = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: { "Authorization": cfg.api_key, "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query { issues(first: 25, filter: { ${filter} }) { nodes { id identifier title state { name } assignee { name } url } } }`
    })
  });
  if (!res.ok) return null;
  const data = await res.json();
  const issues = ((_b = (_a = data == null ? void 0 : data.data) == null ? void 0 : _a.issues) == null ? void 0 : _b.nodes) || [];
  return state ? issues.filter((i) => {
    var _a2, _b2;
    return (_b2 = (_a2 = i.state) == null ? void 0 : _a2.name) == null ? void 0 : _b2.toLowerCase().includes(state.toLowerCase());
  }) : issues;
}
async function hubspotCreateContact(workspaceId, input) {
  const cfg = await getConfig(workspaceId, "hubspot");
  if (!(cfg == null ? void 0 : cfg.access_token)) return null;
  const properties = { email: input.email };
  if (input.firstName) properties.firstname = input.firstName;
  if (input.lastName) properties.lastname = input.lastName;
  if (input.company) properties.company = input.company;
  if (input.phone) properties.phone = input.phone;
  if (input.notes) properties.notes = input.notes;
  const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "POST",
    headers: { "Authorization": `Bearer ${cfg.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ properties })
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.id || null;
}
async function hubspotCreateDeal(workspaceId, input) {
  const cfg = await getConfig(workspaceId, "hubspot");
  if (!(cfg == null ? void 0 : cfg.access_token)) return null;
  const properties = { dealname: input.dealName };
  if (input.amount) properties.amount = input.amount;
  if (input.stage) properties.dealstage = input.stage;
  if (input.closeDate) properties.closedate = input.closeDate;
  const res = await fetch("https://api.hubapi.com/crm/v3/objects/deals", {
    method: "POST",
    headers: { "Authorization": `Bearer ${cfg.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ properties })
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.id || null;
}
async function hubspotSearchContacts(workspaceId, query) {
  const cfg = await getConfig(workspaceId, "hubspot");
  if (!(cfg == null ? void 0 : cfg.access_token)) return null;
  const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/search", {
    method: "POST",
    headers: { "Authorization": `Bearer ${cfg.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      properties: ["email", "firstname", "lastname", "company"],
      limit: 10
    })
  });
  if (!res.ok) return null;
  const data = await res.json();
  return (data.results || []).map((r) => r.properties);
}
async function twilioSendSMS(workspaceId, to, message) {
  const cfg = await getConfig(workspaceId, "twilio");
  if (!(cfg == null ? void 0 : cfg.account_sid) || !(cfg == null ? void 0 : cfg.auth_token) || !(cfg == null ? void 0 : cfg.from_number)) return false;
  const auth = Buffer.from(`${cfg.account_sid}:${cfg.auth_token}`).toString("base64");
  const body = new URLSearchParams({ To: to, From: cfg.from_number, Body: message });
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${cfg.account_sid}/Messages.json`, {
    method: "POST",
    headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString()
  });
  return res.ok;
}
async function stripeListCustomers(workspaceId, limit = 10, email) {
  const cfg = await getConfig(workspaceId, "stripe");
  if (!(cfg == null ? void 0 : cfg.secret_key)) return null;
  const params = new URLSearchParams({ limit: String(limit) });
  if (email) params.set("email", email);
  const res = await fetch(`https://api.stripe.com/v1/customers?${params}`, {
    headers: { "Authorization": `Bearer ${cfg.secret_key}` }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data || null;
}
async function stripeGetRevenue(workspaceId, days = 30) {
  const cfg = await getConfig(workspaceId, "stripe");
  if (!(cfg == null ? void 0 : cfg.secret_key)) return null;
  const since = Math.floor((Date.now() - days * 864e5) / 1e3);
  const res = await fetch(`https://api.stripe.com/v1/charges?created[gte]=${since}&limit=100`, {
    headers: { "Authorization": `Bearer ${cfg.secret_key}` }
  });
  if (!res.ok) return null;
  const data = await res.json();
  const charges = data.data || [];
  const total = charges.reduce((sum, c) => sum + (c.amount_captured || 0), 0) / 100;
  const successful = charges.filter((c) => c.status === "succeeded").length;
  return `Total revenue: $${total.toLocaleString()} across ${successful} successful charges (last ${days} days)`;
}
async function airtableCreateRecord(workspaceId, baseId, tableName, fieldsJson) {
  const cfg = await getConfig(workspaceId, "airtable");
  if (!(cfg == null ? void 0 : cfg.api_key)) return null;
  let fields;
  try {
    fields = JSON.parse(fieldsJson);
  } catch {
    return null;
  }
  const res = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${cfg.api_key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields })
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.id || null;
}
async function airtableListRecords(workspaceId, baseId, tableName, filterFormula, maxRecords = 20) {
  const cfg = await getConfig(workspaceId, "airtable");
  if (!(cfg == null ? void 0 : cfg.api_key)) return null;
  const params = new URLSearchParams({ maxRecords: String(maxRecords) });
  if (filterFormula) params.set("filterByFormula", filterFormula);
  const res = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?${params}`, {
    headers: { "Authorization": `Bearer ${cfg.api_key}` }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.records || null;
}
async function asanaCreateTask(workspaceId, input) {
  var _a, _b;
  const cfg = await getConfig(workspaceId, "asana");
  if (!(cfg == null ? void 0 : cfg.access_token)) return null;
  const body = { name: input.name };
  if (input.notes) body.notes = input.notes;
  if (input.dueDate) body.due_on = input.dueDate;
  if (input.assignee) body.assignee = input.assignee;
  if (input.projectId || cfg.project_id) {
    body.projects = [input.projectId || cfg.project_id];
  }
  const res = await fetch("https://app.asana.com/api/1.0/tasks", {
    method: "POST",
    headers: { "Authorization": `Bearer ${cfg.access_token}`, "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ data: body })
  });
  if (!res.ok) return null;
  const data = await res.json();
  return ((_a = data.data) == null ? void 0 : _a.permalink_url) || ((_b = data.data) == null ? void 0 : _b.gid) ? `https://app.asana.com/0/${input.projectId || "0"}/${data.data.gid}` : null;
}
async function trelloCreateCard(workspaceId, input) {
  const cfg = await getConfig(workspaceId, "trello");
  if (!(cfg == null ? void 0 : cfg.api_key) || !(cfg == null ? void 0 : cfg.token)) return null;
  const params = new URLSearchParams({
    key: cfg.api_key,
    token: cfg.token,
    name: input.name,
    idList: input.listId
  });
  if (input.desc) params.set("desc", input.desc);
  if (input.due) params.set("due", input.due);
  const res = await fetch(`https://api.trello.com/1/cards?${params}`, { method: "POST" });
  if (!res.ok) return null;
  const data = await res.json();
  return data.url || null;
}
async function intercomSendMessage(workspaceId, userId, message, subject) {
  const cfg = await getConfig(workspaceId, "intercom");
  if (!(cfg == null ? void 0 : cfg.access_token)) return false;
  const body = {
    message_type: "inapp",
    body: message,
    from: { type: "admin", id: "me" },
    to: userId.includes("@") ? { type: "user", email: userId } : { type: "user", id: userId }
  };
  if (subject) {
    body.message_type = "email";
    body.subject = subject;
  }
  const res = await fetch("https://api.intercom.io/messages", {
    method: "POST",
    headers: { "Authorization": `Bearer ${cfg.access_token}`, "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(body)
  });
  return res.ok;
}
async function zendeskCreateTicket(workspaceId, input) {
  const cfg = await getConfig(workspaceId, "zendesk");
  if (!(cfg == null ? void 0 : cfg.subdomain) || !(cfg == null ? void 0 : cfg.email) || !(cfg == null ? void 0 : cfg.api_token)) return null;
  const auth = Buffer.from(`${cfg.email}/token:${cfg.api_token}`).toString("base64");
  const ticket = {
    subject: input.subject,
    comment: { body: input.description },
    priority: input.priority || "normal"
  };
  if (input.requesterEmail) ticket.requester = { email: input.requesterEmail };
  if (input.tags) ticket.tags = input.tags.split(",").map((t) => t.trim());
  const res = await fetch(`https://${cfg.subdomain}.zendesk.com/api/v2/tickets`, {
    method: "POST",
    headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({ ticket })
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.ticket ? `https://${cfg.subdomain}.zendesk.com/agent/tickets/${data.ticket.id}` : null;
}
async function vercelListDeployments(workspaceId, projectName, limit = 10) {
  const cfg = await getConfig(workspaceId, "vercel");
  if (!(cfg == null ? void 0 : cfg.token)) return null;
  const params = new URLSearchParams({ limit: String(limit) });
  if (projectName) params.set("projectId", projectName);
  if (cfg.team_id) params.set("teamId", cfg.team_id);
  const res = await fetch(`https://api.vercel.com/v6/deployments?${params}`, {
    headers: { "Authorization": `Bearer ${cfg.token}` }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.deployments || null;
}
async function vercelGetProject(workspaceId, projectName) {
  var _a, _b, _c, _d;
  const cfg = await getConfig(workspaceId, "vercel");
  if (!(cfg == null ? void 0 : cfg.token)) return null;
  const params = cfg.team_id ? `?teamId=${cfg.team_id}` : "";
  const res = await fetch(`https://api.vercel.com/v9/projects/${encodeURIComponent(projectName)}${params}`, {
    headers: { "Authorization": `Bearer ${cfg.token}` }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return {
    name: data.name,
    framework: data.framework,
    latestDeployment: ((_b = (_a = data.latestDeployments) == null ? void 0 : _a[0]) == null ? void 0 : _b.state) || "none",
    url: ((_d = (_c = data.targets) == null ? void 0 : _c.production) == null ? void 0 : _d.url) ? `https://${data.targets.production.url}` : null
  };
}
async function pagerdutyCreateIncident(workspaceId, input) {
  const cfg = await getConfig(workspaceId, "pagerduty");
  const routingKey = input.serviceKey || (cfg == null ? void 0 : cfg.routing_key);
  if (!routingKey) return null;
  const res = await fetch("https://events.pagerduty.com/v2/enqueue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      routing_key: routingKey,
      event_action: "trigger",
      payload: {
        summary: input.title,
        severity: input.severity || "critical",
        source: "Atlantir",
        custom_details: { description: input.description || "" }
      }
    })
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.dedup_key || "triggered";
}
async function sentryListIssues(workspaceId, project, query, limit = 10) {
  const cfg = await getConfig(workspaceId, "sentry");
  if (!(cfg == null ? void 0 : cfg.auth_token) || !(cfg == null ? void 0 : cfg.org_slug)) return null;
  const params = new URLSearchParams({ limit: String(limit) });
  if (query) params.set("query", query);
  if (project) params.set("project", project);
  const res = await fetch(`https://sentry.io/api/0/organizations/${cfg.org_slug}/issues/?${params}`, {
    headers: { "Authorization": `Bearer ${cfg.auth_token}` }
  });
  if (!res.ok) return null;
  return await res.json();
}
async function cloudflareListZones(workspaceId) {
  const cfg = await getConfig(workspaceId, "cloudflare");
  if (!(cfg == null ? void 0 : cfg.api_token)) return null;
  const res = await fetch("https://api.cloudflare.com/client/v4/zones", {
    headers: { "Authorization": `Bearer ${cfg.api_token}` }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.result || null;
}
async function cloudflarePurgeCache(workspaceId, zoneId, urls) {
  const cfg = await getConfig(workspaceId, "cloudflare");
  if (!(cfg == null ? void 0 : cfg.api_token)) return false;
  const body = urls ? { files: urls.split(",").map((u) => u.trim()) } : { purge_everything: true };
  const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${cfg.api_token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return res.ok;
}
async function webSearch(query, numResults = 5) {
  const serperKey = process.env.SERPER_API_KEY;
  if (serperKey) {
    try {
      const res = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: { "X-API-KEY": serperKey, "Content-Type": "application/json" },
        body: JSON.stringify({ q: query, num: numResults })
      });
      if (res.ok) {
        const data = await res.json();
        const results = (data.organic || []).slice(0, numResults);
        if (results.length > 0) {
          const formatted = results.map(
            (r, i) => `${i + 1}. **${r.title}**
${r.snippet}
${r.link}`
          ).join("\n\n");
          return ` Web search results for "${query}":

${formatted}`;
        }
      }
    } catch {
    }
  }
  return `Web search for "${query}": No search API configured (set SERPER_API_KEY for live web search). Using training knowledge to answer.`;
}

async function getRagContext(workspaceId, taskTitle, taskDesc) {
  try {
    const sb = useSupabaseAdmin();
    const keywords = (taskTitle + " " + (taskDesc || "")).toLowerCase().split(/\s+/).filter((w) => w.length > 4).slice(0, 6);
    if (!keywords.length) return "";
    const { data } = await sb.from("file_chunks").select("content").eq("workspace_id", workspaceId).limit(60);
    if (!(data == null ? void 0 : data.length)) return "";
    const scored = data.map((chunk) => ({ content: chunk.content, score: keywords.filter((k) => chunk.content.toLowerCase().includes(k)).length })).filter((c) => c.score > 0).sort((a, b) => b.score - a.score).slice(0, 4);
    if (!scored.length) return "";
    return `

## Company knowledge
${scored.map((c) => c.content).join("\n\n---\n\n")}`;
  } catch {
    return "";
  }
}
async function getIntegrationSummary(workspaceId) {
  const sb = useSupabaseAdmin();
  const [{ data }, { data: dbData }] = await Promise.all([
    sb.from("integrations").select("type, config").eq("workspace_id", workspaceId).eq("status", "connected"),
    sb.from("db_connections").select("name, db_type, status, config").eq("workspace_id", workspaceId)
  ]);
  const hasAnything = ((data == null ? void 0 : data.length) || 0) + ((dbData == null ? void 0 : dbData.length) || 0) > 0;
  if (!hasAnything) return "";
  const lines = data.map((i) => {
    var _a;
    const cfg = i.config;
    const details = {
      slack: `Slack (default channel: ${(cfg == null ? void 0 : cfg.channel) || "#general"})`,
      github: `GitHub (default repo: ${(cfg == null ? void 0 : cfg.repo) || "auto-detect"})`,
      notion: `Notion (database: ${(cfg == null ? void 0 : cfg.database_id) ? "configured" : "not set"})`,
      gmail: `Gmail (sender: ${(cfg == null ? void 0 : cfg.sender_email) || "not set"})`,
      google_calendar: `Google Calendar (via webhook)`,
      zapier: `Zapier (webhook: configured)`,
      jira: `Jira (project: ${(cfg == null ? void 0 : cfg.project_key) || "PROJ"}, host: ${(cfg == null ? void 0 : cfg.host) || "not set"})`,
      linear: `Linear (team: ${(cfg == null ? void 0 : cfg.team_id) || "default"})`,
      hubspot: `HubSpot CRM`,
      twilio: `Twilio (from: ${(cfg == null ? void 0 : cfg.from_number) || "not set"})`,
      stripe: `Stripe (live: ${((_a = cfg == null ? void 0 : cfg.secret_key) == null ? void 0 : _a.startsWith("sk_live")) ? "yes" : "test mode"})`,
      airtable: `Airtable`,
      asana: `Asana (project: ${(cfg == null ? void 0 : cfg.project_id) || "default"})`,
      trello: `Trello`,
      intercom: `Intercom`,
      zendesk: `Zendesk (subdomain: ${(cfg == null ? void 0 : cfg.subdomain) || "not set"})`,
      vercel: `Vercel (team: ${(cfg == null ? void 0 : cfg.team_id) || "personal"})`,
      pagerduty: `PagerDuty`,
      sentry: `Sentry (org: ${(cfg == null ? void 0 : cfg.org_slug) || "not set"})`,
      cloudflare: `Cloudflare`
    };
    return "- " + (details[i.type] || i.type);
  });
  let summary = "";
  if (lines.length) {
    summary += `

## Connected integrations
${lines.join("\n")}`;
  }
  summary += `

Always available (no connection needed):
- Excel: generate .xlsx files
- Web search: search the internet`;
  if (dbData == null ? void 0 : dbData.length) {
    const dbLines = dbData.map((d) => {
      var _a, _b;
      const tables = ((_b = (_a = d.config) == null ? void 0 : _a.tables) == null ? void 0 : _b.length) ? ` (tables: ${d.config.tables.join(", ")})` : "";
      return `- ${d.name} [${d.db_type}] \u2014 status: ${d.status}${tables}`;
    });
    summary += `

## Connected databases (you CAN query these \u2014 they are available)
${dbLines.join("\n")}`;
  }
  return summary;
}
async function loadMemory(workspaceId, agentType) {
  const sb = useSupabaseAdmin();
  const { data } = await sb.from("agent_memory").select("content").eq("workspace_id", workspaceId).eq("agent_type", agentType).order("created_at", { ascending: false }).limit(5);
  if (!(data == null ? void 0 : data.length)) return "";
  return `

## Memory from past tasks
${data.map((m) => `- ${m.content}`).join("\n")}`;
}
async function saveMemory(workspaceId, agentType, content, taskId) {
  try {
    const client = useAnthropic();
    const res = await client.messages.create({
      model: AGENT_MODEL,
      max_tokens: 150,
      system: 'Extract 1 key fact worth remembering for future tasks. Return just the fact as one sentence, or "NONE".',
      messages: [{ role: "user", content: content.slice(0, 800) }]
    });
    const memory = res.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim();
    if (memory && memory !== "NONE") {
      const sb = useSupabaseAdmin();
      await sb.from("agent_memory").insert({ workspace_id: workspaceId, agent_type: agentType, memory_type: "fact", content: memory, source_task_id: taskId });
    }
  } catch {
  }
}
async function postProgress(taskId, workspaceId, petName, agentType, type, content) {
  const sb = useSupabaseAdmin();
  await sb.from("task_updates").insert({ task_id: taskId, workspace_id: workspaceId, agent_type: agentType, pet_name: petName, update_type: type, content });
}
async function runAgenticLoop(systemPrompt, userMessage, workspaceId, onProgress) {
  const client = useAnthropic();
  const tools = await getConnectedTools(workspaceId);
  const anthropicTools = tools.map(toAnthropicTool);
  const messages = [{ role: "user", content: userMessage }];
  let roundsLeft = 10;
  const allToolResults = [];
  while (roundsLeft-- > 0) {
    const response = await client.messages.create({
      model: EXECUTOR_MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      tools: anthropicTools.length > 0 ? anthropicTools : void 0,
      tool_choice: anthropicTools.length > 0 ? { type: "auto" } : void 0,
      messages
    });
    const textBlocks = response.content.filter((b) => b.type === "text").map((b) => b.text);
    if (textBlocks.length > 0 && textBlocks.join("").trim()) {
      await onProgress(textBlocks.join("\n").trim());
    }
    if (response.stop_reason === "end_turn" || response.stop_reason === "max_tokens") {
      const finalText = response.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      if (allToolResults.length > 0) {
        return finalText + "\n\n**Actions completed:**\n" + allToolResults.join("\n");
      }
      return finalText;
    }
    const toolUseBlocks = response.content.filter((b) => b.type === "tool_use");
    if (toolUseBlocks.length === 0) break;
    messages.push({ role: "assistant", content: response.content });
    const calls = toolUseBlocks.map((b) => ({
      id: b.id,
      name: b.name,
      input: b.input
    }));
    const toolNames = calls.map((c) => c.name.replace(/_/g, " ")).join(", ");
    await onProgress(`\u26A1 Executing: ${toolNames}\u2026`);
    const results = await executeTools(calls, workspaceId);
    allToolResults.push(...results.map((r) => r.content));
    messages.push({
      role: "user",
      content: results.map((r) => ({
        type: "tool_result",
        tool_use_id: r.toolUseId,
        content: r.content,
        is_error: r.isError
      }))
    });
  }
  const finalMessages = [...messages, {
    role: "user",
    content: "Summarize what was accomplished based on the tool results above."
  }];
  const summary = await client.messages.create({
    model: EXECUTOR_MODEL,
    max_tokens: 1e3,
    system: systemPrompt,
    messages: finalMessages
  });
  const summaryText = summary.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
  return allToolResults.length > 0 ? summaryText + "\n\n**Actions completed:**\n" + allToolResults.join("\n") : summaryText;
}
async function runPet(petName, task, previousOutputs, stepId) {
  const pet = PETS[petName];
  const sb = useSupabaseAdmin();
  await sb.from("task_pipeline").update({ status: "running", started_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", stepId);
  await postProgress(task.id, task.workspace_id, pet.displayName, pet.agentType, "started", `${pet.displayName} starting\u2026`);
  const [memory, rag, integrationSummary] = await Promise.all([
    loadMemory(task.workspace_id, pet.agentType),
    getRagContext(task.workspace_id, task.title, task.description || ""),
    getIntegrationSummary(task.workspace_id)
  ]);
  const context = previousOutputs.length > 0 ? `

## Previous step output
${previousOutputs[previousOutputs.length - 1]}` : "";
  const systemPrompt = pet.systemPrompt + integrationSummary + memory + rag;
  const userMessage = `Task: ${task.title}${task.description ? `
Details: ${task.description}` : ""}${context}`;
  let output;
  if (pet.agentType === "executor") {
    output = await runAgenticLoop(
      systemPrompt,
      userMessage,
      task.workspace_id,
      async (msg) => {
        await postProgress(task.id, task.workspace_id, pet.displayName, pet.agentType, "progress", msg);
      }
    );
  } else {
    const client = useAnthropic();
    const response = await client.messages.create({
      model: AGENT_MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }]
    });
    output = response.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
    await postProgress(task.id, task.workspace_id, pet.displayName, pet.agentType, "progress", output);
  }
  await sb.from("task_pipeline").update({ status: "completed", output, completed_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", stepId);
  saveMemory(task.workspace_id, pet.agentType, output, task.id).catch(() => {
  });
  return output;
}
async function runPipeline(task) {
  const sb = useSupabaseAdmin();
  const pipeline = getPipelineForTask(task.assigned_agent || "default");
  const stepRecords = [];
  for (let i = 0; i < pipeline.length; i++) {
    const pet = PETS[pipeline[i]];
    const { data } = await sb.from("task_pipeline").insert({
      task_id: task.id,
      workspace_id: task.workspace_id,
      step_index: i,
      agent_type: pet.agentType,
      pet_name: pet.displayName,
      status: "waiting"
    }).select().single();
    stepRecords.push({ petName: pipeline[i], stepId: data.id });
  }
  const outputs = [];
  for (const { petName, stepId } of stepRecords) {
    try {
      const output = await runPet(petName, task, outputs, stepId);
      outputs.push(output);
    } catch (err) {
      const errMsg = err.message || String(err);
      await sb.from("task_pipeline").update({ status: "failed", completed_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", stepId);
      await postProgress(task.id, task.workspace_id, PETS[petName].displayName, PETS[petName].agentType, "error", `${PETS[petName].displayName} failed: ${errMsg}`);
      outputs.push(`[${petName} failed: ${errMsg}]`);
    }
  }
  return [...outputs].reverse().find((o) => !o.startsWith("[")) || outputs[outputs.length - 1] || "";
}

function looksLikeRawData(text) {
  const trimmed = text.trim();
  if (/^(\[|\{)/.test(trimmed)) return true;
  if (/```(json)?\s*[\[\{]/i.test(trimmed)) {
    const nonCodeLines = trimmed.replace(/```[\s\S]*?```/g, "").trim();
    if (nonCodeLines.length < trimmed.length * 0.3) return true;
  }
  return false;
}
async function humaniseOutput(rawOutput, taskTitle, taskDescription) {
  const client = useAnthropic();
  try {
    const response = await client.messages.create({
      model: AGENT_MODEL,
      max_tokens: 1500,
      system: `You are a professional technical writer. Convert raw data or JSON output into clear, readable prose that directly answers what was asked.

Rules:
- Write in plain, professional English \u2014 no jargon
- Convert JSON arrays/objects into readable sentences and bullet lists
- Structure the response with a brief summary paragraph, then detail as needed
- Preserve every specific fact: names, IDs, column names, values, URLs
- Do not mention JSON, arrays, or data structures \u2014 just describe what the data contains
- Do not use emojis
- Output ONLY the human-readable version, nothing else`,
      messages: [{
        role: "user",
        content: `Task: ${taskTitle}
${taskDescription ? "Details: " + taskDescription + "\n" : ""}
Raw output to convert:

${rawOutput}`
      }]
    });
    const humanised = response.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim();
    return humanised || rawOutput;
  } catch {
    return rawOutput;
  }
}
const run_post$2 = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { task_id } = body;
  if (!task_id) throw createError({ statusCode: 400, message: "task_id required" });
  const sb = useSupabaseAdmin();
  const { data: task, error: taskError } = await sb.from("tasks").select("*").eq("id", task_id).single();
  if (taskError || !task) throw createError({ statusCode: 404, message: "Task not found" });
  if (task.status !== "approved") throw createError({ statusCode: 400, message: "Task not approved" });
  await sb.from("tasks").update({ status: "in_progress" }).eq("id", task_id);
  runPipeline(task).then(async (finalOutput) => {
    let content = finalOutput;
    if (looksLikeRawData(finalOutput)) {
      content = await humaniseOutput(finalOutput, task.title, task.description || "");
    }
    await sb.from("artifacts").insert({
      workspace_id: task.workspace_id,
      task_id: task.id,
      title: task.title,
      type: task.assigned_agent === "research" ? "research" : task.assigned_agent === "writer" ? "document" : "other",
      content,
      version: 1
    });
    await sb.from("tasks").update({ status: "completed" }).eq("id", task_id);
  }).catch(async () => {
    await sb.from("tasks").update({ status: "approved" }).eq("id", task_id);
  });
  return { status: "pipeline_started" };
});

const run_post$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: run_post$2
}, Symbol.toStringTag, { value: 'Module' }));

const chatClear_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { workspace_id, connection_id } = body;
  if (!workspace_id) throw createError({ statusCode: 400, message: "workspace_id required" });
  const sb = useSupabaseAdmin();
  let q = sb.from("analyst_chats").delete().eq("workspace_id", workspace_id);
  if (connection_id) q = q.eq("connection_id", connection_id);
  else q = q.is("connection_id", null);
  await q;
  return { success: true };
});

const chatClear_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: chatClear_post
}, Symbol.toStringTag, { value: 'Module' }));

const chatHistory_get = defineEventHandler(async (event) => {
  const query = getQuery$1(event);
  const { workspace_id, connection_id } = query;
  if (!workspace_id) throw createError({ statusCode: 400, message: "workspace_id required" });
  const sb = useSupabaseAdmin();
  let q = sb.from("analyst_chats").select("id, role, content, user_id, metadata, created_at, users(full_name, email)").eq("workspace_id", workspace_id).order("created_at", { ascending: true }).limit(200);
  if (connection_id) {
    q = q.eq("connection_id", connection_id);
  } else {
    q = q.is("connection_id", null);
  }
  const { data } = await q;
  return data || [];
});

const chatHistory_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: chatHistory_get
}, Symbol.toStringTag, { value: 'Module' }));

const chatSave_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { workspace_id, connection_id, role, content, user_id, metadata } = body;
  if (!workspace_id || !role || !content) throw createError({ statusCode: 400, message: "workspace_id, role, content required" });
  const sb = useSupabaseAdmin();
  const { data, error } = await sb.from("analyst_chats").insert({
    workspace_id,
    connection_id: connection_id || null,
    role,
    content,
    user_id: user_id || null,
    metadata: metadata || {}
  }).select("id, created_at").single();
  if (error) throw createError({ statusCode: 500, message: error.message });
  return data;
});

const chatSave_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: chatSave_post
}, Symbol.toStringTag, { value: 'Module' }));

function parseCassandraUrl(connStr) {
  try {
    const normalized = connStr.replace(/^scylla:\/\//, "cassandra://").replace(/^cassandra:\/\//, "http://");
    const url = new URL(normalized);
    const params = Object.fromEntries(url.searchParams.entries());
    const rawHost = url.hostname;
    const contactPoints = rawHost.split(",").map((h) => h.trim()).filter(Boolean);
    if (!contactPoints.length) contactPoints.push("localhost");
    const port = url.port ? parseInt(url.port) : 9042;
    const keyspace = url.pathname.replace(/^\//, "") || params.keyspace || void 0;
    const datacenter = params.datacenter || "datacenter1";
    const username = url.username || void 0;
    const password = url.password || void 0;
    const opts = {
      contactPoints,
      localDataCenter: datacenter,
      protocolOptions: { port },
      socketOptions: { connectTimeout: 8e3 }
    };
    if (keyspace) opts.keyspace = keyspace;
    if (username && password) opts.credentials = { username, password };
    else if (username) opts.credentials = { username, password: "" };
    return opts;
  } catch (e) {
    throw new Error("Invalid Cassandra connection string: " + e.message);
  }
}

async function getConn(connectionId) {
  const sb = useSupabaseAdmin();
  const { data } = await sb.from("db_connections").select("*").eq("id", connectionId).single();
  return data;
}
async function execQuery(cfg, type, sql, fetchSize = 100) {
  var _a, _b, _c, _d;
  if (type === "postgres" || type === "supabase") {
    const { Client } = await import('file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/pg/esm/index.mjs');
    const client = new Client(cfg.connectionString ? cfg.connectionString : {
      host: cfg.host || "localhost",
      port: parseInt(cfg.port || "5432"),
      database: cfg.database || void 0,
      user: cfg.username || void 0,
      password: cfg.password || void 0,
      connectionTimeoutMillis: 12e3,
      ssl: cfg.ssl ? { rejectUnauthorized: false } : void 0
    });
    await client.connect();
    const res = await client.query(sql);
    await client.end();
    if ((_a = res.fields) == null ? void 0 : _a.length) return { columns: res.fields.map((f) => f.name), rows: res.rows.slice(0, fetchSize) };
    return { columns: ["result"], rows: [{ result: "ok" }], affected: res.rowCount || 0, ddl: true };
  }
  if (type === "mysql" || type === "mariadb" || type === "planetscale") {
    const mysql = await import('file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/mysql2/promise.js');
    const c = await mysql.createConnection(cfg.connectionString ? cfg.connectionString : {
      host: cfg.host || "localhost",
      port: parseInt(cfg.port || "3306"),
      database: cfg.database,
      user: cfg.username,
      password: cfg.password,
      connectTimeout: 12e3
    });
    const [rows, fields] = await c.query(sql);
    await c.end();
    if (Array.isArray(rows) && (fields == null ? void 0 : fields.length)) return { columns: fields.map((f) => f.name), rows: rows.slice(0, fetchSize) };
    return { columns: ["affected_rows"], rows: [{ affected_rows: (_b = rows.affectedRows) != null ? _b : 0 }], affected: (_c = rows.affectedRows) != null ? _c : 0, ddl: true };
  }
  if (type === "cassandra" || type === "scylla") {
    const cassandra = await import('file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/cassandra-driver/index.js');
    const opts = cfg.connectionString ? parseCassandraUrl(cfg.connectionString) : (() => {
      const o = {
        contactPoints: (cfg.host || "localhost").split(",").map((s) => s.trim()),
        localDataCenter: cfg.datacenter || "datacenter1",
        socketOptions: { connectTimeout: 12e3 }
      };
      if (cfg.database) o.keyspace = cfg.database;
      if (cfg.username) o.credentials = { username: cfg.username, password: cfg.password || "" };
      if (cfg.port) o.protocolOptions = { port: parseInt(cfg.port) };
      return o;
    })();
    const client = new cassandra.Client(opts);
    await client.connect();
    const res = await client.execute(sql, [], { prepare: false, fetchSize });
    const columns = ((_d = res.columns) == null ? void 0 : _d.map((c) => c.name)) || [];
    if (!columns.length) {
      await client.shutdown();
      return { columns: ["result"], rows: [{ result: "ok" }], ddl: true };
    }
    const rows = res.rows.map((r) => {
      const obj = {};
      columns.forEach((c) => {
        obj[c] = r[c];
      });
      return obj;
    });
    await client.shutdown();
    return { columns, rows };
  }
  throw new Error("Unsupported database type: " + type);
}
function dialectGuide(type) {
  switch (type) {
    case "cassandra":
    case "scylla":
      return `CRITICAL - You are connected to a CASSANDRA / CQL database. You MUST use CQL syntax, NOT SQL syntax.

CQL rules you must always follow:
- Adding a column: ALTER TABLE tablename ADD columnname datatype  (NO "COLUMN" keyword \u2014 CQL does not have it)
- Column types in CQL: text, int, bigint, boolean, float, double, uuid, timestamp, list<text>, map<text,text>, set<text>
- No JOINS in CQL \u2014 Cassandra does not support joins
- No subqueries
- SELECT always needs LIMIT unless querying by full primary key
- Primary key must be included in WHERE clauses for UPDATE/DELETE
- No transactions
- To list tables: SELECT table_name FROM system_schema.tables WHERE keyspace_name='yourkeyspace'
- To describe a table: SELECT * FROM system_schema.columns WHERE table_name='yourtable' AND keyspace_name='yourkeyspace'

WRONG (SQL): ALTER TABLE users ADD COLUMN groups TEXT
CORRECT (CQL): ALTER TABLE users ADD groups text

WRONG (SQL): SELECT * FROM users JOIN orders ON users.id = orders.user_id
CORRECT (CQL): Not possible \u2014 query each table separately

Always generate valid CQL. If the user asks something impossible in CQL, tell them clearly instead of generating wrong syntax.`;
    case "mysql":
    case "mariadb":
    case "planetscale":
      return `You are connected to a MYSQL database. Use MySQL syntax.
- String type: VARCHAR(255) or TEXT
- Adding column: ALTER TABLE tablename ADD COLUMN columnname datatype
- Auto-increment: INT AUTO_INCREMENT PRIMARY KEY
- Use backticks for identifiers if needed`;
    case "postgres":
    case "supabase":
    default:
      return `You are connected to a POSTGRESQL database. Use PostgreSQL syntax.
- String type: TEXT or VARCHAR
- Adding column: ALTER TABLE tablename ADD COLUMN columnname datatype
- UUID: gen_random_uuid() or uuid_generate_v4()
- JSON: JSONB type recommended`;
  }
}
function fmtTable(result) {
  if (!result.rows.length) return "_(0 rows)_";
  const header = "| " + result.columns.join(" | ") + " |";
  const sep = "| " + result.columns.map(() => "---").join(" | ") + " |";
  const rows = result.rows.slice(0, 40).map(
    (r) => "| " + result.columns.map((c) => {
      var _a;
      return String((_a = r[c]) != null ? _a : "");
    }).join(" | ") + " |"
  );
  return [header, sep, ...rows].join("\n") + (result.rows.length > 40 ? `
_(showing 40 of ${result.rows.length} rows)_` : "");
}
const chat_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const {
    message,
    history,
    data_context,
    connection_id,
    db_tables,
    db_name,
    db_type,
    insights_context,
    workspace_id,
    confirm_write,
    pending_sql
  } = body;
  const aiClient = useAnthropic();
  let conn = null;
  let connCfg = null;
  let connType = db_type;
  if (connection_id) {
    conn = await getConn(connection_id);
    if (conn) {
      connCfg = conn.config;
      connType = conn.db_type;
    }
  }
  if (confirm_write && pending_sql && connCfg) {
    try {
      const result = await execQuery(connCfg, connType, pending_sql);
      let reply2;
      if (result.ddl) {
        reply2 = `Done. The operation completed successfully.

If this was a schema change (ALTER TABLE, CREATE, etc.), you may need to refresh the table list to see it.`;
      } else if (result.affected !== void 0) {
        reply2 = `Done. **${result.affected} row(s) affected.**`;
      } else {
        reply2 = `Done.

${fmtTable(result)}`;
      }
      return { reply: reply2, executed_sql: pending_sql };
    } catch (err) {
      return {
        reply: `The operation failed with this error:

\`\`\`
${err.message}
\`\`\`

This may mean the syntax is wrong for this database engine or you lack permissions.`,
        error: true
      };
    }
  }
  const tableList = (db_tables || []).join(", ");
  const dialect = connType ? dialectGuide(connType) : "";
  const systemPrompt = `You are an expert data analyst with direct access to the connected database. You give accurate, honest responses.

${connection_id ? `DATABASE: "${db_name}" (${connType})
ALL TABLES: ${tableList || "none discovered yet"}

${dialect}

You can run read queries by including them like:
[QUERY: SELECT * FROM users LIMIT 10]

You can propose write/DDL operations like:
[WRITE: INSERT INTO users (name) VALUES ('Alice')]
[WRITE: ALTER TABLE users ADD groups text]

The user will be asked to confirm before any write/DDL executes.

IMPORTANT RULES:
- Always use the correct syntax for this specific database engine (${connType})
- If a query fails, report the actual error \u2014 never pretend it succeeded
- If something is not possible in this database engine, say so clearly with an explanation
- When you propose a write, the SQL you put in [WRITE: ...] must be exactly valid for ${connType}
- After a write is confirmed and executed, tell the user to refresh to see the change take effect` : "No database connected. Tell the user to select a database from the left panel."}

${data_context ? "Data context:\n" + data_context : ""}
${insights_context ? "Recent analysis:\n" + insights_context : ""}

Respond with markdown. Be direct, accurate, and honest about errors or limitations.`;
  let preData = "";
  const isDataRequest = /\b(show|list|rows|data|records|count|how many|what|fetch|get)\b/i.test(message);
  if (connCfg && tableList && isDataRequest) {
    try {
      const genRes = await aiClient.messages.create({
        model: AGENT_MODEL,
        max_tokens: 300,
        system: `Generate a SELECT query for this request. Database engine: ${connType}.
Tables available: ${tableList}.
${dialect}
Return ONLY the SELECT SQL, nothing else. If a SELECT is not appropriate, return nothing.`,
        messages: [{ role: "user", content: message }]
      });
      const autoSql = genRes.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim().replace(/^```sql\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
      if (autoSql && autoSql.toUpperCase().startsWith("SELECT")) {
        const result = await execQuery(connCfg, connType, autoSql, 50);
        if (result.rows.length > 0) {
          preData = `

[Live query result for: ${autoSql}]
${fmtTable(result)}`;
        }
      }
    } catch (e) {
      preData = `

[Pre-emptive query failed: ${e.message}]`;
    }
  }
  const response = await aiClient.messages.create({
    model: AGENT_MODEL,
    max_tokens: 2e3,
    system: systemPrompt,
    messages: [
      ...(history || []).map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: message + preData }
    ]
  });
  let reply = response.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim();
  const readRegex = /\[QUERY:\s*([\s\S]*?)\]/g;
  let match;
  const queryParts = [];
  while ((match = readRegex.exec(reply)) !== null) {
    if (connCfg) {
      try {
        const result = await execQuery(connCfg, connType, match[1].trim(), 100);
        queryParts.push("\n**Results:**\n" + fmtTable(result));
      } catch (e) {
        queryParts.push(`
**Query error:** \`${e.message}\``);
      }
    }
  }
  reply = reply.replace(/\[QUERY:\s*[\s\S]*?\]/g, "").trim();
  if (queryParts.length) reply += queryParts.join("\n");
  const writeMatch = reply.match(/\[WRITE:\s*([\s\S]*?)\]/);
  if (writeMatch) {
    const writeSql = writeMatch[1].trim();
    reply = reply.replace(/\[WRITE:\s*[\s\S]*?\]/g, "").trim();
    reply += `

**Proposed operation:**
\`\`\`sql
${writeSql}
\`\`\`
_Confirm below to execute this against the database._`;
    return { reply, pending_write: writeSql };
  }
  return { reply };
});

const chat_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: chat_post
}, Symbol.toStringTag, { value: 'Module' }));

const dbConnect_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const {
    workspace_id,
    name,
    type,
    host,
    port,
    database,
    username,
    password,
    connectionString,
    useConnStr,
    ssl,
    extra
  } = body;
  if (!workspace_id || !name) throw createError({ statusCode: 400, message: "workspace_id and name required" });
  const sb = useSupabaseAdmin();
  const config = useConnStr ? { connectionString } : { host, port, database, username, password, ssl, datacenter: extra };
  const { data, error } = await sb.from("db_connections").insert({
    workspace_id,
    name,
    db_type: type,
    status: "untested",
    config,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).select().single();
  if (error) throw createError({ statusCode: 500, message: error.message });
  return { id: data.id, name, type, status: "untested" };
});

const dbConnect_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: dbConnect_post
}, Symbol.toStringTag, { value: 'Module' }));

const dbDelete_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = body.id || body.connection_id;
  if (!id) throw createError({ statusCode: 400, message: "id required" });
  const sb = useSupabaseAdmin();
  const { error } = await sb.from("db_connections").delete().eq("id", id);
  if (error) throw createError({ statusCode: 500, message: error.message });
  return { success: true };
});

const dbDelete_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: dbDelete_post
}, Symbol.toStringTag, { value: 'Module' }));

const dbIntrospect = defineEventHandler(async (event) => {
  var _a;
  let connection_id;
  if (event.method === "GET") {
    const query = getQuery$1(event);
    connection_id = query.connection_id;
    query.workspace_id;
  } else {
    const body = await readBody(event);
    connection_id = body.connection_id;
    body.workspace_id;
  }
  if (!connection_id) throw createError({ statusCode: 400, message: "connection_id required" });
  const sb = useSupabaseAdmin();
  const { data: conn } = await sb.from("db_connections").select("*").eq("id", connection_id).single();
  if (!conn) throw createError({ statusCode: 404, message: "Connection not found" });
  const cfg = conn.config;
  const type = conn.db_type;
  try {
    let tables = [];
    let preview = [];
    let columns = [];
    let rowCounts = {};
    if (type === "postgres" || type === "supabase") {
      const { Client } = await import('file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/pg/esm/index.mjs');
      const client = new Client(cfg.connectionString ? cfg.connectionString : {
        host: cfg.host || "localhost",
        port: parseInt(cfg.port || "5432"),
        database: cfg.database || void 0,
        user: cfg.username || void 0,
        password: cfg.password || void 0,
        connectionTimeoutMillis: 8e3,
        ssl: cfg.ssl ? { rejectUnauthorized: false } : void 0
      });
      await client.connect();
      const tRes = await client.query(`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        ORDER BY table_name LIMIT 50`);
      tables = tRes.rows.map((r) => r.table_name);
      for (const t of tables.slice(0, 10)) {
        try {
          const r = await client.query(`SELECT COUNT(*) FROM "${t}"`);
          rowCounts[t] = parseInt(r.rows[0].count);
        } catch {
        }
      }
      if (tables.length) {
        const pRes = await client.query(`SELECT * FROM "${tables[0]}" LIMIT 10`);
        preview = pRes.rows;
        columns = pRes.fields.map((f) => f.name);
      }
      await client.end();
    } else if (type === "mysql" || type === "mariadb" || type === "planetscale") {
      const mysql = await import('file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/mysql2/promise.js');
      const conn2 = await mysql.createConnection(cfg.connectionString ? cfg.connectionString : {
        host: cfg.host || "localhost",
        port: parseInt(cfg.port || "3306"),
        database: cfg.database,
        user: cfg.username,
        password: cfg.password,
        connectTimeout: 8e3,
        ssl: cfg.ssl ? { rejectUnauthorized: false } : void 0
      });
      const [tRows] = await conn2.query("SHOW TABLES");
      tables = tRows.map((r) => Object.values(r)[0]);
      for (const t of tables.slice(0, 10)) {
        try {
          const [r] = await conn2.query("SELECT COUNT(*) as cnt FROM `" + t + "`");
          rowCounts[t] = r[0].cnt;
        } catch {
        }
      }
      if (tables.length) {
        const [pRows, pFields] = await conn2.query("SELECT * FROM `" + tables[0] + "` LIMIT 10");
        preview = pRows;
        columns = pFields.map((f) => f.name);
      }
      await conn2.end();
    } else if (type === "cassandra" || type === "scylla") {
      const cassandra = await import('file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/cassandra-driver/index.js');
      let opts;
      if (cfg.connectionString) {
        opts = parseCassandraUrl(cfg.connectionString);
      } else {
        const contactPoints = (cfg.host || "localhost").split(",").map((s) => s.trim());
        opts = {
          contactPoints,
          localDataCenter: cfg.datacenter || "datacenter1",
          socketOptions: { connectTimeout: 8e3 }
        };
        if (cfg.database) opts.keyspace = cfg.database;
        if (cfg.username) opts.credentials = { username: cfg.username, password: cfg.password || "" };
        if (cfg.port) opts.protocolOptions = { port: parseInt(cfg.port) };
      }
      const client = new cassandra.Client(opts);
      await client.connect();
      const keyspace = opts.keyspace || client.keyspace;
      if (keyspace) {
        const tRes = await client.execute(
          "SELECT table_name FROM system_schema.tables WHERE keyspace_name = ?",
          [keyspace]
        );
        tables = tRes.rows.map((r) => r.table_name);
        if (tables.length) {
          try {
            const pRes = await client.execute(
              "SELECT * FROM " + keyspace + "." + tables[0] + " LIMIT 10"
            );
            preview = pRes.rows.map((r) => {
              var _a2;
              const obj = {};
              (_a2 = pRes.columns) == null ? void 0 : _a2.forEach((c) => {
                obj[c.name] = r[c.name];
              });
              return obj;
            });
            columns = ((_a = pRes.columns) == null ? void 0 : _a.map((c) => c.name)) || [];
          } catch {
          }
        }
      } else {
        const ksRes = await client.execute(
          "SELECT keyspace_name FROM system_schema.keyspaces"
        );
        tables = ksRes.rows.map((r) => r.keyspace_name).filter((k) => !["system", "system_auth", "system_distributed", "system_schema", "system_traces"].includes(k));
      }
      await client.shutdown();
    } else {
      throw new Error("Introspection not yet supported for " + type);
    }
    await sb.from("db_connections").update({ status: "connected", config: { ...cfg, tables }, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", connection_id);
    return { tables, preview, columns, rowCounts, status: "connected" };
  } catch (err) {
    await sb.from("db_connections").update({ status: "error" }).eq("id", connection_id);
    throw createError({ statusCode: 400, message: err.message || "Failed to connect" });
  }
});

const dbIntrospect$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: dbIntrospect
}, Symbol.toStringTag, { value: 'Module' }));

const dbList_get = defineEventHandler(async (event) => {
  const query = getQuery$1(event);
  const workspaceId = query.workspace_id;
  if (!workspaceId) throw createError({ statusCode: 400, message: "workspace_id required" });
  const sb = useSupabaseAdmin();
  const { data, error } = await sb.from("db_connections").select("id, name, db_type, status, config").eq("workspace_id", workspaceId).order("created_at", { ascending: false });
  if (error) throw createError({ statusCode: 500, message: error.message });
  return (data || []).map((d) => {
    var _a;
    return {
      id: d.id,
      name: d.name,
      type: d.db_type,
      status: d.status,
      tables: ((_a = d.config) == null ? void 0 : _a.tables) || []
    };
  });
});

const dbList_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: dbList_get
}, Symbol.toStringTag, { value: 'Module' }));

function classifyQuery(sql) {
  const s = sql.trim().toLowerCase();
  if (/^(select|show|describe|explain|with\s)/i.test(s)) return "read";
  if (/^(insert|update|delete|merge|replace|upsert)/i.test(s)) return "write";
  return "ddl";
}
const dbQuery_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const body = await readBody(event);
  const { connection_id, sql, limit = 500, allow_write = false } = body;
  if (!connection_id || !(sql == null ? void 0 : sql.trim())) {
    throw createError({ statusCode: 400, message: "connection_id and sql required" });
  }
  const queryKind = classifyQuery(sql);
  if ((queryKind === "write" || queryKind === "ddl") && !allow_write) {
    throw createError({
      statusCode: 403,
      message: "WRITE_CONFIRMATION_REQUIRED",
      data: { code: "WRITE_CONFIRMATION_REQUIRED", query_type: queryKind, sql }
    });
  }
  const sb = useSupabaseAdmin();
  const { data: conn } = await sb.from("db_connections").select("*").eq("id", connection_id).single();
  if (!conn) throw createError({ statusCode: 404, message: "Connection not found" });
  const cfg = conn.config;
  const type = conn.db_type;
  const start = Date.now();
  try {
    let columns = [];
    let rows = [];
    let affectedRows;
    let isDdl = false;
    if (type === "postgres" || type === "supabase") {
      const { Client } = await import('file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/pg/esm/index.mjs');
      const client = new Client(cfg.connectionString ? cfg.connectionString : {
        host: cfg.host || "localhost",
        port: parseInt(cfg.port || "5432"),
        database: cfg.database || void 0,
        user: cfg.username || void 0,
        password: cfg.password || void 0,
        connectionTimeoutMillis: 12e3,
        ssl: cfg.ssl ? { rejectUnauthorized: false } : void 0
      });
      await client.connect();
      const res = await client.query(sql);
      await client.end();
      if (queryKind === "read" && ((_a = res.fields) == null ? void 0 : _a.length)) {
        columns = res.fields.map((f) => f.name);
        rows = res.rows.slice(0, limit);
      } else {
        isDdl = queryKind === "ddl";
        affectedRows = res.rowCount || 0;
        columns = ["result"];
        rows = [{ result: isDdl ? "Schema change applied successfully" : `${affectedRows} row(s) affected` }];
      }
    } else if (type === "mysql" || type === "mariadb" || type === "planetscale") {
      const mysql = await import('file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/mysql2/promise.js');
      const c = await mysql.createConnection(cfg.connectionString ? cfg.connectionString : {
        host: cfg.host || "localhost",
        port: parseInt(cfg.port || "3306"),
        database: cfg.database,
        user: cfg.username,
        password: cfg.password,
        connectTimeout: 12e3
      });
      const [result, fields] = await c.query(sql);
      await c.end();
      if (queryKind === "read" && Array.isArray(result) && (fields == null ? void 0 : fields.length)) {
        columns = fields.map((f) => f.name);
        rows = result.slice(0, limit);
      } else {
        isDdl = queryKind === "ddl";
        affectedRows = (_b = result.affectedRows) != null ? _b : 0;
        columns = ["result"];
        rows = [{ result: isDdl ? "Schema change applied successfully" : `${affectedRows} row(s) affected` }];
      }
    } else if (type === "cassandra" || type === "scylla") {
      const cassandra = await import('file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/cassandra-driver/index.js');
      const opts = cfg.connectionString ? parseCassandraUrl(cfg.connectionString) : (() => {
        const o = {
          contactPoints: (cfg.host || "localhost").split(",").map((s) => s.trim()),
          localDataCenter: cfg.datacenter || "datacenter1",
          socketOptions: { connectTimeout: 12e3 }
        };
        if (cfg.database) o.keyspace = cfg.database;
        if (cfg.username) o.credentials = { username: cfg.username, password: cfg.password || "" };
        if (cfg.port) o.protocolOptions = { port: parseInt(cfg.port) };
        return o;
      })();
      const client = new cassandra.Client(opts);
      await client.connect();
      const res = await client.execute(sql, [], { prepare: false, fetchSize: limit });
      await client.shutdown();
      if ((_c = res.columns) == null ? void 0 : _c.length) {
        columns = res.columns.map((c) => c.name);
        rows = res.rows.map((r) => {
          const obj = {};
          columns.forEach((c) => {
            obj[c] = r[c];
          });
          return obj;
        }).slice(0, limit);
      } else {
        isDdl = queryKind === "ddl";
        columns = ["result"];
        rows = [{ result: isDdl ? "Schema change applied successfully" : "Operation completed" }];
      }
    } else {
      throw new Error(`Query execution is not supported for database type "${type}" yet.`);
    }
    return {
      columns,
      rows,
      count: rows.length,
      affected_rows: affectedRows,
      query_type: queryKind,
      is_ddl: isDdl,
      time: Date.now() - start,
      truncated: queryKind === "read" && rows.length === limit
    };
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError({ statusCode: 400, message: err.message || "Query failed" });
  }
});

const dbQuery_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: dbQuery_post
}, Symbol.toStringTag, { value: 'Module' }));

const dbTest_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { type, host, port, database, username, password, connectionString, useConnStr, ssl, extra } = body;
  if (!body.name) throw createError({ statusCode: 400, message: "Connection name is required" });
  try {
    if (type === "postgres" || type === "supabase") {
      const { Client } = await import('file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/pg/esm/index.mjs');
      const client = new Client(useConnStr && connectionString ? connectionString : {
        host: host || "localhost",
        port: parseInt(port || "5432"),
        database: database || void 0,
        user: username || void 0,
        password: password || void 0,
        connectionTimeoutMillis: 8e3,
        ssl: ssl ? { rejectUnauthorized: false } : void 0
      });
      await client.connect();
      await client.query("SELECT 1");
      await client.end();
    } else if (type === "mysql" || type === "mariadb" || type === "planetscale") {
      const mysql = await import('file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/mysql2/promise.js');
      const conn = await mysql.createConnection(useConnStr && connectionString ? connectionString : {
        host: host || "localhost",
        port: parseInt(port || "3306"),
        database: database || void 0,
        user: username || void 0,
        password: password || void 0,
        connectTimeout: 8e3,
        ssl: ssl ? { rejectUnauthorized: false } : void 0
      });
      await conn.query("SELECT 1");
      await conn.end();
    } else if (type === "cassandra" || type === "scylla") {
      const cassandra = await import('file://C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/cassandra-driver/index.js');
      let opts;
      if (useConnStr && connectionString) {
        opts = parseCassandraUrl(connectionString);
      } else {
        const contactPoints = (host || "localhost").split(",").map((s) => s.trim());
        opts = {
          contactPoints,
          localDataCenter: extra || "datacenter1",
          socketOptions: { connectTimeout: 8e3 }
        };
        if (database) opts.keyspace = database;
        if (username) opts.credentials = { username, password: password || "" };
        if (port) opts.protocolOptions = { port: parseInt(port) };
      }
      const client = new cassandra.Client(opts);
      await client.connect();
      await client.execute("SELECT now() FROM system.local");
      await client.shutdown();
    } else {
      if (!host && !connectionString && type !== "sqlite" && type !== "duckdb") {
        throw new Error("Host or connection string required");
      }
    }
    return { success: true, message: "Connected successfully" };
  } catch (err) {
    const msg = err.message || "Connection failed";
    throw createError({
      statusCode: 400,
      message: msg.includes("ECONNREFUSED") ? "Cannot reach " + (host || "host") + ":" + (port || "?") + " - is the database running?" : msg.includes("password") || msg.includes("auth") || msg.includes("Unauthorized") ? "Authentication failed - check username and password" : msg.includes("does not exist") || msg.includes("keyspace") ? "Keyspace/database not found: " + (database || "") : msg.includes("datacenter") ? "Datacenter not found - check localDataCenter setting" : msg
    });
  }
});

const dbTest_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: dbTest_post
}, Symbol.toStringTag, { value: 'Module' }));

const query_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { question, data_sample, columns, column_stats, total_rows, db_info } = body;
  if (!question || !data_sample) throw createError({ statusCode: 400, message: "question and data required" });
  const client = useAnthropic();
  const systemPrompt = `You are a data analyst AI. You receive a dataset sample and answer questions about it.

Always respond with valid JSON only, no markdown fences:
{
  "answer": "detailed markdown explanation with insights",
  "key_metrics": [{"label": "metric name", "value": "formatted value"}, ...],
  "chart_type": "bar|line|pie|doughnut|scatter|null",
  "chart_data": {
    "type": "bar",
    "labels": [...],
    "datasets": [{
      "label": "Dataset name",
      "data": [...],
      "backgroundColor": ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"]
    }]
  }
}

Rules:
- answer must be substantive markdown with specific numbers from the data
- key_metrics should be 2-4 most important numbers
- chart_data must be valid Chart.js format if a chart helps understand the data
- if no chart is appropriate, set chart_type to null and chart_data to null
- always reference specific values from the data, never be vague
- identify trends, outliers, and actionable insights`;
  const userMsg = `Dataset: ${total_rows} rows, columns: ${column_stats}

Sample data (first ${data_sample.length} rows):
${JSON.stringify(data_sample, null, 2)}

Question: ${question}`;
  const response = await client.messages.create({
    model: AGENT_MODEL,
    max_tokens: 2e3,
    system: systemPrompt,
    messages: [{ role: "user", content: userMsg }]
  });
  const raw = response.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
  try {
    return JSON.parse(raw);
  } catch {
    return { answer: raw, key_metrics: [], chart_type: null, chart_data: null };
  }
});

const query_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: query_post
}, Symbol.toStringTag, { value: 'Module' }));

const DIALECT_HINTS = {
  cassandra: `CQL (Cassandra Query Language) rules:
- ALTER TABLE: ALTER TABLE tbl ADD colname datatype  (NO "COLUMN" keyword)
- No JOINs, no subqueries
- Data types: text, int, bigint, boolean, float, double, uuid, timestamp, list<text>, map<text,text>
- Always include LIMIT on SELECT unless querying by full primary key
- System tables: system_schema.tables, system_schema.columns`,
  scylla: `CQL (ScyllaDB) \u2014 same rules as Cassandra above`,
  mysql: `MySQL syntax \u2014 use VARCHAR/TEXT, backticks for identifiers, LIMIT for pagination`,
  mariadb: `MariaDB syntax \u2014 same as MySQL`,
  postgres: `PostgreSQL syntax \u2014 use TEXT/JSONB, gen_random_uuid(), RETURNING clause`,
  supabase: `PostgreSQL syntax \u2014 same as postgres`
};
const sqlGen_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { prompt, tables, db_type } = body;
  const dialectHint = DIALECT_HINTS[db_type] || DIALECT_HINTS["postgres"];
  const client = useAnthropic();
  const response = await client.messages.create({
    model: AGENT_MODEL,
    max_tokens: 400,
    system: `Generate a valid query for this database.

Database engine: ${db_type || "postgres"}
${dialectHint}

Available tables: ${(tables || []).join(", ")}

Return ONLY the raw SQL/CQL query, no explanation, no markdown fences, no comments.
The query must be valid for ${db_type || "postgres"} specifically.`,
    messages: [{ role: "user", content: prompt }]
  });
  const sql = response.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim().replace(/^```sql\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
  return { sql };
});

const sqlGen_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: sqlGen_post
}, Symbol.toStringTag, { value: 'Module' }));

const summary_post = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event);
  const { data_sample, column_stats, name, total_rows } = body;
  const client = useAnthropic();
  const dbTablesStr = ((_a = body.db_tables) == null ? void 0 : _a.length) ? "Database tables: " + body.db_tables.join(", ") + ". " : "";
  const statsStr = Array.isArray(column_stats) ? column_stats.map((c) => c.type === "number" ? `${c.name}(${c.min}\u2013${c.max})` : `${c.name}(${c.uniques}unique)`).join(", ") : column_stats;
  const response = await client.messages.create({
    model: AGENT_MODEL,
    max_tokens: 2e3,
    system: `You are a senior data analyst. Generate a comprehensive analysis report in markdown.
Include: ## Executive Summary, ## Key Metrics, ## Trends & Patterns, ## Anomalies & Outliers, ## Recommendations
Be specific with numbers. Format as clean markdown.`,
    messages: [{
      role: "user",
      content: `${dbTablesStr}Dataset: ${name}, ${total_rows} rows
Columns: ${statsStr}
Sample data: ${JSON.stringify(data_sample == null ? void 0 : data_sample.slice(0, 40))}

Generate a full analysis report with specific insights from the actual data provided.`
    }]
  });
  const content = response.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim();
  return { title: `Analysis Report \u2014 ${name}`, content };
});

const summary_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: summary_post
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$6 = defineEventHandler(async (event) => {
  var _a;
  const query = getQuery$1(event);
  const workspaceId = query.workspace_id;
  const days = parseInt(query.days) || 30;
  if (!workspaceId) throw createError({ statusCode: 400, message: "workspace_id required" });
  const sb = useSupabaseAdmin();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1e3).toISOString();
  const taskIds = ((_a = (await sb.from("tasks").select("id").eq("workspace_id", workspaceId)).data) == null ? void 0 : _a.map((t) => t.id)) || [];
  const [tasks, meetings, agentRuns, integrations, databases, fileChunks] = await Promise.all([
    sb.from("tasks").select("id,status,assigned_agent,created_at,updated_at").eq("workspace_id", workspaceId).gte("created_at", since),
    sb.from("meetings").select("id,source,bot_platform,transcript,created_at").eq("workspace_id", workspaceId).gte("created_at", since),
    taskIds.length ? sb.from("agent_runs").select("id,agent_type,status,started_at,ended_at").in("task_id", taskIds).gte("started_at", since) : { data: [] },
    // CORRECT columns: type, status — no name/enabled column
    sb.from("integrations").select("type,status").eq("workspace_id", workspaceId),
    sb.from("db_connections").select("name,db_type,status").eq("workspace_id", workspaceId),
    sb.from("file_chunks").select("id,embedding").eq("workspace_id", workspaceId)
  ]);
  const allTasks = tasks.data || [];
  const allMeetings = meetings.data || [];
  const allRuns = agentRuns.data || [];
  const allChunks = fileChunks.data || [];
  const allIntegrations = (integrations.data || []).map((i) => ({
    type: i.type,
    status: i.status || "connected"
  }));
  const tasksByStatus = allTasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});
  const tasksByAgent = allTasks.reduce((acc, t) => {
    if (t.assigned_agent) acc[t.assigned_agent] = (acc[t.assigned_agent] || 0) + 1;
    return acc;
  }, {});
  const completed = allTasks.filter((t) => t.status === "completed").length;
  const total = allTasks.length;
  const completionRate = total > 0 ? Math.round(completed / total * 100) : 0;
  const completedRuns = allRuns.filter((r) => r.status === "completed" && r.ended_at);
  const avgRunMs = completedRuns.length > 0 ? completedRuns.reduce((sum, r) => sum + (new Date(r.ended_at).getTime() - new Date(r.started_at).getTime()), 0) / completedRuns.length : 0;
  const tasksByDay = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
    tasksByDay[d] = 0;
  }
  allTasks.forEach((t) => {
    const d = t.created_at.slice(0, 10);
    if (tasksByDay[d] !== void 0) tasksByDay[d]++;
  });
  const agentPerf = {};
  allRuns.forEach((r) => {
    if (!agentPerf[r.agent_type]) agentPerf[r.agent_type] = { runs: 0, completed: 0, avgMs: 0 };
    agentPerf[r.agent_type].runs++;
    if (r.status === "completed") {
      agentPerf[r.agent_type].completed++;
      if (r.ended_at)
        agentPerf[r.agent_type].avgMs += new Date(r.ended_at).getTime() - new Date(r.started_at).getTime();
    }
  });
  Object.values(agentPerf).forEach((p) => {
    if (p.completed > 0) p.avgMs = Math.round(p.avgMs / p.completed);
  });
  const embeddedChunks = allChunks.filter((c) => c.embedding !== null).length;
  const totalFiles = Math.ceil(allChunks.length / 10) || 0;
  return {
    summary: {
      totalTasks: total,
      completedTasks: completed,
      completionRate,
      totalMeetings: allMeetings.length,
      totalAgentRuns: allRuns.length,
      avgRunMs: Math.round(avgRunMs),
      totalVoiceSessions: allMeetings.filter((m) => m.source === "voice" || m.bot_platform).length,
      totalEmbeddings: embeddedChunks,
      connectedIntegrations: allIntegrations.filter((i) => i.status === "connected").length
    },
    tasksByStatus,
    tasksByAgent,
    tasksByDay,
    agentPerf,
    integrations: allIntegrations,
    databases: databases.data || [],
    rag: {
      totalFiles,
      totalChunks: allChunks.length,
      embeddedChunks
    }
  };
});

const index_get$7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$6
}, Symbol.toStringTag, { value: 'Module' }));

const cron_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if ((body == null ? void 0 : body.secret) !== process.env.CRON_SECRET) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  const sb = useSupabaseAdmin();
  const now = /* @__PURE__ */ new Date();
  const windowEnd = new Date(now.getTime() + 2 * 60 * 1e3).toISOString();
  const { data: due, error } = await sb.from("scheduled_bots").select("*").eq("status", "pending").lte("scheduled_at", windowEnd);
  if (error) throw createError({ statusCode: 500, message: error.message });
  if (!(due == null ? void 0 : due.length)) return { fired: 0, checked: 0 };
  const results = await Promise.allSettled(
    due.map(async (bot) => {
      await sb.from("scheduled_bots").update({ status: "running", fired_at: now.toISOString() }).eq("id", bot.id).eq("status", "pending");
      try {
        const botServiceUrl = process.env.BOT_SERVICE_URL || "http://localhost:3021";
        const secret = process.env.BOT_SECRET || "changeme";
        const res = await fetch(`${botServiceUrl}/bot/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-bot-secret": secret },
          body: JSON.stringify({
            room_url: bot.room_url,
            workspace_id: bot.workspace_id,
            bot_name: bot.bot_name || "Atlantir",
            response_mode: bot.response_mode || "addressed",
            instructions: bot.instructions || void 0
          })
        });
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Bot service ${res.status}: ${errText}`);
        }
        const result = await res.json();
        await sb.from("scheduled_bots").update({ status: "done", session_id: result.session_id }).eq("id", bot.id);
        return { id: bot.id, session_id: result.session_id };
      } catch (e) {
        await sb.from("scheduled_bots").update({ status: "failed", error_message: e.message }).eq("id", bot.id);
        throw e;
      }
    })
  );
  const fired = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;
  return {
    checked: due.length,
    fired,
    failed,
    at: now.toISOString()
  };
});

const cron_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: cron_post
}, Symbol.toStringTag, { value: 'Module' }));

const join_post$2 = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const botServiceUrl = process.env.BOT_SERVICE_URL || "http://localhost:3021";
  const secret = process.env.BOT_SECRET || "changeme";
  const res = await fetch(`${botServiceUrl}/bot/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-bot-secret": secret },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.text();
    throw createError({ statusCode: res.status, message: err });
  }
  return res.json();
});

const join_post$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: join_post$2
}, Symbol.toStringTag, { value: 'Module' }));

const leave_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const botServiceUrl = process.env.BOT_SERVICE_URL || "https://agent.endless.sbs";
  const secret = process.env.BOT_SECRET || "changeme";
  const res = await fetch(`${botServiceUrl}/bot/leave`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-bot-secret": secret },
    body: JSON.stringify(body)
  });
  if (res.status === 404) return { status: "already_stopped" };
  if (!res.ok) throw createError({ statusCode: res.status, message: await res.text() });
  return res.json();
});

const leave_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: leave_post
}, Symbol.toStringTag, { value: 'Module' }));

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] ** 2;
    nb += b[i] ** 2;
  }
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}
async function embedQuery$1(text) {
  var _a, _b, _c;
  try {
    const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ model: "openai/text-embedding-ada-002", input: [text] })
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (_c = (_b = (_a = data.data) == null ? void 0 : _a[0]) == null ? void 0 : _b.embedding) != null ? _c : null;
  } catch {
    return null;
  }
}
const respond_post$2 = defineEventHandler(async (event) => {
  var _a, _b;
  const secret = getHeader(event, "x-bot-secret");
  if (secret !== process.env.BOT_SECRET) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  const body = await readBody(event);
  const { transcript, workspace_id, instructions: sessionInstructions } = body;
  if (!transcript || !workspace_id) {
    throw createError({ statusCode: 400, message: "transcript and workspace_id required" });
  }
  const sb = useSupabaseAdmin();
  const { data: workspace } = await sb.from("workspaces").select("name, description, bot_name, bot_instructions, bot_response_mode").eq("id", workspace_id).single();
  const workspaceName = (workspace == null ? void 0 : workspace.name) || "this workspace";
  const botInstructions = ((_a = workspace == null ? void 0 : workspace.bot_instructions) == null ? void 0 : _a.trim()) || "";
  const workspaceDesc = ((_b = workspace == null ? void 0 : workspace.description) == null ? void 0 : _b.trim()) || "";
  let ragContext = "";
  const queryVec = await embedQuery$1(transcript);
  if (queryVec) {
    const { data: chunks } = await sb.from("file_chunks").select("content, embedding").eq("workspace_id", workspace_id).not("embedding", "is", null).limit(200);
    if (chunks == null ? void 0 : chunks.length) {
      const scored = chunks.map((c) => {
        let vec;
        try {
          vec = typeof c.embedding === "string" ? JSON.parse(c.embedding) : c.embedding;
        } catch {
          return null;
        }
        return { content: c.content, score: cosine(queryVec, vec) };
      }).filter((c) => c !== null && c.score > 0.72).sort((a, b) => b.score - a.score).slice(0, 4);
      if (scored.length) {
        ragContext = `

Relevant workspace knowledge (retrieved by semantic search):
${scored.map((c, i) => `[${i + 1}] ${c.content}`).join("\n---\n")}`;
      }
    }
  }
  if (!ragContext) {
    const keywords = transcript.toLowerCase().split(/\s+/).filter((w) => w.length > 4).slice(0, 8);
    if (keywords.length) {
      const { data: chunks } = await sb.from("file_chunks").select("content").eq("workspace_id", workspace_id).limit(80);
      if (chunks == null ? void 0 : chunks.length) {
        const scored = chunks.map((c) => ({
          content: c.content,
          score: keywords.filter((k) => c.content.toLowerCase().includes(k)).length
        })).filter((c) => c.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);
        if (scored.length) {
          ragContext = `

Relevant workspace knowledge:
${scored.map((c) => c.content).join("\n---\n")}`;
        }
      }
    }
  }
  let integrationsCtx = "";
  const { data: integrations } = await sb.from("integrations").select("name, type").eq("workspace_id", workspace_id).eq("enabled", true).limit(10);
  if (integrations == null ? void 0 : integrations.length) {
    integrationsCtx = `
Connected tools: ${integrations.map((i) => i.name || i.type).join(", ")}.`;
  }
  const effectiveInstructions = (sessionInstructions == null ? void 0 : sessionInstructions.trim()) || botInstructions;
  const systemParts = [
    effectiveInstructions ? effectiveInstructions : `You are an AI assistant named ${(workspace == null ? void 0 : workspace.bot_name) || "Atlantir"}, embedded live in a meeting call for the workspace "${workspaceName}".`,
    // Workspace context
    workspaceDesc && !botInstructions ? `Workspace: ${workspaceDesc}` : "",
    integrationsCtx,
    // Voice response rules — always appended
    `
You are speaking aloud via text-to-speech. Rules:`,
    `- Maximum 2\u20133 sentences. No markdown, no lists, no formatting.`,
    `- Natural spoken language only. Be direct and concise.`,
    `- Use knowledge from the workspace when relevant.`,
    `- If you don't know something, say so briefly in one sentence.`,
    // Knowledge
    ragContext
  ].filter(Boolean).join("\n");
  const client = useAnthropic();
  const response = await client.messages.create({
    model: AGENT_MODEL,
    max_tokens: 200,
    system: systemParts,
    messages: [{ role: "user", content: transcript }]
  });
  const text = response.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim();
  return { response: text };
});

const respond_post$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: respond_post$2
}, Symbol.toStringTag, { value: 'Module' }));

const scheduleDelete_post = defineEventHandler(async (event) => {
  const { id } = await readBody(event);
  if (!id) throw createError({ statusCode: 400, message: "id required" });
  const sb = useSupabaseAdmin();
  const { error } = await sb.from("scheduled_bots").delete().eq("id", id).eq("status", "pending");
  if (error) throw createError({ statusCode: 500, message: error.message });
  return { deleted: true };
});

const scheduleDelete_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: scheduleDelete_post
}, Symbol.toStringTag, { value: 'Module' }));

const schedule_post$2 = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const {
    workspace_id,
    room_url,
    bot_name,
    response_mode,
    instructions,
    scheduled_at,
    timezone,
    platform
  } = body;
  if (!workspace_id || !room_url || !scheduled_at) {
    throw createError({ statusCode: 400, message: "workspace_id, room_url, and scheduled_at required" });
  }
  if (new Date(scheduled_at) <= /* @__PURE__ */ new Date()) {
    throw createError({ statusCode: 400, message: "Scheduled time must be in the future" });
  }
  const sb = useSupabaseAdmin();
  const { data, error } = await sb.from("scheduled_bots").insert({
    workspace_id,
    room_url,
    bot_name: bot_name || "Atlantir",
    response_mode: response_mode || "addressed",
    instructions: instructions || null,
    scheduled_at,
    timezone: timezone || "UTC",
    platform: platform || "zoom",
    status: "pending"
  }).select().single();
  if (error) throw createError({ statusCode: 500, message: error.message });
  return data;
});

const schedule_post$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: schedule_post$2
}, Symbol.toStringTag, { value: 'Module' }));

const schedules_get = defineEventHandler(async (event) => {
  const { workspace_id } = getQuery$1(event);
  if (!workspace_id) throw createError({ statusCode: 400, message: "workspace_id required" });
  const sb = useSupabaseAdmin();
  const { data, error } = await sb.from("scheduled_bots").select("*").eq("workspace_id", workspace_id).order("scheduled_at", { ascending: true });
  if (error) throw createError({ statusCode: 500, message: error.message });
  return data;
});

const schedules_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: schedules_get
}, Symbol.toStringTag, { value: 'Module' }));

const status_get = defineEventHandler(async (event) => {
  const { id } = getQuery$1(event);
  if (!id) throw createError({ statusCode: 400, message: "id required" });
  const botServiceUrl = process.env.BOT_SERVICE_URL || "http://localhost:3021";
  const secret = process.env.BOT_SECRET || "changeme";
  const res = await fetch(`${botServiceUrl}/bot/status/${id}`, {
    headers: { "x-bot-secret": secret }
  });
  if (!res.ok) throw createError({ statusCode: res.status, message: "Session not found" });
  return res.json();
});

const status_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: status_get
}, Symbol.toStringTag, { value: 'Module' }));

const delete_post$2 = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { file_id } = body;
  if (!file_id) throw createError({ statusCode: 400, message: "file_id required" });
  const sb = useSupabaseAdmin();
  const { data: file } = await sb.from("files").select("storage_path").eq("id", file_id).single();
  if (file) await sb.storage.from("files").remove([file.storage_path]);
  await sb.from("file_chunks").delete().eq("file_id", file_id);
  await sb.from("files").delete().eq("id", file_id);
  return { success: true };
});

const delete_post$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: delete_post$2
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$4 = defineEventHandler(async (event) => {
  const query = getQuery$1(event);
  const workspaceId = query.workspace_id;
  if (!workspaceId) throw createError({ statusCode: 400, message: "workspace_id required" });
  const sb = useSupabaseAdmin();
  const { data, error } = await sb.from("files").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false });
  if (error) throw createError({ statusCode: 500, message: error.message });
  return data;
});

const index_get$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$4
}, Symbol.toStringTag, { value: 'Module' }));

async function extractText(buffer, mimeType, filename) {
  if (mimeType === "text/plain" || mimeType === "text/markdown" || filename.endsWith(".md") || filename.endsWith(".txt")) {
    return buffer.toString("utf-8");
  }
  if (mimeType === "application/pdf") {
    const client = useAnthropic();
    const base64 = buffer.toString("base64");
    const response = await client.messages.create({
      model: AGENT_MODEL,
      max_tokens: 4096,
      messages: [{
        role: "user",
        content: [
          {
            type: "document",
            source: { type: "base64", media_type: "application/pdf", data: base64 }
          },
          { type: "text", text: "Extract all text content from this document. Return only the raw text, preserve structure." }
        ]
      }]
    });
    return response.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  }
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const xml = buffer.toString("utf-8");
    const text = xml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return text;
  }
  return buffer.toString("utf-8");
}
function chunkText(text, chunkSize = 500, overlap = 50) {
  const words = text.split(/\s+/);
  const chunks = [];
  let i = 0;
  while (i < words.length) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
    i += chunkSize - overlap;
  }
  return chunks.filter((c) => c.trim().length > 20);
}
async function embedChunks(chunks) {
  const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/text-embedding-ada-002",
      input: chunks
    })
  });
  if (!res.ok) {
    return chunks.map(() => new Array(1536).fill(0));
  }
  const data = await res.json();
  return data.data.map((d) => d.embedding);
}
const upload_post = defineEventHandler(async (event) => {
  var _a, _b;
  const sb = useSupabaseAdmin();
  const formData = await readMultipartFormData(event);
  if (!formData) throw createError({ statusCode: 400, message: "No form data" });
  const filePart = formData.find((p) => p.name === "file");
  const workspaceId = (_a = formData.find((p) => p.name === "workspace_id")) == null ? void 0 : _a.data.toString();
  const userId = (_b = formData.find((p) => p.name === "user_id")) == null ? void 0 : _b.data.toString();
  if (!filePart || !workspaceId) {
    throw createError({ statusCode: 400, message: "file and workspace_id required" });
  }
  const filename = filePart.filename || "upload";
  const mimeType = filePart.type || "text/plain";
  const buffer = filePart.data;
  const storagePath = `${workspaceId}/${Date.now()}_${filename}`;
  const { error: storageErr } = await sb.storage.from("files").upload(storagePath, buffer, { contentType: mimeType, upsert: false });
  if (storageErr) throw createError({ statusCode: 500, message: storageErr.message });
  const { data: fileRecord, error: fileErr } = await sb.from("files").insert({
    workspace_id: workspaceId,
    uploaded_by: userId || null,
    filename,
    storage_path: storagePath,
    mime_type: mimeType,
    size_bytes: buffer.length
  }).select().single();
  if (fileErr) throw createError({ statusCode: 500, message: fileErr.message });
  try {
    const text = await extractText(buffer, mimeType, filename);
    const chunks = chunkText(text);
    if (chunks.length > 0) {
      const embeddings = await embedChunks(chunks);
      const chunkRows = chunks.map((content, i) => ({
        file_id: fileRecord.id,
        workspace_id: workspaceId,
        content,
        embedding: JSON.stringify(embeddings[i]),
        chunk_index: i
      }));
      await sb.from("file_chunks").insert(chunkRows);
      await sb.from("files").update({
        embedding_meta: { chunks: chunks.length, status: "indexed" }
      }).eq("id", fileRecord.id);
    }
  } catch (err) {
    await sb.from("files").update({
      embedding_meta: { status: "index_failed" }
    }).eq("id", fileRecord.id);
  }
  return fileRecord;
});

const upload_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: upload_post
}, Symbol.toStringTag, { value: 'Module' }));

const disconnect_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { workspace_id, type } = body;
  if (!workspace_id || !type) throw createError({ statusCode: 400, message: "workspace_id and type required" });
  const sb = useSupabaseAdmin();
  await sb.from("integrations").update({ status: "disconnected", config: {} }).eq("workspace_id", workspace_id).eq("type", type);
  return { success: true };
});

const disconnect_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: disconnect_post
}, Symbol.toStringTag, { value: 'Module' }));

const SECRET_KEYS = /* @__PURE__ */ new Set([
  "app_password",
  "api_key",
  "token",
  "auth_token",
  "api_token",
  "access_token",
  "webhook_url",
  "oauth_token",
  "secret_key",
  "routing_key",
  "account_sid"
]);
function maskSecret(value) {
  if (!value || value.length < 4) return "\u2022\u2022\u2022\u2022";
  return "\u2022\u2022\u2022\u2022" + value.slice(-4);
}
function stripSecrets(config) {
  return Object.fromEntries(
    Object.entries(config).map(
      ([k, v]) => SECRET_KEYS.has(k) ? [k, maskSecret(String(v))] : [k, v]
    )
  );
}
const index_get$2 = defineEventHandler(async (event) => {
  const query = getQuery$1(event);
  const workspaceId = query.workspace_id;
  if (!workspaceId) throw createError({ statusCode: 400, message: "workspace_id required" });
  const sb = useSupabaseAdmin();
  const { data } = await sb.from("integrations").select("type, status, config, id").eq("workspace_id", workspaceId);
  return (data || []).map((i) => ({
    type: i.type,
    status: i.status,
    config: i.config ? stripSecrets(i.config) : {},
    id: i.id
  }));
});

const index_get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$2
}, Symbol.toStringTag, { value: 'Module' }));

function isMasked(value) {
  return typeof value === "string" && value.startsWith("\u2022\u2022\u2022\u2022");
}
const save_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { workspace_id, type, config, status } = body;
  if (!workspace_id || !type) throw createError({ statusCode: 400, message: "workspace_id and type required" });
  const sb = useSupabaseAdmin();
  const { data: existing } = await sb.from("integrations").select("config").eq("workspace_id", workspace_id).eq("type", type).single();
  const existingConfig = (existing == null ? void 0 : existing.config) || {};
  const incomingConfig = config || {};
  const mergedConfig = { ...existingConfig };
  for (const [k, v] of Object.entries(incomingConfig)) {
    if (!isMasked(v)) {
      mergedConfig[k] = v;
    }
  }
  const { data, error } = await sb.from("integrations").upsert({
    workspace_id,
    type,
    status: status || "connected",
    config: mergedConfig,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }, { onConflict: "workspace_id,type" }).select().single();
  if (error) throw createError({ statusCode: 500, message: error.message });
  return { id: data.id, type: data.type, status: data.status };
});

const save_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: save_post
}, Symbol.toStringTag, { value: 'Module' }));

const test_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { workspace_id, type } = body;
  if (!workspace_id || !type) {
    throw createError({ statusCode: 400, message: "workspace_id and type required" });
  }
  const sb = useSupabaseAdmin();
  const { data, error } = await sb.from("integrations").select("config, status").eq("workspace_id", workspace_id).eq("type", type).single();
  if (error || !data) {
    throw createError({ statusCode: 404, message: "Integration not found" });
  }
  if (data.status !== "connected") {
    return { result: "Integration is not connected" };
  }
  const config = data.config;
  try {
    switch (type) {
      case "slack": {
        const res = await fetch(config.webhook_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: "\u2705 Agentspace connection test successful!" })
        });
        if (!res.ok) throw new Error(`Slack returned ${res.status}`);
        return { result: "Slack message sent successfully!" };
      }
      case "notion": {
        const res = await fetch("https://api.notion.com/v1/users/me", {
          headers: {
            Authorization: `Bearer ${config.api_key}`,
            "Notion-Version": "2022-06-28"
          }
        });
        if (!res.ok) throw new Error(`Notion returned ${res.status}`);
        const user = await res.json();
        return { result: `Connected as ${user.name || "Notion user"}` };
      }
      case "gmail": {
        if (!config.sender_email || !config.app_password) {
          throw new Error("Missing email or app password");
        }
        if (!config.sender_email.includes("@")) {
          throw new Error("Invalid email address");
        }
        return { result: `Gmail credentials look good for ${config.sender_email}` };
      }
      case "github": {
        const res = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${config.token}`,
            Accept: "application/vnd.github+json"
          }
        });
        if (!res.ok) throw new Error(`GitHub returned ${res.status}`);
        const user = await res.json();
        return { result: `Connected as @${user.login}` };
      }
      case "google_calendar": {
        if (!config.webhook_url) {
          throw new Error("No webhook URL \u2014 follow the setup guide to create a Zapier webhook");
        }
        const res = await fetch(config.webhook_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source: "agentspace", test: true, summary: "Agentspace test ping" })
        });
        if (!res.ok) throw new Error(`Webhook returned ${res.status}`);
        return { result: "Calendar webhook connected \u2014 test ping sent to Zapier \u2705" };
      }
      case "excel": {
        return { result: "Excel generation is built-in \u2014 no external connection needed \u2705" };
      }
      case "zapier": {
        const res = await fetch(config.webhook_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ test: true, source: "agentspace" })
        });
        if (!res.ok) throw new Error(`Zapier returned ${res.status}`);
        return { result: "Zapier webhook triggered successfully!" };
      }
      default:
        return { result: "Unknown integration type" };
    }
  } catch (e) {
    return { error: (e == null ? void 0 : e.message) || "Test failed" };
  }
});

const test_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: test_post
}, Symbol.toStringTag, { value: 'Module' }));

const ANALYSIS_PROMPT = `You are an Orchestrator Agent running a live meeting.
You receive chunks of meeting transcript and must decide what action to take.

Respond with ONLY raw JSON:
{
  "action": "none" | "agent_response" | "create_task",
  "reason": "brief reason",
  "agent": "research|writer|analyst|executor" (only if action is agent_response or create_task),
  "message": "what the agent should say or do" (only if action is agent_response),
  "task_title": "short task title" (only if create_task),
  "task_description": "task details" (only if create_task)
}

Rules:
- "none": conversation is ongoing, no action needed yet
- "agent_response": a question was asked or info needed RIGHT NOW \u2014 agent responds in meeting chat
- "create_task": a concrete deliverable was mentioned that needs work after/during meeting

Only act when clearly needed. Prefer "none" to avoid being disruptive.
Examples that trigger agent_response: "what's the market size?", "can someone look up X?", "what does Y cost?"
Examples that trigger create_task: "we need to prepare a report", "someone should write an email", "let's do a competitive analysis"`;
const analyze_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { meeting_id, transcript_chunk, full_transcript, workspace_id, analysis_type } = body;
  if (!meeting_id || !transcript_chunk) {
    throw createError({ statusCode: 400, message: "meeting_id and transcript_chunk required" });
  }
  const sb = useSupabaseAdmin();
  const client = useAnthropic();
  const response = await client.messages.create({
    model: ORCHESTRATOR_MODEL,
    max_tokens: 500,
    system: ANALYSIS_PROMPT,
    messages: [{
      role: "user",
      content: `Analysis type: ${analysis_type || "quick"}

New transcript:
${transcript_chunk}

Full context:
${(full_transcript || "").slice(-2e3)}`
    }]
  });
  const raw = response.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
  let decision;
  try {
    decision = JSON.parse(raw);
  } catch {
    return { action: "none" };
  }
  if (decision.action === "none") return { action: "none" };
  if (decision.action === "agent_response") {
    const agentPrompts = {
      research: "You are a Research Agent in a live meeting. Answer concisely and directly. 2-3 sentences max unless detail is needed.",
      writer: "You are a Writer Agent in a live meeting. Provide concise writing help or drafts.",
      analyst: "You are an Analyst Agent in a live meeting. Give sharp, direct analysis.",
      executor: "You are an Executor Agent in a live meeting. Confirm actions and provide status."
    };
    const agentType = decision.agent || "research";
    const agentResponse = await client.messages.create({
      model: AGENT_MODEL,
      max_tokens: 400,
      system: agentPrompts[agentType] || agentPrompts.research,
      messages: [{ role: "user", content: decision.message || transcript_chunk }]
    });
    const agentText = agentResponse.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    await sb.from("messages").insert({
      workspace_id,
      meeting_id,
      sender_type: "agent",
      agent_type: agentType,
      content: agentText
    });
    return { action: "agent_response", agent: agentType, message: agentText };
  }
  if (decision.action === "create_task") {
    const { data: task } = await sb.from("tasks").insert({
      workspace_id,
      meeting_id,
      title: decision.task_title,
      description: decision.task_description,
      assigned_agent: decision.agent || "research",
      status: "pending_approval",
      priority: "medium"
    }).select().single();
    await sb.from("messages").insert({
      workspace_id,
      meeting_id,
      sender_type: "agent",
      agent_type: "orchestrator",
      content: `Task created: "${decision.task_title}" \u2014 assigned to ${decision.agent} agent. Awaiting approval.`
    });
    return { action: "create_task", task };
  }
  return { action: "none" };
});

const analyze_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: analyze_post
}, Symbol.toStringTag, { value: 'Module' }));

const clearTranscript_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { meeting_id } = body;
  if (!meeting_id) throw createError({ statusCode: 400, message: "meeting_id required" });
  const sb = useSupabaseAdmin();
  await sb.from("meetings").update({ transcript: null }).eq("id", meeting_id);
  return { success: true };
});

const clearTranscript_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: clearTranscript_post
}, Symbol.toStringTag, { value: 'Module' }));

const create_post$2 = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { workspace_id, title, created_by, source } = body;
  if (!workspace_id) throw createError({ statusCode: 400, message: "workspace_id required" });
  const sb = useSupabaseAdmin();
  const insertPayload = {
    workspace_id,
    title: title || `Meeting ${(/* @__PURE__ */ new Date()).toLocaleDateString()}`,
    created_by,
    status: "live",
    started_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (source) insertPayload.source = source;
  const { data, error } = await sb.from("meetings").insert(insertPayload).select().single();
  if (error) throw createError({ statusCode: 500, message: error.message });
  return data;
});

const create_post$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: create_post$2
}, Symbol.toStringTag, { value: 'Module' }));

const delete_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { meeting_id } = body;
  if (!meeting_id) throw createError({ statusCode: 400, message: "meeting_id required" });
  const sb = useSupabaseAdmin();
  await sb.from("messages").delete().eq("meeting_id", meeting_id);
  await sb.from("meetings").delete().eq("id", meeting_id);
  return { success: true };
});

const delete_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: delete_post
}, Symbol.toStringTag, { value: 'Module' }));

const end_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { meeting_id, transcript, bot_session_id, bot_platform, bot_transcript } = body;
  if (!meeting_id) {
    throw createError({ statusCode: 400, message: "meeting_id required" });
  }
  const sb = useSupabaseAdmin();
  const updatePayload = {
    status: "ended",
    ended_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (transcript !== void 0) updatePayload.transcript = transcript;
  if (bot_session_id) updatePayload.bot_session_id = bot_session_id;
  if (bot_platform) updatePayload.bot_platform = bot_platform;
  if (bot_transcript) updatePayload.bot_transcript = bot_transcript;
  const { data: meeting, error } = await sb.from("meetings").update(updatePayload).eq("id", meeting_id).select().single();
  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }
  const workspaceId = meeting.workspace_id;
  if (workspaceId && transcript) {
    sb.from("workflows").select("id").eq("workspace_id", workspaceId).eq("trigger", "meeting_end").eq("enabled", true).then(async ({ data: workflows, error: error2 }) => {
      if (error2 || !(workflows == null ? void 0 : workflows.length)) return;
      await Promise.all(
        workflows.map(
          (wf) => $fetch("/api/workflows/run", {
            method: "POST",
            body: {
              workflow_id: wf.id,
              triggered_by: "meeting_end",
              context: transcript,
              variables: {
                transcript: transcript.slice(0, 2e3),
                date: (/* @__PURE__ */ new Date()).toLocaleDateString()
              }
            }
          })
        )
      );
    });
  }
  return meeting;
});

const end_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: end_post
}, Symbol.toStringTag, { value: 'Module' }));

const index_get = defineEventHandler(async (event) => {
  const query = getQuery$1(event);
  const workspaceId = query.workspace_id;
  if (!workspaceId) throw createError({ statusCode: 400, message: "workspace_id required" });
  const sb = useSupabaseAdmin();
  const { data, error } = await sb.from("meetings").select("id, title, status, transcript, started_at, ended_at, created_at, source, bot_session_id, bot_platform, bot_transcript").eq("workspace_id", workspaceId).order("created_at", { ascending: false }).limit(50);
  if (error) throw createError({ statusCode: 500, message: error.message });
  return data;
});

const index_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get
}, Symbol.toStringTag, { value: 'Module' }));

async function getWorkspaceTools(workspaceId) {
  const sb = useSupabaseAdmin();
  const [intResult, dbResult, fileResult] = await Promise.all([
    sb.from("integrations").select("type").eq("workspace_id", workspaceId).eq("status", "connected"),
    sb.from("db_connections").select("name, db_type, status").eq("workspace_id", workspaceId),
    sb.from("file_chunks").select("metadata").eq("workspace_id", workspaceId).limit(5)
  ]);
  const integrations = (intResult.data || []).map((i) => i.type);
  const databases = (dbResult.data || []).map((d) => `${d.name} (${d.db_type}, ${d.status})`);
  const hasRag = (fileResult.data || []).length > 0;
  let tools = "";
  if (integrations.length) tools += `
Connected integrations (executor can use these): ${integrations.join(", ")}`;
  if (databases.length) tools += `
Connected databases (analyst can query these): ${databases.join("; ")}`;
  if (hasRag) tools += `
RAG knowledge base: available (files uploaded)`;
  return tools;
}
const BASE_SYSTEM_PROMPT = `You are an Orchestrator Agent inside an AI workspace tool.
Analyze a meeting transcript or goal and produce the MINIMUM number of tasks needed.

Rules:
- Create as FEW tasks as possible \u2014 combine related work into one task
- A single goal ("post slack + send email + make calendar event") = ONE task for the executor
- Only split into separate tasks when they require completely different agents AND cannot be done together
- Maximum 3 tasks total. Usually 1-2 is correct.
- Assign the right agent:
  - executor: ANYTHING that touches a connected integration (Slack, Gmail, GitHub, Google Calendar, Notion, Zapier) or a connected database \u2014 including reading, listing, or querying them, not just writing/sending
  - research: finding information from public web sources only \u2014 never use for tasks that involve connected integrations
  - writer: writing documents, reports, long-form content
  - analyst: data analysis, strategic frameworks, querying connected databases
- Keep task titles short and action-oriented (under 8 words)

CRITICAL: If the input involves multiple actions of the same type (e.g. "post slack AND send email AND create calendar event"), 
combine them into ONE executor task. Do NOT create separate tasks per tool.

CRITICAL: Any task that reads FROM or writes TO a connected integration (GitHub, Gmail, Slack, Google Calendar, Notion, Zapier) MUST be assigned to executor \u2014 never to research, writer, or analyst.

CRITICAL: If databases are listed in the workspace tools, the executor/analyst agents CAN access them. Do NOT say databases are inaccessible.

Respond with ONLY raw JSON, no markdown, no fences:
{
  "summary": "one sentence summary",
  "tasks": [
    {
      "title": "short action title",
      "description": "full details of everything that needs to be done",
      "assigned_agent": "executor|research|writer|analyst",
      "priority": "low|medium|high|urgent"
    }
  ]
}`;
async function runOrchestrator(input, workspaceId, meetingId) {
  const client = useAnthropic();
  const tools = await getWorkspaceTools(workspaceId);
  const systemPrompt = BASE_SYSTEM_PROMPT + (tools ? `

Workspace tools available:${tools}` : "");
  const response = await client.messages.create({
    model: ORCHESTRATOR_MODEL,
    max_tokens: MAX_TOKENS,
    system: systemPrompt,
    messages: [{ role: "user", content: input }]
  });
  const raw = response.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`Orchestrator returned invalid JSON: ${raw.slice(0, 200)}`);
  }
  if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
    throw new Error("Orchestrator response missing tasks array");
  }
  const tasks = parsed.tasks.slice(0, 3).map((t) => ({
    title: t.title,
    description: t.description,
    assigned_agent: t.assigned_agent,
    priority: t.priority || "medium",
    workspace_id: workspaceId,
    meeting_id: meetingId
  }));
  return { tasks, summary: parsed.summary || "" };
}

const process_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { meeting_id, workspace_id, transcript } = body;
  if (!workspace_id || !transcript) {
    throw createError({ statusCode: 400, message: "workspace_id and transcript required" });
  }
  const sb = useSupabaseAdmin();
  const result = await runOrchestrator(transcript, workspace_id, meeting_id);
  const taskRows = result.tasks.map((t) => ({
    workspace_id,
    meeting_id: meeting_id || null,
    title: t.title,
    description: t.description,
    assigned_agent: t.assigned_agent,
    priority: t.priority || "medium",
    status: "pending_approval"
  }));
  const { data: tasks, error } = await sb.from("tasks").insert(taskRows).select();
  if (error) throw createError({ statusCode: 500, message: error.message });
  if (meeting_id) {
    await sb.from("meetings").update({ status: "ended" }).eq("id", meeting_id);
  }
  return { tasks, summary: result.summary };
});

const process_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: process_post
}, Symbol.toStringTag, { value: 'Module' }));

const rename_post = defineEventHandler(async (event) => {
  const { meeting_id, title } = await readBody(event);
  if (!meeting_id || !title) throw createError({ statusCode: 400, message: "meeting_id and title required" });
  const sb = useSupabaseAdmin();
  await sb.from("meetings").update({ title }).eq("id", meeting_id);
  return { ok: true };
});

const rename_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: rename_post
}, Symbol.toStringTag, { value: 'Module' }));

const transcribe_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const formData = await readMultipartFormData(event);
  if (!formData) throw createError({ statusCode: 400, message: "No form data" });
  const filePart = formData.find((p) => p.name === "file");
  const workspaceId = (_a = formData.find((p) => p.name === "workspace_id")) == null ? void 0 : _a.data.toString();
  const title = ((_b = formData.find((p) => p.name === "title")) == null ? void 0 : _b.data.toString()) || "Uploaded recording";
  const createdBy = (_c = formData.find((p) => p.name === "user_id")) == null ? void 0 : _c.data.toString();
  if (!filePart || !workspaceId) {
    throw createError({ statusCode: 400, message: "file and workspace_id required" });
  }
  const mimeType = filePart.type || "audio/mpeg";
  const dgKey = process.env.DEEPGRAM_API_KEY;
  if (!dgKey) throw createError({ statusCode: 500, message: "Deepgram API key not configured" });
  const dgRes = await fetch(
    "https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&punctuate=true&paragraphs=true",
    {
      method: "POST",
      headers: {
        "Authorization": `Token ${dgKey}`,
        "Content-Type": mimeType
      },
      body: filePart.data
    }
  );
  if (!dgRes.ok) {
    const err = await dgRes.text();
    throw createError({ statusCode: 500, message: `Deepgram error: ${err}` });
  }
  const dgData = await dgRes.json();
  const transcript = ((_h = (_g = (_f = (_e = (_d = dgData == null ? void 0 : dgData.results) == null ? void 0 : _d.channels) == null ? void 0 : _e[0]) == null ? void 0 : _f.alternatives) == null ? void 0 : _g[0]) == null ? void 0 : _h.transcript) || "";
  if (!transcript) throw createError({ statusCode: 422, message: "No speech detected in file" });
  const sb = useSupabaseAdmin();
  const { data: meeting, error } = await sb.from("meetings").insert({
    workspace_id: workspaceId,
    created_by: createdBy || null,
    title,
    status: "ended",
    transcript,
    started_at: (/* @__PURE__ */ new Date()).toISOString(),
    ended_at: (/* @__PURE__ */ new Date()).toISOString()
  }).select().single();
  if (error) throw createError({ statusCode: 500, message: error.message });
  return { meeting, transcript };
});

const transcribe_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: transcribe_post
}, Symbol.toStringTag, { value: 'Module' }));

const AGENT_PROMPTS = {
  orchestrator: "",
  research: `You are a Research Agent. Find accurate, up-to-date information on the given topic.
- Summarise findings clearly with source context where available
- If company knowledge is provided, prioritise it over general knowledge
- Return a well-structured research summary`,
  writer: `You are a Writer Agent. Produce clear, professional written content.
- Match tone to context (formal for reports, conversational for emails)
- Structure content with headers where appropriate
- If company knowledge is provided, use it to personalise the content
- Return the complete document, ready to use`,
  analyst: `You are an Analyst Agent. Analyse information and produce insights.
- Use structured frameworks (pros/cons, comparisons, rankings)
- Back conclusions with reasoning
- If company knowledge is provided, incorporate it into the analysis
- If connected databases are listed, reference them in your analysis \u2014 the executor can query them if needed
- Return a clear analysis with actionable recommendations`,
  executor: `You are an Executor Agent. Carry out specific tasks precisely using the connected tools and integrations available.
- Do exactly what is asked
- Use the connected integrations and databases listed in the workspace context
- IMPORTANT: If databases are listed as connected, you have access to them \u2014 do not claim otherwise
- Report what you did and the result clearly
- Return a clear completion report`
};
async function embedQuery(text) {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ model: "openai/text-embedding-ada-002", input: [text] })
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data[0].embedding;
  } catch {
    return null;
  }
}
async function getRelevantContext(query, workspaceId) {
  try {
    const sb = useSupabaseAdmin();
    const embedding = await embedQuery(query);
    if (!embedding) return "";
    const { data } = await sb.rpc("match_chunks", {
      query_embedding: embedding,
      workspace_filter: workspaceId,
      match_count: 5
    });
    if (!(data == null ? void 0 : data.length)) return "";
    return data.map((c) => c.content).join("\n\n---\n\n");
  } catch {
    return "";
  }
}
async function getWorkspaceToolsContext(workspaceId) {
  try {
    const sb = useSupabaseAdmin();
    const [intResult, dbResult] = await Promise.all([
      sb.from("integrations").select("type").eq("workspace_id", workspaceId).eq("status", "connected"),
      sb.from("db_connections").select("name, db_type, status, config").eq("workspace_id", workspaceId)
    ]);
    const integrations = (intResult.data || []).map((i) => i.type);
    const databases = (dbResult.data || []).map((d) => {
      var _a, _b;
      const tables = ((_b = (_a = d.config) == null ? void 0 : _a.tables) == null ? void 0 : _b.join(", ")) || "";
      return `${d.name} (${d.db_type}, status: ${d.status})${tables ? " \u2014 tables: " + tables : ""}`;
    });
    let ctx = "";
    if (integrations.length) ctx += `

Connected integrations available to use: ${integrations.join(", ")}`;
    if (databases.length) ctx += `

Connected databases available to query: ${databases.join("; ")}`;
    return ctx;
  } catch {
    return "";
  }
}
async function getTaskMessages(taskId) {
  const sb = useSupabaseAdmin();
  const { data } = await sb.from("messages").select("*").eq("task_id", taskId).order("created_at", { ascending: true });
  return data || [];
}
async function runAgent(task, agentType, runId) {
  const sb = useSupabaseAdmin();
  const client = useAnthropic();
  const [context, toolsContext, history] = await Promise.all([
    getRelevantContext(`${task.title} ${task.description || ""}`, task.workspace_id),
    getWorkspaceToolsContext(task.workspace_id),
    getTaskMessages(task.id)
  ]);
  const agentBasePrompt = AGENT_PROMPTS[agentType];
  const systemPrompt = agentBasePrompt + (toolsContext ? `

Workspace tools context:${toolsContext}` : "");
  const messages = [];
  if (context) {
    messages.push({ role: "user", content: `Relevant company knowledge for this task:

${context}` });
    messages.push({ role: "assistant", content: "Understood, I have reviewed the company knowledge and will use it in my response." });
  }
  for (const msg of history) {
    messages.push({
      role: msg.sender_type === "human" ? "user" : "assistant",
      content: msg.content
    });
  }
  messages.push({ role: "user", content: `Task: ${task.title}

${task.description || ""}` });
  const response = await client.messages.create({
    model: AGENT_MODEL,
    max_tokens: MAX_TOKENS,
    system: systemPrompt,
    messages
  });
  const output = response.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
  await sb.from("agent_runs").update({
    status: "completed",
    output,
    tool_calls: [],
    ended_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", runId);
  return output;
}

const index_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { workspace_id, task_id, meeting_id, content, sender_id } = body;
  if (!workspace_id || !content) {
    throw createError({ statusCode: 400, message: "workspace_id and content required" });
  }
  const sb = useSupabaseAdmin();
  const { data: message } = await sb.from("messages").insert({
    workspace_id,
    task_id: task_id || null,
    meeting_id: meeting_id || null,
    sender_id: sender_id || null,
    sender_type: "human",
    content
  }).select().single();
  if (task_id) {
    const { data: task } = await sb.from("tasks").select("*").eq("id", task_id).single();
    if ((task == null ? void 0 : task.status) === "needs_clarification" && task.assigned_agent) {
      await sb.from("tasks").update({ status: "approved" }).eq("id", task_id);
      const { data: run } = await sb.from("agent_runs").insert({
        task_id,
        agent_type: task.assigned_agent,
        status: "running",
        input: content
      }).select().single();
      if (run) {
        runAgent(task, task.assigned_agent, run.id).then(async (output) => {
          await sb.from("artifacts").insert({
            workspace_id,
            task_id,
            agent_run_id: run.id,
            title: task.title,
            type: "document",
            content: output,
            version: 1
          });
          await sb.from("messages").insert({
            workspace_id,
            task_id,
            sender_type: "agent",
            agent_type: task.assigned_agent,
            content: output
          });
          await sb.from("tasks").update({ status: "completed" }).eq("id", task_id);
        });
      }
    }
  }
  return message;
});

const index_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post
}, Symbol.toStringTag, { value: 'Module' }));

const approve_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { task_id, assigned_agent, approved_by } = body;
  if (!task_id) throw createError({ statusCode: 400, message: "task_id required" });
  const sb = useSupabaseAdmin();
  const { data, error } = await sb.from("tasks").update({
    status: "approved",
    assigned_agent,
    approved_by,
    approved_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", task_id).select().single();
  if (error) throw createError({ statusCode: 500, message: error.message });
  return data;
});

const approve_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: approve_post
}, Symbol.toStringTag, { value: 'Module' }));

async function getWorkspaceContext(workspaceId) {
  const sb = useSupabaseAdmin();
  const [intResult, fileResult, taskResult, dbResult] = await Promise.all([
    sb.from("integrations").select("type, config").eq("workspace_id", workspaceId).eq("status", "connected"),
    sb.from("file_chunks").select("content").eq("workspace_id", workspaceId).limit(20),
    sb.from("tasks").select("title, status").eq("workspace_id", workspaceId).in("status", ["pending_approval", "in_progress"]).limit(5),
    sb.from("db_connections").select("name, db_type, status, config").eq("workspace_id", workspaceId)
  ]);
  const integrations = (intResult.data || []).map((i) => i.type).join(", ");
  const files = (fileResult.data || []).map((f) => f.content).join("\n\n").slice(0, 2e3);
  const tasks = (taskResult.data || []).map((t) => `${t.title} (${t.status})`).join(", ");
  const databases = (dbResult.data || []).map((d) => {
    var _a, _b;
    const tables = ((_b = (_a = d.config) == null ? void 0 : _a.tables) == null ? void 0 : _b.join(", ")) || "";
    return `${d.name} (${d.db_type}, ${d.status})${tables ? " \u2014 tables: " + tables : ""}`;
  }).join("; ");
  let ctx = "";
  if (integrations) ctx += `
Connected integrations: ${integrations}`;
  if (databases) ctx += `
Connected databases: ${databases}`;
  if (tasks) ctx += `
Active tasks: ${tasks}`;
  if (files) ctx += `

Company knowledge:
${files}`;
  return ctx;
}
const respond_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { workspace_id, message, history } = body;
  if (!workspace_id || !message) throw createError({ statusCode: 400, message: "workspace_id and message required" });
  const context = await getWorkspaceContext(workspace_id);
  const client = useAnthropic();
  const systemPrompt = `You are an AI workspace assistant for Atlantir. You help users get work done through natural conversation.
${context}

You have full access to the workspace. You can:
- Create and manage tasks by explaining what you'll do
- Answer questions about company knowledge and RAG documents
- List and describe connected integrations (Slack, Gmail, GitHub, Google Calendar, Notion, Zapier etc.)
- List and query connected databases (the databases listed above ARE accessible \u2014 do not say you cannot access them)
- Help think through problems, draft content, analyze data
- Schedule meetings and calendar events

IMPORTANT: If databases are listed above, you DO have access to them through the analyst module. Tell users to use the Analyst tab to query them, or confirm you can see them.
IMPORTANT: If integrations are listed, confirm you can use them for tasks.

Keep responses SHORT and CONVERSATIONAL \u2014 1-3 sentences max for voice. You are speaking out loud.
No markdown, no bullet points, no formatting \u2014 plain spoken language only.
Sound natural, helpful, and confident. Get to the point immediately.`;
  const messages = [
    ...(history || []).slice(-6),
    { role: "user", content: message }
  ];
  const response = await client.messages.create({
    model: AGENT_MODEL,
    max_tokens: 300,
    system: systemPrompt,
    messages
  });
  const reply = response.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim().replace(/\*\*(.*?)\*\*/g, "$1").replace(/#{1,6}\s/g, "").replace(/- /g, "");
  return { reply };
});

const respond_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: respond_post
}, Symbol.toStringTag, { value: 'Module' }));

const synthesize_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { text } = body;
  if (!(text == null ? void 0 : text.trim())) throw createError({ statusCode: 400, message: "text required" });
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return { audioBase64: null, useBrowserTTS: true, text };
  }
  const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
      },
      body: JSON.stringify({
        text: text.slice(0, 1e3),
        model_id: "eleven_turbo_v2_5",
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0, use_speaker_boost: true }
      })
    });
    if (!res.ok) {
      return { audioBase64: null, useBrowserTTS: true, text };
    }
    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return { audioBase64: base64, useBrowserTTS: false };
  } catch {
    return { audioBase64: null, useBrowserTTS: true, text };
  }
});

const synthesize_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: synthesize_post
}, Symbol.toStringTag, { value: 'Module' }));

const index = defineEventHandler(async (event) => {
  const method = getMethod(event);
  const sb = useSupabaseAdmin();
  if (method === "GET") {
    const query = getQuery$1(event);
    const { data } = await sb.from("workflows").select("*").eq("workspace_id", query.workspace_id).order("created_at", { ascending: false });
    return data || [];
  }
  if (method === "POST") {
    const body = await readBody(event);
    const { data, error } = await sb.from("workflows").insert(body).select().single();
    if (error) throw createError({ statusCode: 500, message: error.message });
    return data;
  }
  if (method === "PATCH") {
    const body = await readBody(event);
    const { id, ...updates } = body;
    const { data, error } = await sb.from("workflows").update(updates).eq("id", id).select().single();
    if (error) throw createError({ statusCode: 500, message: error.message });
    return data;
  }
  if (method === "DELETE") {
    const body = await readBody(event);
    await sb.from("workflows").delete().eq("id", body.id);
    return { success: true };
  }
});

const index$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index
}, Symbol.toStringTag, { value: 'Module' }));

function injectVars(text, vars) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    var _a;
    return (_a = vars[key]) != null ? _a : `{{${key}}}`;
  });
}
const run_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { workflow_id, triggered_by = "manual", variables = {}, context = "" } = body;
  if (!workflow_id) throw createError({ statusCode: 400, message: "workflow_id required" });
  const sb = useSupabaseAdmin();
  const { data: workflow } = await sb.from("workflows").select("*").eq("id", workflow_id).single();
  if (!workflow) throw createError({ statusCode: 404, message: "Workflow not found" });
  const { data: run } = await sb.from("workflow_runs").insert({
    workflow_id,
    workspace_id: workflow.workspace_id,
    status: "running",
    triggered_by,
    variables
  }).select().single();
  const steps = workflow.steps;
  const createdTasks = [];
  let previousOutput = context;
  for (const step of steps) {
    const title = injectVars(step.task_title, variables);
    const baseDesc = injectVars(step.task_description || "", variables);
    const description = previousOutput ? `${baseDesc}

Context from previous step:
${previousOutput.slice(0, 1500)}` : baseDesc;
    const { data: task } = await sb.from("tasks").insert({
      workspace_id: workflow.workspace_id,
      title,
      description,
      assigned_agent: step.agent,
      priority: step.priority || "medium",
      status: "approved",
      // skip approval queue — workflows are pre-approved
      approved_at: (/* @__PURE__ */ new Date()).toISOString()
    }).select().single();
    if (!task) continue;
    createdTasks.push(task);
    try {
      await sb.from("tasks").update({ status: "in_progress" }).eq("id", task.id);
      const output = await runPipeline(task);
      previousOutput = output;
      await sb.from("artifacts").insert({
        workspace_id: task.workspace_id,
        task_id: task.id,
        title: task.title,
        type: task.assigned_agent === "research" ? "research" : task.assigned_agent === "writer" ? "document" : "other",
        content: output,
        version: 1
      });
      await sb.from("tasks").update({ status: "completed" }).eq("id", task.id);
    } catch (err) {
      await sb.from("tasks").update({ status: "approved" }).eq("id", task.id);
      previousOutput = "";
    }
  }
  await sb.from("workflow_runs").update({
    status: "completed",
    tasks_created: createdTasks.length,
    final_output: (previousOutput == null ? void 0 : previousOutput.slice(0, 5e3)) || "",
    ended_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", run.id);
  await sb.from("workflows").update({
    run_count: (workflow.run_count || 0) + 1,
    last_run_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", workflow_id);
  return { tasks: createdTasks, run, final_output: previousOutput };
});

const run_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: run_post
}, Symbol.toStringTag, { value: 'Module' }));

const create_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, user_id, email, full_name, avatar_url } = body;
  if (!(name == null ? void 0 : name.trim()) || !user_id) {
    throw createError({ statusCode: 400, message: "name and user_id required" });
  }
  const sb = useSupabaseAdmin();
  await sb.from("users").upsert({
    id: user_id,
    email,
    full_name: full_name || null,
    avatar_url: avatar_url || null
  });
  const { data: ws, error: wsErr } = await sb.from("workspaces").insert({ name: name.trim(), owner_id: user_id }).select().single();
  if (wsErr) throw createError({ statusCode: 500, message: wsErr.message });
  await sb.from("workspace_members").insert({
    workspace_id: ws.id,
    user_id,
    role: "owner"
  });
  return ws;
});

const create_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: create_post
}, Symbol.toStringTag, { value: 'Module' }));

const inviteInfo_get = defineEventHandler(async (event) => {
  const query = getQuery$1(event);
  const token = query.token;
  if (!token) throw createError({ statusCode: 400, message: "token required" });
  const sb = useSupabaseAdmin();
  const { data } = await sb.from("workspaces").select("id, name, invite_enabled").eq("invite_token", token).single();
  if (!data) throw createError({ statusCode: 404, message: "Invalid invite link" });
  if (!data.invite_enabled) throw createError({ statusCode: 403, message: "This invite link has been disabled" });
  const { count } = await sb.from("workspace_members").select("*", { count: "exact", head: true }).eq("workspace_id", data.id);
  return { id: data.id, name: data.name, member_count: count || 0 };
});

const inviteInfo_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: inviteInfo_get
}, Symbol.toStringTag, { value: 'Module' }));

const inviteManage_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { workspace_id, action } = body;
  if (!workspace_id) throw createError({ statusCode: 400, message: "workspace_id required" });
  const sb = useSupabaseAdmin();
  if (action === "disable") {
    await sb.from("workspaces").update({ invite_enabled: false }).eq("id", workspace_id);
    return { success: true, invite_enabled: false };
  }
  if (action === "enable") {
    await sb.from("workspaces").update({ invite_enabled: true }).eq("id", workspace_id);
    return { success: true, invite_enabled: true };
  }
  const newToken = Array.from(crypto.getRandomValues(new Uint8Array(16))).map((b) => b.toString(16).padStart(2, "0")).join("");
  await sb.from("workspaces").update({ invite_token: newToken, invite_enabled: true }).eq("id", workspace_id);
  return { success: true, invite_token: newToken };
});

const inviteManage_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: inviteManage_post
}, Symbol.toStringTag, { value: 'Module' }));

const invite_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { workspace_id, email, role = "member", invited_by } = body;
  if (!workspace_id || !email) {
    throw createError({ statusCode: 400, message: "workspace_id and email required" });
  }
  const sb = useSupabaseAdmin();
  const { data: workspace } = await sb.from("workspaces").select("name").eq("id", workspace_id).single();
  if (!workspace) throw createError({ statusCode: 404, message: "Workspace not found" });
  const { data: existingUser } = await sb.from("users").select("id").eq("email", email).single();
  if (existingUser) {
    const { data: existing } = await sb.from("workspace_members").select("id").eq("workspace_id", workspace_id).eq("user_id", existingUser.id).single();
    if (existing) throw createError({ statusCode: 409, message: "User is already a member" });
    await sb.from("workspace_members").insert({
      workspace_id,
      user_id: existingUser.id,
      role
    });
    return { status: "added", message: `${email} added to workspace` };
  }
  const { error } = await sb.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.APP_URL || "http://localhost:3000"}/auth/callback`,
    data: {
      invited_to_workspace: workspace_id,
      invited_role: role,
      workspace_name: workspace.name
    }
  });
  if (error) throw createError({ statusCode: 500, message: error.message });
  return { status: "invited", message: `Invite sent to ${email}` };
});

const invite_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: invite_post
}, Symbol.toStringTag, { value: 'Module' }));

const join_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { token, user_id, email, full_name } = body;
  if (!token || !user_id) throw createError({ statusCode: 400, message: "token and user_id required" });
  const sb = useSupabaseAdmin();
  const { data: workspace } = await sb.from("workspaces").select("id, name, invite_enabled").eq("invite_token", token).single();
  if (!workspace) throw createError({ statusCode: 404, message: "Invalid or expired invite link" });
  if (!workspace.invite_enabled) throw createError({ statusCode: 403, message: "Invite link has been disabled" });
  const { data: existing } = await sb.from("workspace_members").select("id, role").eq("workspace_id", workspace.id).eq("user_id", user_id).single();
  if (existing) {
    return { workspace_id: workspace.id, workspace_name: workspace.name, already_member: true, role: existing.role };
  }
  await sb.from("users").upsert({ id: user_id, email, full_name: full_name || null });
  await sb.from("workspace_members").insert({
    workspace_id: workspace.id,
    user_id,
    role: "member"
  });
  return { workspace_id: workspace.id, workspace_name: workspace.name, already_member: false, role: "member" };
});

const join_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: join_post
}, Symbol.toStringTag, { value: 'Module' }));

const members_get = defineEventHandler(async (event) => {
  const query = getQuery$1(event);
  const workspaceId = query.workspace_id;
  if (!workspaceId) throw createError({ statusCode: 400, message: "workspace_id required" });
  const sb = useSupabaseAdmin();
  const { data, error } = await sb.from("workspace_members").select("*, user:users(id, email, full_name, avatar_url)").eq("workspace_id", workspaceId).order("role");
  if (error) throw createError({ statusCode: 500, message: error.message });
  return data;
});

const members_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: members_get
}, Symbol.toStringTag, { value: 'Module' }));

const removeMember_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { workspace_id, user_id, requester_id } = body;
  if (!workspace_id || !user_id) {
    throw createError({ statusCode: 400, message: "workspace_id and user_id required" });
  }
  const sb = useSupabaseAdmin();
  const { data: workspace } = await sb.from("workspaces").select("owner_id").eq("id", workspace_id).single();
  if ((workspace == null ? void 0 : workspace.owner_id) === user_id) {
    throw createError({ statusCode: 403, message: "Cannot remove the workspace owner" });
  }
  const { error } = await sb.from("workspace_members").delete().eq("workspace_id", workspace_id).eq("user_id", user_id);
  if (error) throw createError({ statusCode: 500, message: error.message });
  return { success: true };
});

const removeMember_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: removeMember_post
}, Symbol.toStringTag, { value: 'Module' }));

const runs_get = defineEventHandler(async (event) => {
  const query = getQuery$1(event);
  const { workflow_id, limit = 5 } = query;
  if (!workflow_id) throw createError({ statusCode: 400, message: "workflow_id required" });
  const sb = useSupabaseAdmin();
  const { data } = await sb.from("workflow_runs").select("*").eq("workflow_id", workflow_id).order("created_at", { ascending: false }).limit(Number(limit));
  return data || [];
});

const runs_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: runs_get
}, Symbol.toStringTag, { value: 'Module' }));

const schedule_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (body.secret !== process.env.CRON_SECRET) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  const cadence = body.cadence || "daily";
  const sb = useSupabaseAdmin();
  const { data: workflows } = await sb.from("workflows").select("id, workspace_id, name").eq("trigger", "schedule").eq("schedule_cadence", cadence).eq("enabled", true);
  if (!(workflows == null ? void 0 : workflows.length)) return { fired: 0 };
  const results = await Promise.allSettled(
    workflows.map(
      (wf) => $fetch("/api/workflows/run", {
        method: "POST",
        body: {
          workflow_id: wf.id,
          triggered_by: `schedule:${cadence}`,
          variables: { date: (/* @__PURE__ */ new Date()).toLocaleDateString(), cadence }
        }
      })
    )
  );
  const fired = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;
  return { fired, failed, cadence };
});

const schedule_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: schedule_post
}, Symbol.toStringTag, { value: 'Module' }));

function renderPayloadResponse(ssrContext) {
  return {
    body: stringify(splitPayload(ssrContext).payload, ssrContext._payloadReducers) ,
    statusCode: getResponseStatus(ssrContext.event),
    statusMessage: getResponseStatusText(ssrContext.event),
    headers: {
      "content-type": "application/json;charset=utf-8" ,
      "x-powered-by": "Nuxt"
    }
  };
}
function renderPayloadJsonScript(opts) {
  const contents = opts.data ? stringify(opts.data, opts.ssrContext._payloadReducers) : "";
  const payload = {
    "type": "application/json",
    "innerHTML": contents,
    "data-nuxt-data": appId,
    "data-ssr": !(opts.ssrContext.noSSR)
  };
  {
    payload.id = "__NUXT_DATA__";
  }
  if (opts.src) {
    payload["data-src"] = opts.src;
  }
  const config = uneval(opts.ssrContext.config);
  return [
    payload,
    {
      innerHTML: `window.__NUXT__={};window.__NUXT__.config=${config}`
    }
  ];
}
function splitPayload(ssrContext) {
  const { data, prerenderedAt, ...initial } = ssrContext.payload;
  return {
    initial: { ...initial, prerenderedAt },
    payload: { data, prerenderedAt }
  };
}

const renderSSRHeadOptions = {"omitLineBreaks":false};

globalThis.__buildAssetsURL = buildAssetsURL;
globalThis.__publicAssetsURL = publicAssetsURL;
const HAS_APP_TELEPORTS = !!(appTeleportAttrs.id);
const APP_TELEPORT_OPEN_TAG = HAS_APP_TELEPORTS ? `<${appTeleportTag}${propsToString(appTeleportAttrs)}>` : "";
const APP_TELEPORT_CLOSE_TAG = HAS_APP_TELEPORTS ? `</${appTeleportTag}>` : "";
const PAYLOAD_URL_RE = /^[^?]*\/_payload.json(?:\?.*)?$/ ;
const renderer = defineRenderHandler(async (event) => {
  const nitroApp = useNitroApp();
  const ssrError = event.path.startsWith("/__nuxt_error") ? getQuery$1(event) : null;
  if (ssrError && !("__unenv__" in event.node.req)) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page Not Found: /__nuxt_error"
    });
  }
  const ssrContext = createSSRContext(event);
  const headEntryOptions = { mode: "server" };
  ssrContext.head.push(appHead, headEntryOptions);
  if (ssrError) {
    ssrError.statusCode &&= Number.parseInt(ssrError.statusCode);
    setSSRError(ssrContext, ssrError);
  }
  const isRenderingPayload = PAYLOAD_URL_RE.test(ssrContext.url);
  if (isRenderingPayload) {
    const url = ssrContext.url.substring(0, ssrContext.url.lastIndexOf("/")) || "/";
    ssrContext.url = url;
    event._path = event.node.req.url = url;
  }
  const routeOptions = getRouteRules(event);
  if (routeOptions.ssr === false) {
    ssrContext.noSSR = true;
  }
  const renderer = await getRenderer(ssrContext);
  const _rendered = await renderer.renderToString(ssrContext).catch(async (error) => {
    if (ssrContext._renderResponse && error.message === "skipping render") {
      return {};
    }
    const _err = !ssrError && ssrContext.payload?.error || error;
    await ssrContext.nuxt?.hooks.callHook("app:error", _err);
    throw _err;
  });
  const inlinedStyles = [];
  await ssrContext.nuxt?.hooks.callHook("app:rendered", { ssrContext, renderResult: _rendered });
  if (ssrContext._renderResponse) {
    return ssrContext._renderResponse;
  }
  if (ssrContext.payload?.error && !ssrError) {
    throw ssrContext.payload.error;
  }
  if (isRenderingPayload) {
    const response = renderPayloadResponse(ssrContext);
    return response;
  }
  const NO_SCRIPTS = routeOptions.noScripts;
  const { styles, scripts } = getRequestDependencies(ssrContext, renderer.rendererContext);
  if (ssrContext._preloadManifest && !NO_SCRIPTS) {
    ssrContext.head.push({
      link: [
        { rel: "preload", as: "fetch", fetchpriority: "low", crossorigin: "anonymous", href: buildAssetsURL(`builds/meta/${ssrContext.runtimeConfig.app.buildId}.json`) }
      ]
    }, { ...headEntryOptions, tagPriority: "low" });
  }
  if (inlinedStyles.length) {
    ssrContext.head.push({ style: inlinedStyles });
  }
  const link = [];
  for (const resource of Object.values(styles)) {
    if ("inline" in getQuery(resource.file)) {
      continue;
    }
    link.push({ rel: "stylesheet", href: renderer.rendererContext.buildAssetsURL(resource.file), crossorigin: "" });
  }
  if (link.length) {
    ssrContext.head.push({ link }, headEntryOptions);
  }
  if (!NO_SCRIPTS) {
    ssrContext.head.push({
      link: getPreloadLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    ssrContext.head.push({
      link: getPrefetchLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    ssrContext.head.push({
      script: renderPayloadJsonScript({ ssrContext, data: ssrContext.payload }) 
    }, {
      ...headEntryOptions,
      // this should come before another end of body scripts
      tagPosition: "bodyClose",
      tagPriority: "high"
    });
  }
  if (!routeOptions.noScripts) {
    const tagPosition = "head";
    ssrContext.head.push({
      script: Object.values(scripts).map((resource) => ({
        type: resource.module ? "module" : null,
        src: renderer.rendererContext.buildAssetsURL(resource.file),
        defer: resource.module ? null : true,
        // if we are rendering script tag payloads that import an async payload
        // we need to ensure this resolves before executing the Nuxt entry
        tagPosition,
        crossorigin: ""
      }))
    }, headEntryOptions);
  }
  const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = await renderSSRHead(ssrContext.head, renderSSRHeadOptions);
  const htmlContext = {
    htmlAttrs: htmlAttrs ? [htmlAttrs] : [],
    head: normalizeChunks([headTags]),
    bodyAttrs: bodyAttrs ? [bodyAttrs] : [],
    bodyPrepend: normalizeChunks([bodyTagsOpen, ssrContext.teleports?.body]),
    body: [
      replaceIslandTeleports(ssrContext, _rendered.html) ,
      APP_TELEPORT_OPEN_TAG + (HAS_APP_TELEPORTS ? joinTags([ssrContext.teleports?.[`#${appTeleportAttrs.id}`]]) : "") + APP_TELEPORT_CLOSE_TAG
    ],
    bodyAppend: [bodyTags]
  };
  await nitroApp.hooks.callHook("render:html", htmlContext, { event });
  return {
    body: renderHTMLDocument(htmlContext),
    statusCode: getResponseStatus(event),
    statusMessage: getResponseStatusText(event),
    headers: {
      "content-type": "text/html;charset=utf-8",
      "x-powered-by": "Nuxt"
    }
  };
});
function normalizeChunks(chunks) {
  return chunks.filter(Boolean).map((i) => i.trim());
}
function joinTags(tags) {
  return tags.join("");
}
function joinAttrs(chunks) {
  if (chunks.length === 0) {
    return "";
  }
  return " " + chunks.join(" ");
}
function renderHTMLDocument(html) {
  return `<!DOCTYPE html><html${joinAttrs(html.htmlAttrs)}><head>${joinTags(html.head)}</head><body${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body></html>`;
}

const renderer$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: renderer
}, Symbol.toStringTag, { value: 'Module' }));
//# sourceMappingURL=index.mjs.map
