import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const links = [
  {
    category: "Travel",
    links: [
      {
        link: "/countries",
        label: "Countries",
      },
      {
        link: "/conferences",
        label: "Conferences Spoken",
      },
    ],
  },
  {
    category: "Gaming",
    links: [
      {
        link: "/games",
        label: "Games Finished",
      },
    ],
  },
];

export default function Home() {
  return (
    <>
      <h1 className="text-center text-2xl font-bold mb-12">The books</h1>
      <div className="grid grid-cols-4 gap-4">
        {links.map((link) => (
          <div key={link.category}>
            <div className="space-y-1">
              <h4 className="text-base font-medium leading-none">
                {link.category}
              </h4>
            </div>
            <Separator className="my-4 max-w-[200px]" />
            {link.links.map((l) => (
              <div
                className="flex h-5 items-center space-x-4 text-sm mb-2"
                key={l.link}
              >
                <div>
                  <Link href={l.link}>{l.label}</Link>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
