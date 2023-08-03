import { Logger } from '@nestjs/common';

export class CustomLogger extends Logger {
  constructor(context: string) {
    super(context);
  }

  log(message: any, context?: string) {
    const stackTrace = new Error().stack.split('\n');
    // Extract the filename and line number from the stack trace
    const caller = stackTrace[2].match(/at (.*?) \((.*?):(\d+):(\d+)\)/);
    const filename = caller[2];
    const lineNumber = caller[3];

    super.log(
      `${message}` + ` \x1b[38;5;214mat [${filename}:${lineNumber}]\x1b[0m `,
      context,
    );
  }

  debug(message: any, context?: string) {
    const stackTrace = new Error().stack.split('\n');
    // Extract the filename and line number from the stack trace
    const caller = stackTrace[2].match(/at (.*?) \((.*?):(\d+):(\d+)\)/);
    const filename = caller[2];
    const lineNumber = caller[3];

    super.debug(
      `${message}` + ` \x1b[38;5;214mat [${filename}:${lineNumber}]\x1b[0m `,
      context,
    );
  }

  warn(message: any, context?: string) {
    const stackTrace = new Error().stack.split('\n');
    // Extract the filename and line number from the stack trace
    const caller = stackTrace[2].match(/at (.*?) \((.*?):(\d+):(\d+)\)/);
    const filename = caller[2];
    const lineNumber = caller[3];

    super.warn(
      `${message}` + ` \x1b[38;5;214mat [${filename}:${lineNumber}]\x1b[0m `,
      context,
    );
  }

  verbose(message: any, context?: string) {
    const stackTrace = new Error().stack.split('\n');
    // Extract the filename and line number from the stack trace
    const caller = stackTrace[2].match(/at (.*?) \((.*?):(\d+):(\d+)\)/);
    const filename = caller[2];
    const lineNumber = caller[3];

    super.verbose(
      `${message}` + ` \x1b[38;5;214mat [${filename}:${lineNumber}]\x1b[0m `,
      context,
    );
  }

  error(message: any, stack?: string, context?: string) {
    const stackTrace = new Error().stack.split('\n');
    // Extract the filename and line number from the stack trace
    const caller = stackTrace[2].match(/at (.*?) \((.*?):(\d+):(\d+)\)/);
    const filename = caller[2];
    const lineNumber = caller[3];

    super.error(
      `${message}` + ` \x1b[38;5;214mat [${filename}:${lineNumber}]\x1b[0m `,
      stack,
      context,
    );
  }
}
