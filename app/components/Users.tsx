"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import arrow1 from "../assets/arrows1.drawio-Photoroom.png";
import { DatePickerDemo } from "@/components/dateRangePicker";
import { format } from "date-fns";
import { CalendarIcon, Circle, LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import usermodel from "../assets/usermodel.drawio.png";
import Xarrow from "react-xarrows";

interface DailyData {
  at_risk_mau: number;
  at_risk_wau: number;
  curr: number;
  current_users: number;
  date: string;
  dead_users: number;
  iMAURR: number;
  iWAURR: number;
  mauLoss: number;
  new_users: number;
  nurr: number;
  reactivated_users: number;
  resurrected_users: number;
  rurr: number;
  surr: number;
  wauLoss: number;
}

interface ApiResponse {
  [date: string]: DailyData;
}

type Props = {};

const Users = (props: Props) => {
  useEffect(() => {
    fetchData();
  }, []);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DailyData | null>();
  const [date, setDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    fetchData();
  }, [date]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const formattedDate = date ? format(date, "yyyy/MM/dd") : "";

      console.log("formattedDate", formattedDate);
      const response = await fetch("https://daum.lvl.fit/api/data/daum", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dates: [formattedDate],
        }),
      });

      if (response.ok) {
        const responseData: ApiResponse = await response.json();

        // Extract the data for the specific date
        const dailyData = responseData[formattedDate];

        console.log("Daily Data:", dailyData);
        setData(dailyData);
        setLoading(false);

        console.log("responsedata", responseData);
      }
    } catch (error) {}
  };

  const generateCSV = () => {
    if (!data) return;

    const formattedDate = data.date
      ? format(new Date(data.date), "yyyy-MM-dd")
      : "";

    // Define CSV headers and data
    const headers = [
      "Date",
      "Current Users",
      "New Users",
      "Reactivated Users",
      "Resurrected Users",
      "At Risk WAUs",
      "At Risk MAUs",
      "Dead Users",
      "CURR",
      "NURR",
      "RURR",
      "SURR",
      "iWAURR",
      "iMAURR",
      "WAU Loss Rate",
      "MAU Loss Rate",
    ];

    // Create CSV data row
    const dataRow = [
      formattedDate,
      data.current_users,
      data.new_users,
      data.reactivated_users,
      data.resurrected_users,
      data.at_risk_wau,
      data.at_risk_mau,
      data.dead_users,
      data.curr,
      data.nurr,
      data.rurr,
      data.surr,
      data.iWAURR,
      data.iMAURR,
      data.wauLoss,
      data.mauLoss,
    ];

    // Combine headers and data
    const csvContent = [headers.join(","), dataRow.join(",")].join("\n");

    // Create blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `user_metrics_${data.date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {loading ? (
        <>
          <div className="flex flex-col w-screen h-screen justify-center items-center">
            <div>
              <LoaderCircle className="animate-spin" />
            </div>
            <div>
              <p className="text-xl text-black">Please Wait...</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="p-20 relative w-full ">
            {/* <img
            src={arrow1.src}
            alt=""
            className="fixed top-24 h-[26em] right-[79%]"
          /> */}
            <div>
              <p className="text-2xl font-bold text-black mb-2">
                Daily Active Users
              </p>
            </div>

            <div className="mb-4 flex justify-between w-full">
              <div>
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
              </div>
              <div>
                <Button onClick={generateCSV}>Download Report</Button>
              </div>
            </div>

            <div className="text-xl font-bold">
              <div>
                <Xarrow
                  start="at_risk_mau"
                  end="reactivated_users"
                  color="#16a34a"
                  path="smooth"
                  strokeWidth={4}
                  headSize={6}
                  zIndex={10}
                  startAnchor={{ position: "top", offset: { x: -190, y: 0 } }}
                  endAnchor={{ position: "bottom", offset: { x: -140, y: 0 } }}
                  // startAnchor={["left", "left"]}
                  // endAnchor={["left", "left"]}
                  labels={{
                    middle: `iMAURR : ${data?.iMAURR}`,
                  }}
                  // className="z-10"
                />
              </div>
              <div className="">
                <Xarrow
                  start="at_risk_wau"
                  end="reactivated_users"
                  color="#f97316"
                  path="smooth"
                  strokeWidth={4}
                  headSize={6}
                  zIndex={10}
                  // headShape="circle"
                  startAnchor={{ position: "top", offset: { x: 40, y: 0 } }}
                  endAnchor={{ position: "bottom", offset: { x: 40, y: 0 } }}
                  // startAnchor={["right", "right"]}
                  // endAnchor={["bottom", "bottom"]}
                  // className="z-10"
                  labels={{
                    end: `1-RURR : ${100 - data?.rurr.toFixed(2)}`,
                  }}
                />
              </div>
              <div>
                <Xarrow
                  start="reactivated_users"
                  end="current_users"
                  color="#1d4ed8"
                  path="smooth"
                  strokeWidth={4}
                  headSize={6}
                  zIndex={10}
                  // headShape="circle"
                  startAnchor={{ position: "bottom", offset: { x: 0, y: 0 } }}
                  // endAnchor={{ position: "bottom", offset: { x: 50, y: 0 } }}
                  // startAnchor={["bottom", "bottom"]}
                  endAnchor={["left", "left"]}
                  // className="z-10"
                  labels={{
                    middle: `RURR : ${data?.rurr}`,
                  }}
                />
              </div>
              <div>
                <Xarrow
                  start="at_risk_wau"
                  end="current_users"
                  color="#1d4ed8"
                  path="smooth"
                  strokeWidth={4}
                  headSize={6}
                  zIndex={10}
                  // headShape="circle"
                  // startAnchor={{ position: "top", offset: { x: 40, y: 0 } }}
                  // endAnchor={{ position: "bottom", offset: { x: 50, y: 0 } }}
                  startAnchor={["top", "top"]}
                  endAnchor={["left", "left"]}
                  // className="z-10"
                  labels={{
                    start: `iWAURR:${data?.iWAURR}`,
                  }}
                />
              </div>
              <div>
                <Xarrow
                  start="new_users"
                  end="at_risk_wau"
                  color="#f97316"
                  path="smooth"
                  strokeWidth={4}
                  headSize={6}
                  zIndex={10}
                  // headShape="circle"
                  startAnchor={{
                    position: "bottom",
                    offset: { x: 120, y: 14 },
                  }}
                  endAnchor={{ position: "top", offset: { x: 80, y: 0 } }}
                  // endAnchor={["top", "top"]}
                  // startAnchor={["bottom", "bottom"]}
                  // className="z-10"
                  labels={{
                    start: `iWAURR:${data?.iWAURR}`,
                  }}
                />
              </div>
              <div>
                <Xarrow
                  start="resurrected_users"
                  end="at_risk_wau"
                  color="#f97316"
                  path="smooth"
                  strokeWidth={4}
                  headSize={6}
                  zIndex={10}
                  // headShape="circle"
                  // startAnchor={{ position: "top", offset: { x: 90, y: 0 } }}
                  // endAnchor={{ position: "bottom", offset: { x: -200, y: 0 } }}
                  startAnchor={["bottom", "bottom"]}
                  endAnchor={["right", "right"]}
                  // className="z-10"
                  labels={{
                    // end: `1-SURR:${100 - data?.surr}`,
                    end: `1SURR: ${
                      data?.surr ? (100 - Number(data.surr)).toFixed(2) : "0.00"
                    }`,
                  }}
                />
              </div>
              <div>
                <Xarrow
                  start="at_risk_wau"
                  end="at_risk_mau"
                  color="#db2777"
                  path="smooth"
                  strokeWidth={4}
                  headSize={6}
                  zIndex={10}
                  // headShape="circle"
                  startAnchor={{ position: "bottom", offset: { x: 90, y: 0 } }}
                  endAnchor={{ position: "top", offset: { x: 90, y: 0 } }}
                  // startAnchor={["top", "top"]}
                  // endAnchor={["bottom", "bottom"]}
                  // className="z-10"
                  labels={{
                    end: `WAU Loss Rate:${data?.wauLoss}`,
                  }}
                />
              </div>
              <div>
                <Xarrow
                  start="at_risk_mau"
                  end="dead_users"
                  color="#b91c1c"
                  path="smooth"
                  strokeWidth={4}
                  headSize={6}
                  zIndex={10}
                  // headShape="circle"
                  startAnchor={{ position: "bottom", offset: { x: 90, y: 0 } }}
                  endAnchor={{ position: "top", offset: { x: 90, y: 0 } }}
                  // startAnchor={["top", "top"]}
                  // endAnchor={["bottom", "bottom"]}
                  // className="z-10"
                  labels={{
                    end: `MAU Loss Rate:${data?.mauLoss}`,
                  }}
                />
              </div>
              <div>
                <Xarrow
                  start="dead_users"
                  end="resurrected_users"
                  color="#16a34a"
                  path="smooth"
                  strokeWidth={4}
                  headSize={6}
                  zIndex={10}
                  // startAnchor={{ position: "bottom", offset: { x: 0, y: 0 } }}
                  endAnchor={{ position: "bottom", offset: { x: 60, y: 0 } }}
                  startAnchor={["right", "right"]}
                  // endAnchor={["bottom", "bottom"]}
                  // className="z-10"
                  labels={{
                    end: `MAU Loss Rate:${data?.mauLoss}`,
                  }}
                />
              </div>
              <div>
                <Xarrow
                  start="resurrected_users"
                  end="current_users"
                  color="#1d4ed8"
                  path="smooth"
                  strokeWidth={4}
                  headSize={6}
                  zIndex={10}
                  // startAnchor={{ position: "bottom", offset: { x: 0, y: 0 } }}
                  // endAnchor={{ position: "right", offset: { x: -600, y: 0 } }}
                  startAnchor={["bottom", "bottom"]}
                  endAnchor={["right", "right"]}
                  // className="z-10"
                  labels={{
                    end: `SURR:${data?.surr}`,
                  }}
                />
              </div>
              <div>
                <Xarrow
                  start="new_users"
                  end="current_users"
                  color="#1d4ed8"
                  path="smooth"
                  strokeWidth={4}
                  headSize={6}
                  zIndex={10}
                  // headShape="circle"
                  // startAnchor={{ position: "top", offset: { x: 90, y: 0 } }}
                  // endAnchor={{ position: "bottom", offset: { x: 80, y: 0 } }}
                  startAnchor={["bottom", "bottom"]}
                  endAnchor={["top", "top"]}
                  // className="z-10"
                  labels={{
                    middle: `NURR:${data?.nurr}`,
                  }}
                />
              </div>
              <div>
                <Xarrow
                  start="current_users"
                  end="at_risk_wau"
                  color="#f97316"
                  path="smooth"
                  strokeWidth={4}
                  headSize={6}
                  zIndex={10}
                  // headShape="circle"
                  // startAnchor={{ position: "top", offset: { x: 90, y: 0 } }}
                  endAnchor={{ position: "top", offset: { x: 150, y: 0 } }}
                  startAnchor={["bottom", "bottom"]}
                  // endAnchor={["top", "top"]}
                  // className="z-10"
                  labels={{
                    // middle: `1-CURR:${100 - data?.curr}`,
                    middle: `1-CURR: ${
                      data?.curr ? (100 - Number(data.curr)).toFixed(2) : "0.00"
                    }`,
                  }}
                />
              </div>
              <div>
                <Xarrow
                  start="current_users"
                  end="current_users"
                  color="#1d4ed8"
                  path="smooth"
                  strokeWidth={4}
                  headSize={6}
                  zIndex={10}
                  // headShape="circle"
                  startAnchor={{ position: "bottom", offset: { x: 0, y: 0 } }}
                  endAnchor={{ position: "bottom", offset: { x: 180, y: 0 } }}
                  // startAnchor={["right", "right"]}
                  // endAnchor={["bottom", "bottom"]}
                  // className="z-10"
                  labels={{
                    end: `CURR:${data?.curr}`,
                  }}
                />
              </div>
            </div>

            <div className="mx-auto z-50 relative   ">
              <div className="flex gap-4 justify-around  text-white font-bold">
                <div
                  id="reactivated_users"
                  className="bg-green-600 w-5/12 shadow-2xl p-4 rounded-2xl text-center"
                >
                  <p>Reactivated Users : {data?.reactivated_users}</p>
                  <p className="font-normal">(first day back)</p>
                </div>
                <div
                  id="new_users"
                  className="bg-green-600 w-5/12 shadow-2xl p-4 rounded-2xl text-center"
                >
                  <p>New Users: {data?.new_users}</p>
                  <p className="font-normal">(first day in the app)</p>
                </div>
                <div
                  id="resurrected_users"
                  className="bg-green-600 w-5/12 shadow-2xl p-4 rounded-2xl text-center"
                >
                  <p>Resurrected Users:{data?.resurrected_users}</p>
                  <p className="font-normal">(first day back)</p>
                </div>
              </div>

              <div
                id="current_users"
                className="bg-blue-700 z-50 shadow-2xl p-4 rounded-2xl text-center text-white font-bold w-96 max-w-xl mx-auto my-40"
              >
                <p>Current Users:{data?.current_users}</p>
                <p className="font-normal">
                  (active today and at least one other time in the prior 7 days)
                </p>
              </div>

              <div
                id="at_risk_wau"
                className="bg-orange-500 z-50 shadow-2xl p-4 rounded-2xl text-center text-white font-bold w-full max-w-xl my-20"
              >
                <p>At risk WAUs:{data?.at_risk_wau}</p>
                <p className="font-normal">
                  (Inactive today, but active in last 1-6 days)
                </p>
              </div>

              <div
                id="at_risk_mau"
                className="bg-pink-600 shadow-2xl p-4 rounded-2xl text-center text-white font-bold w-full max-w-3xl my-20"
              >
                <p>At risk MAUs:{data?.at_risk_mau}</p>
                <p className="font-normal">
                  (Inactive today, inactive in last 1-6 days, but active in last
                  7-29 days)
                </p>
              </div>

              <div
                id="dead_users"
                className="bg-red-700 shadow-2xl p-4 rounded-2xl text-center text-white font-bold w-full max-w-4xl"
              >
                <p>Dead Users:{data?.dead_users}</p>
                <p className="font-normal">(Inactive today and last 29 days)</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Users;
