import { expectElementToHaveText } from '../../../src/raushan-playwright/utils/assert-utils';
import { getLocator } from '../../../src/raushan-playwright/utils/locator-utils';

const miniCartCount = () => getLocator(`//*[@id='shopping_cart_container']//span`);

export async function verifyMiniCartCount(expMiniCartCount: string) {
  await expectElementToHaveText(miniCartCount(), expMiniCartCount);
}
