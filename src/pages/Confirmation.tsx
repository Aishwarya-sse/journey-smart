// Confirmation Page - Shows ticket with QR code

import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Download, 
  Share2, 
  Home,
  Ticket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import QRTicket from '@/components/QRTicket';
import { Booking } from '@/types/railway';
import { getBookingByPnr, isLoggedIn } from '@/utils/storage';
import { toast } from 'sonner';

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    const state = location.state as { pnr?: string } | null;
    const pnr = state?.pnr || localStorage.getItem('lastPnr');
    
    if (pnr) {
      const bookingData = getBookingByPnr(pnr);
      if (bookingData) {
        setBooking(bookingData);
      } else {
        navigate('/bookings');
      }
    } else {
      navigate('/bookings');
    }
  }, [location, navigate]);

  const handleShare = async () => {
    if (!booking) return;
    
    const text = `🚂 Train Ticket Booked!\n\nPNR: ${booking.pnr}\nTrain: ${booking.train.name} (${booking.train.number})\nFrom: ${booking.train.from.city}\nTo: ${booking.train.to.city}\nDate: ${new Date(booking.journeyDate).toLocaleDateString()}\n\nBooked via RailBook`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Train Ticket', text });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Ticket details copied to clipboard!');
    }
  };

  const handleDownload = () => {
    toast.info('Download feature coming soon!');
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8 md:py-12">
        {/* Success Banner */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-muted-foreground">
            Your ticket has been booked successfully. Show the QR code at the station.
          </p>
        </div>

        {/* Ticket */}
        <div className="flex justify-center mb-8 animate-slide-up">
          <QRTicket booking={booking} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
          <Button variant="outline" onClick={handleDownload} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download Ticket
          </Button>
          <Button variant="outline" onClick={handleShare} className="flex-1">
            <Share2 className="mr-2 h-4 w-4" />
            Share Ticket
          </Button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6 max-w-md mx-auto">
          <Link to="/search" className="flex-1">
            <Button variant="ghost" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Book Another Ticket
            </Button>
          </Link>
          <Link to="/bookings" className="flex-1">
            <Button className="w-full">
              <Ticket className="mr-2 h-4 w-4" />
              View All Bookings
            </Button>
          </Link>
        </div>

        {/* Important Notes */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-muted/50 rounded-lg p-6 border">
            <h3 className="font-heading font-semibold mb-4">Important Information</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Please carry a valid ID proof during the journey
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Report to the station at least 30 minutes before departure
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                The QR code on your ticket can be scanned for verification
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                For cancellations, please visit the bookings page
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
