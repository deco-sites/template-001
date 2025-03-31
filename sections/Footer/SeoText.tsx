import { type ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import PoweredByDeco from "apps/website/components/PoweredByDeco.tsx";
import Section from "../../components/ui/Section.tsx";

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
  firstSection?: {
    title: string;
    /**
     * @title Text
     * @description Text to display in the first section
     * @format html
     * **/
    text: string;
  }
  secondSection?: {
    /**
     * @title Text 1
     * @description Text to display in the first section
     * @format html
     * **/
    text: string;
    /**
     * @title Text 2
     * @description Text to display in the first section
     * @format html
     * **/
    text2: string;
  }
  faqSection?: {
    title: string;
    questions: {
      question: string;
      /**
       * @title Answer
       * @description Answer text with HTML support
       * @format html
       * **/
      answer: string;
    }[];
  }
  social?: Social[];
  paymentMethods?: Social[];
  policies?: Item[];
  logo?: ImageWidget;
  trademark?: string;
}

function SeoText({
  firstSection,
  secondSection,
  faqSection,
}: Props) {

  return (
    <div
      class="px-5 sm:px-0 mt-5 sm:mt-10"
    >
      <div class="w-full flex flex-col gap-5 sm:gap-10 py-10 px-5">
        <div class="flex flex-col gap-5 sm:gap-10">

          <div class="flex flex-col gap-2 max-w-[660px] mx-auto">
            <h2 class="text-[20px] font-normal  mt-1-[04347826em] mb-1-[04347826em] text-center">{firstSection?.title}</h2>
            <div class="text-xs font-normal leading-[22.4px] text-center">
              <p class="text-xs font-normal leading-[22.4px] text-center" dangerouslySetInnerHTML={{ __html: firstSection?.text }} />
            </div>
          </div>

          <div class="flex flex-col lg:flex-row gap-10">
            <div class="flex flex-col mx-auto text-[12px] [&>h3]:text-[14px] [&>h3]:font-bold [&>p]:[margin:12px_0_35px]">
              <p dangerouslySetInnerHTML={{ __html: secondSection?.text }} />
            </div>
            <div class="flex flex-col mx-auto text-[12px] [&>h3]:text-[14px] [&>h3]:font-bold [&>p]:[margin:12px_0_35px]">
              <p dangerouslySetInnerHTML={{ __html: secondSection?.text2 }} />
            </div>
          </div>

          {/* FAQ */}
          <div class="flex flex-col gap-2 w-full mx-auto">
            <h2 class="text-center mb-8 text-xl">{faqSection?.title ?? "faq"}</h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {faqSection?.questions.map((item) => (
                <div class="flex flex-col gap-4">
                  <h3 class="text-sm font-bold">{item.question}</h3>
                  <div 
                    class="text-xs text-[#716D6E]"
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="1145px" />;

export default SeoText;
