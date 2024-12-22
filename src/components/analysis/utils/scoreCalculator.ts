// 性格特征类型定义
export enum PersonalityTrait {
  Extroversion = 'extroversion',    // 外向性
  Openness = 'openness',            // 开放性
  Agreeableness = 'agreeableness',  // 宜人性
  Conscientiousness = 'conscientiousness', // 尽责性
  Stability = 'stability'           // 情绪稳定性
}

// 价值观维度类型定义
export enum ValueDimension {
  Career = 'career',       // 事业价值观
  Family = 'family',       // 家庭价值观
  Personal = 'personal',   // 个人发展
  Social = 'social',       // 社会价值观
  Material = 'material',   // 物质价值观
  Spiritual = 'spiritual'  // 精神价值观
}

// 性格特征得分映射
const personalityScoreMap: Record<string, Record<string, number>> = {
  'p1': { // 社交场合的表现
    'A': { [PersonalityTrait.Extroversion]: 1.0, [PersonalityTrait.Openness]: 0.8 },
    'B': { [PersonalityTrait.Extroversion]: 0.3, [PersonalityTrait.Stability]: 0.7 },
    'C': { [PersonalityTrait.Agreeableness]: 0.8, [PersonalityTrait.Stability]: 0.6 },
    'D': { [PersonalityTrait.Extroversion]: 0.1, [PersonalityTrait.Stability]: 0.3 }
  },
  'p2': { // 面对挑战的态度
    'A': { [PersonalityTrait.Openness]: 1.0, [PersonalityTrait.Stability]: 0.8 },
    'B': { [PersonalityTrait.Conscientiousness]: 0.9, [PersonalityTrait.Stability]: 0.7 },
    'C': { [PersonalityTrait.Agreeableness]: 0.8, [PersonalityTrait.Openness]: 0.6 },
    'D': { [PersonalityTrait.Stability]: 0.4, [PersonalityTrait.Openness]: 0.2 }
  },
  'p3': { // 处理矛盾的方式
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

// 计算性格特征得分
export const calculatePersonalityTraits = (answers: Record<string, string>) => {
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
  const traitScores = Object.entries(traits).reduce((acc, [trait, scores]) => {
    const average = scores.length > 0
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : 0;
    acc[trait as PersonalityTrait] = Math.round(average * 100);
    return acc;
  }, {} as Record<PersonalityTrait, number>);

  return traitScores;
};

// 计算价值观维度得分
export const calculateValueDimensions = (answers: Record<string, number>) => {
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
  const dimensionScores = Object.entries(dimensions).reduce((acc, [dimension, scores]) => {
    const average = scores.length > 0
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : 0;
    acc[dimension as ValueDimension] = Math.round((average / 5) * 100);
    return acc;
  }, {} as Record<ValueDimension, number>);

  return dimensionScores;
};

// 计算匹配度
export const calculateCompatibility = (
  personalityTraits: Record<PersonalityTrait, number>,
  valueDimensions: Record<ValueDimension, number>
) => {
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

// 生成匹配分析
export const generateAnalysis = (score: number, dimensions: any[]) => {
  // 根据得分生成分析文本
  const getScoreLevel = (score: number) => {
    if (score >= 90) return '极高';
    if (score >= 80) return '很高';
    if (score >= 70) return '较高';
    if (score >= 60) return '一般';
    return '较低';
  };

  // 生成总体评价
  const overallComment = `根据测评结果显示,你们的整体匹配度${getScoreLevel(score)},
    总分为${score}分。在性格特征方面的匹配度为${dimensions[0].score}分,
    在价值观方面的契合度为${dimensions[1].score}分。
    这表明你们${score >= 70 ? '有较好的发展潜力' : '可能需要更多的相互理解和包容'}。`;

  return {
    overallComment,
    dimensions: dimensions.map(dim => ({
      name: dim.name,
      score: dim.score,
      analysis: `在${dim.name}方面,得分为${dim.score}分,属于${getScoreLevel(dim.score)}水平。`,
      strengths: generateStrengths(dim),
      weaknesses: generateWeaknesses(dim),
      suggestions: generateSuggestions(dim)
    }))
  };
};

// 生成优势分析
const generateStrengths = (dimension: any) => {
  const strengths = [];
  if (dimension.score >= 80) {
    strengths.push(`在${dimension.name}方面表现出色`);
    strengths.push('具有良好的发展基础');
  }
  if (dimension.score >= 70) {
    strengths.push('展现出积极的特质');
  }
  return strengths;
};

// 生成不足分析
const generateWeaknesses = (dimension: any) => {
  const weaknesses = [];
  if (dimension.score < 60) {
    weaknesses.push(`在${dimension.name}方面存在明显差异`);
    weaknesses.push('需要更多的互相理解');
  }
  if (dimension.score < 70) {
    weaknesses.push('仍有提升空间');
  }
  return weaknesses;
};

// 生成建议
const generateSuggestions = (dimension: any) => {
  const suggestions = [];
  if (dimension.score < 60) {
    suggestions.push('建议增加沟通和交流');
    suggestions.push('尝试理解对方的观点');
  }
  if (dimension.score < 70) {
    suggestions.push('可以寻找共同的兴趣爱好');
  }
  if (dimension.score >= 70) {
    suggestions.push('继续保持良好的互动');
  }
  return suggestions;
}; 