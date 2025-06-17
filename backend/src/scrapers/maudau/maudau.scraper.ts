import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ICategoryScraper } from 'src/scrapers/category-scraper.interface';

@Injectable()
export class MaudauScraper implements ICategoryScraper {
  constructor(private configService: ConfigService) {}

  async scrapeCategoryPage(page: number = 1, input: string) {
    const baseUrl = this.configService.get<string>('MAUDAU_URL');
    const CATEGORY_PATH = 'pyvo';

    const url = `${baseUrl}${CATEGORY_PATH}/page=${page}`;
    // const query = new URLSearchParams({ text: 'jack daniels' }).toString();
    // const url = `${baseUrl}/search?${query}`;

    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const products = [];

    $('ul[data-testid="products"] > li').each((_, element) => {
      const name = $(element).find('a').attr('href') || 'no-name';
      const fullLink = name.startsWith('http') ? name : `${baseUrl}${name}`;

      const discount = $(element)
        .find('[data-testid="productDiscount"]')
        .text();

      if (!discount) return;

      const oldPrice = $(element)
        .find('[data-testid="productFullPrice"]')
        .text()
        .replace('₴', '')
        .replace(/\s/g, '')
        .trim();

      const price = $(element)
        .find('[data-testid="finalPrice"]')
        .text()
        .replace(/\s|&nbsp;/g, '')
        .replace(',', '.');

      const productName = $(element).find('[data-testid="productName"]').text();

      products.push({
        name: productName,
        link: fullLink,
        oldPrice: parseFloat(oldPrice),
        price: parseFloat(price),
        discount,
      });
    });

    return products;
  }
}
