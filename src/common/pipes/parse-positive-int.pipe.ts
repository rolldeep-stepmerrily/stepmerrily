import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform {
  transform(value: string) {
    const parsedValue = parseInt(value, 10);

    if (isNaN(parsedValue) || parsedValue < 0) {
      return new BadRequestException();
    }

    return parsedValue;
  }
}
