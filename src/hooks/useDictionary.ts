import { useState, useEffect } from 'react';

interface Definition {
  definition: string;
  example?: string;
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

interface DictionaryResponse {
  word: string;
  meanings: Meaning[];
}

export function useDictionary(word: string) {
  const [definition, setDefinition] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!word) return;

    const fetchDefinition = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
          throw new Error('Word not found');
        }
        const data: DictionaryResponse[] = await response.json();
        // Get the first definition from the first meaning
        const firstDefinition = data[0]?.meanings[0]?.definitions[0]?.definition;
        setDefinition(firstDefinition || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch definition');
        setDefinition(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDefinition();
  }, [word]);

  return { definition, loading, error };
} 