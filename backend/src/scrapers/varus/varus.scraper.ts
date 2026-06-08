import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ICategoryScraper } from '../category-scraper.interface';
import { Product } from 'src/products/types/product/product';
import { scrapperWrapper } from '../scrapper.wrapper';

@Injectable()
export class VarusScraper implements ICategoryScraper {
  constructor(private configService: ConfigService) {}

  async scrapeCategoryPage(input: string): Promise<Product[]> {
    return scrapperWrapper(
      this.configService,
      input,
      {
        baseUrlName: 'VARUS_URL',
        searchParam: 'q',
        searchUrlPrefix: 'search',
        waitForSelector: '.products__grid',
        minCards: {
          selector: '.sf-product-card',
          count: 5,
        },
      },
      (input, baseUrl) => {
        const items = Array.from(document.querySelectorAll('.sf-product-card'));

        return items.reduce<Product[]>((acc, item) => {
          if (acc.length >= 10) return acc;

          const titleEl = item.querySelector('.sf-product-card__title');
          if (
            !titleEl?.textContent?.toLowerCase().includes(input.toLowerCase())
          ) {
            return acc;
          }

          const specialEl = item.querySelector('.sf-price__special');
          const oldEl = item.querySelector('.sf-price__old');
          const regularEl = item.querySelector('.sf-price__regular');

          if (!specialEl || !oldEl || regularEl) return acc;

          const priceEl = specialEl.textContent
            ?.replace(/[₴грн]/g, '')
            .replace(/\s/g, '')
            .trim();
          const oldPriceEl = oldEl.textContent
            ?.replace(/[₴грн]/g, '')
            .replace(/\s/g, '')
            .trim();

          const saleText = item.querySelector('.sf-price__sale')?.textContent;
          const badgeText = item.querySelector(
            '.sf-product-card__badge_text',
          )?.textContent;
          const discountFromSale = saleText?.match(/(\d+)\s*%/)?.[1];
          const discountNumber =
            discountFromSale ||
            badgeText?.trim().split('\n')[0].replace('%', '').trim() ||
            null;

          const linkEl = item.querySelector('a');

          acc.push({
            name: titleEl.textContent.trim() || null,
            link: linkEl?.getAttribute('href')
              ? `${baseUrl}${linkEl.getAttribute('href')}`
              : null,
            discount: `-${discountNumber}`,
            price: parseFloat(priceEl) || null,
            oldPrice: parseFloat(oldPriceEl) || null,
          });

          return acc;
        }, []);
      },
    );
  }
}
