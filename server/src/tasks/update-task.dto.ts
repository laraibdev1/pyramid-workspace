import { IsArray, IsIn, IsISO8601, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  title?: string

  @IsOptional()
  @IsIn(['To Do', 'Doing', 'Completed', 'On Hold'])
  status?: string

  @IsOptional()
  @IsIn(['Urgent', 'High', 'Medium', 'Low'])
  priority?: string

  @IsOptional()
  @IsString()
  @MaxLength(80)
  member?: string

  @IsOptional()
  @IsISO8601()
  dueDate?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[]
}
