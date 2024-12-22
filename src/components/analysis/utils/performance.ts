import { useMemo } from 'react';
import { isEqual } from 'lodash-es';

/**
 * 带有深度比较的 useMemo hook
 * @param factory 工厂函数
 * @param deps 依赖数组
 * @returns 记忆化的值
 */
export function useMemoizedValue<T>(factory: () => T, deps: any[]): T {
  return useMemo(() => {
    return factory();
  }, deps.map(dep => JSON.stringify(dep)));
}

/**
 * 防抖函数
 * @param fn 需要防抖的函数
 * @param delay 延迟时间
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * 节流函数
 * @param fn 需要节流的函数
 * @param limit 时间限制
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 深度比较两个值是否相等
 * @param value1 第一个值
 * @param value2 第二个值
 * @returns 是否相等
 */
export function deepEqual<T>(value1: T, value2: T): boolean {
  return isEqual(value1, value2);
}

/**
 * 缓存函数结果
 * @param fn 需要缓存的函数
 * @returns 带有缓存的函数
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  return function (...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  } as T;
}

/**
 * 批量处理函数
 * @param fn 需要批量处理的函数
 * @param delay 延迟时间
 * @returns 批量处理后的函数
 */
export function batch<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 0
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let batch: Parameters<T>[] = [];
  let timeoutId: NodeJS.Timeout;

  return function (...args: Parameters<T>): Promise<ReturnType<T>> {
    return new Promise((resolve) => {
      batch.push(args);
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        const currentBatch = batch;
        batch = [];
        resolve(fn.apply(this, [currentBatch]));
      }, delay);
    });
  };
}

/**
 * 异步任务队列
 */
export class AsyncQueue {
  private queue: (() => Promise<any>)[] = [];
  private running = false;

  /**
   * 添加任务到队列
   * @param task 异步任务
   * @returns Promise
   */
  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.run();
    });
  }

  private async run() {
    if (this.running) return;
    this.running = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        await task();
      }
    }

    this.running = false;
  }
} 