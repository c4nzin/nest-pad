import { PartialType } from '@nestjs/mapped-types';
import { CreateNotepadDto } from './create-notepad.dto';

export class UpdateNoteDto extends PartialType(CreateNotepadDto) {}
