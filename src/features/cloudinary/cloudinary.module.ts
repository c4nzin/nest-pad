import { Module } from '@nestjs/common';
import { CloudinaryModule as CloudinaryClientModule } from 'nestjs-cloudinary';
import { Config } from 'src/config';

@Module({
  imports: [
    CloudinaryClientModule.forRootAsync({
      imports: [],
      useFactory: (configService: Config) => ({
        cloud_name: configService.CLOUD_NAME,
        api_key: configService.CLOUDINARY_API_KEY,
        api_secret: configService.CLOUDINARY_API_SECRET,
      }),
    }),
  ],
  exports: [CloudinaryModule],
})
export class CloudinaryModule {}
