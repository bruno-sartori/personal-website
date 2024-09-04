import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UIOptions } from '@/types.js';
import SearchResult from '@/components/SearchResult';

interface SearchProps {
  id?: string;
  open: boolean;
  className?: string;
  uiOptions: UIOptions;
}

const Search: React.FC<SearchProps> = ({ id, open, className, uiOptions }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ title: string; excerpt: string; image?: string }[]>([]);

  React.useEffect(() => {
    async function loadPagefind() {
      // @ts-expect-error
      if (typeof window.pagefind === "undefined") {
        try {
          // @ts-expect-error
          window.pagefind = await import(
            // @ts-expect-error pagefind.js generated after build
            /* webpackIgnore: true */ "./pagefind/pagefind.js"
          );
        } catch (e) {
          // @ts-expect-error
          window.pagefind = { search: () => ({ results: [] }) };
        }
      }
    }

    loadPagefind();
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } else {
      setQuery('');
    }
  }, [open]);
  
  const handleSearch = useCallback(async () => {
    // @ts-expect-error
    if (window.pagefind) {
      // @ts-expect-error
      const search = await window.pagefind.debouncedSearch(query);
      setResults(search.results);
    }
  }, [query]);

  useEffect(() => {
    if (query.length > 2) {
      handleSearch();
    } else {
      setResults([]);
    }
  }, [handleSearch, query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div id={id} className={className}>
      <input
        type="text"
        ref={inputRef}
        value={query}
        onChange={handleInputChange}
        placeholder="Search..."
        className={`w-full p-2 border rounded ${uiOptions?.resetStyles ? '' : 'bg-gray-50'}`}
      />
      {results.length > 0 && (
        <div className="mt-2 border rounded p-2 bg-white dark:bg-gray-800">
          <ul>
            {results.map((result, index) => (
              <SearchResult key={index} result={result} uiOptions={uiOptions} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;
