import { existsSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import puppeteer, { Browser } from 'puppeteer';

const MAC_CHROME =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export async function launchBrowser(
  configService: ConfigService,
): Promise<Browser> {
  const options: Parameters<typeof puppeteer.launch>[0] = { headless: true };

  const executablePath = configService.get<string>('PUPPETEER_EXECUTABLE_PATH');

  if (executablePath) {
    options.executablePath = executablePath;
  } else if (process.platform === 'darwin' && existsSync(MAC_CHROME)) {
    options.executablePath = MAC_CHROME;
  }

  return puppeteer.launch(options);
}
