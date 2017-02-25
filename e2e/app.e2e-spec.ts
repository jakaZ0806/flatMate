import { TestNewDepsPage } from './app.po';

describe('test-new-deps App', () => {
  let page: TestNewDepsPage;

  beforeEach(() => {
    page = new TestNewDepsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
