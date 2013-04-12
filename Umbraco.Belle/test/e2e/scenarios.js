'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('my app', function() {

  beforeEach(function() {
    browser().navigateTo('../../belle/index.html');
  });


  it('should automatically redirect to /content when location hash/fragment is empty', function() {
    expect(browser().location().url()).toBe("/content");
  });


  describe('content', function() {

    beforeEach(function() {
      browser().navigateTo('#/content');
    });


    it('should render dashboard when user navigates to /content', function() {
      expect(element('h1').text()).
        toMatch(/This is the dashboard for content/);  
    });

  });


  describe('contenteditor', function() {

    beforeEach(function() {
      browser().navigateTo('#/content/edit/1234');
    });

    it('should render content editor when user navigates to /content/edit/id', function() {
        expect(element('[ng-view] h1:first').text()).
          toMatch(/My content with id: 1234/);
    });

  });
});
