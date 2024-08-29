import { useEffect, useState } from "react";

export function sendRoute(a: number, b: string) {
  const [selectedButton, setSelectedButton] = useState<number | null>(1);
  useEffect(() => {
    console.log(selectedButton, "btn");
  }, [selectedButton]);

  setSelectedButton(a);
  return console.log(a, b);
}
