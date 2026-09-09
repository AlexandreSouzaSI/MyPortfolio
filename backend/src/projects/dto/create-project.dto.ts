import {
    IsArray,
    IsBoolean,
    IsIn,
    IsInt,
    IsOptional,
    IsString,
    IsUrl,
    MinLength,
} from 'class-validator';

export class CreateProjectDto {
    @IsString()
    @MinLength(1)
    slug: string;

    @IsString()
    @MinLength(1)
    title: string;

    @IsString()
    @MinLength(1)
    tagline: string;

    @IsString()
    @MinLength(1)
    problem: string;

    @IsString()
    @MinLength(1)
    solution: string;

    @IsString()
    @MinLength(1)
    impact: string;

    @IsArray()
    @IsString({ each: true })
    techStack: string[];

    @IsOptional()
    @IsUrl()
    liveUrl?: string;

    @IsOptional()
    @IsUrl()
    repoUrl?: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsArray()
    metrics?: { label: string; value: string }[];

    @IsOptional()
    @IsString()
    nextStep?: string;

    @IsOptional()
    @IsIn(['live', 'in_development'])
    status?: string;

    @IsOptional()
    @IsBoolean()
    featured?: boolean;

    @IsOptional()
    @IsInt()
    order?: number;
}
