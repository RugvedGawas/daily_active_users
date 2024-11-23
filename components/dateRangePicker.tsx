"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

// import * as React from "react";
// import { addDays, format, subDays } from "date-fns";
// import { Calendar as CalendarIcon } from "lucide-react";
// import { DateRange } from "react-day-picker";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// export function DateRangePicker({
//   className,
//   onDateChange,
// }: React.HTMLAttributes<HTMLDivElement> & {
//   onDateChange?: (start: string, end: string) => void;
// }) {
//   const [date, setDate] = React.useState<DateRange | undefined>({
//     from: subDays(new Date(), 7),
//     to: new Date(),
//   });

//   const formatDateRange = (range: DateRange | undefined) => {
//     if (!range) return { start: "", end: "" };
//     return {
//       start: range.from ? format(range.from, "yy-MM-dd") : "",
//       end: range.to ? format(range.to, "yy-MM-dd") : "",
//     };
//   };

//   React.useEffect(() => {
//     const { start, end } = formatDateRange(date);
//     if (onDateChange) {
//       onDateChange(start, end);
//     }
//   }, [date, onDateChange]);

//   return (
//     <div className={cn("grid gap-2", className)}>
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             id="date"
//             variant={"outline"}
//             className={cn(
//               "w-[300px] justify-start text-left font-normal",
//               !date && "text-muted-foreground"
//             )}
//           >
//             <CalendarIcon className="mr-2 h-4 w-4" />
//             {date?.from ? (
//               date.to ? (
//                 <>
//                   {format(date.from, "yy-MM-dd")} -{" "}
//                   {format(date.to, "yy-MM-dd")}
//                 </>
//               ) : (
//                 format(date.from, "yy-MM-dd")
//               )
//             ) : (
//               <span>Pick a date</span>
//             )}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align="start">
//           <Calendar
//             initialFocus
//             mode="range"
//             defaultMonth={date?.from}
//             selected={date}
//             onSelect={setDate}
//             numberOfMonths={2}
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }
