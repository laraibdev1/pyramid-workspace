import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateTaskDto {
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  title!: string

  @IsOptional()
  @IsIn(['To Do', 'Doing', 'Completed', 'On Hold'])
  status?: string

  @IsOptional()
  @IsIn(['Urgent', 'High', 'Medium', 'Low'])
  priority?: string
}
