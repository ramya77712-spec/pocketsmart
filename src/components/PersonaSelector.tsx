import React from 'react';
import { PersonaType } from '../types';
import { PERSONAS } from '../data/personas';

interface PersonaSelectorProps {
  selectedPersona: PersonaType | null;
  onPersonaSelect: (persona: PersonaType) => void;
  onSkip: () => void;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  selectedPersona,
  onPersonaSelect,
  onSkip,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Financial Persona</h2>
        <p className="text-gray-600">
          Select the profile that best matches your current situation to get personalized recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {PERSONAS.map((persona) => (
          <button
            key={persona.id}
            onClick={() => onPersonaSelect(persona)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
              selectedPersona?.id === persona.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{persona.icon}</span>
              <h3 className="font-semibold text-gray-800">{persona.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">{persona.description}</p>
            <div className="space-y-1 text-xs text-gray-500">
              <p>Income: ${persona.defaultIncome.toLocaleString()}/month</p>
              <p>Savings Target: ${persona.savingsTarget}/month</p>
              <p>Risk Tolerance: {persona.riskTolerance}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={onSkip}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Skip for now
        </button>
        {selectedPersona && (
          <button
            onClick={() => onPersonaSelect(selectedPersona)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Continue with {selectedPersona.name}
          </button>
        )}
      </div>
    </div>
  );
};