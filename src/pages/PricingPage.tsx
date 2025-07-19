import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/AuthContext';
import { PaymentService } from '@/lib/payment';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PricingPage() {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [isLoading, setIsLoading] = useState(false);

  const prices = {
    monthly: {
      price: 14.99,
      priceId: 'price_monthly',
      savingsPercentage: 0,
    },
    yearly: {
      price: 99,
      priceId: 'price_yearly',
      savingsPercentage: 45,
    }
  };

  const features = [
    { name: 'Unlimited Resume & Cover Letter Exports', free: false, premium: true },
    { name: 'Unlimited AI-Powered Content Generation', free: false, premium: true },
    { name: 'Multiple Public Profile Pages', free: false, premium: true },
    { name: 'Access to All Premium Templates', free: false, premium: true },
    { name: 'Priority Customer Support', free: false, premium: true },
    { name: 'Basic Resume Templates', free: true, premium: true },
    { name: '1 Public Profile', free: true, premium: true },
    { name: '2 AI-Powered Content Generations', free: true, premium: true },
    { name: '1 Resume or Cover Letter Export', free: true, premium: true },
  ];

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      // Redirect to signup if not logged in
      return;
    }

    setIsLoading(true);
    try {
      const checkoutUrl = await PaymentService.createCheckoutSession(
        user.id,
        priceId,
        window.location.origin + '/dashboard', // Success URL
        window.location.origin + '/pricing' // Cancel URL
      );
      
      // Redirect to checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-br from-white to-primary-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Simple, transparent pricing
                </h1>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Choose the plan that's right for your job search
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${billingCycle === 'monthly' ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                  Monthly
                </span>
                <Switch
                  checked={billingCycle === 'yearly'}
                  onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
                />
                <span className={`text-sm ${billingCycle === 'yearly' ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                  Yearly <span className="text-xs text-primary font-medium">(Save {prices.yearly.savingsPercentage}%)</span>
                </span>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Free Tier */}
              <Card className="border-2 border-muted flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl">Free</CardTitle>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="ml-1 text-sm text-muted-foreground">/forever</span>
                  </div>
                  <CardDescription className="mt-2">
                    Basic tools to get started with your job search.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className={`mr-2 h-4 w-4 ${feature.free ? 'text-primary' : 'text-muted'}`} />
                        <span className={!feature.free ? 'text-muted-foreground line-through' : ''}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to={user ? '/dashboard' : '/signup'} className="w-full">
                    <Button variant="outline" className="w-full">
                      {user ? 'Access Dashboard' : 'Sign Up Free'}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              
              {/* Premium Tier */}
              <Card className="border-2 border-primary flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0">
                  <div className="bg-primary text-white text-xs font-medium px-3 py-1 rotate-45 translate-x-[30%] translate-y-[10%]">
                    POPULAR
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">Premium</CardTitle>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold">${billingCycle === 'monthly' ? prices.monthly.price : prices.yearly.price}</span>
                    <span className="ml-1 text-sm text-muted-foreground">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                  </div>
                  <CardDescription className="mt-2">
                    {billingCycle === 'yearly' && (
                      <div className="text-primary text-sm font-medium">
                        Save ${(prices.monthly.price * 12 - prices.yearly.price).toFixed(2)} annually
                      </div>
                    )}
                    Everything you need for professional job applications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className={`mr-2 h-4 w-4 ${feature.premium ? 'text-primary' : 'text-muted'}`} />
                        <span className={!feature.premium ? 'text-muted-foreground line-through' : ''}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {user ? (
                    <Button
                      className="w-full bg-primary hover:bg-primary-600"
                      onClick={() => handleSubscribe(billingCycle === 'monthly' ? prices.monthly.priceId : prices.yearly.priceId)}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Subscribe Now'}
                    </Button>
                  ) : (
                    <Link to="/signup" className="w-full">
                      <Button className="w-full bg-primary hover:bg-primary-600">
                        Sign Up
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter">
                  Frequently Asked Questions
                </h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Everything you need to know about our pricing and features
                </p>
              </div>
            </div>
            <div className="mx-auto mt-12 grid max-w-4xl gap-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Can I cancel my subscription at any time?</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your billing period.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">What happens to my documents if I downgrade?</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  All of your created documents remain accessible. However, you will be limited to the Free plan's export and generation quotas for new actions.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Do you offer refunds?</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  We offer a 7-day money-back guarantee for annual subscriptions. Monthly subscriptions are non-refundable.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Can I switch between monthly and yearly billing?</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Yes, you can switch from monthly to yearly at any time. If you switch from yearly to monthly, the change will take effect after your current yearly subscription ends.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter">
                  What our users say
                </h2>
              </div>
            </div>
            <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
              <Card className="border-0 bg-card shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <img
                        src="https://placehold.co/100x100/7C3AED/FFFFFF/png?text=JD"
                        alt="John Doe"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-base font-semibold">John Doe</p>
                      <p className="text-sm text-gray-500">Software Engineer</p>
                    </div>
                  </div>
                  <blockquote className="mt-4 border-l-2 border-primary pl-4 italic text-gray-600">
                    "The premium templates helped me stand out in a competitive tech job market. Worth every penny!"
                  </blockquote>
                </CardContent>
              </Card>
              <Card className="border-0 bg-card shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <img
                        src="https://placehold.co/100x100/7C3AED/FFFFFF/png?text=JS"
                        alt="Jane Smith"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-base font-semibold">Jane Smith</p>
                      <p className="text-sm text-gray-500">Marketing Director</p>
                    </div>
                  </div>
                  <blockquote className="mt-4 border-l-2 border-primary pl-4 italic text-gray-600">
                    "After upgrading to Premium, I was able to create multiple tailored resumes for different positions. Got 3 interviews in my first week!"
                  </blockquote>
                </CardContent>
              </Card>
              <Card className="border-0 bg-card shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <img
                        src="https://placehold.co/100x100/7C3AED/FFFFFF/png?text=MT"
                        alt="Mike Thompson"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-base font-semibold">Mike Thompson</p>
                      <p className="text-sm text-gray-500">Product Manager</p>
                    </div>
                  </div>
                  <blockquote className="mt-4 border-l-2 border-primary pl-4 italic text-gray-600">
                    "The annual subscription is a no-brainer. I've used it for job hunting and internal promotion applications throughout the year."
                  </blockquote>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter">
                  Ready to land your next interview?
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Choose the plan that's right for you and start creating professional resumes and cover letters today.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to={user ? '/dashboard' : '/signup'}>
                  <Button size="lg" className="bg-primary hover:bg-primary-600">
                    {user ? 'Go to Dashboard' : 'Start Free'}
                  </Button>
                </Link>
                <Link to="/templates">
                  <Button size="lg" variant="outline">
                    Browse Templates
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}