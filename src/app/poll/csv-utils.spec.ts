import { escapeCSVCell, generateCSVFileName } from "./csv-utils";

describe("escapeCSVCell", () => {
  it.each([
    ["apple", "apple"],
    ["banana", "banana"],
    ["apple,banana", '"apple,banana"'],
    ['orange"juice', '"orange""juice"'],
    ["orange juice", "orange juice"],
    ["line1\nline2", '"line1\nline2"'],
    ["line1\rline2", '"line1\rline2"'],
  ])("escapes $input to $expectedOutput", (input: string, expected: string) => {
    expect(escapeCSVCell(input)).toStrictEqual(expected);
  });
});

describe("generateCSVFileName", () => {
  it.each([
    ["My awesome poll", "Title-My-awesome-poll.csv"],
    [
      "My !@#$%^&*()_+ Poll...April 2024 with very long descriptive title",
      "Title-My-Poll-April-2024-with-very-long-descriptive-title.csv",
    ],
    [
      "Very long title ".repeat(20),
      "Title-Very-long-title-Very-long-title-Very-long-title-Very-long-title-Very-long-title-Very-long-title-Very-long-title-Very-long-title-Very-long-title-Very-long-title-Very-long-title-Very-long-title-Very-long-title-Very-long-title-Very-long-title-Very-.csv",
    ],
    ["!@#$%^&*()_+", "Title-.csv"],
  ])("escapes $input to $expectedOutput", (input: string, expected: string) => {
    expect(generateCSVFileName("Title", input)).toStrictEqual(expected);
  });
});
