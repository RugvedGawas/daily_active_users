"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import arrow1 from "./assets/arrows1.drawio-Photoroom.png";
import Users from "./components/Users";

export default function Home() {
  return (
    <>
      <div>
        <Users />
      </div>
    </>
  );
}
