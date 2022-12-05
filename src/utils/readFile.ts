import { readFile } from 'fs/promises';

export async function readFileFromInput(
  input: string,
  trim = true
): Promise<string> {
  let content = await readFile(input, 'utf-8');

  if (trim) {
    return content.trim();
  }

  return content;
}

export async function readFileFromInput2(input: string): Promise<string> {
  let content = await readFile(input, 'utf-8');

  return content;
}

export async function readLinesFromInput(
  input: string,
  lineEnd = '\r\n'
): Promise<string[]> {
  let content = await readFileFromInput(input);

  return content.split(lineEnd);
}
