import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ICategoryScraper } from '../category-scraper.interface';

@Injectable()
export class SilpoScraper implements ICategoryScraper {
  constructor(private configService: ConfigService) {}

  async scrapeCategoryPage(page: number = 1, input: string) {
    const baseUrl = this.configService.get<string>('SILPO_URL');
    const CATEGORY_PATH = 'pyvo-4503';

    const url = `${baseUrl}${CATEGORY_PATH}?page=${page}`;

    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const products = [];

    $('silpo-products-list-item').each((_, element) => {
      const name = $(element).find('a').attr('href') || 'no-name';
      const fullLink = name.startsWith('http') ? name : `${baseUrl}${name}`;

      const discount = $(element).find('.product-card-price__sale').text();

      if (!discount) return;

      const oldPrice = $(element)
        .find('.product-card-price__displayOldPrice')
        .text()
        .replace('грн', '')
        .replace(/\s/g, '')
        .trim();

      const price = $(element)
        .find('.product-card-price__displayPrice')
        .text()
        .replace(/\s|&nbsp;/g, '')
        .replace(',', '.');

      const productName = $(element).find('.product-card__title').text();

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
