import {
  PersonalityTrait,
  ValueDimension
} from './scoreCalculator';

// 性格特征得分映射
const personalityScoreMap: Record<string, Record<string, number>> = {
  'p1': {
    'A': { [PersonalityTrait.Extroversion]: 1.0, [PersonalityTrait.Openness]: 0.8 },
    'B': { [PersonalityTrait.Extroversion]: 0.3, [PersonalityTrait.Stability]: 0.7 },
    'C': { [PersonalityTrait.Agreeableness]: 0.8, [PersonalityTrait.Stability]: 0.6 },
    'D': { [PersonalityTrait.Extroversion]: 0.1, [PersonalityTrait.Stability]: 0.3 }
  },
  'p2': {
    'A': { [PersonalityTrait.Openness]: 1.0, [PersonalityTrait.Stability]: 0.8 },
    'B': { [PersonalityTrait.Conscientiousness]: 0.9, [PersonalityTrait.Stability]: 0.7 },
    'C': { [PersonalityTrait.Agreeableness]: 0.8, [PersonalityTrait.Openness]: 0.6 },
    'D': { [PersonalityTrait.Stability]: 0.4, [PersonalityTrait.Openness]: 0.2 }
  },
  'p3': {
    'A': { [PersonalityTrait.Extroversion]: 0.8, [PersonalityTrait.Stability]: 0.7 },
    'B': { [PersonalityTrait.Conscientiousness]: 1.0, [PersonalityTrait.Stability]: 0.9 },
    'C': { [PersonalityTrait.Agreeableness]: 1.0, [PersonalityTrait.Stability]: 0.8 },
    'D': { [PersonalityTrait.Agreeableness]: 0.6, [PersonalityTrait.Stability]: 0.4 }
  }
};

// 价值观问题分类
const valueQuestionCategories: Record<string, ValueDimension> = {
  'v1': ValueDimension.Career,
  'v2': ValueDimension.Family,
  'v3': ValueDimension.Personal,
  'v4': ValueDimension.Social,
  'v5': ValueDimension.Material,
  'v6': ValueDimension.Spiritual
};

// 特征权重
const traitWeights = {
  [PersonalityTrait.Extroversion]: 0.15,
  [PersonalityTrait.Openness]: 0.25,
  [PersonalityTrait.Agreeableness]: 0.2,
  [PersonalityTrait.Conscientiousness]: 0.2,
  [PersonalityTrait.Stability]: 0.2
};

// 价值观权重
const dimensionWeights = {
  [ValueDimension.Career]: 0.15,
  [ValueDimension.Family]: 0.2,
  [ValueDimension.Personal]: 0.15,
  [ValueDimension.Social]: 0.15,
  [ValueDimension.Material]: 0.15,
  [ValueDimension.Spiritual]: 0.2
};

// 计算性格特征得分
const calculatePersonalityTraits = (answers: Record<string, string>) => {
  // 初始化特征得分
  const traits: Record<PersonalityTrait, number[]> = {
    [PersonalityTrait.Extroversion]: [],
    [PersonalityTrait.Openness]: [],
    [PersonalityTrait.Agreeableness]: [],
    [PersonalityTrait.Conscientiousness]: [],
    [PersonalityTrait.Stability]: []
  };

  // 计算每个特征的得分
  Object.entries(answers).forEach(([questionId, answer]) => {
    const questionScores = personalityScoreMap[questionId]?.[answer];
    if (questionScores) {
      Object.entries(questionScores).forEach(([trait, score]) => {
        traits[trait as PersonalityTrait].push(score);
      });
    }
  });

  // 计算每个特征的平均分
  return Object.entries(traits).reduce((acc, [trait, scores]) => {
    const average = scores.length > 0
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : 0;
    acc[trait as PersonalityTrait] = Math.round(average * 100);
    return acc;
  }, {} as Record<PersonalityTrait, number>);
};

// 计算价值观维度得分
const calculateValueDimensions = (answers: Record<string, number>) => {
  // 初始化维度得分
  const dimensions: Record<ValueDimension, number[]> = {
    [ValueDimension.Career]: [],
    [ValueDimension.Family]: [],
    [ValueDimension.Personal]: [],
    [ValueDimension.Social]: [],
    [ValueDimension.Material]: [],
    [ValueDimension.Spiritual]: []
  };

  // 收集每个维度的得分
  Object.entries(answers).forEach(([questionId, score]) => {
    const dimension = valueQuestionCategories[questionId];
    if (dimension) {
      dimensions[dimension].push(score);
    }
  });

  // 计算每个维度的平均分
  return Object.entries(dimensions).reduce((acc, [dimension, scores]) => {
    const average = scores.length > 0
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : 0;
    acc[dimension as ValueDimension] = Math.round((average / 5) * 100);
    return acc;
  }, {} as Record<ValueDimension, number>);
};

// 计算匹配度
const calculateCompatibility = (
  personalityTraits: Record<PersonalityTrait, number>,
  valueDimensions: Record<ValueDimension, number>
) => {
  // 计算性格特征加权得分
  const personalityScore = Object.entries(personalityTraits).reduce((sum, [trait, score]) => {
    return sum + (score * traitWeights[trait as PersonalityTrait]);
  }, 0);

  // 计算价值观加权得分
  const valueScore = Object.entries(valueDimensions).reduce((sum, [dimension, score]) => {
    return sum + (score * dimensionWeights[dimension as ValueDimension]);
  }, 0);

  // 返回最终得分和维度得分
  return {
    totalScore: Math.round((personalityScore * 0.4 + valueScore * 0.6)),
    dimensions: [
      {
        name: '性格匹配度',
        score: Math.round(personalityScore),
        maxScore: 100,
        weight: 0.4,
        traits: personalityTraits
      },
      {
        name: '价值观契合度',
        score: Math.round(valueScore),
        maxScore: 100,
        weight: 0.6,
        dimensions: valueDimensions
      }
    ]
  };
};

// 监听消息
self.addEventListener('message', (e) => {
  const { type, data } = e.data;

  switch (type) {
    case 'calculatePersonalityTraits':
      const traits = calculatePersonalityTraits(data);
      self.postMessage({ type, result: traits });
      break;

    case 'calculateValueDimensions':
      const dimensions = calculateValueDimensions(data);
      self.postMessage({ type, result: dimensions });
      break;

    case 'calculateCompatibility':
      const { personalityTraits, valueDimensions } = data;
      const compatibility = calculateCompatibility(personalityTraits, valueDimensions);
      self.postMessage({ type, result: compatibility });
      break;

    default:
      self.postMessage({ type: 'error', error: 'Unknown calculation type' });
  }
}); 