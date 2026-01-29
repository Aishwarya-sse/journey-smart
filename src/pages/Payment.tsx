// Payment Page - Mock payment flow

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  Wallet,
  CheckCircle2,
  Loader2,
  Shield,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Header from '@/components/Header';
import { Train as TrainType, Passenger, ClassType, Booking } from '@/types/railway';
import { saveBooking, generatePNR, generateId, isLoggedIn } from '@/utils/storage';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PaymentState {
  train: TrainType;
  classType: ClassType;
  journeyDate: string;
  passengers: Passenger[];
  selectedSeats: string[];
  totalFare: number;
}

type PaymentMethod = 'upi' | 'card' | 'wallet';
type WalletType = 'paytm' | 'phonepe' | 'gpay';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as PaymentState | null;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [walletType, setWalletType] = useState<WalletType>('paytm');
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    if (!state?.train) {
      navigate('/search');
    }
  }, [state, navigate]);

  useEffect(() => {
    if (paymentSuccess && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (paymentSuccess && countdown === 0) {
      navigate('/confirmation', { state: { pnr: localStorage.getItem('lastPnr') } });
    }
  }, [paymentSuccess, countdown, navigate]);

  if (!state?.train) {
    return null;
  }

  const { train, classType, journeyDate, passengers, selectedSeats, totalFare } = state;
  
  const finalAmount = Math.round(totalFare * 1.05 + 40 * passengers.length);

  const validatePayment = () => {
    if (paymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        toast.error('Please enter a valid UPI ID');
        return false;
      }
    } else if (paymentMethod === 'card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
        toast.error('Please enter a valid 16-digit card number');
        return false;
      }
      if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        toast.error('Please enter valid expiry (MM/YY)');
        return false;
      }
      if (!cardCvv || cardCvv.length !== 3) {
        toast.error('Please enter valid CVV');
        return false;
      }
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validatePayment()) return;

    setProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create booking
    const pnr = generatePNR();
    const booking: Booking = {
      id: generateId(),
      pnr,
      train,
      passengers: passengers.map((p, i) => ({
        ...p,
        seatNumber: selectedSeats[i],
      })),
      classType,
      journeyDate,
      totalFare: finalAmount,
      status: 'confirmed',
      bookedAt: new Date().toISOString(),
      paymentMethod,
      seatNumbers: selectedSeats,
    };

    saveBooking(booking);
    localStorage.setItem('lastPnr', pnr);
    
    setProcessing(false);
    setPaymentSuccess(true);
    toast.success('Payment successful!');
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
            Payment Successful!
          </h1>
          <p className="text-muted-foreground mb-4">
            Your ticket has been booked successfully
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecting to confirmation in {countdown}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-6 md:py-10">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Booking
        </Button>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2">
              Complete Payment
            </h1>
            <p className="text-muted-foreground">
              Choose your preferred payment method
            </p>
          </div>

          <div className="bg-card rounded-xl border p-6 mb-6">
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              className="space-y-4"
            >
              {/* UPI Option */}
              <div className={cn(
                "flex items-center space-x-4 p-4 rounded-lg border-2 transition-colors cursor-pointer",
                paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
              )}>
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Smartphone className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold">UPI</p>
                      <p className="text-sm text-muted-foreground">Pay using any UPI app</p>
                    </div>
                  </div>
                </Label>
              </div>

              {paymentMethod === 'upi' && (
                <div className="pl-12 animate-fade-in">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="mt-1.5"
                  />
                </div>
              )}

              {/* Card Option */}
              <div className={cn(
                "flex items-center space-x-4 p-4 rounded-lg border-2 transition-colors cursor-pointer",
                paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
              )}>
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Credit/Debit Card</p>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard, Rupay</p>
                    </div>
                  </div>
                </Label>
              </div>

              {paymentMethod === 'card' && (
                <div className="pl-12 space-y-4 animate-fade-in">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="mt-1.5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardExpiry">Expiry Date</Label>
                      <Input
                        id="cardExpiry"
                        value={cardExpiry}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.substring(0, 2) + '/' + value.substring(2, 4);
                          }
                          setCardExpiry(value);
                        }}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardCvv">CVV</Label>
                      <Input
                        id="cardCvv"
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        placeholder="•••"
                        maxLength={3}
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Wallet Option */}
              <div className={cn(
                "flex items-center space-x-4 p-4 rounded-lg border-2 transition-colors cursor-pointer",
                paymentMethod === 'wallet' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
              )}>
                <RadioGroupItem value="wallet" id="wallet" />
                <Label htmlFor="wallet" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Wallet className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Wallets</p>
                      <p className="text-sm text-muted-foreground">Paytm, PhonePe, Google Pay</p>
                    </div>
                  </div>
                </Label>
              </div>

              {paymentMethod === 'wallet' && (
                <div className="pl-12 animate-fade-in">
                  <div className="flex gap-3">
                    {(['paytm', 'phonepe', 'gpay'] as WalletType[]).map(wallet => (
                      <Button
                        key={wallet}
                        type="button"
                        variant={walletType === wallet ? 'default' : 'outline'}
                        onClick={() => setWalletType(wallet)}
                        className="flex-1"
                      >
                        {wallet === 'paytm' ? 'Paytm' : wallet === 'phonepe' ? 'PhonePe' : 'GPay'}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </RadioGroup>
          </div>

          {/* Payment Summary */}
          <div className="bg-card rounded-xl border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground">Amount to Pay</span>
              <span className="font-heading font-bold text-2xl text-primary">
                ₹{finalAmount.toLocaleString()}
              </span>
            </div>
            
            <Button 
              className="w-full h-12" 
              size="lg"
              onClick={handlePayment}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Pay ₹{finalAmount.toLocaleString()}
                </>
              )}
            </Button>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <Shield size={16} />
            <span>Secured by 256-bit SSL encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
