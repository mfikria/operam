// require('apickli-gherkin')
const {client} = require('nightwatch-cucumber');
const {defineSupportCode} = require('cucumber');

defineSupportCode(({Given, Then, When, After, Before}) => {
    After(function (scenario) {
        return client.end();
    });

    Before(function (scenario) {
        return client.init();
    });

    Given(/^user is in home page$/, function () {
        client.assert.containsText('body', 'Welcome to our store')
    });

    When(/^he goes to information link "([^"]*)"$/, function (link) {
    });

    Then(/^he should see the heading "([^"]*)"$/, function (arg1) {
    });
});