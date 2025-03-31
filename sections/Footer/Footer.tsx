import { type ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import PoweredByDeco from "apps/website/components/PoweredByDeco.tsx";
import Section from "../../components/ui/Section.tsx";
import { useDevice } from "@deco/deco/hooks";
/** @titleBy title */
interface Item {
  title: string;
  href: string;
}

/** @titleBy title */
interface Link extends Item {
  children: Item[];
}

/** @titleBy alt */
interface Social {
  alt?: string;
  href?: string;
  image: ImageWidget;
}

interface Props {
  links?: Link[];
  social?: Social[];
  paymentMethods?: Social[];
  policies?: Item[];
  logo?: ImageWidget;
  trademark?: string;
}

function Footer({
  links = [],
  social = [],
  policies = [],
  paymentMethods = [],
  logo,
  trademark,
}: Props) {
  const device = useDevice();
  return (
    <footer
      class="px-5 sm:px-[60px] mt-5 sm:mt-10"
    >
      <div class="flex flex-col gap-5 sm:gap-10 py-10">
        <div class="flex gap-6">
          <div class="flex justify-between gap-4 w-full max-w-[1050px] mr-auto">
            {/* Links do Footer */}
            {device == "desktop" ? 
            links.map(({ title, href, children }) => (
              <div class="flex flex-col gap-4">
                <span class="text-sm font-semibold">{title}</span>
                <ul class="flex flex-col gap-2">
                  {children.map(({ title, href }) => (
                    <li>
                      <a class="text-xs text-[#737777] hover:underline" href={href}>
                        {title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )): links.map(({ title, href, children }) => (
              <div class="flex flex-col gap-4">
                {/* Mobile dropdawn */}
                <span class="text-sm font-semibold">{title}</span>
                <ul class="flex flex-col gap-2">
                  {children.map(({ title, href }) => (
                    <li>
                      <a class="text-xs text-[#737777] hover:underline" href={href}>
                        {title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div class="flex flex-col gap-4 w-full max-w-[464px]">
            <span class="text-sm font-semibold">Newsletter</span>
            <div class="flex items-center gap-2">
              <input
                type="email"
                placeholder="E-mail"
                class="flex-1 h-8 px-2 text-xs border-b border-[#C9CFCF] rounded-sm focus:outline-none bg-transparent"
              />
              <button class="h-8 px-4 text-xs text-black  rounded-sm hover:bg-opacity-80">
                →
              </button>
            </div>
          </div>
        </div>

        <div class="w-full flex justify-between items-center">
            <img src={logo} alt="Logo" class="w-full h-auto"/>
        </div>

        {/* <div class="flex flex-col sm:flex-row gap-12 justify-between items-start sm:items-center">
          <ul class="flex gap-4">
            {social.map(({ image, href, alt }) => (
              <li>
                <a href={href}>
                  <Image
                    src={image}
                    alt={alt}
                    loading="lazy"
                    width={24}
                    height={24}
                  />
                </a>
              </li>
            ))}
          </ul>
          <ul class="flex flex-wrap gap-2">
            {paymentMethods.map(({ image, alt }) => (
              <li class="h-8 w-10 border border-base-100 rounded flex justify-center items-center">
                <Image
                  src={image}
                  alt={alt}
                  width={20}
                  height={20}
                  loading="lazy"
                />
              </li>
            ))}
          </ul>
        </div> */}

        {/* <hr class="w-full text-base-400" /> */}

        {/* <div class="grid grid-flow-row sm:grid-flow-col gap-8">
          <ul class="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center">
            {policies.map(({ title, href }) => (
              <li>
                <a class="text-xs font-medium" href={href}>
                  {title}
                </a>
              </li>
            ))}
          </ul>

          {/* {/* <div class="flex flex-nowrap items-center justify-between sm:justify-center gap-4">
            <div>
              <img loading="lazy" src={logo} />
            </div>
            <span class="text-xs font-normal text-base-400">{trademark}</span>
          </div>

          <div class="flex flex-nowrap items-center justify-center gap-4">
            <span class="text-sm font-normal text-base-400">Powered by</span>
            <PoweredByDeco />
          </div> 
        </div>  */}
      </div>
    </footer>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="1145px" />;

export default Footer;
