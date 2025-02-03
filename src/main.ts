import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Xode Blockchain API')
    .setDescription('The Xode Blockchain API provides methods to interact with the Xode blockchain. Key features include creating wallet addresses, retrieving the latest block height, fetching transactions of specific blocks, checking transaction details, ensuring transaction accuracy, making transfers with offline signing, and querying address balances.')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
