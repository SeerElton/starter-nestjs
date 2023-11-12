import { ApiProperty } from "@nestjs/swagger"

export class ZScoreItem {
    @ApiProperty({
        type: Number,
        format: 'double',
        example: 1.5,
    })
    redN3: number;

    @ApiProperty({
        type: Number,
        format: 'double',
        example: 1.5,
    })
    amberN2: number;

    @ApiProperty({
        type: Number,
        format: 'double',
        example: 1.5,
    })
    green: number;

    @ApiProperty({
        type: Number,
        format: 'double',
        example: 1.5,
    })
    amberP2: number;

    @ApiProperty({
        type: Number,
        format: 'double',
        example: 1.5,
    })
    redP3: number;

    @ApiProperty({
        type: Number,
        example: 1,
    })
    month: number;
}