import { Module } from '@nestjs/common';
import { CloudinaryModule as CloudinaryClientModule } from 'nestjs-cloudinary';

@Module({
  imports: [
    CloudinaryClientModule.forRootAsync({
      isGlobal: true,
      useFactory: () => ({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: false,
      }),
    }),
  ],
  exports: [CloudinaryModule],
})
export class CloudinaryModule {}
