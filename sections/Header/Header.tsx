import { h } from "preact";
import type { ComponentChildren } from "preact";
import type { HTMLWidget, ImageWidget } from "apps/admin/widgets.ts";
import type { SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import Alert from "../../components/header/Alert.tsx";
import Bag from "../../components/header/Bag.tsx";
import Menu from "../../components/header/Menu.tsx";
import NavItem from "../../components/header/NavItem.tsx";
import Searchbar, {
  type SearchbarProps,
} from "../../components/search/Searchbar/Form.tsx";
import Drawer from "../../components/ui/Drawer.tsx";
import Icon from "../../components/ui/Icon.tsx";
import SearchModal from "../../components/ui/SearchModal.tsx";
import {
  HEADER_HEIGHT_DESKTOP,
  HEADER_HEIGHT_MOBILE,
  NAVBAR_HEIGHT_MOBILE,
  SEARCHBAR_DRAWER_ID,
  SEARCHBAR_POPUP_ID,
  SIDEMENU_CONTAINER_ID,
  SIDEMENU_DRAWER_ID,
} from "../../constants.ts";
import { useDevice } from "@deco/deco/hooks";
import { type LoadingFallbackProps } from "@deco/deco";

interface DrawerAsideProps {
  title: string;
  drawer: string;
  children: ComponentChildren;
}

export interface Logo {
  src: ImageWidget;
  alt: string;
  width?: number;
  height?: number;
}
export interface SectionProps {
  alerts?: HTMLWidget[];
  /**
   * @title Navigation items
   * @description Navigation items used both on mobile and desktop menus
   */
  navItems?: SiteNavigationElement[] | null;
  /**
   * @title Searchbar
   * @description Searchbar configuration
   */
  searchbar: SearchbarProps;
  /** @title Logo */
  logo: Logo;
  /**
   * @description Usefull for lazy loading hidden elements, like hamburguer menus etc
   * @hide true */
  loading?: "eager" | "lazy";
}
type Props = Omit<SectionProps, "alert">;
const Desktop = ({ navItems, logo, searchbar, loading }: Props) => (
  <>
    <SearchModal id={SEARCHBAR_POPUP_ID}>
      <div 
        class="absolute top-0 left-0 w-full bg-base-100 transform transition-transform duration-300"
      >
        {loading === "lazy" ? (
          <div class="flex justify-center items-center p-8">
            <span class="loading loading-spinner text-primary" />
          </div>
        ) : (
          <div class="container py-8">
            <Searchbar {...searchbar} />
          </div>
        )}
      </div>
    </SearchModal>

    <div class="flex flex-col w-full bg-base-100">
      <div class="w-full">
        <div class="flex items-center justify-between relative">
          {/* Left side - Navigation */}
          <div className="flex-1">
            <ul className="flex items-center gap-8 px-10">
              {navItems?.slice(0, 5).map((item) => <NavItem key={item.name} item={item} />)}
            </ul>
          </div>

          {/* Center - Logo */}
          <div class="flex-1 flex justify-center">
            <a href="/" aria-label="Store logo" class="inline-block lg:ml-[71px]">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width || 100}
                height={logo.height || 23}
              />
            </a>
          </div>

          {/* Right side - CTAs */}
          <div class="flex-1 flex items-center justify-end gap-8 px-8">
            <label
              for={SEARCHBAR_POPUP_ID}
              class="text-primary hover:text-secondary cursor-pointer text-sm"
              aria-label="search icon button"
            >
              {/* <Icon id="search" size={24} /> */}
              Buscar
            </label>
            <a href="/sacola" class="text-primary  cursor-pointer text-sm">Conta</a>
            <a href="/account" class="text-primary  cursor-pointer text-sm">Favoritos</a>
            <Bag />
          </div>
        </div>
      </div>
    </div>
  </>
);
const Mobile = ({ logo, searchbar, navItems, loading }: Props) => (
  <>
    <Drawer
      id={SEARCHBAR_DRAWER_ID}
      aside={
        <Drawer.Aside title="Search" drawer={SEARCHBAR_DRAWER_ID}>
          <div class="w-screen overflow-y-auto">
            {loading === "lazy"
              ? (
                <div class="h-full w-full flex items-center justify-center">
                  <span class="loading loading-spinner" />
                </div>
              )
              : <Searchbar {...searchbar} />}
          </div>
        </Drawer.Aside>
      }
    />
    <Drawer
      id={SIDEMENU_DRAWER_ID}
      aside={
        <Drawer.Aside title="Menu" drawer={SIDEMENU_DRAWER_ID}>
          {loading === "lazy"
            ? (
              <div
                id={SIDEMENU_CONTAINER_ID}
                class="h-full flex items-center justify-center"
                style={{ minWidth: "100vw" }}
              >
                <span class="loading loading-spinner" />
              </div>
            )
            : <Menu navItems={navItems ?? []} />}
        </Drawer.Aside>
      }
    />

    <div
      class="grid place-items-center w-screen px-3 lg:px-5 gap-1"
      style={{
        height: NAVBAR_HEIGHT_MOBILE,
        gridTemplateColumns:
          "min-content auto min-content min-content min-content",
      }}
    >
      <label
        for={SIDEMENU_DRAWER_ID}
        class="btn btn-square btn-sm btn-ghost flex flex-col gap-1 justify-center items-center pb-2"
        aria-label="open menu"
      >
        {/* <Icon id="menu" /> */}
        <div class="w-[32px] h-[1px] bg-primary mb-1"></div>
        <div class="w-[32px] h-[1px] bg-primary"></div>
      </label>

      {logo && (
        <a
          href="/"
          class="flex-grow inline-flex items-center justify-center max-w-[100px] h-auto ml-4"
          style={{ minHeight: NAVBAR_HEIGHT_MOBILE }}
          aria-label="Store logo"
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width || 100}
            height={logo.height || 13}
          />
        </a>
      )}

      <label
        for={SEARCHBAR_DRAWER_ID}
        class="btn btn-square btn-sm btn-ghost"
        aria-label="search icon button"
      >
        <Icon id="search" />
      </label>
      <Bag />
    </div>
  </>
);
function Header({
  alerts = [],
  logo = {
    src:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/2291/986b61d4-3847-4867-93c8-b550cb459cc7",
    width: 100,
    height: 16,
    alt: "Logo",
  },
  ...props
}: Props) {
  const device = useDevice();
  return (
    <header
    class="relative"
      style={{
        height: device === "desktop"
          ? HEADER_HEIGHT_DESKTOP
          : HEADER_HEIGHT_MOBILE,
      }}
    >
      <div class="bg-base-100 fixed w-full z-40">
        {alerts.length > 0 && <Alert alerts={alerts} />}
        {device === "desktop"
          ? <Desktop logo={logo} {...props} />
          : <Mobile logo={logo} {...props} />}
      </div>
    </header>
  );
}
export const LoadingFallback = (props: LoadingFallbackProps<Props>) => (
  // deno-lint-ignore no-explicit-any
  <Header {...props as any} loading="lazy" />
);
export default Header;

