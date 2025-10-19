import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { UsersService } from '../users/users.service';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-09-30.clover' as any,
    });
  }

  async createCheckoutSession(userId: string, subjects: string[], email: string) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Student Account Upgrade',
                description: `Access to subjects: ${subjects.join(', ')}`,
              },
              unit_amount: 4999,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${this.configService.get<string>('FRONTEND_URL')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.configService.get<string>('FRONTEND_URL')}/payment/cancel`,
        customer_email: email,
        metadata: {
          userId,
          subjects: subjects.join(','),
        },
      });

      return { sessionId: session.id, url: session.url };
    } catch (error) {
      throw new BadRequestException('Failed to create checkout session');
    }
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    
    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const { userId, subjects } = session.metadata;
        
        const customer = await this.stripe.customers.retrieve(session.customer as string);
        const customerId = typeof customer === 'string' ? customer : customer.id;

        await this.usersService.upgradeUser(
          userId,
          subjects.split(','),
          customerId,
        );
      }

      return { received: true };
    } catch (error) {
      throw new BadRequestException('Webhook signature verification failed');
    }
  }

  async verifySession(sessionId: string) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      return {
        status: session.payment_status,
        metadata: session.metadata,
      };
    } catch (error) {
      throw new BadRequestException('Failed to verify session');
    }
  }
}
