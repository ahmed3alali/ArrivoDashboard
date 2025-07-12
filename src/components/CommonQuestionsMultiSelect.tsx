import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
  } from "@/components/ui/command";
  
  export function CommonQuestionsMultiSelect({ options, selected, onChange }) {
    return (
      <Command>
        <CommandInput placeholder="Select Common Questions..." />
        <CommandList>
          <CommandEmpty>No questions found.</CommandEmpty>
          <CommandGroup>
            {options.map(({ label, value }) => (
              <CommandItem
                key={value}
                onSelect={() => {
                  if (selected.includes(value)) {
                    onChange(selected.filter((v) => v !== value));
                  } else {
                    onChange([...selected, value]);
                  }
                }}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(value)}
                  readOnly
                  className="mr-2"
                />
                {label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    );
  }
  