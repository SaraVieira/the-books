"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function SearchSelect({ data, onChange }: any) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? data.find(
                (d: any) =>
                  d.label.toLocaleLowerCase() === value.toLocaleLowerCase()
              )?.label
            : "Select country..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 max-h-[150px] overflow-auto">
        <Command>
          <CommandInput placeholder="Search a country..." />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup>
            {data.map((d: any) => (
              <CommandItem
                key={d.value}
                value={d.label}
                onSelect={(currentValue) => {
                  const v = currentValue === value ? "" : currentValue;
                  setValue(v);
                  onChange(
                    (
                      data.find(
                        (a) =>
                          a.label.toLocaleLowerCase() === v.toLocaleLowerCase()
                      ) || {}
                    ).value
                  );
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === d.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {d.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
