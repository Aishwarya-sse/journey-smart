// Booking Page - Passenger details and seat selection

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Train, 
  Calendar, 
  MapPin, 
  Clock,
  Users,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import PassengerForm from '@/components/PassengerForm';
import SeatSelector from '@/components/SeatSelector';
import CrowdIndicator from '@/components/CrowdIndicator';
import ComfortScore from '@/components/ComfortScore';
import RecommendationTag from '@/components/RecommendationTag';
import { Train as TrainType, Passenger, classTypeNames, ClassType } from '@/types/railway';
import { generateSeatLayout } from '@/data/mockData';
import { calculateCrowdInfo } from '@/utils/crowdCalculator';
import { generateId, isLoggedIn } from '@/utils/storage';
import { toast } from 'sonner';

interface BookingState {
  train: TrainType;
  classType: ClassType;
  journeyDate: string;
}

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as BookingState | null;

  const [passengers, setPassengers] = useState<Passenger[]>([
    {
      id: generateId(),
      name: '',
      age: 0,
      gender: 'M',
      berthPreference: 'none',
    }
  ]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seatLayout, setSeatLayout] = useState<{ seatNumber: string; isBooked: boolean }[]>([]);

  // Check auth and state
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    if (!state?.train) {
      navigate('/search');
      return;
    }

    // Generate seat layout
    const selectedClass = state.train.classes.find(c => c.type === state.classType);
    if (selectedClass) {
      setSeatLayout(generateSeatLayout(selectedClass.totalSeats));
    }
  }, [state, navigate]);

  if (!state?.train) {
    return null;
  }

  const { train, classType, journeyDate } = state;
  const selectedClass = train.classes.find(c => c.type === classType);
  const crowdInfo = selectedClass 
    ? calculateCrowdInfo(selectedClass, train.departureTime, journeyDate)
    : null;

  const calculateTotalFare = () => {
    if (!selectedClass) return 0;
    return selectedClass.fare * passengers.length;
  };

  const validatePassengers = () => {
    for (const p of passengers) {
      if (!p.name.trim()) {
        toast.error('Please enter name for all passengers');
        return false;
      }
      if (!p.age || p.age < 1 || p.age > 120) {
        toast.error('Please enter valid age for all passengers');
        return false;
      }
    }
    return true;
  };

  const handleProceedToPayment = () => {
    if (!validatePassengers()) return;
    
    if (selectedSeats.length !== passengers.length) {
      toast.error(`Please select ${passengers.length} seat(s)`);
      return;
    }

    // Navigate to payment page
    navigate('/payment', {
      state: {
        train,
        classType,
        journeyDate,
        passengers,
        selectedSeats,
        totalFare: calculateTotalFare(),
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-6 md:py-10">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Train Summary */}
            <div className="bg-card rounded-xl border p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Train className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-heading font-semibold text-lg">
                      {train.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      #{train.number} • {classTypeNames[classType]}
                    </p>
                  </div>
                </div>
                {crowdInfo && (
                  <div className="flex flex-wrap gap-2">
                    <CrowdIndicator level={crowdInfo.level} size="sm" />
                    <RecommendationTag type={crowdInfo.recommendation} size="sm" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">From</p>
                    <p className="font-medium">{train.from.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">To</p>
                    <p className="font-medium">{train.to.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {new Date(journeyDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Time</p>
                    <p className="font-medium">{train.departureTime} - {train.arrivalTime}</p>
                  </div>
                </div>
              </div>

              {crowdInfo && (
                <div className="mt-4 pt-4 border-t flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Comfort:</span>
                    <ComfortScore score={crowdInfo.comfortScore} size="sm" />
                  </div>
                </div>
              )}
            </div>

            {/* Passenger Form */}
            <div className="bg-card rounded-xl border p-4 md:p-6">
              <PassengerForm
                passengers={passengers}
                onUpdate={setPassengers}
                maxPassengers={6}
              />
            </div>

            {/* Seat Selection */}
            <div className="bg-card rounded-xl border p-4 md:p-6">
              <SeatSelector
                seats={seatLayout}
                selectedSeats={selectedSeats}
                maxSelection={passengers.length}
                onSelectionChange={setSelectedSeats}
              />
            </div>
          </div>

          {/* Right Column - Fare Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border p-4 md:p-6 sticky top-24">
              <h3 className="font-heading font-semibold text-lg mb-4">Fare Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base Fare</span>
                  <span>₹{selectedClass?.fare.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Passengers</span>
                  <span>× {passengers.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Reservation Charge</span>
                  <span>₹{(40 * passengers.length).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST (5%)</span>
                  <span>₹{Math.round(calculateTotalFare() * 0.05).toLocaleString()}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Amount</span>
                    <span className="font-heading font-bold text-xl text-primary">
                      ₹{Math.round(calculateTotalFare() * 1.05 + 40 * passengers.length).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleProceedToPayment}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Proceed to Payment
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                By proceeding, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
