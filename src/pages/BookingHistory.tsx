// Booking History Page

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Ticket, 
  Search, 
  Calendar,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Header from '@/components/Header';
import QRTicket from '@/components/QRTicket';
import { Booking } from '@/types/railway';
import { getBookings, cancelBooking, isLoggedIn } from '@/utils/storage';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const BookingHistory = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    const allBookings = getBookings();
    // Sort by booked date, newest first
    allBookings.sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime());
    setBookings(allBookings);
    setFilteredBookings(allBookings);
  }, [navigate]);

  useEffect(() => {
    let filtered = bookings;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b => 
        b.pnr.toLowerCase().includes(query) ||
        b.train.name.toLowerCase().includes(query) ||
        b.train.number.includes(query) ||
        b.train.from.city.toLowerCase().includes(query) ||
        b.train.to.city.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter);
    }

    setFilteredBookings(filtered);
  }, [searchQuery, statusFilter, bookings]);

  const handleCancel = (pnr: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      const success = cancelBooking(pnr);
      if (success) {
        setBookings(prev => prev.map(b => 
          b.pnr === pnr ? { ...b, status: 'cancelled' as const } : b
        ));
        toast.success('Booking cancelled successfully');
      } else {
        toast.error('Failed to cancel booking');
      }
    }
  };

  const toggleExpand = (pnr: string) => {
    setExpandedBooking(expandedBooking === pnr ? null : pnr);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'waiting':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-6 md:py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold">
              My Bookings
            </h1>
            <p className="text-muted-foreground">
              View and manage your train ticket bookings
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Ticket size={16} />
            <span>{bookings.length} total bookings</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by PNR, train name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter size={16} className="mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="waiting">Waiting</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map(booking => (
              <div 
                key={booking.id}
                className="bg-card rounded-xl border overflow-hidden animate-fade-in"
              >
                {/* Booking Summary - Clickable Header */}
                <button
                  onClick={() => toggleExpand(booking.pnr)}
                  className="w-full p-4 md:p-6 text-left hover:bg-muted/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <Ticket className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-primary">
                            {booking.pnr}
                          </span>
                          <span className={cn(
                            'px-2 py-0.5 text-xs font-medium rounded-full border',
                            getStatusColor(booking.status)
                          )}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <p className="font-semibold">
                          {booking.train.name} ({booking.train.number})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.train.from.city} → {booking.train.to.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar size={14} />
                        <span>
                          {new Date(booking.journeyDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-heading font-bold text-lg text-primary">
                          ₹{booking.totalFare.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {booking.passengers.length} passenger(s)
                        </p>
                      </div>
                      <div className="hidden md:block">
                        {expandedBooking === booking.pnr ? (
                          <ChevronUp size={20} className="text-muted-foreground" />
                        ) : (
                          <ChevronDown size={20} className="text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expanded Details */}
                {expandedBooking === booking.pnr && (
                  <div className="border-t p-4 md:p-6 bg-muted/20 animate-fade-in">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* QR Ticket */}
                      <div className="flex justify-center lg:justify-start">
                        <QRTicket booking={booking} compact />
                      </div>

                      {/* Actions */}
                      <div className="flex-1 flex flex-col justify-end gap-3">
                        {booking.status === 'confirmed' && (
                          <Button
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancel(booking.pnr);
                            }}
                          >
                            Cancel Booking
                          </Button>
                        )}
                        <p className="text-xs text-muted-foreground text-center lg:text-right">
                          Booked on {new Date(booking.bookedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Ticket className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-heading text-xl font-semibold mb-2">
              No Bookings Found
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter'
                : "You haven't made any bookings yet"}
            </p>
            <Button onClick={() => navigate('/search')}>
              Book Your First Ticket
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
