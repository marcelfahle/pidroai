import GameTable from "@/components/game-table";

export default function Home() {
  return (
    <div className="">
      <main className="">
        <GameTable />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
