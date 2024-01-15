import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import clientPromise from "@/lib/mongodb";
import { GetServerSideProps } from "next";
import { AddGameModal } from "@/components/modals/AddGame";
import { Steam } from "@/components/Icons";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps<any> = async () => {
  const client = await clientPromise;
  const db = client.db("the_books");

  const games = await db
    .collection("games")
    .find()
    .sort({ date: -1 })
    .toArray();
  return {
    props: { games: JSON.parse(JSON.stringify(games)) || [] },
  };
};

export default function Games({ games }: any) {
  return (
    <>
      <Link href={"/"} className="mb-8 block flex gap-2">
        <ChevronLeft /> Go back
      </Link>
      <AddGameModal />

      <Table>
        <TableCaption>Games</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date Finished</TableHead>
            <TableHead>Release</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Summary</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Steam Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game) => (
            <TableRow key={game._id}>
              <TableCell className="font-medium">
                <img src={game.image} />
              </TableCell>
              <TableCell>{game.name}</TableCell>
              <TableCell>
                {game.date ? new Date(game.date).toDateString() : ""}
              </TableCell>
              <TableCell>{new Date(game.release).toDateString()}</TableCell>
              <TableCell>{game.score}/100</TableCell>
              <TableCell>{parseFloat(game.time)}h</TableCell>
              <TableCell className="max-w-[300px]">
                <Dialog>
                  <DialogTrigger className="underline">
                    View Summary
                  </DialogTrigger>
                  <DialogContent>{game.summary}</DialogContent>
                </Dialog>
              </TableCell>
              <TableCell className="max-w-[300px]">
                {game.notes ? (
                  <Dialog>
                    <DialogTrigger className="underline">
                      View notes
                    </DialogTrigger>
                    <DialogContent>{game.notes}</DialogContent>
                  </Dialog>
                ) : null}
              </TableCell>
              <TableCell>
                {!game.steam ? (
                  ""
                ) : (
                  <a
                    href={`https://store.steampowered.com/app/${game.steam}/`}
                    target="_blank"
                    className="flex justify-center w-full"
                  >
                    <Steam />
                  </a>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8}>Total</TableCell>
            <TableCell>{games.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}
