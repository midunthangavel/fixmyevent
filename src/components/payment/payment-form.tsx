'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

import { useToast } from '@/hooks/use-toast';
import { CreditCard, Lock, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { paymentFormSchema, type PaymentFormData, PAYMENT_METHOD } from '@/types/payment';
import { paymentService } from '@/services/payment';

interface PaymentFormProps {
  amount: number;
  currency?: string;
  bookingId?: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
}

export function PaymentForm({ amount, currency = 'USD', bookingId, onSuccess, onError }: PaymentFormProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<keyof typeof PAYMENT_METHOD>('STRIPE');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,

  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amount,
      currency: currency.toLowerCase(),
      paymentMethod: 'stripe',
      savePaymentMethod: false,
    },
  });




  const handlePaymentMethodChange = (method: string) => {
    setSelectedMethod(method as keyof typeof PAYMENT_METHOD);
    setValue('paymentMethod', method as any);
  };

  const onSubmit = async (data: PaymentFormData) => {
    setIsProcessing(true);
    
    try {
      let paymentId: string;

      if (data.paymentMethod === 'stripe') {
        const stripePayment = await paymentService.processStripePayment(
          crypto.randomUUID(),
          data.amount,
          data.currency,
          { bookingId: bookingId || '' }
        );
        paymentId = stripePayment.paymentIntentId;
      } else if (data.paymentMethod === 'paypal') {
        const paypalPayment = await paymentService.processPaypalPayment(
          crypto.randomUUID(),
          data.amount,
          data.currency,
          { bookingId: bookingId || '' }
        );
        paymentId = paypalPayment.orderId;
      } else {
        throw new Error('Unsupported payment method');
      }

      toast({
        title: 'Payment Successful',
        description: 'Your payment has been processed successfully.',
      });

      onSuccess?.(paymentId);
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      
      toast({
        variant: 'destructive',
        title: 'Payment Failed',
        description: errorMessage,
      });

      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(value);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Payment Summary */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-green-600" />
            Secure Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <span className="font-medium">Total Amount:</span>
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(amount)}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>Your payment information is encrypted and secure</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle>Choose Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedMethod === 'STRIPE'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handlePaymentMethodChange('stripe')}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <div>
                  <div className="font-medium">Credit Card</div>
                  <div className="text-sm text-muted-foreground">Visa, Mastercard, Amex</div>
                </div>
                {selectedMethod === 'STRIPE' && (
                  <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                )}
              </div>
            </div>

            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedMethod === 'PAYPAL'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handlePaymentMethodChange('paypal')}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                  P
                </div>
                <div>
                  <div className="font-medium">PayPal</div>
                  <div className="text-sm text-muted-foreground">Fast & secure checkout</div>
                </div>
                {selectedMethod === 'PAYPAL' && (
                  <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Billing Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Billing Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...register('billingDetails.name')}
                    placeholder="John Doe"
                    className={errors.billingDetails?.name ? 'border-red-500' : ''}
                  />
                  {errors.billingDetails?.name && (
                    <p className="text-sm text-red-500">{errors.billingDetails.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('billingDetails.email')}
                    placeholder="john@example.com"
                    className={errors.billingDetails?.email ? 'border-red-500' : ''}
                  />
                  {errors.billingDetails?.email && (
                    <p className="text-sm text-red-500">{errors.billingDetails.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('billingDetails.phone')}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  {...register('billingDetails.address.line1')}
                  placeholder="123 Main Street"
                  className={errors.billingDetails?.address?.line1 ? 'border-red-500' : ''}
                />
                {errors.billingDetails?.address?.line1 && (
                  <p className="text-sm text-red-500">{errors.billingDetails.address.line1.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                <Input
                  id="address2"
                  {...register('billingDetails.address.line2')}
                  placeholder="Apt, suite, etc."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    {...register('billingDetails.address.city')}
                    placeholder="New York"
                    className={errors.billingDetails?.address?.city ? 'border-red-500' : ''}
                  />
                  {errors.billingDetails?.address?.city && (
                    <p className="text-sm text-red-500">{errors.billingDetails.address.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    {...register('billingDetails.address.state')}
                    placeholder="NY"
                    className={errors.billingDetails?.address?.state ? 'border-red-500' : ''}
                  />
                  {errors.billingDetails?.address?.state && (
                    <p className="text-sm text-red-500">{errors.billingDetails.address.state.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    {...register('billingDetails.address.postalCode')}
                    placeholder="10001"
                    className={errors.billingDetails?.address?.postalCode ? 'border-red-500' : ''}
                  />
                  {errors.billingDetails?.address?.postalCode && (
                    <p className="text-sm text-red-500">{errors.billingDetails.address.postalCode.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select
                  onValueChange={(value) => setValue('billingDetails.address.country', value)}
                  defaultValue="US"
                >
                  <SelectTrigger className={errors.billingDetails?.address?.country ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="FR">France</SelectItem>
                    <SelectItem value="JP">Japan</SelectItem>
                    <SelectItem value="IN">India</SelectItem>
                  </SelectContent>
                </Select>
                {errors.billingDetails?.address?.country && (
                  <p className="text-sm text-red-500">{errors.billingDetails.address.country.message}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Payment Method Specific Fields */}
            {selectedMethod === 'STRIPE' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Credit Card Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date *</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      className="font-mono"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'PAYPAL' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">PayPal Checkout</h3>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">You will be redirected to PayPal to complete your payment</span>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {/* Additional Options */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="savePaymentMethod"
                  {...register('savePaymentMethod')}
                />
                <Label htmlFor="savePaymentMethod" className="text-sm">
                  Save this payment method for future use
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Pay {formatCurrency(amount)}
                </>
              )}
            </Button>

            {/* Security Notice */}
            <div className="text-center text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Your payment is protected by SSL encryption</span>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
