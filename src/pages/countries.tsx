import { AddCountryModal } from "@/components/modals/AddCountryModal";
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
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import clientPromise from "@/lib/mongodb";
import { ChevronLeft } from "lucide-react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import Map from "@/components/Map";

export const getServerSideProps: GetServerSideProps<any> = async () => {
  const client = await clientPromise;
  const db = client.db("the_books");

  const countries = await db.collection("countries").find().toArray();
  return {
    props: { countries: JSON.parse(JSON.stringify(countries)) },
  };
};

export default function Countries({ countries }: any) {
  return (
    <>
      <Link href={"/"} className="mb-8 flex gap-2">
        <ChevronLeft /> Go back
      </Link>
      <AddCountryModal />
      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <Table>
            <TableCaption>Visited Countries</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Flag</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Subregion</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {countries.map((country) => (
                <TableRow key={country._id}>
                  <TableCell className="font-medium">
                    <img src={country.flag} alt={country.name} />
                  </TableCell>
                  <TableCell>{country.name}</TableCell>
                  <TableCell>{country.region}</TableCell>
                  <TableCell>{country.subregion}</TableCell>
                  <TableCell>{country.currency}</TableCell>
                  <TableCell>
                    <a
                      href={`https://www.google.com/maps/@${country.location.join(
                        ","
                      )},10z?entry=ttu`}
                      target="_blank"
                    >
                      Location
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5}>Total</TableCell>
                <TableCell>{countries.length}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TabsContent>
        <TabsContent
          value="map"
          className="min-h-[600px] overflow-hidden rounded-[14px]"
        >
          <ParentSize>
            {({ width }) => (
              <Map width={width} height={600} countries={countries} />
            )}
          </ParentSize>
        </TabsContent>
      </Tabs>
    </>
  );
}
