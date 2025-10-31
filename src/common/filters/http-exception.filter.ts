import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();
    let message: string | string[];
    let error: string;

    if (typeof exceptionResponse === 'string') {
      message = [exceptionResponse];
      error = HttpStatus[status] || 'Error';
    } else if (typeof exceptionResponse === 'object') {
      const responseObj = exceptionResponse as any;
      message = Array.isArray(responseObj.message) ? responseObj.message : [responseObj.message];
      error = responseObj.error || HttpStatus[status] || 'Error';
    } else {
      message = ['An error occurred'];
      error = 'Error';
    }

    response.status(status).json({
      message,
      error,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}