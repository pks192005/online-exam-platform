import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Query,
  Headers,
  Req,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentService } from './payment.service';

class CreateCheckoutDto {
  subjects: string[];
}

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-checkout')
  @UseGuards(AuthGuard('jwt'))
  createCheckout(@Body() createCheckoutDto: CreateCheckoutDto, @Request() req) {
    return this.paymentService.createCheckoutSession(
      req.user.userId,
      createCheckoutDto.subjects,
      req.user.email,
    );
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    return this.paymentService.handleWebhook(signature, request.rawBody);
  }

  @Get('verify-session')
  @UseGuards(AuthGuard('jwt'))
  verifySession(@Query('session_id') sessionId: string) {
    return this.paymentService.verifySession(sessionId);
  }
}
