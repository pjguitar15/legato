import Link from "next/link"
import { Facebook, Instagram, Phone, Mail, MapPin, Music } from "lucide-react"
import companyData from "@/data/company.json"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-bg-[hsl(var(--secondary)/0.5)]
 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-gradient">{companyData.name}</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">{companyData.description}</p>
            <div className="flex space-x-4">
              <Link
                href={companyData.contact.facebook}
                target="_blank"
                className="p-2 bg-background rounded-lg hover:bg-accent transition-colors glow-hover"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href={companyData.contact.instagram}
                target="_blank"
                className="p-2 bg-background rounded-lg hover:bg-accent transition-colors glow-hover"
              >
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["Home", "Packages", "Equipment", "Gallery", "Events", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`#${item.toLowerCase()}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">{companyData.contact.phone}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">{companyData.contact.email}</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-primary mt-1" />
                <span className="text-muted-foreground">
                  {companyData.address.street}
                  <br />
                  {companyData.address.city} {companyData.address.zipCode}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © {currentYear} {companyData.name}. All rights reserved. | Rock On! 🤘
          </p>
        </div>
      </div>
    </footer>
  )
}
