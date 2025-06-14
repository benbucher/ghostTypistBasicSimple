import { useState, useEffect, useRef } from 'react';

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

interface CacheEntry {
  definition: string;
  timestamp: number;
}

export function useDictionary(word: string) {
  const [definition, setDefinition] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cache = useRef<Record<string, CacheEntry>>({});
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!word) return;

    // Check cache first
    const cachedEntry = cache.current[word];
    const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
    if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_DURATION) {
      setDefinition(cachedEntry.definition);
      return;
    }

    const fetchDefinition = async () => {
      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
          { signal: abortControllerRef.current.signal }
        );
        if (!response.ok) {
          throw new Error('Word not found');
        }
        const data: DictionaryResponse[] = await response.json();
        const firstDefinition = data[0]?.meanings[0]?.definitions[0]?.definition;
        
        if (firstDefinition) {
          // Update cache
          cache.current[word] = {
            definition: firstDefinition,
            timestamp: Date.now()
          };
        }
        
        setDefinition(firstDefinition || null);
      } catch (err) {
        // Don't set error if request was aborted
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
          setDefinition(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDefinition();

    // Cleanup function to abort request on unmount or word change
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [word]);

  return { definition, loading, error };
} 