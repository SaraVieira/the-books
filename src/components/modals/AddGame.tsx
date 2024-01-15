import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import {
  DialogFooter,
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";

export const AddGameModal = () => {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [game, setCurrentGame] = useState<any>();
  const [open, setIsOpen] = useState(false);

  const onAddGame = async () => {
    await fetch(`/api/db`, {
      method: "POST",
      body: JSON.stringify({
        data: {
          ...game,
          notes,
          date,
        },
        collection: "games",
      }),
    });
    router.replace("/games", undefined);
  };

  useEffect(() => {
    setIsOpen(router.query.key === process.env.NEXT_PUBLIC_KEY);
  }, []);

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const game = await fetch(`/api/hltb?id=${e.target.value}`).then((rsp) =>
      rsp.json()
    );
    setCurrentGame(game);
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a game</DialogTitle>
          <div className="pt-4 flex flex-col gap-4">
            <Input onChange={onChange} placeholder="Game ID" />
            <Textarea
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "pl-3 text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button disabled={!game} onClick={onAddGame}>
            Add Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
