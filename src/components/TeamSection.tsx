import fabianImg from "@/assets/team-fabian.png";
import michaelImg from "@/assets/team-michael.png";
import patriciaImg from "@/assets/team-patricia.png";
import laraImg from "@/assets/team-lara.png";
import bahadirImg from "@/assets/team-bahadir.png";
import christianImg from "@/assets/team-christian.png";

const team = [
  { name: "Fabian", title: "Hyperfocus Activated", img: fabianImg },
  { name: "Michael", title: "Spreadsheet Overlord (Fun Not Budgeted)", img: michaelImg },
  { name: "Patricia", title: "Mandatory Good Vibes Officer", img: patriciaImg },
  { name: "Lara", title: "Chief You're On Camera Now", img: laraImg },
  { name: "Bahadir", title: "Too Likeable To Be This Technical", img: bahadirImg },
  { name: "Christian", title: "Does Not Require Social Interaction To Function", img: christianImg },
];

const TeamSection = () => {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="font-pixel text-lg md:text-xl text-secondary text-glow-pink mb-4">
          DAS TEAM
        </h2>
        <p className="text-muted-foreground mb-16 text-sm md:text-base">
          Sechs Menschen. Ein Ziel. Null Langeweile.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className="rounded-lg bg-card neon-border-cyan p-5 text-left transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_24px_hsl(var(--primary)/0.45)]"
            >
              <div className="aspect-square overflow-hidden rounded mb-4">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-pixel text-xs text-foreground mb-1">{member.name}</h3>
              <p className="text-secondary italic text-sm">{member.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
