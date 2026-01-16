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
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { searchServices, Service } from "@/data/services";

interface ServiceComboboxProps {
  value: string;
  onSelect: (service: Service | null) => void;
  placeholder?: string;
}

export function ServiceCombobox({
  value,
  onSelect,
  placeholder = "Search procedure...",
}: ServiceComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [results, setResults] = React.useState<Service[]>([]);

  React.useEffect(() => {
    if (searchQuery.length >= 2) {
      const matches = searchServices(searchQuery, 30);
      setResults(matches);
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  const handleSelect = (service: Service) => {
    onSelect(service);
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal h-10"
        >
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {value || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type to search services..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {searchQuery.length < 2
                ? "Type at least 2 characters to search..."
                : "No services found."}
            </CommandEmpty>
            {results.length > 0 && (
              <CommandGroup heading={`Found ${results.length} services`}>
                {results.map((service) => (
                  <CommandItem
                    key={service.id}
                    value={service.name}
                    onSelect={() => handleSelect(service)}
                    className="flex flex-col items-start py-2"
                  >
                    <div className="flex items-center w-full">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 flex-shrink-0",
                          value === service.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{service.name}</div>
                        <div className="text-xs text-muted-foreground flex gap-2">
                          <span>{service.department}</span>
                          {service.cost > 0 && (
                            <span className="text-primary font-medium">
                              ₹{service.cost.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
