import type { Metadata } from "next";
import { MastersHubClient } from "@/app/_components/masters-hub/MastersHubClient";
import { Footer } from "@/app/_components/Footer";

export const metadata: Metadata = {
  title: "Мастера — Бодрость и Сила",
  description:
    "Команда мастеров: пар-мастера, релаксологи, тренеры. Все, кто работает в проектах бани, релаксологии и тренировок в Оренбурге.",
};

export default function MastersHubPage() {
  return (
    <main>
      <MastersHubClient />
      <Footer />
    </main>
  );
}
