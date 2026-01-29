// Seat Selection Grid Component

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Seat {
  seatNumber: string;
  isBooked: boolean;
}

interface SeatSelectorProps {
  seats: Seat[];
  selectedSeats: string[];
  maxSelection: number;
  onSelectionChange: (seats: string[]) => void;
}

const SeatSelector = ({ 
  seats, 
  selectedSeats, 
  maxSelection, 
  onSelectionChange 
}: SeatSelectorProps) => {
  const toggleSeat = (seatNumber: string, isBooked: boolean) => {
    if (isBooked) return;
    
    if (selectedSeats.includes(seatNumber)) {
      onSelectionChange(selectedSeats.filter(s => s !== seatNumber));
    } else if (selectedSeats.length < maxSelection) {
      onSelectionChange([...selectedSeats, seatNumber]);
    }
  };

  // Group seats by row (8 seats per row for sleeper coaches)
  const seatsPerRow = 8;
  const rows = [];
  for (let i = 0; i < seats.length; i += seatsPerRow) {
    rows.push(seats.slice(i, i + seatsPerRow));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-lg">Select Seats</h3>
        <span className="text-sm text-muted-foreground">
          {selectedSeats.length}/{maxSelection} selected
        </span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="seat seat-available !cursor-default">A</div>
          <span className="text-sm text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="seat seat-selected !cursor-default">S</div>
          <span className="text-sm text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="seat seat-booked !cursor-default">B</div>
          <span className="text-sm text-muted-foreground">Booked</span>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="border rounded-lg p-4 bg-card overflow-x-auto">
        <div className="min-w-fit">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-2 mb-2">
              {/* Row number */}
              <span className="w-8 text-xs text-muted-foreground font-medium">
                R{rowIndex + 1}
              </span>
              
              {/* Seats */}
              <div className="flex gap-1">
                {row.slice(0, 3).map((seat) => (
                  <button
                    key={seat.seatNumber}
                    onClick={() => toggleSeat(seat.seatNumber, seat.isBooked)}
                    disabled={seat.isBooked}
                    className={cn(
                      'seat',
                      seat.isBooked ? 'seat-booked' :
                      selectedSeats.includes(seat.seatNumber) ? 'seat-selected' : 'seat-available'
                    )}
                    title={seat.seatNumber}
                  >
                    {seat.seatNumber.slice(2)}
                  </button>
                ))}
              </div>
              
              {/* Aisle */}
              <div className="w-6" />
              
              <div className="flex gap-1">
                {row.slice(3, 6).map((seat) => (
                  <button
                    key={seat.seatNumber}
                    onClick={() => toggleSeat(seat.seatNumber, seat.isBooked)}
                    disabled={seat.isBooked}
                    className={cn(
                      'seat',
                      seat.isBooked ? 'seat-booked' :
                      selectedSeats.includes(seat.seatNumber) ? 'seat-selected' : 'seat-available'
                    )}
                    title={seat.seatNumber}
                  >
                    {seat.seatNumber.slice(2)}
                  </button>
                ))}
              </div>
              
              {/* Side berths */}
              <div className="w-4" />
              
              <div className="flex gap-1">
                {row.slice(6, 8).map((seat) => (
                  <button
                    key={seat.seatNumber}
                    onClick={() => toggleSeat(seat.seatNumber, seat.isBooked)}
                    disabled={seat.isBooked}
                    className={cn(
                      'seat',
                      seat.isBooked ? 'seat-booked' :
                      selectedSeats.includes(seat.seatNumber) ? 'seat-selected' : 'seat-available'
                    )}
                    title={seat.seatNumber}
                  >
                    {seat.seatNumber.slice(2)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Seats Summary */}
      {selectedSeats.length > 0 && (
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm font-medium text-primary">
            Selected: {selectedSeats.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default SeatSelector;
