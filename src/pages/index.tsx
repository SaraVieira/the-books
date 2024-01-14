import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function Home({}) {
  return (
    <>
      <h1 className="text-center text-2xl font-bold mb-12">The books</h1>
      <div className="grid grid-cols-4">
        <div>
          <div className="space-y-1">
            <h4 className="text-base font-medium leading-none">Travel</h4>
          </div>
          <Separator className="my-4" />
          <div className="flex h-5 items-center space-x-4 text-sm">
            <div>
              <Link href={"/countries"}>Countries</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
