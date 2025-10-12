import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle2, Download } from "lucide-react";
import { toast } from "sonner";
import { createRSVP, type User } from "@/lib/supabase";
import QRCode from "qrcode";
import { buildAndDownloadPoster } from "@/lib/poster";

interface RSVPModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  referralCode?: string;
}

const RSVPModal = ({ open, onOpenChange, referralCode }: RSVPModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newUser, setNewUser] = useState<User | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    grade: "",
    referrer: "",
    dietary: "",
  });

  // Generate QR code when user is created
  useEffect(() => {
    if (newUser) {
      // const inviteUrl = `${window.location.origin}?ref=${newUser.referral_code}`;
      const inviteUrl = `https://mission-countdown-hq.vercel.app?ref=${newUser.referral_code}`;
      QRCode.toDataURL(inviteUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#00d9ff",
          light: "#000000",
        },
      }).then(setQrCodeUrl);
    }
  }, [newUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await createRSVP({
        firstName: formData.firstName,
        lastName: formData.lastName,
        contact: formData.contact,
        grade: formData.grade,
        referrer: formData.referrer,
        dietary: formData.dietary,
        referredByCode: referralCode,
      });

      setNewUser(user);
      setShowSuccess(true);
      toast.success("Mission Accepted! 🎯", {
        description: "Check your email for mission details.",
      });
    } catch (error) {
      console.error("RSVP error:", error);
      toast.error("Mission Failed", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement("a");
    link.download = `countdown-invite-${newUser?.referral_code}.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      contact: "",
      grade: "",
      referrer: "",
      dietary: "",
    });
    setShowSuccess(false);
    setNewUser(null);
    setQrCodeUrl("");
    onOpenChange(false);
  };

  if (showSuccess && newUser) {
    return (
      <Dialog open={open} onOpenChange={resetForm}>
        <DialogContent className="sm:max-w-[500px] bg-card border-2 border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-3xl font-display text-center text-primary tracking-wider">
              MISSION ACCEPTED
            </DialogTitle>
            <div className="h-px bg-primary/30 my-2"></div>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="flex items-center justify-center gap-3 text-success">
              <CheckCircle2 className="w-12 h-12" />
              <div>
                <p className="text-xl font-display">Welcome, Agent {newUser.first_name}!</p>
                <p className="text-sm text-muted-foreground">Your code: {newUser.referral_code}</p>
              </div>
            </div>

            <div className="bg-background/60 p-6 rounded-lg border border-primary/20">
              <h3 className="text-lg font-display text-primary mb-4 text-center">
                YOUR RECRUITMENT QR CODE
              </h3>
              {qrCodeUrl && (
                <div className="flex flex-col items-center gap-4">
                  <img src={qrCodeUrl} alt="Your invite QR code" className="w-64 h-64 rounded" />
                  <p className="text-sm text-center text-muted-foreground">
                    Share this code to recruit your team!<br />
                    Every signup through your code increases your leaderboard rank.
                  </p>

                  {/*  QR download */}
                  {/* <Button
                    onClick={downloadQRCode}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button> */}

                  // where you call it in RSVPModal success UI
                  <Button
                    onClick={() =>
                      buildAndDownloadPoster({
                        referralCode: newUser.referral_code,
                        xPct: 9.2,
                        yPct: 84.0,
                        wPct: 22.5,
                      })
                    }
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Share Poster (PNG)
                  </Button>

                </div>
              )}

            </div>

            <div className="bg-background/60 p-4 rounded-lg border border-secondary/20">
              <p className="text-sm text-center text-foreground">
                <span className="text-secondary font-semibold">Want to be in the Top 5?</span><br />
                Share your QR code on Instagram, Snapchat, or text it to friends!
              </p>
            </div>

            <Button
              onClick={resetForm}
              className="w-full bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-display text-lg tracking-wider py-6"
            >
              GOT IT ▶
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-2 border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-3xl font-display text-center text-primary tracking-wider">
            ACCEPT MISSION
          </DialogTitle>
          <div className="h-px bg-primary/30 my-2"></div>
        </DialogHeader>

        {referralCode && (
          <div className="bg-success/10 border border-success/30 p-3 rounded text-center">
            <p className="text-sm text-success font-semibold">
              ✓ Referred by a friend - they'll get credit when you sign up!
            </p>
          </div>
        )}

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