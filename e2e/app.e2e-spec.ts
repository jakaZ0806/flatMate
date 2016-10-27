import { FlatMatePage } from './app.po';

describe('flat-mate App', function() {
  let page: FlatMatePage;

  beforeEach(() => {
    page = new FlatMatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
