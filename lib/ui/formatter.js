'use strict';

import { isEmpty, isString } from '../utils.js';

// Colors and emphasis
const off = '\x1b[0m';
const bold = '\x1b[1m';
const grey = '\x1b[30m';
const red = '\x1b[31m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';

const consoleWidth = 80;

export class Formatter {
  constructor(console, i18n) {
    this._console = console;
    this._i18n = i18n;
    this._timerName = this._translated('total_time');
  }

  start() {
    this._console.time(this._timerName);
  }

  end() {
    this._console.timeEnd(this._timerName);
  }

  displayInitialInformation(configuration, paths) {
    this._filter = configuration.filterRaw();
    this._displaySeparator();
    this._displayConfigurationSummary(paths, configuration);
    this._displaySeparator();
  }

  displayRunnerEnd(runner) {
    this._displayErrorsAndFailuresSummary(runner);
    this._displayGeneralSummary(runner);
  }

  // displaying suites

  displaySuiteStart(suite) {
    this._console.log(`\n${suite.name()}:`);
    this._displaySeparator('-');
  }

  displaySuiteEnd(suite) {
    this._displaySeparator('-');
    this._console.log(`${this._translated('summary_of')} ${suite.name()}:`);
    this._displayCountFor(suite);
    this._displaySeparator();
  }

  // displaying test results

  displayPendingResult(test) {
    this._displayResult(this._translated('wip'), test, yellow);
    if (test.isExplicitlyMarkedPending()) {
      this._displayResultDetail(test.result().reason());
    }
  }

  displaySkippedResult(test) {
    this._displayResult(this._translated('skip'), test, grey);
  }

  displaySuccessResult(test) {
    this._displayResult(this._translated('ok'), test, green);
  }

  displayFailureResult(test, failType) {
    this._displayResult(this._translated(failType), test, red);
    this._displayResultDetail(test.result().failureMessage());
    this._displayResultDetail(test.result().location());
  }

  // displaying other messages

  displayError(message) {
    this._console.log(`${this._withColor(this._potentiallyInternationalized(message), red)}`);
  }

  _displayConfigurationSummary(paths, configuration) {
    const testPathsLabel = this._translated('running_tests_in');
    const failFastLabel = this._translated('fail_fast');
    const randomOrderLabel = this._translated('random_order');
    this._console.log(this._inBold(this._translated('starting_testy')));
    const padding = Math.max(testPathsLabel.length, failFastLabel.length, randomOrderLabel.length);
    this._console.log(`${testPathsLabel.padEnd(padding)} : ${paths}`);
    this._console.log(`${failFastLabel.padEnd(padding)} : ${this._humanBoolean(configuration.failFastMode().enabled())}`);
    this._console.log(`${randomOrderLabel.padEnd(padding)} : ${this._humanBoolean(configuration.randomOrder())}`);
  }

  _displayResult(result, test, color) {
    this._console.log(`[${color}${this._inBold(result)}] ${this._withColor(test.name(), color)}`);
  }

  _displayResultDetail(detail) {
    if (!isEmpty(detail)) {
      this._console.log(`  => ${this._potentiallyInternationalized(detail)}`);
    }
  }

  _potentiallyInternationalized(text) {
    return isString(text) ? text : text.expressedIn(this._i18n);
  }

  _displayErrorsAndFailuresSummary(runner) {
    if (runner.hasErrorsOrFailures()) {
      this._console.log(`\n${this._translated('failures_summary')}`);
      runner.allFailuresAndErrors().forEach(test => {
        const failType = test.isFailure() ? 'fail' : 'error';
        this.displayFailureResult(test, failType);
      });
      this._displaySeparator();
    }
  }

  _displayGeneralSummary(runner) {
    this._console.log(`\n${this._translated('total')}`);
    this._displayCountFor(runner);
    this._displaySeparator();
  }

  _displayCountFor(runner) {
    const passedCount = this._displayIfNonZero(runner.successCount(), this._translated('passed'), green);
    const failureCount = this._displayIfNonZero(runner.failuresCount(), this._translated('failed'), red);
    const errorCount = this._displayIfNonZero(runner.errorsCount(), this._translated('errors'), red);
    const pendingCount = this._displayIfNonZero(runner.pendingCount(), this._translated('pending'), yellow);
    const skippedCount = this._displayIfNonZero(runner.skippedCount(), this._translated('skipped'), yellow);
    this._console.log(`${runner.totalCount()} test(s)${passedCount}${failureCount}${errorCount}${pendingCount}${skippedCount}`);
    if (runner.totalCount() === 0) {
      this._console.log(this._withColor(`\nWarning: Make sure your files matches the ${this._filter} naming filter.`, yellow));
    }
  }

  _displayIfNonZero(quantity, word, color = off) {
    const pluralizedWord = `${quantity} ${word}`;
    return quantity > 0 ? `, ${this._withColor(pluralizedWord, color)}` : '';
  }

  _displaySeparator(character = '=') {
    this._console.log(character.repeat(consoleWidth));
  }

  _inBold(text) {
    return `${bold}${text}${off}`;
  }

  _withColor(text, color) {
    return `${color}${text}${off}`;
  }

  _humanBoolean(boolean) {
    return boolean === true ? this._translated('yes') : this._translated('no');
  }

  _translated(key) {
    return this._i18n.translate(key);
  }
}
