import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const countryCodes = [
  { name: "India", dial_code: "+91", code: "IN" },
  { name: "United States", dial_code: "+1", code: "US" },
  { name: "United Kingdom", dial_code: "+44", code: "GB" },
  { name: "Australia", dial_code: "+61", code: "AU" },
  { name: "Canada", dial_code: "+1", code: "CA" },
  { name: "Singapore", dial_code: "+65", code: "SG" },
  { name: "United Arab Emirates", dial_code: "+971", code: "AE" },
  // Add more countries as needed
];

const DonateFormPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    amount: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("donations_interest").insert([{
        donor_name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: `${selectedCountryCode} ${formData.phone}`,
        amount: parseFloat(formData.amount),
      }]);

      if (error) throw error;

      toast({
        title: "Thank You for Your Generosity",
        description: "Your willingness to contribute to the well-being of others is deeply appreciated. We will reach out to you soon to complete your donation. Your support helps us continue our humanitarian efforts.",
      });

      navigate("/donation");
    } catch (error) {
      console.error("Donation submission error:", error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please check the console for details and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/donation")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Donation Page
        </Button>

        <div className="space-y-8">
          <div className="text-center space-y-4 pb-8">
            <div className="flex justify-center">
              <div className="bg-primary/10 p-4 rounded-full">
                <Heart className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              Express Your Interest to Donate
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              If you wish to donate, please fill out this form, and we will reach out to you soon.
            </p>
          </div>

          <div className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-primary border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="flex items-center gap-2">
                      <Select value={selectedCountryCode} onValueChange={setSelectedCountryCode}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Code" />
                        </SelectTrigger>
                        <SelectContent>
                          {countryCodes.map((country) => (
                            <SelectItem key={country.code} value={country.dial_code}>
                              {country.dial_code} ({country.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="XXXXX XXXXX"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Donation Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-primary border-b pb-2">Donation Amount</h3>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    required
                    min="1"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="Enter amount in INR"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 space-y-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-lg py-6"
                  disabled={isSubmitting}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  By submitting this form, you express your interest in making a donation. We will contact you to complete the process.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateFormPage;
