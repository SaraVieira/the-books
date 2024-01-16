import { AddConferenceModal } from "@/components/modals/AddConference";
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
import clientPromise from "@/lib/mongodb";
import { ChevronLeft } from "lucide-react";
import { GetServerSideProps } from "next";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps<any> = async () => {
  const client = await clientPromise;
  const db = client.db("the_books");

  const conferences = await db.collection("conferences").find().toArray();
  return {
    props: { conferences: JSON.parse(JSON.stringify(conferences)) },
  };
};

export default function Conferences({ conferences }: any) {
  return (
    <>
      <Link href={"/"} className="mb-8 flex gap-2">
        <ChevronLeft /> Go back
      </Link>
      <AddConferenceModal />
      <Table>
        <TableCaption>Conferences</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Website</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conferences.map((conference) => (
            <TableRow key={conference._id}>
              <TableCell className="font-bold">{conference.name}</TableCell>
              <TableCell>{conference.city}</TableCell>
              <TableCell>
                <div className="flex gap-1 items-center">
                  <img
                    src={conference.country.flag}
                    alt={conference.name}
                    className="w-6 h-auto"
                  />
                  {conference.country.name}
                </div>
              </TableCell>
              <TableCell>
                {conference.link ? <a href={conference.link}>Website</a> : ""}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell>{conferences.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}
