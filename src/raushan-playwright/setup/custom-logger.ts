/**
 * custom-logger.ts: This module provides a custom logger for Playwright tests. It implements the Reporter interface from Playwright
 * and uses the Winston logging library to provide detailed logs for test execution. The logger includes custom colors
 * for different log levels and can be configured to log to the console or a file.
 */

// import { Reporter, TestCase, TestError, TestResult } from '@playwright/test/reporter';
// import winston from 'winston';

// /**
//  * Custom colors for the logger
//  */
// const customColors = {
//   info: 'blue',
//   error: 'red',
// };
// winston.addColors(customColors);

// /**
//  * Logger configuration
//  */
// export const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.combine(
//     winston.format.colorize({ all: true }),
//     winston.format.timestamp(),
//     winston.format.printf(({ timestamp, level, message }) => {
//       return `${timestamp} [${level}]: ${message}`;
//     }),
//   ),
//   transports: [
//     new winston.transports.Console(),
//     // If you want to log to a file uncomment below line
//     // new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
//   ],
// });

// /**
//  * CustomLogger class that implements the Reporter interface from Playwright
//  */
// export default class CustomLogger implements Reporter {
//   /**
//    * Logs the start of a test case
//    * @param {TestCase} test - The test case that is starting
//    */
//   onTestBegin(test: TestCase): void {
//     logger.info(`Test Case Started : ${test.title}`);
//   }

//   /**
//    * Logs the end of a test case
//    * @param {TestCase} test - The test case that ended
//    * @param {TestResult} result - The result of the test case
//    */
//   onTestEnd(test: TestCase, result: TestResult): void {
//     if (result.status === 'passed') {
//       logger.info(`\x1b[32mTest Case Passed : ${test.title}\x1b[0m`); // Green color
//     } else if (result.status === 'skipped') {
//       logger.info(`\x1b[33mTest Case Skipped : ${test.title}\x1b[0m`); // Yellow color
//     } else if (result.status === 'failed' && result.error) {
//       // Playwright inbuild reporter logs the error
//       // logger.error(
//       //   `Test Case Failed: ${test.title} Error: ${result.error.message}`,
//       // );
//     }
//   }

//   /**
//    * Logs an error
//    * @param {TestError} error - The error
//    */
//   onError(error: TestError): void {
//     logger.error(error.message);
//   }
// }

/**
 * custom-logger.ts
 * Custom Playwright reporter using Winston.
 * Allows configurable log level and output file, plus a helper to inspect config.
 */

import { Reporter, TestCase, TestError, TestResult } from '@playwright/test/reporter';
import winston from 'winston';

// ---------------------------------------------------------------------
// 1. Define a type for options you want to pass from playwright.config.ts
// ---------------------------------------------------------------------
export interface LoggerOptions {
  logLevel?: string;
  filePath?: string;
}

// ---------------------------------------------------------------------
// 2. Create the class
// ---------------------------------------------------------------------
export default class CustomLogger implements Reporter {
  private logger: winston.Logger;

  // Keep `options` as a property so we can read it later
  constructor(private options: LoggerOptions = {}) {
    const transports: winston.transport[] = [new winston.transports.Console()];

    if (options.filePath) {
      transports.push(
        new winston.transports.File({
          filename: options.filePath,
          level: options.logLevel ?? 'info',
        }),
      );
    }

    this.logger = winston.createLogger({
      level: options.logLevel ?? 'info',
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
      ),
      transports,
    });
  }

  /** Optional helper to debug the logger configuration */
  printConfig(): void {
    this.logger.info(
      `Logger initialized with level="${this.options.logLevel ?? 'info'}" and file="${
        this.options.filePath ?? 'console'
      }"`,
    );
  }

  onTestBegin(test: TestCase): void {
    this.logger.info(`🚀 Test Started: ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const { status } = result;
    if (status === 'passed') {
      this.logger.info(`✅ Passed: ${test.title}`);
    } else if (status === 'skipped') {
      this.logger.warn(`⏭ Skipped: ${test.title}`);
    } else if (status === 'failed') {
      this.logger.error(`❌ Failed: ${test.title}`);
    }
  }

  onError(error: TestError): void {
    this.logger.error(`💥 Error: ${error.message}`);
  }
}
