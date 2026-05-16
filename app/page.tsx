import { Hero } from "./_components/Hero";
import { Banya } from "./_components/Banya";
import { Relax } from "./_components/Relax";
import { Training } from "./_components/Training";
import { Masters } from "./_components/Masters";
import { Locations } from "./_components/Locations";
import { Contact } from "./_components/Contact";
import { Footer } from "./_components/Footer";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <div className="bridge-warm-in" aria-hidden="true" />
      <Banya />
      <div className="bridge-warm-to-cool" aria-hidden="true" />
      <Relax />
      <div className="bridge-cool-to-neutral" aria-hidden="true" />
      <Training />
      <div className="bridge-neutral-to-warm" aria-hidden="true" />
      <Masters
        filterByNames={["Дмитрий", "Александр", "Вадим", "Анна", "Мария"]}
      />
      <div className="bridge-warm-to-cool-2" aria-hidden="true" />
      <Locations />
      <div className="bridge-cool-to-neutral" aria-hidden="true" />
      <Contact />
      <div className="bridge-cool-to-darkneutral" aria-hidden="true" />
      <Footer />
    </main>
  );
}
