import { Award, Users, Calendar, Target } from "lucide-react"
import aboutData from "@/data/about.json"
import Image from "next/image"

export default function AboutSection() {
  return (
    <section id="about" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            About <span className="text-gradient">Us</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{aboutData.company.mission}</p>
        </div>

        {/* Company Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-3xl font-display font-bold mb-6">Our Story</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">{aboutData.company.story}</p>

            {/* Company Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-bg-[hsl(var(--secondary)/0.5)]
 rounded-xl">
                <div className="text-2xl font-bold text-primary">Founded</div>
                <div className="text-muted-foreground">{aboutData.company.founded}</div>
              </div>
              <div className="text-center p-4 bg-bg-[hsl(var(--secondary)/0.5)]
 rounded-xl">
                <div className="text-2xl font-bold text-primary">6+</div>
                <div className="text-muted-foreground">Years Experience</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <img src="/placeholder.svg?height=500&width=600" alt="LEGATO Team" className="rounded-2xl shadow-2xl" />
            <div className="absolute -bottom-6 -right-6 bg-[hsl(var(--primary))] text-primary-foreground p-6 rounded-2xl">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm">Events Completed</div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-card p-8 rounded-2xl border border-border">
            <Target className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-muted-foreground">{aboutData.company.mission}</p>
          </div>
          <div className="bg-card p-8 rounded-2xl border border-border">
            <Award className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-muted-foreground">{aboutData.company.vision}</p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h3 className="text-3xl font-display font-bold text-center mb-12">Our Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutData.company.values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-secondary/30 rounded-xl">
                <div className="w-16 h-16 bg-[hsl(var(--primary))]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">{index + 1}</span>
                </div>
                <h4 className="font-semibold">{value}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h3 className="text-3xl font-display font-bold text-center mb-12">
            Meet Our <span className="text-gradient">Team</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aboutData.team.map((member) => (
              <div
                key={member.id}
                className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
              >
                <div className="aspect-square relative">
                  <Image
                    width={300}
                    height={300}
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold mb-1">{member.name}</h4>
                  <p className="text-primary font-semibold mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground mb-3">{member.specialization}</p>
                  <p className="text-xs text-muted-foreground mb-4">{member.bio}</p>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm">{member.experience}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="mt-20 bg-secondary/30 rounded-3xl p-8 lg:p-12">
          <h3 className="text-3xl font-display font-bold text-center mb-12">Our Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutData.achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[hsl(var(--primary))] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="font-semibold">{achievement}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
