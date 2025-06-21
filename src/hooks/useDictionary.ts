/// <reference types="vite/client" />
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

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
  status: 'found' | 'not_found' | 'rate_limited';
}

export function useDictionary(word: string) {
  const [definition, setDefinition] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cache = useRef<Record<string, CacheEntry>>({});
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!word) return;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Clean up expired rate-limited entries
    const RATE_LIMIT_CACHE_DURATION = 1000 * 5; // 5 seconds
    Object.keys(cache.current).forEach(cachedWord => {
      const entry = cache.current[cachedWord];
      if (entry.status === 'rate_limited' && Date.now() - entry.timestamp > RATE_LIMIT_CACHE_DURATION) {
        delete cache.current[cachedWord];
      }
    });

    // Check cache first
    const cachedEntry = cache.current[word];
    const CACHE_DURATION = 1000 * 60 * 60; // 1 hour for found/not_found
    
    if (cachedEntry) {
      const isExpired = cachedEntry.status === 'rate_limited' 
        ? Date.now() - cachedEntry.timestamp > RATE_LIMIT_CACHE_DURATION
        : Date.now() - cachedEntry.timestamp > CACHE_DURATION;
      
      if (!isExpired) {
        if (cachedEntry.status === 'found') {
          setDefinition(cachedEntry.definition);
          setError(null);
        } else if (cachedEntry.status === 'not_found') {
          setDefinition(null);
          setError('Word not found in dictionary');
        } else if (cachedEntry.status === 'rate_limited') {
          setDefinition(null);
          setError('API rate limit exceeded. Retrying in a few seconds...');
        }
        return;
      }
    }

    // Don't make API calls for words we've already determined don't exist (unless cache expired)
    if (cachedEntry?.status === 'not_found' && Date.now() - cachedEntry.timestamp < CACHE_DURATION) {
      setDefinition(null);
      setError('Word not found in dictionary');
      return;
    }

    // Debounce the API call by 350ms
    timeoutRef.current = setTimeout(() => {
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
          const apiKey = import.meta.env.VITE_WORDNIK_API_KEY;
          const response = await axios.get(
            `https://api.wordnik.com/v4/word.json/${word}/definitions`,
            {
              params: {
                limit: 1,
                includeRelated: false,
                useCanonical: false,
                includeTags: false,
                api_key: apiKey,
              },
              signal: abortControllerRef.current.signal,
            }
          );
          const data = response.data;
          const firstDefinition = data[0]?.text;

          if (firstDefinition) {
            // Update cache with found definition
            cache.current[word] = {
              definition: firstDefinition,
              timestamp: Date.now(),
              status: 'found'
            };
            setDefinition(firstDefinition);
          } else {
            // Word not found - cache this result
            cache.current[word] = {
              definition: '',
              timestamp: Date.now(),
              status: 'not_found'
            };
            setDefinition(null);
            setError('Word not found in dictionary');
          }
        } catch (err) {
          // Don't set error if request was aborted
          if (
            (err instanceof Error && err.name !== 'AbortError') ||
            (axios.isAxiosError(err) && err.code !== 'ERR_CANCELED')
          ) {
            let errorMessage = 'Failed to fetch definition';
            let cacheStatus: CacheEntry['status'] = 'not_found';

            // Handle rate limiting specifically
            if (axios.isAxiosError(err)) {
              const status = err.response?.status;
              if (status === 429) {
                errorMessage = 'API rate limit exceeded. Retrying in a few seconds...';
                cacheStatus = 'rate_limited';
              } else if (status === 404) {
                errorMessage = 'Word not found in dictionary';
                cacheStatus = 'not_found';
              } else if (status && status >= 500) {
                errorMessage = 'Dictionary service temporarily unavailable';
                cacheStatus = 'rate_limited'; // Treat server errors as temporary
              }
            }

            // Cache the error result to prevent repeated failed requests
            cache.current[word] = {
              definition: '',
              timestamp: Date.now(),
              status: cacheStatus
            };

            setError(errorMessage);
            setDefinition(null);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchDefinition();
    }, 350);

    // Cleanup function to abort request on unmount or word change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [word]);

  return { definition, loading, error };
} 