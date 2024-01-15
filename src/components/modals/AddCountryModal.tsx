import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { SearchSelect } from "../searchSelect";
import { Button } from "../ui/button";
import { countries as countryInfo } from "@/lib/countries";

export const AddCountryModal = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [currentCountry, setCurrentCountry] = useState<any>();
  const [open, setIsOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsOpen(router.query.key === process.env.NEXT_PUBLIC_KEY);
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
    <Dialog open={open} onOpenChange={setIsOpen}>
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
  );
};
