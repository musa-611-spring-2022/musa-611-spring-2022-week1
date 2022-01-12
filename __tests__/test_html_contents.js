/* global describe, beforeAll, it, page, expect */

const fs = require('fs');
const path = require('path');

const introductionsDir = path.join(__dirname, '../introductions');
const htmlFileNames = fs.readdirSync(introductionsDir).filter((fileName) => (
  (fileName.slice(-5) === '.html')
    && (fileName !== 'index.html')
    && (fileName !== '_start.html')
));

if (htmlFileNames.length === 0) {
  describe('This test suite', () => {
    it('is waiting for a new HTML file', () => {
      expect(true);
    });
  });
}

htmlFileNames.forEach((fileName) => {
  describe(`Introduction document ${fileName}`, () => {
    beforeAll(async () => {
      await page.goto(`http://localhost:8000/introductions/${fileName}`);
    });

    it('should not be titled with "YOUR NAME HERE"', async () => {
      await expect(page.title()).resolves.not.toMatch(/YOUR NAME HERE/i);
    });

    it('should have an h1 with a name inside', async () => {
      const nameH1 = await page.$('#identity > h1');
      expect(nameH1).not.toBeNull();

      const name = await nameH1.evaluate((node) => node.textContent);
      expect(name).toBeTruthy();
    });

    function describeProfileLink(className, urlPrefix) {
      describe(`${className} link`, () => {
        it('element should exist', async () => {
          const link = await page.$(`.profiles .${className} a`);
          expect(link).not.toBeNull();
        });

        it('should have an appropriate href URL', async () => {
          const link = await page.$(`.profiles .${className} a`);
          const href = link ? await link.evaluate((node) => node.href) : '';
          expect(href).toMatch(new RegExp(`${urlPrefix}.*`, 'i'));
        });

        it('should have some content inside', async () => {
          const link = await page.$(`.profiles .${className} a`);
          const username = link ? await link.evaluate((node) => node.textContent) : '';
          expect(username).toBeTruthy();
        });
      });
    }

    describeProfileLink('github-profile', 'https://www.github.com/');
    describeProfileLink('slack-profile', 'https://musa509611.slack.com/team/');

    function describeTechnologyImage(className, altMapping) {
      describe(`${className} image`, () => {
        it('element should exist', async () => {
          const image = await page.$(`.${className} img`);
          expect(image).not.toBeNull();
        });

        it('should have a valid src', async () => {
          const image = await page.$(`.${className} img`);

          // src should start with "images/" and end with ".png"
          const src = image ? await image.evaluate((node) => node.src) : '';
          expect(src).toMatch(/images\/.*\.png/);
        });

        it('should have an alt value that matches the src', async () => {
          const image = await page.$(`.${className} img`);
          const src = image ? await image.evaluate((node) => node.src) : '';
          const alt = image ? await image.evaluate((node) => node.alt) : '';
          expect(src).toContain(altMapping[alt]);
        });
      });
    }

    describeTechnologyImage('operating-system', {
      Windows: 'images/windows.png',
      MacOS: 'images/macos.png',
      Linux: 'images/linux.png',
      Android: 'images/android.png',
      iOS: 'images/ios.png',
      ChromeOS: 'images/chromeos.png',
    });
    describeTechnologyImage('web-browser', {
      'Google Chrome': 'images/chrome.png',
      'Apple Safari': 'images/safari.png',
      'Mozilla Firefox': 'images/firefox.png',
      'Microsoft Edge': 'images/edge.png',
      'Microsoft Exlorer': 'images/exlorer.png',
    });

    describe('interests-and-experiences section', () => {
      it('should have at least two paragraphs', async () => {
        const paragraphs = await page.$$('#interests-and-experiences p');
        expect(paragraphs.length).toBeGreaterThanOrEqual(2);
      });
    });
  });
});
