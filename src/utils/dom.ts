import { delay } from "./promiseFlow";
import { hasKey } from "./typeGuards";

/** 同 addEventListener，但返回值是移除该监听的方法 */
export function addDomEvent<D extends Window, K extends keyof WindowEventMap>(
  dom: D,
  type: K,
  listener: (this: D, ev: WindowEventMap[K]) => unknown,
  options?: AddEventListenerOptions
): () => void;
export function addDomEvent<
  D extends Document,
  K extends keyof DocumentEventMap
>(
  dom: D,
  type: K,
  listener: (this: Document, ev: DocumentEventMap[K]) => unknown,
  options?: AddEventListenerOptions
): () => void;
export function addDomEvent<
  D extends HTMLElement,
  K extends keyof HTMLElementEventMap
>(
  dom: D,
  type: K,
  listener: (this: D, ev: HTMLElementEventMap[K]) => unknown,
  options?: AddEventListenerOptions
): () => void;
export function addDomEvent<
  D extends Window | Document | HTMLElement,
  K extends Extract<
    keyof DocumentEventMap,
    Extract<keyof WindowEventMap, keyof HTMLElementEventMap>
  >
>(
  dom: D,
  type: K,
  listener: (this: D, ev: WindowEventMap[K]) => unknown,
  options?: AddEventListenerOptions
): () => void;
export function addDomEvent<D extends EventTarget, K extends string>(
  dom: D,
  type: K,
  listener: (this: D, ev: Event) => unknown,
  options?: AddEventListenerOptions
): () => void;
export function addDomEvent(
  dom: Window | HTMLElement | Document,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
) {
  dom.addEventListener(type, listener, options);
  let isRemoved = false;
  return function removeListener() {
    if (!isRemoved) {
      dom.removeEventListener(type, listener);
      isRemoved = true;
    }
  };
}

export interface LoadScriptOption extends Partial<HTMLScriptElement> {
  noRepeat?: boolean;
  autoRemove?: boolean;
  /**
   * 出错时是否抛出
   * @default false
   */
  throwError?: boolean;
  exposeGlobalName?: string;
  /**
   * 是否清除global的值，配合 exposeGlobalName 清除
   */
  cleanGlobal?: boolean;
}

export const exposeMap = new Map<string, unknown>();
export const loadingPromiseMap = new Map<string, Promise<unknown>>();
export const loadedUrls = new Set<string>();

export function _coreFn(scriptUrl: string, opts: LoadScriptOption = {}) {
  const {
    noRepeat = false,
    autoRemove = true,
    throwError,
    exposeGlobalName,
    cleanGlobal,
    ...scriptAttrs
  } = opts;

  async function resolveExposeValue() {
    await delay(0);
    if (exposeGlobalName) {
      if (exposeMap.has(scriptUrl)) {
        if (cleanGlobal && hasKey(window, exposeGlobalName)) {
          delete window[exposeGlobalName];
        }
        return exposeMap.get(scriptUrl);
      } else {
        const exposeVal = window[exposeGlobalName];
        if (cleanGlobal && hasKey(window, exposeGlobalName)) {
          delete window[exposeGlobalName];
        }
        exposeMap.set(scriptUrl, exposeVal);
        return exposeVal;
      }
    }
    return;
  }

  if (noRepeat) {
    if (loadingPromiseMap.has(scriptUrl)) {
      return loadingPromiseMap.get(scriptUrl);
    }
    if (loadedUrls.has(scriptUrl)) {
      return Promise.resolve(resolveExposeValue());
    }
  }

  const scriptElm = document.createElement("script");
  Object.assign(
    scriptElm,
    { async: true, type: "text/javascript", charset: "utf-8" },
    scriptAttrs
  );
  scriptElm.setAttribute("src", scriptUrl);
  scriptElm.setAttribute("data-create-by", "loadScript");

  // 启动 script 加载，promisified
  const task = new Promise<unknown>((resolve, reject) => {
    // 监听 load 事件
    const rm1 = addDomEvent(
      scriptElm,
      "load",
      () => {
        removeAllHandler();
        resolve(resolveExposeValue());
        !loadedUrls.has(scriptUrl) && loadedUrls.add(scriptUrl);
      },
      { once: true }
    );
    // 监听 error 事件
    const rm2 = addDomEvent(
      scriptElm,
      "error",
      () => {
        removeAllHandler();
        const err = new Error(`loadScriptError 『${scriptUrl}』`);
        throwError ? reject(err) : resolve(err);
      },
      { once: true }
    );

    // window 监听 error 事件
    const rm3 = addDomEvent(window, "error", (event) => {
      if (event.filename.includes(scriptUrl)) {
        removeAllHandler();
        reject(
          Object.assign(event.error, {
            lineno: event.lineno,
            colno: event.colno
          })
        );
      }
    });

    // 移除所有监听事件
    const removeAllHandler = () => [rm1, rm2, rm3].forEach((fn) => fn());
    // 添加 script 标签，启动加载
    document.documentElement.appendChild(scriptElm);
  }).finally(() => {
    autoRemove && scriptElm.remove();
    loadingPromiseMap.delete(scriptUrl);
  });
  loadingPromiseMap.set(scriptUrl, task);

  return task;
}

/**
 * 加载`script`
 * - 只是加载，不判断代码是否执行成功
 */
export async function loadScript(
  scriptUrl: string,
  opts: LoadScriptOption = {}
) {
  return await _coreFn(scriptUrl, opts);
}

export default loadScript;
