#!/usr/bin/env -S deno run -A

const data = await Deno.readTextFile("./text/input.txt");
const lines = data.split("\n");

const dateRegex = /^ .*\d{2}:\d{2}$/;
const dateInBlockRegex = /^\d{2}:\d{2}$/;
const replyContRegex = /\d+ 件の返信/;

let output = "";

for (let i = 0; i < lines.length; i++) {
  if (
    lines[i][0] === ":" && lines[i].at(-1) === ":" // skip stamp
  ) {
    i++;
    continue;
  }

  if (
    lines[i].match(dateInBlockRegex) || // skip date in block
    lines[i].match(replyContRegex) || // skip reply count
    lines[i].startsWith("@") || // skip mention
    ["cc", "CC", "cc:", "CC:"].includes(lines[i].trim()) || // skip cc
    lines[i] === "（編集済み）"
  ) {
    continue;
  }

  if (lines[i].trim() === "") {
    if (i < lines.length - 2 && lines[i + 2].match(dateRegex)) { // skip name and date on top of message
      i += 2;
      if (output !== "") {
        output += "\n";
      }
    }
    continue;
  }

  output += lines[i] + "\n";
}

await Deno.writeTextFile("./text/output.txt", output);
