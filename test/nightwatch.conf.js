const seleniumServer = require('selenium-server');
const phantomjs = require('phantomjs-prebuilt');
const chromeDriver = require('chromedriver');
const geckoDriver = require('geckodriver');

require('nightwatch-cucumber')({
    cucumberArgs: [
        '--require',
        'timeout.js',
        '--require',
        'features/step_definitions',
        '--format',
        'pretty',
        '--format',
        'json:reports/cucumber.json',
        'features'
    ]
});

module.exports = {
    output_folder: "reports",
    custom_assertion_path: '',
    live_output: false,
    disable_colors: false,
    selenium: {
        start_process: true,
        server_path: seleniumServer.path,
        log_path: '',
        host: '127.0.0.1',
        port: 5555
    },
    // test_workers: {
    //     enabled: true,
    //     workers: "auto"
    // },
    test_settings: {
        end_session_on_fail: false,
        skip_testcases_on_fail: false,

        default: {
            launch_url: 'https://demo.nopcommerce.com',
            selenium_port: 32768,
            selenium_host: '192.168.99.100',
            end_session_on_fail: false,
            skip_testcases_on_fail: false,
            // username: 'sangajala55',
            // access_key: 'c8ea41db-344a-4f82-9eef-4e5ee2ece7fc',
            screenshots: {
                enabled: true,
                on_failure: true,
                on_error: true,
                path: 'reports/screenshots'
            },
            desiredCapabilities: {
                browserName: 'phantomjs',
                javascriptEnabled: true,
                acceptSslCerts: true,
                'phantomjs.binary.path': phantomjs.path
            }
        },
        chrome: {
            screenshots: {
                enabled: false,
                on_failure: true,
                on_error: true,
                path: 'reports/screenshots'
            },
            desiredCapabilities: {
                browserName: 'chrome',
                javascriptEnabled: true,
                acceptSslCerts: true
            },
            selenium: {
                cli_args: {
                    'webdriver.chrome.driver': chromeDriver.path
                }
            }
        },
        firefox: {
            screenshots: {
                enabled: false,
                on_failure: true,
                on_error: true,
                path: 'reports/screenshots'
            },
            desiredCapabilities: {
                browserName: 'firefox',
                javascriptEnabled: true,
                acceptSslCerts: true
            },
            selenium: {
                cli_args: {
                    'webdriver.gecko.driver': geckoDriver.path
                }
            }
        }
    }
};