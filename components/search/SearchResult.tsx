import type { ProductListingPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductCard from "../../components/product/ProductCard.tsx";
import Filters, { FilterSelectedValues } from "../../components/search/Filters.tsx";
import Icon from "../../components/ui/Icon.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import Breadcrumb from "../ui/Breadcrumb.tsx";
import Drawer from "../ui/Drawer.tsx";
import Sort from "./Sort.tsx";
import { useDevice, useScript, useSection } from "@deco/deco/hooks";
import { type SectionProps } from "@deco/deco";
export interface Layout {
  /**
   * @title Pagination
   * @description Format of the pagination
   */
  pagination?: "show-more" | "pagination";
}

export interface CardConfig {
  
  /** 
   * @title Exibir SKU selector 
   * @default false
  */
  cardSkuShow?: boolean;
  
}

export interface Props {
  /** @title Integration */
  page: ProductListingPage | null;
  layout?: Layout;
  /** @description 0 for ?page=0 as your first page */
  startingPage?: 0 | 1;
  /** @hidden */
  partial?: "hideMore" | "hideLess";
  /** @title Card Config */
  cardConfig: CardConfig;
}
function NotFound() {
  return (
    <div class="w-full flex justify-center items-center py-10">
      <span>Not Found!</span>
    </div>
  );
}
const useUrlRebased = (overrides: string | undefined, base: string) => {
  let url: string | undefined = undefined;
  if (overrides) {
    const temp = new URL(overrides, base);
    const final = new URL(base);
    final.pathname = temp.pathname;
    for (const [key, value] of temp.searchParams.entries()) {
      final.searchParams.set(key, value);
    }
    url = final.href;
  }
  return url;
};
function PageResult(props: SectionProps<typeof loader>) {
  const { layout,cardConfig, startingPage = 0, url, partial } = props;
  const page = props.page!;
  const { products, pageInfo } = page;
  const perPage = pageInfo?.recordPerPage || products.length;
  const zeroIndexedOffsetPage = pageInfo.currentPage - startingPage;
  const offset = zeroIndexedOffsetPage * perPage;
  const nextPageUrl = useUrlRebased(pageInfo.nextPage, url);
  const prevPageUrl = useUrlRebased(pageInfo.previousPage, url);
  const partialPrev = useSection({
    href: prevPageUrl,
    props: { partial: "hideMore" },
  });
  const partialNext = useSection({
    href: nextPageUrl,
    props: { partial: "hideLess" },
  });
  const infinite = layout?.pagination !== "pagination";
  return (
    <div class="grid grid-flow-row grid-cols-1 place-items-center lg:px-[30px] lg:mt-[60px]">
      <div
        class={clx(
          "pb-2 sm:pb-10",
          (!prevPageUrl || partial === "hideLess") && "hidden",
        )}
      >
        <a
          rel="prev"
          class="btn btn-ghost"
          hx-swap="outerHTML show:parent:top"
          hx-get={partialPrev}
        >
          <span class="inline [.htmx-request_&]:hidden">
            Show Less
          </span>
          <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
        </a>
      </div>

      <div
        data-product-list
        class={clx(
          "grid items-center",
          "grid-cols-2 gap-2",
          "sm:grid-cols-4 sm:gap-0",
          "w-full",
        )}
      >
        {products?.map((product, index) => (
          <ProductCard
            cardConfig={cardConfig}
            key={`product-card-${product.productID}`}
            product={product}
            preload={index === 0}
            index={offset + index}
            class="h-full min-w-[160px] max-w-[100%] p-1 lg:p-3"
          />
        ))}
      </div>

      <div class={clx("pt-2 sm:pt-10 w-full", "")}>
        {infinite
          ? (
            <div class="flex justify-center [&_section]:contents">
              <a
                rel="next"
                class={clx(
                  "btn btn-ghost",
                  (!nextPageUrl || partial === "hideMore") && "hidden",
                )}
                hx-swap="outerHTML show:parent:top"
                hx-get={partialNext}
              >
                <span class="inline [.htmx-request_&]:hidden">
                  Show More
                </span>
                <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
              </a>
            </div>
          )
          : (
            <div class={clx("join", infinite && "hidden")}>
              <a
                rel="prev"
                aria-label="previous page link"
                href={prevPageUrl ?? "#"}
                disabled={!prevPageUrl}
                class="btn btn-ghost join-item"
              >
                <Icon id="chevron-right" class="rotate-180" />
              </a>
              <span class="btn btn-ghost join-item">
                Page {zeroIndexedOffsetPage + 1}
              </span>
              <a
                rel="next"
                aria-label="next page link"
                href={nextPageUrl ?? "#"}
                disabled={!nextPageUrl}
                class="btn btn-ghost join-item"
              >
                <Icon id="chevron-right" />
              </a>
            </div>
          )}
      </div>
    </div>
  );
}
const setPageQuerystring = (page: string, id: string) => {
  const element = document.getElementById(id)?.querySelector(
    "[data-product-list]",
  );
  if (!element) {
    return;
  }
  new IntersectionObserver((entries) => {
    const url = new URL(location.href);
    const prevPage = url.searchParams.get("page");
    for (let it = 0; it < entries.length; it++) {
      if (entries[it].isIntersecting) {
        url.searchParams.set("page", page);
      } else if (
        typeof history.state?.prevPage === "string" &&
        history.state?.prevPage !== page
      ) {
        url.searchParams.set("page", history.state.prevPage);
      }
    }
    history.replaceState({ prevPage }, "", url.href);
  }).observe(element);
};
function Result(props: SectionProps<typeof loader>) {
  const container = useId();
  const controls = useId();
  const device = useDevice();
  const { startingPage = 0, url, partial } = props;
  const page = props.page!;
  const { products, filters, breadcrumb, pageInfo, sortOptions } = page;
  const perPage = pageInfo?.recordPerPage || products.length;
  const zeroIndexedOffsetPage = pageInfo.currentPage - startingPage;
  const offset = zeroIndexedOffsetPage * perPage;
  const viewItemListEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item_list",
      params: {
        // TODO: get category name from search or cms setting
        item_list_name: breadcrumb.itemListElement?.at(-1)?.name,
        item_list_id: breadcrumb.itemListElement?.at(-1)?.item,
        items: page.products?.map((product, index) =>
          mapProductToAnalyticsItem({
            ...(useOffer(product.offers)),
            index: offset + index,
            product,
            breadcrumbList: page.breadcrumb,
          })
        ),
      },
    },
  });
  const results = (
    <span class="text-[10px]/[12px] font-normal">
      {page.pageInfo.recordPerPage} of {page.pageInfo.records} results
    </span> 
  );
  const sortBy = sortOptions.length > 0 && (
    <Sort sortOptions={sortOptions} url={url} />
  );
  return (
    <>
    <script dangerouslySetInnerHTML={{ __html: useScript((e)=>console.log(e), props) }} />
      <div id={container} {...viewItemListEvent} class="w-full">
        {partial
          ? <PageResult {...props} />
          : (
            <div class="w-full flex flex-col gap-4 sm:gap-5 w-full py-4 sm:py-5 px-1 lg:px-5 sm:px-0">
              <div class="flex flex-col lg:flex-row justify-between items-center px-5 gap-8 lg:gap-0 pt-3 lg:pt-0">
                <div class="flex items-center w-full lg:w-[35%] justify-center lg:justify-start px-2">
                  <Breadcrumb itemListElement={breadcrumb?.itemListElement} />
                </div>
                <p class="text-base font-semibold text-black w-full lg:w-[30%] text-center">{breadcrumb?.itemListElement?.[0]?.name}</p>
                <p class="text-[10px]/[12px] font-medium text-[#d0cbc7] w-full lg:w-[35%] text-center lg:text-right">{results}</p>
              </div>

              {device === "mobile" && (
                <Drawer
                  id={controls}
                  aside={
                    <div class="bg-base-100 flex flex-col h-full divide-y overflow-y-hidden">
                      <div class="flex justify-between items-center">
                        <h1 class="px-4 py-3">
                          <span class="font-medium text-2xl">Filters</span>
                        </h1>
                        <label class="btn btn-ghost" for={controls}>
                          <Icon id="close" />
                        </label>
                      </div>
                      <div class="flex-grow overflow-auto">
                        <Filters filters={filters} />
                      </div>
                    </div>
                  }
                  class="flex"
                >
                  <div class="flex sm:hidden justify-between items-end w-full gap-2 mt-[12px]">
                    <label class="btn btn-ghost w-full bg-[#433d3f] text-white max-w-[50%] rounded-none max-h-[40px] min-h-[40px]" for={controls}>
                      filtrar
                    </label>
                    <div class="flex flex-col w-full max-w-[50%] border border-[#433d3f] max-h-[40px]">
                      {sortBy}
                    </div>

                    
                  </div>
                </Drawer>
              )}

              <div class="flex flex-col gap-9 w-full lg:px-[30px]">
                {device === "desktop" && (
                  <>
                    <aside class="flex border-y border-[#c3c3c34d] gap-9 w-full justify-between items-start lg:mt-11">
                      <Filters filters={filters} />
                      <div class="flex justify-between items-center">
                          {sortBy}
                      </div>
                    </aside>
                    <aside class="flex gap-9 w-full justify-center items-start mt-7">
                      <FilterSelectedValues filters={filters} />
                    </aside>
                  </>
                )}

                <div class="flex flex-col gap-9">
                  <PageResult {...props} />
                </div>
              </div>
            </div>
          )}
      </div>

      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(
            setPageQuerystring,
            `${pageInfo.currentPage}`,
            container,
          ),
        }}
      />
    </>
  );
}
function SearchResult({ page, ...props }: SectionProps<typeof loader>) {
  if (!page) {
    return <NotFound />;
  }
  return <Result {...props} page={page} />;
}
export const loader = (props: Props, req: Request) => {
  return {
    ...props,
    url: req.url,
  };
};
export default SearchResult;
