import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  public transform(value: any, metadata: ArgumentMetadata): boolean {
    const maxFileSize = 10000; //10mb
    return value.size < maxFileSize;
  }
}
