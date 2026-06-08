import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ICategoryScraper } from '../category-scraper.interface';
import { Product } from 'src/products/types/product/product';
import { scrapperWrapper } from '../scrapper.wrapper';

@Injectable()
export class SilpoScraper implements ICategoryScraper {
  constructor(private configService: ConfigService) {}

  async scrapeCategoryPage(input: string): Promise<Product[]> {
    return scrapperWrapper(
      this.configService,
      input,
      {
        baseUrlName: 'SILPO_URL',
        searchParam: 'find',
        searchUrlPrefix: 'search',
        waitForSelector: 'shop-silpo-common-product-card',
      },
      (input, baseUrl) => {
        const items = Array.from(
          document.querySelectorAll('shop-silpo-common-product-card'),
        );

        return items.reduce<Product[]>((acc, item) => {
          if (acc.length >= 10) return acc;

          const discount = item.querySelector('.product-card-price__sale');
          if (!discount) return acc;

          const titleEl = item.querySelector('.product-card__title');
          if (
            !titleEl ||
            !titleEl.textContent.toLowerCase().includes(input.toLowerCase())
          ) {
            return acc;
          }

          const discountNumber = discount.textContent
            ?.trim()
            .split('\n')[0]
            .replace('%', '')
            .trim()
            .replace(' ', '');
          const volume = item.querySelector(
            '.ft-flex.ft-justify-between .ft-typo-14-semibold',
          );

          const linkEl = item.querySelector('a');
          const priceEl = item
            .querySelector('.product-card-price__displayPrice')
            ?.textContent?.replace('грн', '')
            .replace(/\s/g, '')
            .trim();
          const oldPriceEl = item
            .querySelector('.product-card-price__displayOldPrice')
            ?.textContent?.replace('грн', '')
            .replace(/\s/g, '')
            .trim();

          acc.push({
            name:
              `${titleEl?.textContent?.trim()} ${volume ? volume.textContent?.trim() : ''}` ||
              null,
            price: parseFloat(priceEl) || null,
            oldPrice: parseFloat(oldPriceEl) || null,
            link: linkEl?.getAttribute('href')
              ? `${baseUrl}${linkEl.getAttribute('href')}`
              : null,
            discount: discountNumber,
          });

          return acc;
        }, []);
      },
    );
  }
}
