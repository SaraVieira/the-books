import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  DialogFooter,
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { countries as countryInfo } from "@/lib/countries";
import { SearchSelect } from "../searchSelect";

export const AddConferenceModal = () => {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [open, setIsOpen] = useState(false);
  const [country, setCountry] = useState({});
  const [city, setCity] = useState("");
  const [link, setLink] = useState("");
  const [name, setName] = useState("");

  const onAddConference = async () => {
    await fetch(`/api/db`, {
      method: "POST",
      body: JSON.stringify({
        data: {
          name,
          notes,
          country,
          city,
          link,
        },
        collection: "conferences",
      }),
    });
    setNotes("");
    setIsOpen(false);
    setCountry({});
    setCity("");
    setLink("");
    setName("");
    router.replace("/conferences", undefined);
  };

  useEffect(() => {
    setIsOpen(router.query.key === process.env.NEXT_PUBLIC_KEY);
  }, []);

  const onChange = async (name: string) => {
    const data = await fetch(
      `https://restcountries.com/v3.1/alpha/${name}`
    ).then((rsp) => rsp.json());
    setCountry({
      name: data[0].name.common,
      region: data[0].region,
      flag: data[0].flags.png,
      location: data[0].latlng,
      subregion: data[0].subregion,
    });
  };
  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a conference</DialogTitle>
          <div className="pt-4 flex flex-col gap-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Conference Name"
            />
            <Input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Conference Website"
            />
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Conference City"
            />
            <SearchSelect
              data={countryInfo.map((c) => ({
                value: c.code,
                label: c.name,
              }))}
              onChange={onChange}
            />
            <Textarea
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button disabled={!name || !city} onClick={onAddConference}>
            Add Conference
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
