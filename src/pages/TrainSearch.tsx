// Train Search Page

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  MapPin, 
  ArrowRightLeft,
  Train,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import Header from '@/components/Header';
import TrainCard from '@/components/TrainCard';
import { stations, generateTrains, popularRoutes } from '@/data/mockData';
import { Train as TrainType, classTypeNames, ClassType } from '@/types/railway';
import { saveSearchHistory } from '@/utils/storage';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const TrainSearch = () => {
  const navigate = useNavigate();
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [journeyDate, setJourneyDate] = useState<Date | undefined>(new Date());
  const [classFilter, setClassFilter] = useState<ClassType | 'all'>('all');
  const [searchResults, setSearchResults] = useState<TrainType[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter stations for autocomplete
  const fromStations = useMemo(() => 
    stations.filter(s => 
      !toStation || s.code !== toStation
    ), [toStation]
  );

  const toStations = useMemo(() => 
    stations.filter(s => 
      !fromStation || s.code !== fromStation
    ), [fromStation]
  );

  const swapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const handleSearch = async () => {
    if (!fromStation || !toStation) {
      toast.error('Please select both stations');
      return;
    }
    if (!journeyDate) {
      toast.error('Please select a journey date');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const trains = generateTrains(fromStation, toStation);
    
    // Apply class filter
    let filteredTrains = trains;
    if (classFilter !== 'all') {
      filteredTrains = trains.filter(t => 
        t.classes.some(c => c.type === classFilter)
      );
    }
    
    setSearchResults(filteredTrains);
    setHasSearched(true);
    saveSearchHistory(fromStation, toStation);
    setLoading(false);

    if (filteredTrains.length === 0) {
      toast.info('No trains found for this route');
    }
  };

  const handleTrainSelect = (train: TrainType, classType: string) => {
    if (!journeyDate) return;
    
    // Navigate to booking page with selected train and class
    navigate('/booking', {
      state: {
        train,
        classType,
        journeyDate: format(journeyDate, 'yyyy-MM-dd'),
      },
    });
  };

  const handleQuickRoute = (from: string, to: string) => {
    setFromStation(from);
    setToStation(to);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Search Section */}
      <section className="hero-gradient py-10 md:py-16">
        <div className="container">
          <div className="text-center text-primary-foreground mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
              Search Trains
            </h1>
            <p className="text-lg opacity-90">
              Find the best trains with smart crowd predictions
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-card rounded-2xl shadow-xl p-4 md:p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* From Station */}
              <div className="md:col-span-4">
                <Label className="text-muted-foreground mb-1.5 block">From</Label>
                <Select value={fromStation} onValueChange={setFromStation}>
                  <SelectTrigger className="h-12">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-primary shrink-0" />
                      <SelectValue placeholder="Select station" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-popover max-h-60">
                    {fromStations.map(station => (
                      <SelectItem key={station.code} value={station.code}>
                        <div className="flex flex-col">
                          <span className="font-medium">{station.city}</span>
                          <span className="text-xs text-muted-foreground">{station.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Swap Button */}
              <div className="md:col-span-1 flex items-end justify-center pb-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-10 w-10"
                  onClick={swapStations}
                >
                  <ArrowRightLeft size={16} />
                </Button>
              </div>

              {/* To Station */}
              <div className="md:col-span-4">
                <Label className="text-muted-foreground mb-1.5 block">To</Label>
                <Select value={toStation} onValueChange={setToStation}>
                  <SelectTrigger className="h-12">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-primary shrink-0" />
                      <SelectValue placeholder="Select station" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-popover max-h-60">
                    {toStations.map(station => (
                      <SelectItem key={station.code} value={station.code}>
                        <div className="flex flex-col">
                          <span className="font-medium">{station.city}</span>
                          <span className="text-xs text-muted-foreground">{station.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="md:col-span-3">
                <Label className="text-muted-foreground mb-1.5 block">Journey Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-12 w-full justify-start text-left font-normal",
                        !journeyDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4 text-primary" />
                      {journeyDate ? format(journeyDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={journeyDate}
                      onSelect={setJourneyDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Class Filter */}
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Label className="text-muted-foreground">Class:</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={classFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setClassFilter('all')}
                >
                  All Classes
                </Button>
                {(['SL', '3A', '2A', '1A', 'CC'] as ClassType[]).map(cls => (
                  <Button
                    key={cls}
                    variant={classFilter === cls ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setClassFilter(cls)}
                  >
                    {classTypeNames[cls]}
                  </Button>
                ))}
              </div>
            </div>

            {/* Search Button */}
            <Button 
              className="w-full mt-6 h-12" 
              size="lg"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse">Searching trains...</span>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Search Trains
                </>
              )}
            </Button>
          </div>

          {/* Quick Routes */}
          {!hasSearched && (
            <div className="mt-6 text-center">
              <p className="text-primary-foreground/80 text-sm mb-3">Popular Routes</p>
              <div className="flex flex-wrap justify-center gap-2">
                {popularRoutes.map(route => (
                  <Button
                    key={route.label}
                    variant="secondary"
                    size="sm"
                    className="bg-white/10 text-primary-foreground hover:bg-white/20 border-0"
                    onClick={() => handleQuickRoute(route.from, route.to)}
                  >
                    {route.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Search Results */}
      {hasSearched && (
        <section className="py-8 md:py-12">
          <div className="container">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="font-heading text-xl font-semibold">
                  {searchResults.length} Trains Found
                </h2>
                <p className="text-muted-foreground text-sm">
                  {stations.find(s => s.code === fromStation)?.city} → {' '}
                  {stations.find(s => s.code === toStation)?.city} • {' '}
                  {journeyDate && format(journeyDate, 'EEEE, dd MMM yyyy')}
                </p>
              </div>
              
              {/* Smart Features Legend */}
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-1.5 text-sm">
                  <Sparkles size={14} className="text-secondary" />
                  <span className="text-muted-foreground">Smart Features</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <TrendingUp size={14} className="text-primary" />
                  <span className="text-muted-foreground">Crowd Prediction</span>
                </div>
              </div>
            </div>

            {/* Train Cards */}
            {searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map(train => (
                  <TrainCard
                    key={train.id}
                    train={train}
                    journeyDate={journeyDate ? format(journeyDate, 'yyyy-MM-dd') : ''}
                    onSelect={handleTrainSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Train className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-heading text-xl font-semibold mb-2">
                  No Trains Found
                </h3>
                <p className="text-muted-foreground">
                  Try searching for a different route or date
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section (shown before search) */}
      {!hasSearched && (
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="text-center mb-10">
              <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">
                Smart Booking Features
              </h2>
              <p className="text-muted-foreground">
                Make informed decisions with our intelligent booking system
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  icon: '🎯',
                  title: 'Crowd Predictions',
                  description: 'Know how crowded your train will be before booking'
                },
                {
                  icon: '⭐',
                  title: 'Comfort Scores',
                  description: 'Rate-based seat comfort to help you choose wisely'
                },
                {
                  icon: '💡',
                  title: 'Smart Recommendations',
                  description: 'Get personalized travel suggestions'
                }
              ].map((feature, i) => (
                <div key={i} className="text-center p-6 rounded-xl bg-card border">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="font-heading font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default TrainSearch;
