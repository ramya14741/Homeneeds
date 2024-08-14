
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { domainToASCII } from 'url';
import { ConfigModule } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
var fs = require('fs');
dotenv.config();
//const path = require('path')
//const dotenv = require('dotenv').config({ path: path.resolve(__dirname, './dotenv') })

async function bootstrap() {
  try{
    const app = await NestFactory.create(AppModule ,{ cors: true });
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({whitelist:true, transform:true}));

  const config = new DocumentBuilder()
    .setTitle('e-com')
    .setDescription('e-com application')
    .setVersion('1.0')
    .addTag('House hold needs')
    //.enableCors()
    .addBearerAuth(
      { 
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'JWT',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header'
      },
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('household/v1', app, document);

  const household = await app.listen(process.env.PORT);
  console.log('household application is listening on http://localhost:'+process.env.PORT+'/household/v1');
  }
  catch(e){
    console.log('error in starting server');
    throw e;
  }
  
}
bootstrap();