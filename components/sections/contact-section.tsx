"use client"

import { Phone, Mail, MapPin, MessageCircle, Facebook, Instagram, Clock } from "lucide-react"
import companyData from "@/data/company.json"

export default function ContactSection() {
  const handleWhatsApp = () => {
    window.open(`https://wa.me/${companyData.contact.whatsapp.replace(/[^0-9]/g, "")}`, "_blank")
  }

  const handleFacebookMessenger = () => {
    window.open(`https://m.me/${companyData.contact.facebookPageId}`, "_blank")
  }

  const handleCall = () => {
    window.open(`tel:${companyData.contact.phone}`, "_self")
  }

  const handleEmail = () => {
    window.open(`mailto:${companyData.contact.email}`, "_self")
  }

  return (
    <section id="contact" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            Let's <span className="text-gradient">Rock Together</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to make your live performance unforgettable? Contact us today for a free consultation and quote.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-display font-bold mb-8">Get In Touch</h3>

            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-center space-x-4 p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-[hsl(var(--primary))]/20 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Phone</div>
                  <div className="text-muted-foreground">{companyData.contact.phone}</div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-4 p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-[hsl(var(--primary))]/20 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Email</div>
                  <div className="text-muted-foreground">{companyData.contact.email}</div>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-4 p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-[hsl(var(--primary))]/20 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Studio Location</div>
                  <div className="text-muted-foreground">
                    {companyData.address.street}
                    <br />
                    {companyData.address.city} {companyData.address.zipCode}
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start space-x-4 p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-[hsl(var(--primary))]/20 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Business Hours</div>
                  <div className="text-muted-foreground">
                    Mon - Fri: 9:00 AM - 6:00 PM
                    <br />
                    Sat - Sun: 10:00 AM - 4:00 PM
                    <br />
                    <span className="text-primary font-semibold">24/7 for Live Events!</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8">
              <h4 className="font-semibold mb-4">Follow Our Rock Journey</h4>
              <div className="flex space-x-4">
                <a
                  href={companyData.contact.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-[hsl(var(--primary))]/20 rounded-full flex items-center justify-center hover:bg-[hsl(var(--primary))] hover:text-primary-foreground transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href={companyData.contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-[hsl(var(--primary))]/20 rounded-full flex items-center justify-center hover:bg-[hsl(var(--primary))] hover:text-primary-foreground transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Actions & Map */}
          <div>
            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-2xl font-display font-bold mb-6">Quick Contact</h3>
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={handleWhatsApp}
                  className="bg-[hsl(var(--primary))] text-primary-foreground p-6 rounded-xl hover:bg-[hsl(var(--primary))]/90 transition-colors flex items-center space-x-3 glow-hover"
                >
                  <MessageCircle className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold">WhatsApp</div>
                    <div className="text-sm opacity-90">Instant Response for Bookings</div>
                  </div>
                </button>

                <button
                  onClick={handleFacebookMessenger}
                  className="bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-3"
                >
                  <MessageCircle className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold">Facebook Messenger</div>
                    <div className="text-sm opacity-90">Chat with us on Facebook</div>
                  </div>
                </button>

                <button
                  onClick={handleCall}
                  className="bg-secondary hover:bg-accent border border-border hover:border-primary/50 p-6 rounded-xl transition-colors flex items-center space-x-3"
                >
                  <Phone className="w-6 h-6 text-primary" />
                  <div className="text-left">
                    <div className="font-semibold">Call Direct</div>
                    <div className="text-sm text-muted-foreground">Speak to our sound engineer</div>
                  </div>
                </button>

                <button
                  onClick={handleEmail}
                  className="bg-secondary hover:bg-accent border border-border hover:border-primary/50 p-6 rounded-xl transition-colors flex items-center space-x-3"
                >
                  <Mail className="w-6 h-6 text-primary" />
                  <div className="text-left">
                    <div className="font-semibold">Send Email</div>
                    <div className="text-sm text-muted-foreground">Detailed event planning</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Map */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <h4 className="font-semibold">Our Rock Studio</h4>
                <p className="text-sm text-muted-foreground">Trece Martires, Cavite</p>
              </div>
              <div className="aspect-video bg-secondary/30 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                  <p className="text-muted-foreground">Interactive Map</p>
                  <p className="text-sm text-muted-foreground">
                    {companyData.address.street}
                    <br />
                    {companyData.address.city}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coverage Area */}
        <div className="mt-16 text-center bg-secondary/30 rounded-3xl p-8">
          <h3 className="text-2xl font-display font-bold mb-4">We Rock These Areas</h3>
          <p className="text-lg text-muted-foreground mb-6">{companyData.coverage}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {["Cavite Province", "Metro Manila", "Laguna", "Batangas"].map((area) => (
              <div key={area} className="bg-card p-4 rounded-xl border border-border">
                <div className="font-semibold text-sm">{area}</div>
              </div>
            ))}
          </div>
          <p className="text-primary font-bold mt-4">🤘 Ready to Rock Your Event! 🤘</p>
        </div>
      </div>
    </section>
  )
}
