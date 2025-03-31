import type {
  Filter,
  FilterToggle,
  FilterToggleValue,
  ProductListingPage,
} from "apps/commerce/types.ts";
import { parseRange } from "apps/commerce/utils/filters.ts";
import Avatar from "../../components/ui/Avatar.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";

interface Props {
  filters: ProductListingPage["filters"];
}

const isToggle = (filter: Filter): filter is FilterToggle =>
  filter["@type"] === "FilterToggle";

function ValueItem(
  { url, selected, label, quantity }: FilterToggleValue,
) {
  return (
    <a href={url} rel="nofollow" class="flex items-center gap-2 hover:underline">
      <div 
        aria-checked={selected} 
        class={clx(
          "w-4 h-4 border rounded-sm transition-colors duration-200 flex items-center justify-center",
          "border-[#C9CFCF]"
        )} 
      >
        {selected && <img src="https://shoulder.vtexassets.com/arquivos/filter-check-hotsite.svg" class="w-2 h-2" />}
      </div>
      <span class="text-sm text-[#2F3333]">{label}</span>
      {quantity > 0 && <span class="text-sm text-[#737777]">({quantity})</span>}
    </a>
  );
}

function FilterValues({ key, values }: FilterToggle) {
  const avatars = key === "tamanho" || key === "cor";
  const flexDirection = avatars ? "flex-row flex-wrap items-center" : "flex-col";

  return (
    <div class="overflow-hidden transition-all duration-200">
      <ul class={clx(`flex gap-3`, flexDirection)}>
        {values.map((item) => {
          const { url, selected, value } = item;

          if (avatars) {
            return (
              <a href={url} rel="nofollow">
                <Avatar
                  content={value}
                  variant={selected ? "active" : "default"}
                />
              </a>
            );
          }

          if (key === "price") {
            const range = parseRange(item.value);

            return range && (
              <ValueItem
                {...item}
                label={`${formatPrice(range.from)} - ${formatPrice(range.to)}`}
              />
            );
          }

          return <ValueItem {...item} />;
        })}
      </ul>
    </div>
  );
}

export function FilterSelectedValues({ filters }: Props) {
  const selectedFilters = filters
    .filter(isToggle)
    .map(filter => ({
      label: filter.label,
      values: filter.values.filter(value => value.selected)
    }))
    .filter(filter => filter.values.length > 0);

  if (selectedFilters.length === 0) return null;

  return (
    <div class="flex flex gap-4">
      <ul class="flex flex-wrap gap-2">
        {selectedFilters.map(filter => (
          filter.values.map(value => (
            <li>
              <a 
                href={value.url} 
                class="flex items-center gap-2  px-2 py-1 rounded-full text-xs text-[#716d6e] font-normal  transition-colors"
              >
                <span>{value.label}</span>
                <svg 
                  class="w-2 h-2" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </a>
            </li>
          ))
        ))}
      </ul>
      <div class="flex items-center gap-2">
        <a href="?" class="text-xs text-[#2F3333] underline">limpar filtros</a>
      </div>
    </div>
  );
}

function Filters({ filters }: Props) {
  return (
    <ul class="flex gap-5 p-4 sm:p-0">
      {filters
        .filter(isToggle)
        .map((filter) => (
          <li class="dropdown flex flex-col min-w-[100px] relative h-[48px] justify-center">
            <input type="button" id={`filter-${filter.key}`} class=" hidden" name="filter"/>
            
            <label 
              tabindex="0" role="button"
              for={`filter-${filter.key}`}
              class="peer flex items-center justify-between py-2 cursor-pointer group h-full px-4"
            >
              <span class="text-sm font-medium text-[#2F3333]">{filter.label}</span>
              <svg 
                class="w-4 h-4 transition-transform duration-200 peer-checked:rotate-180 text-[#2F3333]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </label>
            <div tabindex="0" class="dropdown-content overflow-hidden transition-all duration-200 absolute left-0 top-[100%] max-h-[200px] w-[180px] mt-1 shadow bg-[#fffdf4] ">
              <div class="p-[10px] overflow-y-auto">
                <FilterValues {...filter} />
              </div>
            </div>
          </li>
        ))}
    </ul>
  );
}

export default Filters;
