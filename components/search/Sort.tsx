import { ProductListingPage } from "apps/commerce/types.ts";
import { useScript } from "@deco/deco/hooks";
const SORT_QUERY_PARAM = "sort";
const PAGE_QUERY_PARAM = "page";
export type Props = Pick<ProductListingPage, "sortOptions"> & {
  url: string;
};
const getUrl = (href: string, value: string) => {
  const url = new URL(href);
  url.searchParams.delete(PAGE_QUERY_PARAM);
  url.searchParams.set(SORT_QUERY_PARAM, value);
  return url.href;
};
const labels: Record<string, string> = {
  "relevance:desc": "Relevância",
  "price:desc": "Maior Preço",
  "price:asc": "Menor Preço",
  "orders:desc": "Mais vendidos",
  "name:desc": "Nome - de Z a A",
  "name:asc": "Nome - de A a Z",
  "release:desc": "Lançamento",
  "discount:desc": "Maior desconto",
};
function Sort({ sortOptions, url }: Props) {
  const current = getUrl(
    url,
    new URL(url).searchParams.get(SORT_QUERY_PARAM) ?? "",
  );
  const options = sortOptions?.map(({ value, label }) => ({
    value: getUrl(url, value),
    label,
  }));

  return (
    <div class="relative h-[48px] min-w-[180px] flex items-center justify-center">
      <input type="radio" id="sort-dropdown" class="peer hidden" name="filter"/>
      <label 
        for="sort-dropdown"
        class="flex items-center justify-between py-0 lg:py-2 cursor-pointer h-full max-w-[104px]"
      >
        <span class="text-sm font-medium text-[#2F3333] lowercase">
          {labels[options.find(opt => opt.value === current)?.label ?? ""] ?? "Ordenar por"}
        </span>
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
      <div class="h-0 peer-checked:h-auto overflow-hidden transition-all duration-200 absolute left-0 top-[100%] w-[180px] mt-1 shadow bg-[#fffdf4] z-10">
        <div class="p-[10px] overflow-y-auto">
          <ul class="flex flex-col gap-2">
            {options.map(({ value, label }) => (
              <li>
                <a 
                  href={value}
                  class="flex items-center text-sm text-[#2F3333] hover:underline py-1"
                  hx-on:click={useScript((value) => {
                    event?.preventDefault();
                    window.location.href = value;
                  },value)}
                >
                  {labels[label] ?? label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
export default Sort;
