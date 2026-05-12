import Link from "next/link";

const Navabar = () => {
  return (
    <nav className="relative font-bebasNeue flex justify-between items-center px-6 py-4">
      <div className="flex gap-x-6 text-xl">
        <Link
          href="/#how-it-work"
          className="transition-colors hover:text-accent"
        >
          How it work?
        </Link>
        <Link href="/blog" className="transition-colors hover:text-accent">
          Blog
        </Link>
      </div>
      <h1 className="absolute left-1/2 -translate-x-1/2 text-3xl">
        Rotten & Fresh
      </h1>
      <div className="flex gap-x-6 text-xl">
        <Link href="/about" className="transition-colors hover:text-accent">
          about
        </Link>
        <Link
          href="/playground"
          className="transition-colors hover:text-accent"
        >
          Try now!
        </Link>
      </div>
    </nav>
  );
};

export default Navabar;
