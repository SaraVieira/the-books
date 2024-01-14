import { SearchSelect } from "@/components/searchSelect";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { countries as countryInfo } from "@/lib/countries";
import clientPromise from "@/lib/mongodb";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const getServerSideProps: GetServerSideProps<any> = async () => {
  const client = await clientPromise;
  const db = client.db("the_books");

  const countries = await db.collection("countries").find().toArray();
  return {
    props: { countries: JSON.parse(JSON.stringify(countries)) },
  };
};

export default function Countries({ countries }: any) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [currentCountry, setCurrentCountry] = useState<any>();

  useEffect(() => {
    setIsClient(true);
  }, []);
  const onChange = async (name: string) => {
    const data = await fetch(
      `https://restcountries.com/v3.1/alpha/${name}`
    ).then((rsp) => rsp.json());
    setCurrentCountry({
      name: data[0].name.common,
      region: data[0].region,
      flag: data[0].flags.png,
      location: data[0].latlng,
      subregion: data[0].subregion,
      currency: (Object.values(data[0].currencies)[0] as any).name,
    });
  };

  const onAddCountry = async () => {
    await fetch(`/api/db`, {
      method: "POST",
      body: JSON.stringify({
        data: currentCountry,
        collection: "countries",
      }),
    });
    router.replace("/countries", undefined);
  };

  return (
    <>
      <Dialog open={router.query.key === "lol" && isClient}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a country</DialogTitle>
            <div className="pt-4">
              <SearchSelect
                data={countryInfo.map((c) => ({
                  value: c.code,
                  label: c.name,
                }))}
                onChange={onChange}
              />
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button disabled={!currentCountry} onClick={onAddCountry}>
              Add country
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                <img src={country.flag} />
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
    </>
  );
}
