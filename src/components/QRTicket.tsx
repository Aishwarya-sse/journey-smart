// QR Ticket Component - Displays booking ticket with QR code

import { QRCodeSVG } from 'qrcode.react';
import { Train, Calendar, Clock, MapPin, Users, CreditCard } from 'lucide-react';
import { Booking, classTypeNames } from '@/types/railway';
import { cn } from '@/lib/utils';

interface QRTicketProps {
  booking: Booking;
  compact?: boolean;
}

const QRTicket = ({ booking, compact = false }: QRTicketProps) => {
  // Generate QR data with booking info
  const qrData = JSON.stringify({
    pnr: booking.pnr,
    train: booking.train.number,
    from: booking.train.from.code,
    to: booking.train.to.code,
    date: booking.journeyDate,
    passengers: booking.passengers.length,
    status: booking.status,
  });

  const statusColors = {
    confirmed: 'bg-green-100 text-green-700 border-green-200',
    waiting: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <div className={cn(
      'bg-card rounded-2xl overflow-hidden border shadow-lg',
      compact ? 'max-w-sm' : 'max-w-2xl w-full'
    )}>
      {/* Header */}
      <div className="hero-gradient text-primary-foreground p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Train className="w-6 h-6" />
            <span className="font-heading font-bold text-lg">Rail Ticket</span>
          </div>
          <div className={cn(
            'px-3 py-1 rounded-full text-sm font-medium border',
            statusColors[booking.status]
          )}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </div>
        </div>
      </div>

      <div className={cn(
        'p-4 md:p-6',
        !compact && 'md:flex md:gap-6'
      )}>
        {/* Ticket Info */}
        <div className="flex-1 space-y-4">
          {/* PNR */}
          <div className="p-3 bg-muted rounded-lg text-center">
            <p className="text-xs text-muted-foreground mb-1">PNR Number</p>
            <p className="font-heading font-bold text-2xl tracking-wider text-primary">
              {booking.pnr}
            </p>
          </div>

          {/* Train Details */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Train className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">{booking.train.name}</p>
              <p className="text-sm text-muted-foreground">
                #{booking.train.number} • {classTypeNames[booking.classType]}
              </p>
            </div>
          </div>

          {/* Journey */}
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{booking.train.from.city}</p>
                  <p className="text-xs text-muted-foreground">{booking.train.departureTime}</p>
                </div>
                <div className="text-muted-foreground">→</div>
                <div className="text-right">
                  <p className="font-semibold">{booking.train.to.city}</p>
                  <p className="text-xs text-muted-foreground">{booking.train.arrivalTime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              {new Date(booking.journeyDate).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          {/* Passengers */}
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{booking.passengers.length} Passenger(s)</span>
          </div>

          {!compact && (
            <>
              {/* Passenger List */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-3 py-2 text-sm font-medium">
                  Passengers
                </div>
                {booking.passengers.map((passenger, index) => (
                  <div key={passenger.id} className="px-3 py-2 border-t flex justify-between">
                    <span>{passenger.name}, {passenger.age} {passenger.gender}</span>
                    <span className="text-muted-foreground">
                      {booking.seatNumbers[index] || 'Waiting'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Fare */}
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Total Fare</span>
                </div>
                <span className="font-heading font-bold text-xl text-primary">
                  ₹{booking.totalFare.toLocaleString()}
                </span>
              </div>
            </>
          )}
        </div>

        {/* QR Code */}
        <div className={cn(
          'flex flex-col items-center justify-center',
          !compact && 'md:border-l md:pl-6',
          compact ? 'mt-4 pt-4 border-t' : 'mt-6 md:mt-0'
        )}>
          <div className="p-4 bg-white rounded-xl shadow-sm">
            <QRCodeSVG 
              value={qrData}
              size={compact ? 100 : 150}
              level="H"
              includeMargin={false}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Scan for ticket verification
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 md:px-6 py-3 bg-muted/50 border-t text-center">
        <p className="text-xs text-muted-foreground">
          Booked on {new Date(booking.bookedAt).toLocaleDateString('en-IN')} • 
          Payment: {booking.paymentMethod.toUpperCase()}
        </p>
      </div>
    </div>
  );
};

export default QRTicket;
