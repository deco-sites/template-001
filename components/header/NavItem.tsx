import type { SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { useScript } from "@deco/deco/hooks";
import {
  HEADER_HEIGHT_DESKTOP,
  NAVBAR_HEIGHT_DESKTOP,
} from "../../constants.ts";

interface Props {
  item: SiteNavigationElement;
  class?: string;
}

function NavItem({ item, class: className = "" }: Props) {
  const { url, name, children } = item;
  const image = item?.image?.[0];

  return (
    <li class={`group flex items-center justify-center ${className}`}>
      <a
        href={url}
        class="cursor-pointer text-sm py-[16px] text-primary hover:text-secondary transition-colors duration-200 group-hover:font-bold"
      >
        {name}
      </a>
      

      {children && children.length > 0 && (
        <div class="submenu absolute lg:h-[70vh] overflow-y-auto overflow-x-hidden left-0 w-screen bg-base-100 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 border-t border-base-300">
          <div class="container py-8">
            <ul class="flex items-start justify-center">
              {children.map((child) => (
                <li key={child.name} class="px-[38px]">
                  <a href={child.url} class="text-sm font-normal italic text-[inherit] hover:text-secondary transition-colors duration-200 mb-[10px]">
                    {child.name}
                  </a>
                  {child.children && child.children.length > 0 && (
                    <ul class="">
                      {child.children.map((subChild) => (
                        <li key={subChild.name}>
                          <a href={subChild.url} class="relative text-[10px]/[12px] font-bold text-[inherit] hover:text-primary transition-colors duration-200">
                            {subChild.name} 
                            {subChild.additionalType && <span class="text-[6px]/[7.2px] font-light text-[inherit] absolute pl-[1px] left-[100%] top-[2px]">{subChild.additionalType}</span>}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
}

export default NavItem;
