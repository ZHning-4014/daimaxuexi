import {
  calculatePersonalityTraits,
  calculateValueDimensions,
  calculateCompatibility,
  generateAnalysis,
  PersonalityTrait,
  ValueDimension
} from '../scoreCalculator';

describe('scoreCalculator', () => {
  describe('calculatePersonalityTraits', () => {
    it('应该正确计算性格特征得分', () => {
      const answers = {
        'p1': 'A',
        'p2': 'B',
        'p3': 'C'
      };

      const traits = calculatePersonalityTraits(answers);

      // 验证返回的所有特征
      expect(Object.keys(traits)).toEqual([
        PersonalityTrait.Extroversion,
        PersonalityTrait.Openness,
        PersonalityTrait.Agreeableness,
        PersonalityTrait.Conscientiousness,
        PersonalityTrait.Stability
      ]);

      // 验证分数在合理范围内
      Object.values(traits).forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      });
    });

    it('应该处理空答案', () => {
      const traits = calculatePersonalityTraits({});
      
      Object.values(traits).forEach(score => {
        expect(score).toBe(0);
      });
    });
  });

  describe('calculateValueDimensions', () => {
    it('应该正确计算价值观维度得分', () => {
      const answers = {
        'v1': 5,
        'v2': 4,
        'v3': 3,
        'v4': 4,
        'v5': 5,
        'v6': 4
      };

      const dimensions = calculateValueDimensions(answers);

      // 验证返回的所有维度
      expect(Object.keys(dimensions)).toEqual([
        ValueDimension.Career,
        ValueDimension.Family,
        ValueDimension.Personal,
        ValueDimension.Social,
        ValueDimension.Material,
        ValueDimension.Spiritual
      ]);

      // 验证分数在合理范围内
      Object.values(dimensions).forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      });
    });

    it('应该处理空答案', () => {
      const dimensions = calculateValueDimensions({});
      
      Object.values(dimensions).forEach(score => {
        expect(score).toBe(0);
      });
    });
  });

  describe('calculateCompatibility', () => {
    it('应该正确计算整体匹配度', () => {
      const personalityTraits = {
        [PersonalityTrait.Extroversion]: 80,
        [PersonalityTrait.Openness]: 75,
        [PersonalityTrait.Agreeableness]: 85,
        [PersonalityTrait.Conscientiousness]: 90,
        [PersonalityTrait.Stability]: 70
      };

      const valueDimensions = {
        [ValueDimension.Career]: 85,
        [ValueDimension.Family]: 90,
        [ValueDimension.Personal]: 80,
        [ValueDimension.Social]: 75,
        [ValueDimension.Material]: 70,
        [ValueDimension.Spiritual]: 85
      };

      const result = calculateCompatibility(personalityTraits, valueDimensions);

      // 验证返回结构
      expect(result).toHaveProperty('totalScore');
      expect(result).toHaveProperty('dimensions');
      expect(result.dimensions).toHaveLength(2);

      // 验证分数在合理范围内
      expect(result.totalScore).toBeGreaterThanOrEqual(0);
      expect(result.totalScore).toBeLessThanOrEqual(100);

      result.dimensions.forEach(dim => {
        expect(dim.score).toBeGreaterThanOrEqual(0);
        expect(dim.score).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('generateAnalysis', () => {
    it('应该生成正确的分析报告', () => {
      const score = 85;
      const dimensions = [
        {
          name: '性格匹配度',
          score: 80,
          maxScore: 100,
          weight: 0.4
        },
        {
          name: '价值观契合度',
          score: 90,
          maxScore: 100,
          weight: 0.6
        }
      ];

      const analysis = generateAnalysis(score, dimensions);

      // 验证返回结构
      expect(analysis).toHaveProperty('overallComment');
      expect(analysis).toHaveProperty('dimensions');
      expect(analysis.dimensions).toHaveLength(2);

      // 验证分析内容
      expect(analysis.overallComment).toContain(String(score));
      expect(analysis.dimensions[0].strengths.length).toBeGreaterThan(0);
      expect(analysis.dimensions[0].weaknesses.length).toBeGreaterThan(0);
      expect(analysis.dimensions[0].suggestions.length).toBeGreaterThan(0);
    });

    it('应该根据不同分数生成不同的评价', () => {
      const dimensions = [
        {
          name: '测试维度',
          score: 50,
          maxScore: 100,
          weight: 1
        }
      ];

      const lowAnalysis = generateAnalysis(50, dimensions);
      const highAnalysis = generateAnalysis(90, dimensions);

      expect(lowAnalysis.overallComment).not.toBe(highAnalysis.overallComment);
    });
  });
}); 