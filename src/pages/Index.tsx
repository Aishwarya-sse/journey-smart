// Landing Page

import { Link } from 'react-router-dom';
import { Train, ArrowRight, Sparkles, Shield, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="hero-gradient min-h-[80vh] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="container relative z-10 text-center py-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Train className="w-10 h-10 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-3xl text-primary-foreground">RailBook</span>
          </div>
          
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-primary-foreground mb-6 max-w-3xl mx-auto leading-tight">
            Book Train Tickets with Smart Predictions
          </h1>
          
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Know crowd levels, comfort scores, and travel recommendations before you book. Travel smarter.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/search">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-8">
                Book Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-white/10">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">Why Choose RailBook?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Sparkles, title: 'Smart Predictions', desc: 'AI-powered crowd level predictions' },
              { icon: Shield, title: 'Secure Booking', desc: 'Safe payments with QR tickets' },
              { icon: Clock, title: 'Instant Booking', desc: 'Book tickets in minutes' },
              { icon: Users, title: 'Travel Tips', desc: 'Personalized recommendations' },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/50">
        <div className="container text-center">
          <h2 className="font-heading text-2xl font-bold mb-4">Ready to Travel?</h2>
          <p className="text-muted-foreground mb-6">Create an account and start booking tickets today.</p>
          <Link to="/signup">
            <Button size="lg">Get Started Free</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 RailBook. Demo Application - Client-side only.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
