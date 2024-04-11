import Link from "next/link";

function WelcomeBar() {
  return (
    <header className="flex pl-10 items-center bg-cyan-950 h-20 text-xl text-white font-semibold">
      <Link href="/"> California Collision Insights</Link>
    </header>
  );
}

export default WelcomeBar;
