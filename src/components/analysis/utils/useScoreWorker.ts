import { useEffect, useRef, useState } from 'react';
import { PersonalityTrait, ValueDimension } from './scoreCalculator';

interface WorkerResult<T> {
  type: string;
  result: T;
  error?: string;
}

interface UseScoreWorkerResult {
  calculatePersonalityTraits: (answers: Record<string, string>) => Promise<Record<PersonalityTrait, number>>;
  calculateValueDimensions: (answers: Record<string, number>) => Promise<Record<ValueDimension, number>>;
  calculateCompatibility: (
    personalityTraits: Record<PersonalityTrait, number>,
    valueDimensions: Record<ValueDimension, number>
  ) => Promise<{
    totalScore: number;
    dimensions: {
      name: string;
      score: number;
      maxScore: number;
      weight: number;
      traits?: Record<PersonalityTrait, number>;
      dimensions?: Record<ValueDimension, number>;
    }[];
  }>;
  isCalculating: boolean;
  error: Error | null;
}

export const useScoreWorker = (): UseScoreWorkerResult => {
  const workerRef = useRef<Worker | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 初始化Worker
  useEffect(() => {
    // 创建Worker
    workerRef.current = new Worker(
      new URL('./scoreWorker.ts', import.meta.url),
      { type: 'module' }
    );

    // 清理函数
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  // 创建通用的Worker调用函数
  const callWorker = async <T>(type: string, data: any): Promise<T> => {
    if (!workerRef.current) {
      throw new Error('Worker not initialized');
    }

    setIsCalculating(true);
    setError(null);

    try {
      return await new Promise<T>((resolve, reject) => {
        const worker = workerRef.current!;

        const handleMessage = (e: MessageEvent<WorkerResult<T>>) => {
          const { type: responseType, result, error } = e.data;
          
          if (responseType === type) {
            if (error) {
              reject(new Error(error));
            } else {
              resolve(result);
            }
            worker.removeEventListener('message', handleMessage);
          }
        };

        worker.addEventListener('message', handleMessage);
        worker.postMessage({ type, data });
      });
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsCalculating(false);
    }
  };

  // 计算性格特征得分
  const calculatePersonalityTraits = async (answers: Record<string, string>) => {
    return callWorker<Record<PersonalityTrait, number>>(
      'calculatePersonalityTraits',
      answers
    );
  };

  // 计算价值观维度得分
  const calculateValueDimensions = async (answers: Record<string, number>) => {
    return callWorker<Record<ValueDimension, number>>(
      'calculateValueDimensions',
      answers
    );
  };

  // 计算整体匹配度
  const calculateCompatibility = async (
    personalityTraits: Record<PersonalityTrait, number>,
    valueDimensions: Record<ValueDimension, number>
  ) => {
    return callWorker(
      'calculateCompatibility',
      { personalityTraits, valueDimensions }
    );
  };

  return {
    calculatePersonalityTraits,
    calculateValueDimensions,
    calculateCompatibility,
    isCalculating,
    error
  };
};

// 缓存键生成器
export const generateCacheKey = (type: string, data: any): string => {
  return `score_${type}_${JSON.stringify(data)}`;
}; 