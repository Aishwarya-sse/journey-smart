// Train Card Component with Smart Crowd Indicators

import { Clock, MapPin, Train as TrainIcon, ChevronRight, Armchair } from 'lucide-react';
import { Train, classTypeNames } from '@/types/railway';
import { calculateCrowdInfo } from '@/utils/crowdCalculator';
import CrowdIndicator from './CrowdIndicator';
import ComfortScore from './ComfortScore';
import RecommendationTag from './RecommendationTag';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TrainCardProps {
  train: Train;
  journeyDate: string;
  onSelect: (train: Train, classType: string) => void;
}

const TrainCard = ({ train, journeyDate, onSelect }: TrainCardProps) => {
  // Get crowd info for first available class (for display)
  const primaryClass = train.classes[0];
  const crowdInfo = calculateCrowdInfo(primaryClass, train.departureTime, journeyDate);

  return (
    <div className="train-card p-4 md:p-6 animate-slide-up">
      {/* Header with Train Info */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TrainIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              {train.name}
            </h3>
            <p className="text-sm text-muted-foreground">#{train.number}</p>
          </div>
        </div>
        
        {/* Smart Indicators */}
        <div className="flex flex-wrap gap-2">
          <CrowdIndicator level={crowdInfo.level} size="sm" />
          <RecommendationTag type={crowdInfo.recommendation} size="sm" />
        </div>
      </div>

      {/* Journey Details */}
      <div className="flex items-center gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex-1">
          <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
            <MapPin size={12} />
            <span>Departure</span>
          </div>
          <p className="font-heading font-bold text-xl text-foreground">{train.departureTime}</p>
          <p className="text-sm text-muted-foreground">{train.from.city}</p>
          <p className="text-xs text-muted-foreground">{train.from.name}</p>
        </div>
        
        <div className="flex flex-col items-center">
          <Clock size={14} className="text-muted-foreground mb-1" />
          <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full border">
            {train.duration}
          </span>
          <div className="w-16 md:w-24 h-px bg-border mt-2 relative">
            <ChevronRight size={16} className="absolute -right-1 -top-2 text-primary" />
          </div>
        </div>
        
        <div className="flex-1 text-right">
          <div className="flex items-center justify-end gap-1 text-muted-foreground text-xs mb-1">
            <MapPin size={12} />
            <span>Arrival</span>
          </div>
          <p className="font-heading font-bold text-xl text-foreground">{train.arrivalTime}</p>
          <p className="text-sm text-muted-foreground">{train.to.city}</p>
          <p className="text-xs text-muted-foreground">{train.to.name}</p>
        </div>
      </div>

      {/* Comfort Score */}
      <div className="flex items-center gap-2 mb-4">
        <Armchair size={16} className="text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Seat Comfort:</span>
        <ComfortScore score={crowdInfo.comfortScore} size="sm" />
      </div>

      {/* Days of Operation */}
      <div className="flex gap-1 mb-4">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <span
            key={day}
            className={cn(
              'text-xs px-1.5 py-0.5 rounded',
              train.daysOfOperation.includes(day)
                ? 'bg-primary/10 text-primary font-medium'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {day[0]}
          </span>
        ))}
      </div>

      {/* Class & Fare Selection */}
      <div className="border-t pt-4">
        <p className="text-sm font-medium text-muted-foreground mb-3">Select Class</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {train.classes.map((cls) => {
            const clsCrowdInfo = calculateCrowdInfo(cls, train.departureTime, journeyDate);
            const availabilityColor = 
              cls.availableSeats > 30 ? 'text-green-600' :
              cls.availableSeats > 10 ? 'text-yellow-600' : 'text-red-600';

            return (
              <Button
                key={cls.type}
                variant="outline"
                className="h-auto p-3 flex flex-col items-start hover:border-primary hover:bg-primary/5"
                onClick={() => onSelect(train, cls.type)}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-semibold">{classTypeNames[cls.type]}</span>
                  <span className={cn('text-xs font-medium', availabilityColor)}>
                    {cls.availableSeats}
                  </span>
                </div>
                <span className="text-lg font-heading font-bold text-primary">
                  ₹{cls.fare.toLocaleString()}
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <span className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    clsCrowdInfo.level === 'low' ? 'bg-green-500' :
                    clsCrowdInfo.level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                  )} />
                  <span className="text-xs text-muted-foreground capitalize">
                    {clsCrowdInfo.level}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrainCard;
