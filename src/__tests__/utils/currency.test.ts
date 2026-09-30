import { formatINR, formatIndianNumber, parseIndianAmount, isValidAmount } from '../../utils/currency';

describe('Currency Utils', () => {
  describe('formatINR', () => {
    it('should format amounts in INR correctly', () => {
      expect(formatINR(1000)).toBe('₹1,000');
      expect(formatINR(100000)).toBe('₹1,00,000');
      expect(formatINR(1000000)).toBe('₹10,00,000');
    });

    it('should handle zero and negative amounts', () => {
      expect(formatINR(0)).toBe('₹0');
      expect(formatINR(-1000)).toBe('-₹1,000');
    });
  });

  describe('formatIndianNumber', () => {
    it('should format large numbers with Indian abbreviations', () => {
      expect(formatIndianNumber(100000)).toBe('₹1.0 L');
      expect(formatIndianNumber(10000000)).toBe('₹1.0 Cr');
      expect(formatIndianNumber(50000)).toBe('₹50.0 K');
    });

    it('should format small numbers normally', () => {
      expect(formatIndianNumber(999)).toBe('₹999');
    });
  });

  describe('parseIndianAmount', () => {
    it('should parse Indian abbreviations correctly', () => {
      expect(parseIndianAmount('1.5 Cr')).toBe(15000000);
      expect(parseIndianAmount('2 L')).toBe(200000);
      expect(parseIndianAmount('50 K')).toBe(50000);
    });

    it('should handle currency symbols', () => {
      expect(parseIndianAmount('₹1,000')).toBe(1000);
      expect(parseIndianAmount('$100')).toBe(100);
    });
  });

  describe('isValidAmount', () => {
    it('should validate amounts correctly', () => {
      expect(isValidAmount(1000)).toBe(true);
      expect(isValidAmount('1000')).toBe(true);
      expect(isValidAmount(-100)).toBe(false);
      expect(isValidAmount('invalid')).toBe(false);
      expect(isValidAmount(1000000000)).toBe(false); // Too large
    });
  });
});