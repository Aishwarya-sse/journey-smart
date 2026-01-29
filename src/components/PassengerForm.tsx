// Passenger Form Component

import { useState } from 'react';
import { Plus, Trash2, User } from 'lucide-react';
import { Passenger } from '@/types/railway';
import { generateId } from '@/utils/storage';
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

interface PassengerFormProps {
  passengers: Passenger[];
  onUpdate: (passengers: Passenger[]) => void;
  maxPassengers?: number;
}

const PassengerForm = ({ passengers, onUpdate, maxPassengers = 6 }: PassengerFormProps) => {
  const addPassenger = () => {
    if (passengers.length >= maxPassengers) return;
    
    const newPassenger: Passenger = {
      id: generateId(),
      name: '',
      age: 0,
      gender: 'M',
      berthPreference: 'none',
    };
    
    onUpdate([...passengers, newPassenger]);
  };

  const updatePassenger = (id: string, field: keyof Passenger, value: string | number) => {
    onUpdate(
      passengers.map(p => 
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  const removePassenger = (id: string) => {
    if (passengers.length <= 1) return;
    onUpdate(passengers.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-lg">Passenger Details</h3>
        <span className="text-sm text-muted-foreground">
          {passengers.length}/{maxPassengers} passengers
        </span>
      </div>

      {passengers.map((passenger, index) => (
        <div 
          key={passenger.id}
          className="p-4 border rounded-lg bg-card animate-fade-in"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User size={16} className="text-primary" />
              </div>
              <span className="font-medium">Passenger {index + 1}</span>
            </div>
            {passengers.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removePassenger(passenger.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor={`name-${passenger.id}`}>Full Name (as per ID)</Label>
              <Input
                id={`name-${passenger.id}`}
                value={passenger.name}
                onChange={(e) => updatePassenger(passenger.id, 'name', e.target.value)}
                placeholder="Enter full name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor={`age-${passenger.id}`}>Age</Label>
              <Input
                id={`age-${passenger.id}`}
                type="number"
                min={1}
                max={120}
                value={passenger.age || ''}
                onChange={(e) => updatePassenger(passenger.id, 'age', parseInt(e.target.value) || 0)}
                placeholder="Age"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor={`gender-${passenger.id}`}>Gender</Label>
              <Select
                value={passenger.gender}
                onValueChange={(value) => updatePassenger(passenger.id, 'gender', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                  <SelectItem value="O">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor={`berth-${passenger.id}`}>Berth Preference</Label>
              <Select
                value={passenger.berthPreference}
                onValueChange={(value) => updatePassenger(passenger.id, 'berthPreference', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="none">No Preference</SelectItem>
                  <SelectItem value="LB">Lower Berth</SelectItem>
                  <SelectItem value="MB">Middle Berth</SelectItem>
                  <SelectItem value="UB">Upper Berth</SelectItem>
                  <SelectItem value="SL">Side Lower</SelectItem>
                  <SelectItem value="SU">Side Upper</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ))}

      {passengers.length < maxPassengers && (
        <Button
          variant="outline"
          onClick={addPassenger}
          className="w-full border-dashed"
        >
          <Plus size={16} className="mr-2" />
          Add Passenger
        </Button>
      )}
    </div>
  );
};

export default PassengerForm;
