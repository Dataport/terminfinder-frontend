import {expect, test} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('simple-walkthrough', async ({page}) => {
  await page.goto('http://localhost:4200');
  await page.getByTestId('headline').isVisible()

  const accessibilityScanResults = await new AxeBuilder({page})
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(accessibilityScanResults.violations).toEqual([]);

  await page.getByPlaceholder('Titel der Umfrage').click();
  await page.getByPlaceholder('Titel der Umfrage').fill('Umfrage-Titel');
  await page.getByTestId('tosCheckbox').click();
  await page.getByRole('button', {name: 'Umfrage erstellen Umfrage'}).click();
  await page.getByPlaceholder('Name').click();
  await page.getByPlaceholder('Name').fill('Umfrage-Name');
  await page.getByPlaceholder('Ort').click();
  await page.getByPlaceholder('Ort').fill('Umfrage-Ort');
  await page.getByPlaceholder('Beschreibung').click();
  await page.getByPlaceholder('Beschreibung').fill('Umfrage-Beschreibung');
  await page.getByRole('button', {name: 'Weiter zur Terminauswahl'}).click();
  await page.getByRole('img', {name: 'calendar'}).click();
  await page.getByText('19').click();
  await page.getByRole('button', {name: 'Weiter', exact: true}).click();
  await page.getByRole('button', {name: 'Weiter'}).click();
  await page.getByRole('button', {name: 'Umfrage starten'}).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', {name: 'öffnen create'}).first().click({
    modifiers: ['Meta']
  });
  const page1 = await page1Promise;
  await page1.getByTitle('Teilnehmer:in hinzufügen').click();
  await page1.getByPlaceholder('Name der TeilnehmerIn').click();
  await page1.getByPlaceholder('Name der TeilnehmerIn').fill('Test-Teilnehmer-1');
  await page1.locator('#desktop-voting-status-accepted-0').check();
  await page1.locator('app-tos label').nth(1).click();
  await page1.getByRole('button', {name: 'Abschicken'}).click();
  await page1.getByTitle('Teilnehmer:in hinzufügen').click();
  await page1.getByPlaceholder('Name der TeilnehmerIn').click();
  await page1.getByPlaceholder('Name der TeilnehmerIn').fill('Test-Teilnehmer-2');
  await page1.getByRole('button', {name: 'Ich kann nicht teilnehmen'}).click();
});
