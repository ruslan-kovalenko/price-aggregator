import { ConfigService } from '@nestjs/config';
import { Product } from 'src/products/types/product/product';
import { launchBrowser } from './puppeteer.launcher';
import { ScraperEvaluateFn, WrapperArguments } from './types/wrapper.arguments';

export async function scrapperWrapper(
  configService: ConfigService,
  input: string,
  params: WrapperArguments,
  evaluateCallback: ScraperEvaluateFn,
): Promise<Product[]> {
  const browser = await launchBrowser(configService);

  try {
    const baseUrl = configService.get<string>(params.baseUrlName);
    const query = new URLSearchParams({
      [params.searchParam]: input,
    }).toString();
    const url = `${baseUrl}/${params.searchUrlPrefix}?${query}`;

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    );
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'uk-UA,uk;q=0.9',
    });

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    if (params.afterGoto) {
      await params.afterGoto(page);
    }

    await page.waitForSelector(params.waitForSelector, {
      timeout: 10000,
    });

    if (params.minCards) {
      const {
        selector,
        count,
        pollIntervalMs = 500,
        maxAttempts = 24,
      } = params.minCards;

      for (let i = 0; i < maxAttempts; i++) {
        const cardCount = await page.$$eval(selector, (els) => els.length);
        if (cardCount >= count) break;
        await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
      }
    }

    if (params.beforeEvaluate) {
      await params.beforeEvaluate(page);
    }

    const products = await page.evaluate(evaluateCallback, input, baseUrl);

    return products.filter((product): product is Product => Boolean(product));
  } catch (err) {
    console.error('scrapperWrapper error:', err);
    return [];
  } finally {
    await browser.close();
  }
}
