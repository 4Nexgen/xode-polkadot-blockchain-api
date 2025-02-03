import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { cryptoWaitReady } from '@polkadot/util-crypto';

async function bootstrap() {
  await cryptoWaitReady();
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Xode Blockchain API')
    .setDescription(
      'The Xode Blockchain API provides methods to interact with the Xode blockchain. Key features include creating wallet addresses, retrieving the latest block height, fetching transactions of specific blocks, checking transaction details, ensuring transaction accuracy, making transfers with offline signing, and querying address balances.',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger with modified document
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    methods: '*',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
