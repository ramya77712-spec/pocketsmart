import Papa from 'papaparse';
import { Expense } from '../types';

export interface CSVRow {
  category: string;
  amount: string;
  description: string;
}

const categoryTypeMapping: { [key: string]: 'needs' | 'wants' | 'optional' } = {
  rent: 'needs',
  utilities: 'needs',
  groceries: 'needs',
  transportation: 'needs',
  insurance: 'needs',
  healthcare: 'needs',
  'debt payments': 'needs',
  dining: 'wants',
  entertainment: 'wants',
  shopping: 'wants',
  subscriptions: 'optional',
  hobbies: 'optional',
  travel: 'optional',
  gifts: 'optional',
};

export const parseCSV = (file: File): Promise<Expense[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const expenses: Expense[] = results.data.map((row: any, index: number) => {
            const category = row.category?.toLowerCase().trim() || '';
            const amount = parseFloat(row.amount) || 0;
            const description = row.description?.trim() || '';
            
            if (!category || amount <= 0) {
              throw new Error(`Invalid data in row ${index + 1}: category and amount are required`);
            }
            
            return {
              id: `csv-${index}-${Date.now()}`,
              category: category,
              amount: amount,
              description: description,
              type: categoryTypeMapping[category] || 'optional'
            };
          });
          
          resolve(expenses);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      }
    });
  });
};

export const generateSampleCSV = (): string => {
  const sampleData = [
    { category: 'rent', amount: '1200', description: 'Monthly rent payment' },
    { category: 'utilities', amount: '150', description: 'Electricity, water, internet' },
    { category: 'groceries', amount: '400', description: 'Weekly grocery shopping' },
    { category: 'transportation', amount: '200', description: 'Gas and car maintenance' },
    { category: 'insurance', amount: '250', description: 'Health and auto insurance' },
    { category: 'dining', amount: '300', description: 'Restaurants and takeout' },
    { category: 'entertainment', amount: '150', description: 'Movies, games, events' },
    { category: 'shopping', amount: '200', description: 'Clothing and misc purchases' },
    { category: 'subscriptions', amount: '75', description: 'Netflix, Spotify, etc.' },
    { category: 'hobbies', amount: '100', description: 'Books, art supplies, etc.' },
  ];
  
  return Papa.unparse(sampleData);
};