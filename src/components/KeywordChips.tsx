import { KeywordSuggestion } from '@/lib/suggest';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface KeywordChipsProps {
  suggestions: KeywordSuggestion[];
  onSuggestionClick: (suggestion: string) => void;
  selectedKeywords: string[];
  onRemoveKeyword: (keyword: string) => void;
}

export function KeywordChips({
  suggestions,
  onSuggestionClick,
  selectedKeywords,
  onRemoveKeyword
}: KeywordChipsProps) {
  return (
    <div className="space-y-3">
      {selectedKeywords.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Kata kunci aktif:
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedKeywords.map((keyword) => (
              <Badge
                key={keyword}
                variant="default"
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => onRemoveKeyword(keyword)}
              >
                {keyword}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Saran kata kunci:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions
              .filter(s => !selectedKeywords.includes(s.text))
              .slice(0, 12)
              .map((suggestion) => (
                <Badge
                  key={suggestion.text}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => onSuggestionClick(suggestion.text)}
                >
                  {suggestion.text}
                </Badge>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
