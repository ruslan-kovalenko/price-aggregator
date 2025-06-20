import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ICategoryScraper } from 'src/scrapers/category-scraper.interface';

@Injectable()
export class MaudauScraper implements ICategoryScraper {
  constructor(private configService: ConfigService) {}

  async scrapeCategoryPage(input: string) {
    const baseUrl = this.configService.get<string>('MAUDAU_URL');
    const query = new URLSearchParams({ text: input }).toString();
    const url = `${baseUrl}/search?${query}`;

    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const products = $('ul[data-testid="products"] > li')
      .toArray()
      .reduce((acc, element) => {
        if (acc.length >= 10) return acc;

        const name = $(element).find('a').attr('href') || 'no-name';
        const fullLink = name.startsWith('http') ? name : `${baseUrl}${name}`;

        const discount = $(element)
          .find('[data-testid="productDiscount"]')
          .text();
        if (!discount) return acc;

        const productName = $(element)
          .find('[data-testid="productName"]')
          .text();
        if (!productName.toLowerCase().includes(input.toLowerCase()))
          return acc;

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

        acc.push({
          name: productName,
          link: fullLink,
          oldPrice: parseFloat(oldPrice),
          price: parseFloat(price),
          discount,
        });

        return acc;
      }, []);

    return products.filter((product) => product);
  }
}
