'use client';

import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Badge } from './badge';

export type Option = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: Option[];
  onChange: (options: Option[]) => void;
  className?: string;
  placeholder?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  className,
  placeholder = 'Selecione...',
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [internalSelected, setInternalSelected] = React.useState<Option[]>(selected);
  const containerRef = useRef<HTMLDivElement>(null);

  // Atualiza o estado interno quando as props mudam
  useEffect(() => {
    setInternalSelected(selected);
  }, [selected]);

  // Atualiza o estado do formulário quando o dropdown é fechado
  useEffect(() => {
    if (!isOpen && !arraysAreEqual(internalSelected, selected)) {
      onChange(internalSelected);
    }
  }, [isOpen]);

  // Função auxiliar para comparar arrays de options
  const arraysAreEqual = (a: Option[], b: Option[]) => {
    if (a.length !== b.length) return false;
    return a.every(item => b.some(bItem => bItem.value === item.value));
  };

  const handleSelect = (value: string) => {
    const option = options.find((o) => o.value === value);
    if (!option) return;

    const isSelected = internalSelected.some((s) => s.value === value);
    if (isSelected) {
      setInternalSelected(internalSelected.filter((s) => s.value !== value));
    } else {
      setInternalSelected([...internalSelected, option]);
    }
  };

  const handleUnselect = (option: Option, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = internalSelected.filter((s) => s.value !== option.value);
    setInternalSelected(newSelected);
    // Como o unselect é feito fora do dropdown, atualizamos o estado do formulário imediatamente
    onChange(newSelected);
  };

  // Fecha o dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={cn(
          'flex min-h-[40px] w-full cursor-pointer flex-wrap gap-1 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100',
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-1 flex-wrap gap-1">
          {internalSelected.length > 0 ? (
            internalSelected.map((option) => (
              <Badge
                key={option.value}
                variant="secondary"
                className="bg-zinc-700 text-zinc-100 hover:bg-zinc-600"
              >
                {option.label}
                <button
                  type="button"
                  className="ml-1 rounded-full outline-none hover:text-zinc-200"
                  onClick={(e) => handleUnselect(option, e)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          ) : (
            <span className="text-zinc-400">{placeholder}</span>
          )}
        </div>
        <div className="flex items-center self-center">
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </div>
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-zinc-700 bg-zinc-800 shadow-lg">
          {options.map((option) => {
            const isSelected = internalSelected.some((s) => s.value === option.value);
            return (
              <button
                type="button"
                key={option.value}
                className={cn(
                  'flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-zinc-700',
                  isSelected && 'bg-zinc-700'
                )}
                onClick={() => handleSelect(option.value)}
              >
                <span className="text-zinc-100">{option.label}</span>
                {isSelected && (
                  <Check className="h-4 w-4 text-zinc-100" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
} 