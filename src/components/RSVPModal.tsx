import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RSVPModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RSVPModal = ({ open, onOpenChange }: RSVPModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    grade: "",
    referrer: "",
    dietary: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);
      toast.success("Mission Accepted!", {
        description: "Welcome to the team, Agent! Check your email for details.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        contact: "",
        grade: "",
        referrer: "",
        dietary: "",
      });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-2 border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-3xl font-display text-center text-primary tracking-wider">
            ACCEPT MISSION
          </DialogTitle>
          <div className="h-px bg-primary/30 my-2"></div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-primary text-sm font-semibold tracking-wide">
              FIRST NAME
            </Label>
            <Input
              id="firstName"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="bg-background/60 border-primary/30 focus:border-primary focus:ring-primary/20 text-foreground"
              placeholder="Enter first name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-primary text-sm font-semibold tracking-wide">
              LAST NAME
            </Label>
            <Input
              id="lastName"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="bg-background/60 border-primary/30 focus:border-primary focus:ring-primary/20 text-foreground"
              placeholder="Enter last name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact" className="text-primary text-sm font-semibold tracking-wide">
              PHONE OR EMAIL
            </Label>
            <Input
              id="contact"
              required
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="bg-background/60 border-primary/30 focus:border-primary focus:ring-primary/20 text-foreground"
              placeholder="Phone or email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade" className="text-primary text-sm font-semibold tracking-wide">
              GRADE LEVEL
            </Label>
            <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
              <SelectTrigger className="bg-background/60 border-primary/30 focus:border-primary focus:ring-primary/20">
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent className="bg-card border-primary/30">
                <SelectItem value="9th">9th Grade</SelectItem>
                <SelectItem value="10th">10th Grade</SelectItem>
                <SelectItem value="11th">11th Grade</SelectItem>
                <SelectItem value="12th">12th Grade</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referrer" className="text-primary text-sm font-semibold tracking-wide">
              WHO INVITED YOU? <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="referrer"
              value={formData.referrer}
              onChange={(e) => setFormData({ ...formData, referrer: e.target.value })}
              className="bg-background/60 border-primary/30 focus:border-primary focus:ring-primary/20 text-foreground"
              placeholder="Friend's name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietary" className="text-primary text-sm font-semibold tracking-wide">
              DIETARY RESTRICTIONS? <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="dietary"
              value={formData.dietary}
              onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
              className="bg-background/60 border-primary/30 focus:border-primary focus:ring-primary/20 text-foreground"
              placeholder="Any restrictions?"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-display text-lg tracking-wider py-6 button-shine glow-cyan"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                DEPLOYING...
              </>
            ) : (
              "DEPLOY NOW ▶"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By submitting, you agree to receive event updates
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RSVPModal;
